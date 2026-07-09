/** @deprecated API matchMode 문서용. 클라이언트 토글 없음. */
export type MatchingMode = 'FLEXIBLE' | 'EXACT'

export type MatchingPhase = 'BROWSING' | 'PENDING_APPROVAL'

export type CandidateMatchType = 'EXACT' | 'NEAR'

export type MatchingSuggestionReason = 'EXACT_REVEALED' | 'NEAR_TIMEOUT'

export interface MatchingSuggestion {
  candidateId: string
  reason: MatchingSuggestionReason
}

export interface MatchingCandidate {
  id: string
  nickname: string
  amountKrw: number
  rating: number
  tradeCount: number
  mannerTemperature: number
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
  phase: MatchingPhase
  candidates: MatchingCandidate[]
  revealedCandidateIds: string[]
  dismissedCandidateIds: string[]
  pendingMatch: PendingMatch | null
  suggestion: MatchingSuggestion | null
  startedAt: string
}
