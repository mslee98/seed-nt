import { useSyncExternalStore } from 'react'

import { getActiveTrade, subscribeTradeSession } from '../stores/tradeSession.store'
import type { TradeRecord } from '../types'

export function useActiveTrade(): TradeRecord | null {
  return useSyncExternalStore(subscribeTradeSession, getActiveTrade, () => null)
}
