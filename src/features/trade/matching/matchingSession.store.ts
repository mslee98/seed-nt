import {
  MATCH_APPROVAL_TIMEOUT_MS,
  MATCH_COUNTERPARTY_ACCEPT_DELAY_MS,
  MATCH_NEAR_AUTO_PROPOSE_MS,
} from '../constants'
import { createMockCandidates } from './matchingSession.mock'
import type { MatchingCandidate, MatchingSession, MatchingSuggestionReason } from './types'
import {
  getClosestNearCandidate,
  hasExactCandidate,
  sortCandidatesForReveal,
} from './utils/matchingPhase'

type Listener = () => void

type MatchConfirmedHandler = (payload: { tradeId: string; amountKrw: number }) => void

const REVEAL_INTERVAL_MS = 1500

const listeners = new Set<Listener>()
let session: MatchingSession | null = null
let revealIntervalId: ReturnType<typeof setInterval> | null = null
let nearAutoProposeTimerId: ReturnType<typeof setTimeout> | null = null
let approvalTimeoutId: ReturnType<typeof setTimeout> | null = null
let counterpartyAcceptTimerId: ReturnType<typeof setTimeout> | null = null
let onMatchConfirmed: MatchConfirmedHandler | null = null

function notify() {
  listeners.forEach((listener) => listener())
}

function clearRevealInterval() {
  if (revealIntervalId !== null) {
    clearInterval(revealIntervalId)
    revealIntervalId = null
  }
}

function clearNearAutoProposeTimer() {
  if (nearAutoProposeTimerId !== null) {
    clearTimeout(nearAutoProposeTimerId)
    nearAutoProposeTimerId = null
  }
}

function clearApprovalTimers() {
  if (approvalTimeoutId !== null) {
    clearTimeout(approvalTimeoutId)
    approvalTimeoutId = null
  }
  if (counterpartyAcceptTimerId !== null) {
    clearTimeout(counterpartyAcceptTimerId)
    counterpartyAcceptTimerId = null
  }
}

function clearRevealTimers() {
  clearRevealInterval()
  clearNearAutoProposeTimer()
}

function clearAllTimers() {
  clearRevealTimers()
  clearApprovalTimers()
}

function isQueueLocked(): boolean {
  return session?.phase === 'PENDING_APPROVAL'
}

function setSuggestion(candidateId: string, reason: MatchingSuggestionReason) {
  if (!session) return
  session = {
    ...session,
    suggestion: { candidateId, reason },
  }
  notify()
}

function getRevealQueue(): MatchingCandidate[] {
  if (!session) return []
  const revealed = new Set(session.revealedCandidateIds)
  const dismissed = new Set(session.dismissedCandidateIds)
  return sortCandidatesForReveal(session.candidates, session.requestedAmountKrw).filter(
    (candidate) => !revealed.has(candidate.id) && !dismissed.has(candidate.id),
  )
}

function getNextCandidateToReveal(): MatchingCandidate | null {
  return getRevealQueue()[0] ?? null
}

function scheduleNearAutoPropose() {
  if (!session || hasExactCandidate(session.candidates)) return

  clearNearAutoProposeTimer()
  nearAutoProposeTimerId = setTimeout(() => {
    nearAutoProposeTimerId = null
    if (!session || isQueueLocked()) return

    const closestNear = getClosestNearCandidate(session.candidates, session.requestedAmountKrw)
    if (!closestNear) return

    setSuggestion(closestNear.id, 'NEAR_TIMEOUT')
  }, MATCH_NEAR_AUTO_PROPOSE_MS)
}

function revealNextCandidate() {
  if (!session || isQueueLocked()) return

  const next = getNextCandidateToReveal()
  if (!next) {
    clearRevealInterval()
    return
  }

  session = {
    ...session,
    revealedCandidateIds: [...session.revealedCandidateIds, next.id],
  }
  notify()

  if (next.matchType === 'EXACT') {
    clearRevealTimers()
    setSuggestion(next.id, 'EXACT_REVEALED')
    return
  }

  if (!getNextCandidateToReveal()) {
    clearRevealInterval()
  }
}

function startRevealSequence() {
  if (!session || isQueueLocked()) return

  clearRevealInterval()
  revealNextCandidate()

  revealIntervalId = setInterval(() => {
    if (!session || isQueueLocked()) {
      clearRevealInterval()
      return
    }
    revealNextCandidate()
  }, REVEAL_INTERVAL_MS)
}

function resumeBrowsing() {
  if (!session) return

  session = {
    ...session,
    phase: 'BROWSING',
    pendingMatch: null,
    suggestion: null,
  }
  notify()

  startRevealSequence()
  scheduleNearAutoPropose()
}

function dismissCandidate(candidateId: string) {
  if (!session) return
  if (session.dismissedCandidateIds.includes(candidateId)) return

  session = {
    ...session,
    dismissedCandidateIds: [...session.dismissedCandidateIds, candidateId],
  }
}

