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
