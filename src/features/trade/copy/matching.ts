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
}

export const MATCHING_LEAVE_OK_HINT =
  '화면을 나가도 매칭은 계속돼요. 결과가 나오면 알려드릴게요.'

export const MATCHING_EXACT_PRIORITY_HINT =
  '정확 매칭을 우선으로 찾아요. 비슷한 조건도 함께 볼 수 있어요.'

export function getMatchingHeroCopy(params: {
  mode: MatchingUiMode
  role: TradeRole
  exactCount?: number
  nearCount?: number
}): MatchingHeroCopy {
  return getMatchingResultHeroCopy({
    mode: params.mode,
    role: params.role,
    exactCount: params.exactCount ?? 0,
    nearCount: params.nearCount ?? 0,
  })
}

export function formatMatchingElapsed(startedAt: string, nowMs: number): string {
  const elapsedSec = Math.max(0, Math.floor((nowMs - new Date(startedAt).getTime()) / 1000))
  const minutes = Math.floor(elapsedSec / 60)
  const seconds = elapsedSec % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function formatMatchingCountdown(expiresAt: string, nowMs: number): string {
  const remainSec = Math.max(0, Math.ceil((new Date(expiresAt).getTime() - nowMs) / 1000))
  const minutes = Math.floor(remainSec / 60)
  const seconds = remainSec % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export const MATCHING_NO_RESTRICTION_HINT = '최근 제한 이력 없음'

export const MATCHING_PROPOSAL_START_NOTICE =
  '상대가 수락하면 거래가 시작돼요. 그전까지 현금과 Coin은 이동하지 않아요.'

export function getMatchingProposalMatchBadge(matchType: 'EXACT' | 'NEAR'): string {
  return matchType === 'EXACT' ? '정확 매칭' : '비슷한 금액'
}

export function getMatchingProposalTitle(coinLabel: string): string {
  return `${coinLabel} 거래 제안`
}

export function getMatchingProposalSubtitle(nickname: string, tradeCount: number): string {
  return `${nickname} · 완료 거래 ${tradeCount}건`
}

export function getMatchingProposalTrustLine(params: {
  completionRatePct: number
  avgResponseSec: number
}): string {
  return `완료율 ${params.completionRatePct}%  ·  평균 응답 ${params.avgResponseSec}초`
}

export function getMatchingProposalCtaLabel(coinLabel: string): string {
  return `${coinLabel} 거래 요청하기`
}

export function getMatchingResultHeroCopy(params: {
  mode: MatchingUiMode
  exactCount: number
  nearCount: number
  role: TradeRole
}): MatchingHeroCopy {
  const counterparty = params.role === 'BUYER' ? '판매자' : '구매자'

  if (params.mode === 'PENDING') {
    return {
      title: '거래 요청을 보냈어요',
      description: '상대방의 응답을 기다리고 있어요. 응답이 없으면 자동으로 다시 찾아드릴게요.',
    }
  }

  if (params.mode === 'SEARCHING') {
    return {
      title: `조건에 맞는 ${counterparty}를 계속 찾고 있어요`,
      description: '새 제안이 생기면 바로 알려드릴게요.',
    }
  }

  if (params.mode === 'RESULT_EXACT') {
    return {
      title: `정확 매칭 ${params.exactCount}건을 찾았어요`,
      description: '더 좋은 조건도 계속 찾고 있어요',
    }
  }

  return {
    title: `비슷한 조건 ${params.nearCount}건을 찾았어요`,
    description: '더 좋은 조건도 계속 찾고 있어요',
  }
}

export function getMatchingLiveAnnounce(params: {
  exactCount: number
  coinLabel: string
}): string {
  return `정확 매칭 한 건을 찾았습니다. 금액은 ${params.coinLabel}입니다.`
}
