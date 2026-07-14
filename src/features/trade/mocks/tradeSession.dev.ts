/**
 * DEV — trade session hydrate / force-complete.
 * 프로덕션 경로의 tradeSession.store는 이 모듈을 직접 호출하지 않음.
 */
import {
  clearMatchingSession,
} from '../matching/matchingSession.store'
import type { SplitGroup, TradeRecord } from '../types'
import { advanceSplitAfterLegComplete } from '../stores/tradeSession.split'
import * as state from '../stores/tradeSession.state'
import {
  delay,
  emitTradeCompleted,
  invalidateTradeDetailCache,
  notify,
  setActiveSplitGroup,
  setActiveTrade,
  setTradeRecord,
  tradesById,
} from '../stores/tradeSession.state'

export function hydrateTradeMockSession(input: {
  splitGroup: SplitGroup | null
  trades: Map<string, TradeRecord>
  activeTradeId?: string | null
}): void {
  state.devHooks.clearSimulation?.()
  clearMatchingSession()
  setActiveSplitGroup(input.splitGroup)
  tradesById.clear()
  invalidateTradeDetailCache()
  for (const [id, trade] of input.trades) {
    tradesById.set(id, trade)
  }
  setActiveTrade(input.activeTradeId ? tradesById.get(input.activeTradeId) ?? null : null)
  notify()
}

/** DEV 전용: 구매자 목업에서 판매자 입금 확인 없이 거래 완료 처리 */
export async function devForceCompletePayment(tradeId: string): Promise<TradeRecord> {
  if (!import.meta.env.DEV) {
    throw new Error('DEV_ONLY')
  }

  state.devHooks.clearSimulation?.(tradeId)
  await delay(100)

  const trade = tradesById.get(tradeId) ?? state.activeTrade
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

  if (state.activeSplitGroup) {
    advanceSplitAfterLegComplete(completedTradeId)
  }

  emitTradeCompleted({ side: updated.side, coinAmount: updated.coinAmount })

  return updated
}
