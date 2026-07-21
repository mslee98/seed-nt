/**
 * Trade session mutations — create / payment / cancel / focus.
 */
import { krwToCoin } from '../../../shared/utils/formatAmount'
import { PAYMENT_DEADLINE_MINUTES, SELLER_CONFIRM_DEADLINE_MINUTES } from '../constants'
import {
  clearMatchingSession,
  getMatchingSession,
  startMatchingSession,
} from '../matching/matchingSession.store'
import type { CreateTradeOrderInput, CreateTradeOrderResult, TradeRecord } from '../types'
import { buildSplitPlan, buildSplitPlanWithUnit } from '../utils/splitPlan'
import {
  activeSplitGroup,
  activeTrade,
  addMinutes,
  assertTrade,
  createTradeRecord,
  delay,
  devHooks,
  emitTradeCompleted,
  generateTradeId,
  isTerminalStatus,
  notify,
  onMatchedCallback,
  setActiveTrade,
  setTradeRecord,
  tradesById,
} from './tradeSession.state'
import {
  advanceSplitAfterLegComplete,
  clearSplitGroup,
  createSplitTradeOrder,
  isSplitGroupInProgress,
} from './tradeSession.split'

function startMatchingForTrade(trade: TradeRecord) {
  setActiveTrade(trade)
  startMatchingSession({
    tradeId: trade.id,
    amountKrw: trade.amountKrw,
  })
}

export function completeMatching(tradeId: string, amountKrw?: number) {
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

export async function createTradeOrder(
  input: CreateTradeOrderInput,
): Promise<CreateTradeOrderResult> {
  await delay(400)

  if (isSplitGroupInProgress() || (activeTrade && !isTerminalStatus(activeTrade.status))) {
    throw new Error('ACTIVE_TRADE_LIMIT')
  }

  const shouldSplit = input.splitMode === 'AUTO' || input.splitMode === 'CUSTOM'
  const splitPlan =
    input.splitMode === 'CUSTOM' && input.unitAmountKrw != null
      ? buildSplitPlanWithUnit(input.amountKrw, input.unitAmountKrw)
      : input.splitMode === 'AUTO'
        ? buildSplitPlan(input.amountKrw)
        : null
  if (shouldSplit && splitPlan && splitPlan.legCount > 1) {
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
  setActiveTrade(trade)
  notify()
  startMatchingForTrade(trade)
  return { trade }
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
    sellerConfirmDeadline: addMinutes(now, SELLER_CONFIRM_DEADLINE_MINUTES),
  }
  setTradeRecord(updated)
  notify()
  devHooks.onPaymentReported?.(updated.id, updated.version, confirmPayment)
  return updated
}

export async function denyPayment(tradeId: string, version: number): Promise<TradeRecord> {
  devHooks.clearSimulation?.(tradeId)
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
  devHooks.clearSimulation?.(tradeId)
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

  emitTradeCompleted({ side: updated.side, coinAmount: updated.coinAmount })

  return updated
}

export async function cancelTrade(tradeId: string, version: number): Promise<TradeRecord> {
  // MVP mock: leg 단위 취소가 아니라 세션 전체(split·tradesById)를 초기화함.
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

  devHooks.clearSimulation?.()
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
  setActiveTrade(updated)
  notify()
  return updated
}

export function focusSplitLegTrade(tradeId: string) {
  const trade = tradesById.get(tradeId)
  if (!trade) return

  const wasFocused = activeTrade?.id === tradeId
  setActiveTrade(trade)

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
