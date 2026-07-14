import { formatAmount } from '../../../shared/utils/formatAmount'
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

export function getMatchedDockCopy(
  trade: Pick<TradeRecord, 'role'>,
): Pick<MatchingCopy, 'matchedTitle' | 'matchedDescription'> {
  return COPY_BY_ROLE[trade.role]
}

/** MatchingFeed 히어로 파생 모드 — 세션 phase와 별개 */
export type MatchingUiMode = 'SEARCHING' | 'RESULT_EXACT' | 'RESULT_NEAR' | 'PENDING'

export function getMatchingUiMode(params: {
  queueLocked: boolean
  revealedCount: number
  hasExact: boolean
}): MatchingUiMode {
  if (params.queueLocked) return 'PENDING'
  if (params.revealedCount === 0) return 'SEARCHING'
  if (params.hasExact) return 'RESULT_EXACT'
  return 'RESULT_NEAR'
}

export function getMatchingStatusBadgeLabel(mode: MatchingUiMode): string {
  switch (mode) {
    case 'PENDING':
      return '승인 대기 중'
    case 'SEARCHING':
      return '찾는 중'
    case 'RESULT_EXACT':
      return '정확히 일치'
    case 'RESULT_NEAR':
      return '비슷한 상대'
  }
}

export interface MatchingHeroCopy {
  title: string
  description?: string
  summary?: string
}

export const MATCHING_LEAVE_OK_HINT = '이 화면을 나가도 요청은 유지돼요'

export function getMatchingHeroCopy(params: {
  mode: MatchingUiMode
  amountKrw: number
  exactCount: number
  nearCount: number
  role: TradeRole
}): MatchingHeroCopy {
  const amountLabel = formatAmount(params.amountKrw)

  switch (params.mode) {
    case 'PENDING':
      return {
        title: '상대 승인을 기다리고 있어요',
        description: '승인되면 입금 단계로 넘어가요.',
      }

    case 'SEARCHING':
    case 'RESULT_EXACT':
    case 'RESULT_NEAR':
      return {
        title: '상대 찾는 중이에요',
        description: `${amountLabel}원에 가장 적합한 상대를 계속 찾고 있어요.`,
        summary: `정확히 일치 ${params.exactCount}명 · 비슷한 상대 ${params.nearCount}명`,
      }
  }
}
