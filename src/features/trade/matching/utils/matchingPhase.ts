import type { MatchingCandidate, MatchingSession } from '../types'

export function isQueueLocked(session: MatchingSession | null): boolean {
  return session?.phase === 'PENDING_APPROVAL'
}

export function getPendingCandidate(session: MatchingSession | null): MatchingCandidate | null {
  if (!session?.pendingMatch) return null
  return session.candidates.find((c) => c.id === session.pendingMatch?.candidateId) ?? null
}

export function getVisibleRevealedCandidates(session: MatchingSession | null): MatchingCandidate[] {
  if (!session) return []
  const revealed = new Set(session.revealedCandidateIds)
  const dismissed = new Set(session.dismissedCandidateIds)
  return session.candidates.filter(
    (candidate) => revealed.has(candidate.id) && !dismissed.has(candidate.id),
  )
}

export function hasExactCandidate(candidates: MatchingCandidate[]): boolean {
  return candidates.some((candidate) => candidate.matchType === 'EXACT')
}

function sortNearByAmountDistance(
  candidates: MatchingCandidate[],
  requestedAmountKrw: number,
): MatchingCandidate[] {
  return [...candidates].sort(
    (a, b) =>
      Math.abs(a.amountKrw - requestedAmountKrw) - Math.abs(b.amountKrw - requestedAmountKrw),
  )
}

export function sortCandidatesForReveal(
  candidates: MatchingCandidate[],
  requestedAmountKrw: number,
): MatchingCandidate[] {
  const exact = candidates.filter((candidate) => candidate.matchType === 'EXACT')
  const near = sortNearByAmountDistance(
    candidates.filter((candidate) => candidate.matchType === 'NEAR'),
    requestedAmountKrw,
  )
  return [...exact, ...near]
}

export function partitionRevealedCandidates(
  candidates: MatchingCandidate[],
  requestedAmountKrw: number,
): { exact: MatchingCandidate[]; near: MatchingCandidate[] } {
  return {
    exact: candidates.filter((candidate) => candidate.matchType === 'EXACT'),
    near: sortNearByAmountDistance(
      candidates.filter((candidate) => candidate.matchType === 'NEAR'),
      requestedAmountKrw,
    ),
  }
}

export function getClosestNearCandidate(
  candidates: MatchingCandidate[],
  requestedAmountKrw: number,
): MatchingCandidate | null {
  const near = candidates.filter((candidate) => candidate.matchType === 'NEAR')
  if (near.length === 0) return null

  return near.reduce((closest, candidate) => {
    const closestDiff = Math.abs(closest.amountKrw - requestedAmountKrw)
    const candidateDiff = Math.abs(candidate.amountKrw - requestedAmountKrw)
    return candidateDiff < closestDiff ? candidate : closest
  })
}

export function hasRevealedExact(session: MatchingSession | null): boolean {
  if (!session) return false
  const revealed = new Set(session.revealedCandidateIds)
  return session.candidates.some(
    (candidate) => candidate.matchType === 'EXACT' && revealed.has(candidate.id),
  )
}
