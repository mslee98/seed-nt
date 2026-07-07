import type { TradeRole, TradeRecord } from '../types'

interface MatchingCopy {
  title: string
  description: string
  matchedTitle: string
  matchedDescription: string
}

const COPY_BY_ROLE: Record<TradeRole, MatchingCopy> = {
  BUYER: {
    title: '상대를 찾고 있어요',
    description: '비슷한 금액의 거래가 들어오면 연결해드릴게요.',
    matchedTitle: '매칭됐어요',
    matchedDescription: '이제 입금을 진행해 주세요.',
  },
  SELLER: {
    title: '판매 등록 중이에요',
    description: '코인이 잠겨 있어요. 구매자가 나타나면 알려드릴게요.',
    matchedTitle: '구매자를 찾았어요',
    matchedDescription: '구매자 입금을 기다려 주세요.',
  },
}

export function getMatchingCopy(trade: Pick<TradeRecord, 'role' | 'status'>): MatchingCopy {
  const base = COPY_BY_ROLE[trade.role]
  if (trade.status !== 'MATCHING') {
    return base
  }
  return base
}

export function getMatchedDockCopy(trade: Pick<TradeRecord, 'role'>): Pick<MatchingCopy, 'matchedTitle' | 'matchedDescription'> {
  return COPY_BY_ROLE[trade.role]
}
