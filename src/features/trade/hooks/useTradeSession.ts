import { useCallback, useMemo, useSyncExternalStore } from 'react'

import { getTradeSessionVersion, subscribeTradeSession } from '../stores/tradeSession.store'

/**
 * tradeSession store 구독 + selector.
 * useActiveTrade와 동일한 useSyncExternalStore 패턴.
 */
export function useTradeSession<T>(selector: (version: number) => T): T {
  const subscribe = useCallback((listener: () => void) => subscribeTradeSession(listener), [])

  const version = useSyncExternalStore(subscribe, getTradeSessionVersion, () => 0)

  return useMemo(() => selector(version), [selector, version])
}
