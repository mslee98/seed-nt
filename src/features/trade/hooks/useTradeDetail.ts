import { useCallback, useSyncExternalStore } from 'react'

import {
  cancelTrade,
  confirmPayment,
  devForceCompletePayment,
  getTradeDetail,
  reportPayment,
  subscribeTradeSession,
} from '../stores/tradeSession.store'
import type { TradeDetailViewModel } from '../types'

function getTradeDetailSnapshot(tradeId: string): TradeDetailViewModel | null {
  return getTradeDetail(tradeId)
}

export function useTradeDetail(tradeId: string) {
  const subscribe = useCallback(
    (listener: () => void) => subscribeTradeSession(listener),
    [],
  )

  const getSnapshot = useCallback(() => getTradeDetailSnapshot(tradeId), [tradeId])

  const trade = useSyncExternalStore(subscribe, getSnapshot, () => null)

  const reportPaymentAction = useCallback(async () => {
    if (!trade) return null
    return reportPayment(trade.id, trade.version)
  }, [trade])

  const confirmPaymentAction = useCallback(async () => {
    if (!trade) return null
    return confirmPayment(trade.id, trade.version)
  }, [trade])

  const cancelAction = useCallback(async () => {
    if (!trade) return null
    return cancelTrade(trade.id, trade.version)
  }, [trade])

  const devForceCompletePaymentAction = useCallback(async () => {
    if (!trade) return null
    return devForceCompletePayment(trade.id)
  }, [trade])

  return {
    trade,
    reportPayment: reportPaymentAction,
    confirmPayment: confirmPaymentAction,
    cancelTrade: cancelAction,
    devForceCompletePayment: devForceCompletePaymentAction,
  }
}