function tryConfirmMatch() {
  if (!session?.pendingMatch) return

  const { myApprovedAt, counterpartyApprovedAt } = session.pendingMatch
  if (!myApprovedAt || !counterpartyApprovedAt) return

  const candidate = session.candidates.find((c) => c.id === session!.pendingMatch!.candidateId)
  if (!candidate) return

  const tradeId = session.tradeId
  const amountKrw = candidate.amountKrw

  clearAllTimers()
  onMatchConfirmed?.({ tradeId, amountKrw })
}

function scheduleCounterpartyAccept() {
  clearApprovalTimers()

  counterpartyAcceptTimerId = setTimeout(() => {
    counterpartyAcceptTimerId = null
    if (!session?.pendingMatch) return

    session = {
      ...session,
      pendingMatch: {
        ...session.pendingMatch,
        counterpartyApprovedAt: new Date().toISOString(),
      },
    }
    notify()
    tryConfirmMatch()
  }, MATCH_COUNTERPARTY_ACCEPT_DELAY_MS)

  approvalTimeoutId = setTimeout(() => {
    approvalTimeoutId = null
    if (!session?.pendingMatch) return
    releasePendingMatch('timeout')
  }, MATCH_APPROVAL_TIMEOUT_MS)
}

function releasePendingMatch(_reason: 'timeout' | 'withdraw' | 'reject') {
  if (!session?.pendingMatch) return

  const candidateId = session.pendingMatch.candidateId
  clearApprovalTimers()
  dismissCandidate(candidateId)
  resumeBrowsing()
}

export function setOnMatchConfirmed(handler: MatchConfirmedHandler | null) {
  onMatchConfirmed = handler
}

/** @deprecated use setOnMatchConfirmed */
export function setOnCandidateAccepted(handler: MatchConfirmedHandler | null) {
  setOnMatchConfirmed(handler)
}

export function subscribeMatchingSession(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getMatchingSession(): MatchingSession | null {
  return session
}

export function getRevealedCandidates(): MatchingCandidate[] {
  if (!session) return []
  const revealed = new Set(session.revealedCandidateIds)
  const dismissed = new Set(session.dismissedCandidateIds)
  return session.candidates.filter(
    (candidate) => revealed.has(candidate.id) && !dismissed.has(candidate.id),
  )
}

export function consumeSuggestion() {
  if (!session?.suggestion) return
  session = { ...session, suggestion: null }
  notify()
}

export function startMatchingSession(input: {
  tradeId: string
  amountKrw: number
}): MatchingSession {
  clearAllTimers()
  session = {
    tradeId: input.tradeId,
    requestedAmountKrw: input.amountKrw,
    phase: 'BROWSING',
    candidates: createMockCandidates(input.amountKrw),
    revealedCandidateIds: [],
    dismissedCandidateIds: [],
    pendingMatch: null,
    suggestion: null,
    startedAt: new Date().toISOString(),
  }
  startRevealSequence()
  scheduleNearAutoPropose()
  notify()
  return session
}

export function proposeMatch(candidateId: string) {
  if (!session || isQueueLocked()) return

  const candidate = session.candidates.find((item) => item.id === candidateId)
  if (!candidate || session.dismissedCandidateIds.includes(candidateId)) return

  clearRevealTimers()
  session = {
    ...session,
    phase: 'PENDING_APPROVAL',
    suggestion: null,
    pendingMatch: {
      candidateId,
      proposedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + MATCH_APPROVAL_TIMEOUT_MS).toISOString(),
      myApprovedAt: new Date().toISOString(),
    },
  }
  notify()
  scheduleCounterpartyAccept()
}

export function withdrawProposal() {
  if (!session?.pendingMatch) return
  releasePendingMatch('withdraw')
}

/** @deprecated use proposeMatch */
export function acceptCandidate(candidateId: string) {
  proposeMatch(candidateId)
}

export function clearMatchingSession() {
  clearAllTimers()
  session = null
  notify()
}

/** prefers-reduced-motion: stagger 없이 전체 공개 */
export function revealAllCandidates() {
  if (!session || isQueueLocked()) return

  clearRevealTimers()

  const dismissed = new Set(session.dismissedCandidateIds)
  const toReveal = sortCandidatesForReveal(session.candidates, session.requestedAmountKrw).filter(
    (candidate) => !dismissed.has(candidate.id),
  )
  const exact = toReveal.find((candidate) => candidate.matchType === 'EXACT')

  session = {
    ...session,
    revealedCandidateIds: toReveal.map((candidate) => candidate.id),
  }
  notify()

  if (exact) {
    setSuggestion(exact.id, 'EXACT_REVEALED')
  } else {
    const closestNear = getClosestNearCandidate(session.candidates, session.requestedAmountKrw)
    if (closestNear) {
      setSuggestion(closestNear.id, 'NEAR_TIMEOUT')
    }
  }
}
