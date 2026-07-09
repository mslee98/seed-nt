import { useEffect } from 'react'

import {
  getActiveSplitGroup,
  getTradeDetail,
} from '../../trade/stores/tradeSession.store'
import { TRADE_PUSH_OPEN_EVENT } from '../services/pushNotificationService'
import { actions } from '../../../stackflow/stackflow'

/**
 * 브라우저 Notification 클릭 → Trade 화면 deep link.
 * mock push는 store에서 발송, 클릭 시 이 hook이 라우팅합니다.
 */
export function useTradePushNavigation() {
  useEffect(() => {
    const handleOpenTrade = (event: Event) => {
      const tradeId = (event as CustomEvent<{ tradeId?: string }>).detail?.tradeId
      if (!tradeId) return

      const trade = getTradeDetail(tradeId)
      const splitGroupId = trade?.splitGroupId ?? getActiveSplitGroup()?.id

      if (splitGroupId) {
        actions.push(
          'Trade',
          {
            splitGroupId,
            ...(trade?.splitLegIndex ? { focusLeg: String(trade.splitLegIndex) } : {}),
          },
          { animate: true },
        )
        return
      }

      actions.push('Trade', { tradeId }, { animate: true })
    }

    window.addEventListener(TRADE_PUSH_OPEN_EVENT, handleOpenTrade)
    return () => window.removeEventListener(TRADE_PUSH_OPEN_EVENT, handleOpenTrade)
  }, [])
}
