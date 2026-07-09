import { useSyncExternalStore } from 'react'

import { getActiveSplitGroup, subscribeTradeSession } from '../stores/tradeSession.store'
import type { SplitGroup } from '../types'

export function useActiveSplitGroup(): SplitGroup | null {
  return useSyncExternalStore(subscribeTradeSession, getActiveSplitGroup, () => null)
}
