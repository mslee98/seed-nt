import { krwToCoin } from '../../home/utils/formatAmount'
import type { MatchingCandidate } from './types'

const NICKNAMES = ['브릿유저', '코인마스터', 'MS트레이더', '안전거래왕', '빠른매칭']

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

export function createMockCandidates(requestedAmountKrw: number): MatchingCandidate[] {
  const exact: MatchingCandidate = {
    id: `candidate-exact-${requestedAmountKrw}`,
    nickname: pickNickname(0),
    amountKrw: requestedAmountKrw,
    rating: pickRating(0),
    tradeCount: pickTradeCount(0),
    matchType: 'EXACT',
  }

  const seenAmounts = new Set<number>([requestedAmountKrw])
  const nearCandidates: MatchingCandidate[] = []

  NEAR_OFFSETS.forEach((offset, index) => {
    const amountKrw = Math.max(10_000, requestedAmountKrw + offset)
    if (seenAmounts.has(amountKrw)) return
    seenAmounts.add(amountKrw)
    nearCandidates.push({
      id: `candidate-near-${index}-${amountKrw}`,
      nickname: pickNickname(index + 1),
      amountKrw,
      rating: pickRating(index + 1),
      tradeCount: pickTradeCount(index + 1),
      matchType: 'NEAR',
    })
  })

  return [exact, ...nearCandidates]
}

export function formatCandidateCoin(amountKrw: number): string {
  return `${krwToCoin(amountKrw)} MS`
}
