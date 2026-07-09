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

export interface MatchingHeroCopy {
  title: string
  description?: string
}

export function getMatchingHeroCopy(params: {
  queueLocked: boolean
  revealedCount: number
  hasExact: boolean
  role: TradeRole
}): MatchingHeroCopy {
  if (params.queueLocked) {
    return {
      title: '상대 승인을 기다리고 있어요',
      description: '승인되면 입금 단계로 넘어가요.',
    }
  }

  if (params.revealedCount === 0) {
    const base = COPY_BY_ROLE[params.role]
    return { title: base.title, description: base.description }
  }

  if (params.hasExact) {
    return {
      title: '금액이 맞는 상대를 찾았어요',
      description: '확인 후 제안할 수 있어요.',
    }
  }

  return {
    title: `거래 가능한 상대 ${params.revealedCount}명`,
    description: '계속 찾는 동안 먼저 제안할 수 있어요.',
  }
}
