/**
 * Trade session public API.
 *
 * 책임: subscribe·조회·콜백 등록 + actions/split re-export
 * 비책임: home wallet mutate (→ setOnTradeCompleted 구독)
 */
import {
  clearMatchingSession,
  setOnMatchConfirmed,
} from '../matching/matchingSession.store'
import type { SplitGroup, TradeDetailViewModel, TradeRecord } from '../types'
import { completeMatching } from './tradeSession.actions'
import * as state from './tradeSession.state'
import {
  activeSplitGroup,
  activeTrade,
  buildTradeDetailViewModel,
  invalidateTradeDetailCache,
  listeners,
  notify,
  sessionVersion,
  setActiveSplitGroup,
  setActiveTrade,
  tradeDetailCache,
  tradesById,
} from './tradeSession.state'

export {
  cancelTrade,
  confirmPayment,
  createTradeOrder,
  denyPayment,
  focusSplitLegTrade,
  reportPayment,
} from './tradeSession.actions'
export { getSplitGroupById, isSplitGroupInProgress } from './tradeSession.split'
export {
  isTerminalStatus,
  setTradeSessionDevHooks,
  type TradeSessionDevHooks,
} from './tradeSession.state'

setOnMatchConfirmed(({ tradeId, amountKrw }) => {
  completeMatching(tradeId, amountKrw)
})

export function setOnTradeMatched(callback: ((tradeId: string) => void) | null) {
  // 단일 listener만 유지 — Trade Activity 비활성 시 다른 화면이 덮어쓸 수 있음.
  state.setOnMatchedCallback(callback)
}

export function setOnTradeCompleted(
  callback: ((input: { side: TradeRecord['side']; coinAmount: number }) => void) | null,
) {
  state.setOnTradeCompletedCallback(callback)
}

export function getTradeSessionVersion(): number {
  return sessionVersion
}

export function getActiveTrade(): TradeRecord | null {
  return activeTrade
}

export function getActiveSplitGroup(): SplitGroup | null {
  return activeSplitGroup
}

export function getTradesById(): ReadonlyMap<string, TradeRecord> {
  return tradesById
}

export function subscribeTradeSession(listener: () => void): () => void {
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

export function resetTradeSession() {
  state.devHooks.clearSimulation?.()
  clearMatchingSession()
  setActiveSplitGroup(null)
  tradesById.clear()
  invalidateTradeDetailCache()
  setActiveTrade(null)
  notify()
}
