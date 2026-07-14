import type { TradeStatus } from '../types'
import type { MatchingSession } from '../matching/types'
import { getTradeStatusCopy } from './tradeStatus'

interface HomeActiveTradeCopy {
  badge: string
  title: string
  description: string
}

type TradeRole = 'BUYER' | 'SELLER'

export function getHomeActiveTradeCopy(input: {
  status: TradeStatus
  role?: TradeRole
  matchingSession?: MatchingSession | null
}): HomeActiveTradeCopy {
  const role = input.role ?? 'BUYER'
  const base = getTradeStatusCopy(input.status, role)

  if (input.status !== 'MATCHING' || !input.matchingSession) {
    return base
  }

  if (input.matchingSession.suggestion) {
    return {
      badge: '확인 필요',
      title: '확인이 필요한 상대가 있어요',
      description: '거래 화면에서 상대를 확인해 주세요.',
    }
  }

  if (input.matchingSession.phase === 'PENDING_APPROVAL') {
    return {
      badge: '승인 대기',
      title: '상대 승인을 기다리고 있어요',
      description: '승인되면 입금 단계로 넘어가요.',
    }
  }

  return base
}
