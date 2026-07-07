import { useSyncExternalStore } from 'react'

import {
  proposeMatch,
  getMatchingSession,
  setMatchingMode,
  subscribeMatchingSession,
  withdrawProposal,
} from '../matchingSession.store'
import type { MatchingMode, MatchingSession } from '../types'

export function useMatchingSession(): MatchingSession | null {
  return useSyncExternalStore(subscribeMatchingSession, getMatchingSession, () => null)
}

export function useMatchingSessionActions() {
  return {
    proposeMatch,
    withdrawProposal,
    setMatchingMode,
  }
}

export type { MatchingMode }
