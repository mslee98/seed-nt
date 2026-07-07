export type MatchingMode = 'FLEXIBLE' | 'EXACT'

export type MatchingPhase = 'BROWSING' | 'PENDING_APPROVAL'

export type CandidateMatchType = 'EXACT' | 'NEAR'

export interface MatchingCandidate {
  id: string
  nickname: string
  amountKrw: number
  rating: number
  tradeCount: number
  matchType: CandidateMatchType
}

export interface PendingMatch {
  candidateId: string
  proposedAt: string
  expiresAt: string
  myApprovedAt: string
  counterpartyApprovedAt?: string
}

export interface MatchingSession {
  tradeId: string
  requestedAmountKrw: number
  mode: MatchingMode
  phase: MatchingPhase
  candidates: MatchingCandidate[]
  revealedCandidateIds: string[]
  dismissedCandidateIds: string[]
  pendingMatch: PendingMatch | null
  startedAt: string
}
