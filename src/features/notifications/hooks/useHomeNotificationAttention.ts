import { useMemo } from 'react'

import type { MatchingSession } from '../../trade/matching/types'
import type { TradeStatus } from '../../trade/types'
import { useNotificationAttention } from './useNotifications'

type TradeRole = 'BUYER' | 'SELLER'

interface UseHomeNotificationAttentionInput {
  activeTradeId?: string
  activeTradeStatus?: TradeStatus
  activeTradeRole?: TradeRole
  matchingSession?: MatchingSession | null
}

/**
 * 홈 헤더 attention — 알림 큐 + 매칭 suggestion을 합쳐 표시합니다.
 */
export function useHomeNotificationAttention(input: UseHomeNotificationAttentionInput) {
  const attention = useNotificationAttention()

  return useMemo(() => {
    const hasMatchingSuggestion =
      input.activeTradeStatus === 'MATCHING' &&
      input.matchingSession?.suggestion != null &&
      input.matchingSession.tradeId === input.activeTradeId

    const hasAttentionNotification =
      attention != null && attention.tradeId === input.activeTradeId

    return {
      needsAttention: hasMatchingSuggestion || hasAttentionNotification,
      attentionMessage: hasAttentionNotification ? attention?.message : undefined,
    }
  }, [
    attention,
    input.activeTradeId,
    input.activeTradeStatus,
    input.matchingSession?.suggestion,
    input.matchingSession?.tradeId,
  ])
}
