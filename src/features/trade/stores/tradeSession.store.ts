import { krwToCoin } from '../../home/utils/formatAmount'
import { PAYMENT_DEADLINE_MINUTES } from '../constants'
import {
  clearMatchingSession,
  setOnMatchConfirmed,
  startMatchingSession,
} from '../matching/matchingSession.store'
import type {
  CreateTradeOrderInput,
  SplitGroup,
  SplitLeg,
  TradeAction,
  TradeDetailViewModel,
  TradeRecord,
  TradeRole,
} from '../types'
import type { SplitPlan } from '../utils/splitPlan'
import { buildSplitPlan } from '../utils/splitPlan'

type Listener = () => void

const listeners = new Set<Listener>()
let activeTrade: TradeRecord | null = null
let activeSplitGroup: SplitGroup | null = null
let cachedTradeDetail: TradeDetailViewModel | null = null
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
    return trade.role === 'SELLER' ? ['CONFIRM_PAYMENT'] : []
  }
  if (trade.status === 'COMPLETED' || trade.status === 'CANCELLED' || trade.status === 'EXPIRED') {
    return []
  }
  return ['CONTINUE']
}

function syncTradeDetailCache() {
  if (!activeTrade) {
    cachedTradeDetail = null
    return
  }

  const trade = activeTrade
  cachedTradeDetail = {
    ...trade,
    actions: getActionsForTrade(trade),
    counterpartyNickname: trade.role === 'BUYER' ? '판매자' : '구매자',
    sellerAccount:
      trade.role === 'BUYER' && trade.status !== 'MATCHING'
        ? MOCK_SELLER_ACCOUNT
        : undefined,
  }
}

