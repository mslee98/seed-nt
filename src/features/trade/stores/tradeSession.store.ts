import { krwToCoin } from '../../home/utils/formatAmount'
import { applyCompletedTrade } from '../../home/stores/homeWallet.store'
import { PAYMENT_DEADLINE_MINUTES } from '../constants'
import {
  clearMatchingSession,
  getMatchingSession,
  setOnMatchConfirmed,
  startMatchingSession,
} from '../matching/matchingSession.store'
import type {
  CreateTradeOrderInput,
  CreateTradeOrderResult,
  SplitGroup,
  SplitLeg,
  TradeAction,
  TradeDetailViewModel,
  TradeRecord,
  TradeRole,
} from '../types'
import type { SplitPlan } from '../utils/splitPlan'
import { buildSplitPlan } from '../utils/splitPlan'
import {
  clearDevPaymentSimulation,
  onPaymentReportedDevMock,
} from '../mocks/devPaymentSimulation.mock'

type Listener = () => void

const listeners = new Set<Listener>()
let activeTrade: TradeRecord | null = null
let activeSplitGroup: SplitGroup | null = null
const tradesById = new Map<string, TradeRecord>()
const tradeDetailCache = new Map<string, { version: number; detail: TradeDetailViewModel }>()
let sessionVersion = 0
let onMatchedCallback: ((tradeId: string) => void) | null = null
let tradeIdSeq = 0

const MOCK_SELLER_ACCOUNT = {
  bankName: '카카오뱅크',
  accountNumber: '3333012345673',
  accountNumberMasked: '3333-**-******3',
  holderName: '김브릿',
}

function generateTradeId(): string {
  tradeIdSeq += 1
  return `trade-${Date.now()}-${tradeIdSeq}`
}

function roleFromSide(side: CreateTradeOrderInput['side']): TradeRole {
  return side === 'BUY' ? 'BUYER' : 'SELLER'
}

function addMinutes(iso: string, minutes: number): string {
  return new Date(new Date(iso).getTime() + minutes * 60_000).toISOString()
}

function getActionsForTrade(trade: TradeRecord): TradeAction[] {
  if (trade.status === 'MATCHING') {
    return ['CANCEL']
  }
  if (trade.status === 'PAYMENT_PENDING') {
    return trade.role === 'BUYER' ? ['REPORT_PAYMENT', 'CANCEL'] : ['CANCEL']
  }
  if (trade.status === 'PAYMENT_REPORTED') {
    return trade.role === 'SELLER' ? ['CONFIRM_PAYMENT', 'DENY_PAYMENT'] : []
  }
  if (trade.status === 'DISPUTED') {
    return []
  }
  if (trade.status === 'COMPLETED' || trade.status === 'CANCELLED' || trade.status === 'EXPIRED') {
    return []
  }
  return ['CONTINUE']
}

function buildTradeDetailViewModel(trade: TradeRecord): TradeDetailViewModel {
  return {
    ...trade,
    actions: getActionsForTrade(trade),
    counterpartyNickname: trade.role === 'BUYER' ? '판매자' : '구매자',
    sellerAccount:
      trade.role === 'BUYER' && trade.status !== 'MATCHING'
        ? MOCK_SELLER_ACCOUNT
        : undefined,
  }
}

function invalidateTradeDetailCache(tradeId?: string) {
  if (tradeId) {
    tradeDetailCache.delete(tradeId)
    return
  }
  tradeDetailCache.clear()
}

function setTradeRecord(trade: TradeRecord) {
  tradesById.set(trade.id, trade)
  invalidateTradeDetailCache(trade.id)
  if (activeTrade?.id === trade.id || !activeTrade) {
    activeTrade = trade
  }
}

function notify() {
  sessionVersion += 1
  listeners.forEach((listener) => listener())
}

export function getTradeSessionVersion(): number {
  return sessionVersion
}

function createTradeRecord(input: {
  id: string
  side: CreateTradeOrderInput['side']
  amountKrw: number
  now: string
  splitGroupId?: string
  splitLegIndex?: number
  splitTotalLegs?: number
}): TradeRecord {
  return {
    id: input.id,
    side: input.side,
    role: roleFromSide(input.side),
    status: 'MATCHING',
    amountKrw: input.amountKrw,
    coinAmount: krwToCoin(input.amountKrw),
    version: 1,
    matchingStartedAt: input.now,
    updatedAt: input.now,
    splitGroupId: input.splitGroupId,
    splitLegIndex: input.splitLegIndex,
    splitTotalLegs: input.splitTotalLegs,
  }
}

