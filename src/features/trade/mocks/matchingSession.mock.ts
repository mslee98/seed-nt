import { formatCoinAmount } from '../../../shared/utils/formatAmount'
import type { MatchingCandidate } from '../matching/types'

const NICKNAMES = ['브릿유저', '코인마스터', '코인트레이더', '안전거래왕', '빠른매칭']

const NEAR_OFFSETS = [-10_000, 20_000, -30_000]

function pickNickname(index: number): string {
  return NICKNAMES[index % NICKNAMES.length]
}

function pickRating(index: number): number {
  return 4.2 + (index % 4) * 0.2
}

function pickTradeCount(index: number): number {
  return 12 + index * 17
}

function pickMannerTemperature(index: number): number {
  const values = [36.5, 37.2, 38.0, 39.1, 36.8]
  return values[index % values.length]
}

function pickCompletionRatePct(index: number): number {
  return 96 - (index % 4) * 2
}

function pickAvgResponseSec(index: number): number {
  return 42 + index * 8
}

function buildCandidate(
  partial: Omit<MatchingCandidate, 'completionRatePct' | 'avgResponseSec' | 'rating' | 'tradeCount' | 'mannerTemperature'> & {
    index: number
  },
): MatchingCandidate {
  const { index, ...rest } = partial
  return {
    ...rest,
    rating: pickRating(index),
    tradeCount: pickTradeCount(index),
    mannerTemperature: pickMannerTemperature(index),
    completionRatePct: pickCompletionRatePct(index),
    avgResponseSec: pickAvgResponseSec(index),
  }
}

export function createMockCandidates(requestedAmountKrw: number): MatchingCandidate[] {
  const exact = buildCandidate({
    id: `candidate-exact-${requestedAmountKrw}`,
    nickname: pickNickname(0),
    amountKrw: requestedAmountKrw,
    matchType: 'EXACT',
    index: 0,
  })

  const seenAmounts = new Set<number>([requestedAmountKrw])
  const nearCandidates: MatchingCandidate[] = []

  NEAR_OFFSETS.forEach((offset, index) => {
    const amountKrw = Math.max(10_000, requestedAmountKrw + offset)
    if (seenAmounts.has(amountKrw)) return
    seenAmounts.add(amountKrw)
    nearCandidates.push(
      buildCandidate({
        id: `candidate-near-${index}-${amountKrw}`,
        nickname: pickNickname(index + 1),
        amountKrw,
        matchType: 'NEAR',
        index: index + 1,
      }),
    )
  })

  const sortedNear = [...nearCandidates].sort(
    (a, b) =>
      Math.abs(a.amountKrw - requestedAmountKrw) - Math.abs(b.amountKrw - requestedAmountKrw),
  )

  return [exact, ...sortedNear]
}

export function formatCandidateCoin(amountKrw: number): string {
  return formatCoinAmount(amountKrw)
}
