import {
  MATCH_APPROVAL_TIMEOUT_MS,
  MATCH_COUNTERPARTY_ACCEPT_DELAY_MS,
  MATCHING_SIMULATION_MS,
} from '../constants'
import { createMockCandidates } from './matchingSession.mock'
import type { MatchingCandidate, MatchingMode, MatchingSession } from './types'

type Listener = () => void

type MatchConfirmedHandler = (payload: { tradeId: string; amountKrw: number }) => void
type ExactModeTimeoutHandler = (tradeId: string) => void

const REVEAL_INTERVAL_MS = 1500

const listeners = new Set<Listener>()
let session: MatchingSession | null = null
let exactModeTimerId: ReturnType<typeof setTimeout> | null = null
let revealIntervalId: ReturnType<typeof setInterval> | null = null
let approvalTimeoutId: ReturnType<typeof setTimeout> | null = null
let counterpartyAcceptTimerId: ReturnType<typeof setTimeout> | null = null
let onMatchConfirmed: MatchConfirmedHandler | null = null
let onExactMatchTimeout: ExactModeTimeoutHandler | null = null

function notify() {
  listeners.forEach((listener) => listener())
}

function clearExactModeTimer() {
  if (exactModeTimerId !== null) {
    clearTimeout(exactModeTimerId)
    exactModeTimerId = null
  }
}

function clearRevealInterval() {
  if (revealIntervalId !== null) {
    clearInterval(revealIntervalId)
    revealIntervalId = null
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
}

function clearAllTimers() {
  clearExactModeTimer()
  clearRevealTimers()
  clearApprovalTimers()
}

function isQueueLocked(): boolean {
  return session?.phase === 'PENDING_APPROVAL'
}

function scheduleExactModeMatch(tradeId: string) {
  clearExactModeTimer()
  exactModeTimerId = setTimeout(() => {
    onExactMatchTimeout?.(tradeId)
  }, MATCHING_SIMULATION_MS)
}

function getNextCandidateToReveal(): MatchingCandidate | null {
  if (!session) return null
  const revealed = new Set(session.revealedCandidateIds)
  const dismissed = new Set(session.dismissedCandidateIds)
  return (
    session.candidates.find(
      (candidate) => !revealed.has(candidate.id) && !dismissed.has(candidate.id),
    ) ?? null
  )
}

function revealNextCandidate() {
  if (!session || session.mode !== 'FLEXIBLE' || isQueueLocked()) return

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

  if (!getNextCandidateToReveal()) {
    clearRevealInterval()
  }
}

function startRevealSequence() {
  if (!session || session.mode !== 'FLEXIBLE' || isQueueLocked()) return

  clearRevealInterval()
  revealNextCandidate()

  revealIntervalId = setInterval(() => {
    if (!session || session.mode !== 'FLEXIBLE' || isQueueLocked()) {
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
  }
  notify()

  if (session.mode === 'FLEXIBLE') {
    startRevealSequence()
  } else {
    scheduleExactModeMatch(session.tradeId)
  }
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

function handleExactModeTimeout(tradeId: string) {
  if (!session || session.tradeId !== tradeId || session.mode !== 'EXACT') return
  if (isQueueLocked()) return

  const exact = session.candidates.find((c) => c.matchType === 'EXACT')
  if (!exact) return

  if (!session.revealedCandidateIds.includes(exact.id)) {
    session = {
      ...session,
      revealedCandidateIds: [...session.revealedCandidateIds, exact.id],
    }
    notify()
  }

  proposeMatch(exact.id)
}

export function setOnMatchConfirmed(handler: MatchConfirmedHandler | null) {
  onMatchConfirmed = handler
}

/** @deprecated use setOnMatchConfirmed */
export function setOnCandidateAccepted(handler: MatchConfirmedHandler | null) {
  setOnMatchConfirmed(handler)
}

export function setOnExactMatchTimeout(handler: ExactModeTimeoutHandler | null) {
  onExactMatchTimeout = handler
}

export function subscribeMatchingSession(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getMatchingSession(): MatchingSession | null {
  return session
}

export function getMatchingMode(): MatchingMode | null {
  return session?.mode ?? null
}

export function getRevealedCandidates(): MatchingCandidate[] {
  if (!session) return []
  const revealed = new Set(session.revealedCandidateIds)
  const dismissed = new Set(session.dismissedCandidateIds)
  return session.candidates.filter(
    (candidate) => revealed.has(candidate.id) && !dismissed.has(candidate.id),
  )
}

export function startMatchingSession(input: {
  tradeId: string
  amountKrw: number
  mode?: MatchingMode
}): MatchingSession {
  clearAllTimers()
  const mode = input.mode ?? 'FLEXIBLE'
  session = {
    tradeId: input.tradeId,
    requestedAmountKrw: input.amountKrw,
    mode,
    phase: 'BROWSING',
    candidates: createMockCandidates(input.amountKrw),
    revealedCandidateIds: [],
    dismissedCandidateIds: [],
    pendingMatch: null,
    startedAt: new Date().toISOString(),
  }
  if (mode === 'EXACT') {
    scheduleExactModeMatch(input.tradeId)
  } else {
    startRevealSequence()
  }
  notify()
  return session
}

export function setMatchingMode(mode: MatchingMode) {
  if (!session || isQueueLocked()) return

  clearAllTimers()
  session = {
    ...session,
    mode,
    revealedCandidateIds: [],
    dismissedCandidateIds: [],
    phase: 'BROWSING',
    pendingMatch: null,
  }

  if (mode === 'EXACT') {
    scheduleExactModeMatch(session.tradeId)
  } else {
    startRevealSequence()
  }
  notify()
}

export function proposeMatch(candidateId: string) {
  if (!session || isQueueLocked()) return

  const candidate = session.candidates.find((item) => item.id === candidateId)
  if (!candidate || session.dismissedCandidateIds.includes(candidateId)) return

  clearRevealTimers()
  clearExactModeTimer()

  const now = new Date().toISOString()
  session = {
    ...session,
    phase: 'PENDING_APPROVAL',
    pendingMatch: {
      candidateId,
      proposedAt: now,
      expiresAt: new Date(Date.now() + MATCH_APPROVAL_TIMEOUT_MS).toISOString(),
      myApprovedAt: now,
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
  if (!session || session.mode !== 'FLEXIBLE' || isQueueLocked()) return

  clearRevealInterval()

  const dismissed = new Set(session.dismissedCandidateIds)
  session = {
    ...session,
    revealedCandidateIds: session.candidates
      .filter((candidate) => !dismissed.has(candidate.id))
      .map((candidate) => candidate.id),
  }
  notify()
}

setOnExactMatchTimeout(handleExactModeTimeout)