function startMatchingForTrade(trade: TradeRecord) {
  activeTrade = trade
  startMatchingSession({
    tradeId: trade.id,
    amountKrw: trade.amountKrw,
  })
}

function markSplitLegStatus(tradeId: string, status: SplitLeg['status']) {
  if (!activeSplitGroup) return

  activeSplitGroup = {
    ...activeSplitGroup,
    legs: activeSplitGroup.legs.map((leg) =>
      leg.tradeId === tradeId ? { ...leg, status } : leg,
    ),
  }
}

function advanceSplitAfterLegComplete(completedTradeId: string) {
  if (!activeSplitGroup) return

  markSplitLegStatus(completedTradeId, 'COMPLETED')
  activeSplitGroup = {
    ...activeSplitGroup,
    completedLegs: activeSplitGroup.completedLegs + 1,
  }

  const allDone = activeSplitGroup.completedLegs >= activeSplitGroup.totalLegs
  if (allDone) {
    activeSplitGroup = null
    activeTrade = null
    notify()
    return
  }

  const nextActive = activeSplitGroup.legs.find(
    (leg) => leg.status === 'ACTIVE' && leg.tradeId !== completedTradeId,
  )
  if (nextActive) {
    const trade = tradesById.get(nextActive.tradeId)
    if (trade && trade.status === 'MATCHING') {
      activeTrade = trade
    }
  }

  notify()
}

function clearSplitGroup() {
  activeSplitGroup = null
}

export function isSplitGroupInProgress(): boolean {
  return (
    activeSplitGroup !== null && activeSplitGroup.completedLegs < activeSplitGroup.totalLegs
  )
}

export function getSplitGroupById(id: string): SplitGroup | null {
  if (activeSplitGroup?.id === id) return activeSplitGroup
  return null
}

export function getTradesById(): ReadonlyMap<string, TradeRecord> {
  return tradesById
}

async function createSplitTradeOrder(
  input: CreateTradeOrderInput,
  plan: SplitPlan,
): Promise<CreateTradeOrderResult> {
  const now = new Date().toISOString()
  const splitId = `split-${Date.now()}`
  const legs: SplitLeg[] = plan.legAmounts.map((amountKrw, index) => ({
    index: index + 1,
    tradeId: generateTradeId(),
    amountKrw,
    status: 'ACTIVE',
  }))

  activeSplitGroup = {
    id: splitId,
    side: input.side,
    totalAmountKrw: plan.totalAmountKrw,
    unitAmountKrw: plan.unitAmountKrw,
    totalLegs: plan.legCount,
    completedLegs: 0,
    legs,
    createdAt: now,
  }

  const createdTrades = legs.map((leg) => {
    const trade = createTradeRecord({
      id: leg.tradeId,
      side: input.side,
      amountKrw: leg.amountKrw,
      now,
      splitGroupId: splitId,
      splitLegIndex: leg.index,
      splitTotalLegs: plan.legCount,
    })
    tradesById.set(trade.id, trade)
    return trade
  })

  const firstTrade = createdTrades[0]
  activeTrade = firstTrade
  notify()

  return { trade: firstTrade, splitGroupId: splitId }
}

function completeMatching(tradeId: string, amountKrw?: number) {
  const trade = tradesById.get(tradeId)
  if (!trade || trade.status !== 'MATCHING') {
    return
  }

  const now = new Date().toISOString()
  const resolvedAmountKrw = amountKrw ?? trade.amountKrw
  const updated: TradeRecord = {
    ...trade,
    status: 'PAYMENT_PENDING',
    amountKrw: resolvedAmountKrw,
    coinAmount: krwToCoin(resolvedAmountKrw),
    version: trade.version + 1,
    updatedAt: now,
    paymentDeadline: addMinutes(now, PAYMENT_DEADLINE_MINUTES),
  }
  setTradeRecord(updated)
  clearMatchingSession()
  notify()
  onMatchedCallback?.(tradeId)
}

setOnMatchConfirmed(({ tradeId, amountKrw }) => {
  completeMatching(tradeId, amountKrw)
})