function notify() {
  syncTradeDetailCache()
  listeners.forEach((listener) => listener())
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
  startMatchingSession({
    tradeId: trade.id,
    amountKrw: trade.amountKrw,
    mode: 'FLEXIBLE',
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

function activateSplitLeg(leg: SplitLeg, side: CreateTradeOrderInput['side']) {
  const now = new Date().toISOString()
  const trade = createTradeRecord({
    id: leg.tradeId,
    side,
    amountKrw: leg.amountKrw,
    now,
    splitGroupId: activeSplitGroup?.id,
    splitLegIndex: leg.index,
    splitTotalLegs: activeSplitGroup?.totalLegs,
  })

  markSplitLegStatus(leg.tradeId, 'ACTIVE')
  activeTrade = trade
  startMatchingForTrade(trade)
  notify()
}

function advanceSplitAfterLegComplete(completedTradeId: string) {
  if (!activeSplitGroup) return

  markSplitLegStatus(completedTradeId, 'COMPLETED')
  activeSplitGroup = {
    ...activeSplitGroup,
    completedLegs: activeSplitGroup.completedLegs + 1,
  }

  const nextLeg = activeSplitGroup.legs.find((leg) => leg.status === 'PENDING')
  if (!nextLeg) {
    activeSplitGroup = null
    notify()
    return
  }

  activateSplitLeg(nextLeg, activeSplitGroup.side)
}

function clearSplitGroup() {
  activeSplitGroup = null
}

async function createSplitTradeOrder(
  input: CreateTradeOrderInput,
  plan: SplitPlan,
): Promise<TradeRecord> {
  const now = new Date().toISOString()
  const splitId = `split-${Date.now()}`
  const legs: SplitLeg[] = plan.legAmounts.map((amountKrw, index) => ({
    index: index + 1,
    tradeId: generateTradeId(),
    amountKrw,
    status: index === 0 ? 'ACTIVE' : 'PENDING',
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

  const firstLeg = legs[0]
  const trade = createTradeRecord({
    id: firstLeg.tradeId,
    side: input.side,
    amountKrw: firstLeg.amountKrw,
    now,
    splitGroupId: splitId,
    splitLegIndex: firstLeg.index,
    splitTotalLegs: plan.legCount,
  })

  activeTrade = trade
  notify()
  startMatchingForTrade(trade)
  return trade
}

function completeMatching(tradeId: string, amountKrw?: number) {
  if (!activeTrade || activeTrade.id !== tradeId || activeTrade.status !== 'MATCHING') {
    return
  }

  const now = new Date().toISOString()
  const resolvedAmountKrw = amountKrw ?? activeTrade.amountKrw
  activeTrade = {
    ...activeTrade,
    status: 'PAYMENT_PENDING',
    amountKrw: resolvedAmountKrw,
    coinAmount: krwToCoin(resolvedAmountKrw),
    version: activeTrade.version + 1,
    updatedAt: now,
    paymentDeadline: addMinutes(now, PAYMENT_DEADLINE_MINUTES),
  }
  clearMatchingSession()
  notify()
  onMatchedCallback?.(tradeId)
}

setOnMatchConfirmed(({ tradeId, amountKrw }) => {
  completeMatching(tradeId, amountKrw)
})

export function setOnTradeMatched(callback: ((tradeId: string) => void) | null) {
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
  if (!cachedTradeDetail || cachedTradeDetail.id !== tradeId) {
    return null
  }
  return cachedTradeDetail
}

export async function createTradeOrder(input: CreateTradeOrderInput): Promise<TradeRecord> {
  await delay(400)

  if (activeTrade && !isTerminalStatus(activeTrade.status)) {
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

  activeTrade = trade
  notify()
  startMatchingForTrade(trade)
  return trade
}

export function isTerminalStatus(status: TradeRecord['status']): boolean {
  return status === 'COMPLETED' || status === 'CANCELLED' || status === 'EXPIRED'
}

export async function reportPayment(tradeId: string, version: number): Promise<TradeRecord> {
  await delay(300)
  assertTrade(tradeId, version, 'PAYMENT_PENDING')

  const now = new Date().toISOString()
  activeTrade = {
    ...activeTrade!,
    status: 'PAYMENT_REPORTED',
    version: activeTrade!.version + 1,
    updatedAt: now,
    reportedAt: now,
  }
  notify()
  return activeTrade
}

export async function confirmPayment(tradeId: string, version: number): Promise<TradeRecord> {
  await delay(400)
  assertTrade(tradeId, version, 'PAYMENT_REPORTED')

  const now = new Date().toISOString()
  const completedTradeId = activeTrade!.id
  activeTrade = {
    ...activeTrade!,
    status: 'COMPLETED',
    version: activeTrade!.version + 1,
    updatedAt: now,
    completedAt: now,
  }
  notify()

  if (activeSplitGroup) {
    advanceSplitAfterLegComplete(completedTradeId)
  }

  return activeTrade
}

/** DEV 전용: 구매자 목업에서 판매자 입금 확인 없이 거래 완료 처리 */
export async function devForceCompletePayment(tradeId: string): Promise<TradeRecord> {
  if (!import.meta.env.DEV) {
    throw new Error('DEV_ONLY')
  }

  await delay(100)

  if (!activeTrade || activeTrade.id !== tradeId) {
    throw new Error('TRADE_NOT_FOUND')
  }

  if (!['PAYMENT_PENDING', 'PAYMENT_REPORTED'].includes(activeTrade.status)) {
    throw new Error('TRADE_STATE_CONFLICT')
  }

  const now = new Date().toISOString()
  const completedTradeId = activeTrade.id
  activeTrade = {
    ...activeTrade,
    status: 'COMPLETED',
    version: activeTrade.version + 1,
    updatedAt: now,
    completedAt: now,
    reportedAt: activeTrade.reportedAt ?? now,
  }
  notify()

  if (activeSplitGroup) {
    advanceSplitAfterLegComplete(completedTradeId)
  }

  return activeTrade
}

export async function cancelTrade(tradeId: string, version: number): Promise<TradeRecord> {
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

  clearMatchingSession()
  clearSplitGroup()

  const now = new Date().toISOString()
  activeTrade = {
    ...activeTrade,
    status: 'CANCELLED',
    version: activeTrade.version + 1,
    updatedAt: now,
  }
  notify()
  return activeTrade
}

function assertTrade(tradeId: string, version: number, expectedStatus: TradeRecord['status']) {
  if (!activeTrade || activeTrade.id !== tradeId) {
    throw new Error('TRADE_NOT_FOUND')
  }
  if (activeTrade.version !== version) {
    throw new Error('TRADE_STATE_CONFLICT')
  }
  if (activeTrade.status === expectedStatus) {
    return
  }
  if (expectedStatus === 'PAYMENT_PENDING' && activeTrade.status === 'PAYMENT_REPORTED') {
    return
  }
  if (expectedStatus === 'PAYMENT_REPORTED' && activeTrade.status === 'COMPLETED') {
    return
  }
  throw new Error('TRADE_STATE_CONFLICT')
}

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

export function resetTradeSession() {
  clearMatchingSession()
  clearSplitGroup()
  activeTrade = null
  notify()
}