export function setOnTradeMatched(callback: ((tradeId: string) => void) | null) {
  // 단일 listener만 유지 — Trade Activity 비활성 시 다른 화면이 덮어쓸 수 있음.
  // 장기적으로 subscribeTradeMatched 이벤트 버스로 전환 검토.
  onMatchedCallback = callback
}

export function getActiveTrade(): TradeRecord | null {
  return activeTrade
}

export function getActiveSplitGroup(): SplitGroup | null {
  return activeSplitGroup
}

export function subscribeTradeSession(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getTradeDetail(tradeId: string): TradeDetailViewModel | null {
  if (!tradeId) return null

  const trade = tradesById.get(tradeId) ?? (activeTrade?.id === tradeId ? activeTrade : null)
  if (!trade) return null

  const cached = tradeDetailCache.get(tradeId)
  if (cached && cached.version === trade.version) {
    return cached.detail
  }

  const detail = buildTradeDetailViewModel(trade)
  tradeDetailCache.set(tradeId, { version: trade.version, detail })
  return detail
}

export async function createTradeOrder(
  input: CreateTradeOrderInput,
): Promise<CreateTradeOrderResult> {
  await delay(400)

  if (isSplitGroupInProgress() || (activeTrade && !isTerminalStatus(activeTrade.status))) {
    throw new Error('ACTIVE_TRADE_LIMIT')
  }

  const shouldSplit = input.splitMode === 'AUTO'
  const splitPlan = shouldSplit ? buildSplitPlan(input.amountKrw) : null
  if (splitPlan && splitPlan.legCount > 1) {
    return createSplitTradeOrder(input, splitPlan)
  }

  const now = new Date().toISOString()
  const trade = createTradeRecord({
    id: generateTradeId(),
    side: input.side,
    amountKrw: input.amountKrw,
    now,
  })

  tradesById.set(trade.id, trade)
  activeTrade = trade
  notify()
  startMatchingForTrade(trade)
  return { trade }
}

export function isTerminalStatus(status: TradeRecord['status']): boolean {
  return status === 'COMPLETED' || status === 'CANCELLED' || status === 'EXPIRED'
}

export async function reportPayment(tradeId: string, version: number): Promise<TradeRecord> {
  await delay(300)
  assertTrade(tradeId, version, 'PAYMENT_PENDING')

  const now = new Date().toISOString()
  const updated: TradeRecord = {
    ...activeTrade!,
    status: 'PAYMENT_REPORTED',
    version: activeTrade!.version + 1,
    updatedAt: now,
    reportedAt: now,
  }
  setTradeRecord(updated)
  notify()
  onPaymentReportedDevMock(updated.id, updated.version, confirmPayment)
  return updated
}

export async function denyPayment(tradeId: string, version: number): Promise<TradeRecord> {
  clearDevPaymentSimulation(tradeId)
  await delay(300)
  assertTrade(tradeId, version, 'PAYMENT_REPORTED')

  const now = new Date().toISOString()
  const updated: TradeRecord = {
    ...activeTrade!,
    status: 'DISPUTED',
    version: activeTrade!.version + 1,
    updatedAt: now,
  }
  setTradeRecord(updated)
  notify()
  return updated
}

export async function confirmPayment(tradeId: string, version: number): Promise<TradeRecord> {
  clearDevPaymentSimulation(tradeId)
  await delay(400)
  assertTrade(tradeId, version, 'PAYMENT_REPORTED')

  const now = new Date().toISOString()
  const completedTradeId = activeTrade!.id
  const updated: TradeRecord = {
    ...activeTrade!,
    status: 'COMPLETED',
    version: activeTrade!.version + 1,
    updatedAt: now,
    completedAt: now,
  }
  setTradeRecord(updated)
  notify()

  if (activeSplitGroup) {
    advanceSplitAfterLegComplete(completedTradeId)
  }

  applyCompletedTrade({ side: updated.side, coinAmount: updated.coinAmount })

  return updated
}

/** DEV 전용: 구매자 목업에서 판매자 입금 확인 없이 거래 완료 처리 */
export async function devForceCompletePayment(tradeId: string): Promise<TradeRecord> {
  if (!import.meta.env.DEV) {
    throw new Error('DEV_ONLY')
  }

  clearDevPaymentSimulation(tradeId)
  await delay(100)

  const trade = tradesById.get(tradeId) ?? activeTrade
  if (!trade || trade.id !== tradeId) {
    throw new Error('TRADE_NOT_FOUND')
  }

  if (!['PAYMENT_PENDING', 'PAYMENT_REPORTED'].includes(trade.status)) {
    throw new Error('TRADE_STATE_CONFLICT')
  }

  const now = new Date().toISOString()
  const completedTradeId = trade.id
  const updated: TradeRecord = {
    ...trade,
    status: 'COMPLETED',
    version: trade.version + 1,
    updatedAt: now,
    completedAt: now,
    reportedAt: trade.reportedAt ?? now,
  }
  setTradeRecord(updated)
  notify()

  if (activeSplitGroup) {
    advanceSplitAfterLegComplete(completedTradeId)
  }

  applyCompletedTrade({ side: updated.side, coinAmount: updated.coinAmount })

  return updated
}

export async function cancelTrade(tradeId: string, version: number): Promise<TradeRecord> {
  // MVP mock: leg 단위 취소가 아니라 세션 전체(split·tradesById)를 초기화함.
  // 실 API 연동 시 splitGroupId 기준 leg 취소로 좁혀야 함.
  await delay(300)
  if (!activeTrade || activeTrade.id !== tradeId) {
    throw new Error('TRADE_NOT_FOUND')
  }
  if (activeTrade.version !== version) {
    throw new Error('TRADE_STATE_CONFLICT')
  }
  if (!['MATCHING', 'PAYMENT_PENDING'].includes(activeTrade.status)) {
    throw new Error('TRADE_STATE_CONFLICT')
  }

  clearDevPaymentSimulation()
  clearMatchingSession()
  clearSplitGroup()
  tradesById.clear()

  const now = new Date().toISOString()
  const updated: TradeRecord = {
    ...activeTrade,
    status: 'CANCELLED',
    version: activeTrade.version + 1,
    updatedAt: now,
  }
  activeTrade = updated
  notify()
  return updated
}

export function focusSplitLegTrade(tradeId: string) {
  const trade = tradesById.get(tradeId)
  if (!trade) return

  const wasFocused = activeTrade?.id === tradeId
  activeTrade = trade

  if (trade.status === 'MATCHING') {
    const session = getMatchingSession()
    if (session?.tradeId !== tradeId) {
      startMatchingForTrade(trade)
      notify()
    } else if (!wasFocused) {
      notify()
    }
    return
  }

  if (!wasFocused) {
    notify()
  }
}

function getTradeOrThrow(tradeId: string): TradeRecord {
  const trade = tradesById.get(tradeId) ?? (activeTrade?.id === tradeId ? activeTrade : null)
  if (!trade) {
    throw new Error('TRADE_NOT_FOUND')
  }
  activeTrade = trade
  return trade
}

function assertTrade(tradeId: string, version: number, expectedStatus: TradeRecord['status']) {
  const trade = getTradeOrThrow(tradeId)
  if (trade.version !== version) {
    throw new Error('TRADE_STATE_CONFLICT')
  }
  if (trade.status === expectedStatus) {
    return
  }
  if (expectedStatus === 'PAYMENT_PENDING' && trade.status === 'PAYMENT_REPORTED') {
    return
  }
  if (expectedStatus === 'PAYMENT_REPORTED' && trade.status === 'COMPLETED') {
    return
  }
  throw new Error('TRADE_STATE_CONFLICT')
}

/** DEV/mock — fixture로 trade session 주입 */
export function hydrateTradeMockSession(input: {
  splitGroup: SplitGroup | null
  trades: Map<string, TradeRecord>
  activeTradeId?: string | null
}): void {
  clearDevPaymentSimulation()
  clearMatchingSession()
  activeSplitGroup = input.splitGroup
  tradesById.clear()
  invalidateTradeDetailCache()
  for (const [id, trade] of input.trades) {
    tradesById.set(id, trade)
  }
  activeTrade = input.activeTradeId ? tradesById.get(input.activeTradeId) ?? null : null
  notify()
}

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

export function resetTradeSession() {
  clearDevPaymentSimulation()
  clearMatchingSession()
  clearSplitGroup()
  tradesById.clear()
  invalidateTradeDetailCache()
  activeTrade = null
  notify()
}
