import { useCallback, useEffect, useRef, useState } from 'react'

import {
  useMatchingSession,
  useMatchingSessionActions,
} from '../matching/hooks/useMatchingSession'
import { isQueueLocked } from '../matching/utils/matchingPhase'
import type { MatchingCandidate } from '../matching/types'

interface UseMatchingAcceptSheetOptions {
  enabled: boolean
  tradeId: string | null
}

/**
 * 매칭 확인 시트 — MatchingFeed 밖 overlay 계층에서 suggestion을 처리합니다.
 * 중첩 portal/z-index 충돌을 피하기 위해 TradeLegOverlays에서 사용합니다.
 */
export function useMatchingAcceptSheet({ enabled, tradeId }: UseMatchingAcceptSheetOptions) {
  const matchingSession = useMatchingSession()
  const { proposeMatch, consumeSuggestion } = useMatchingSessionActions()
  const [open, setOpen] = useState(false)
  const [candidate, setCandidate] = useState<MatchingCandidate | null>(null)
  const consumedSuggestionIdRef = useRef<string | null>(null)

  const queueLocked = isQueueLocked(matchingSession)

  const resolveSuggestionCandidate = useCallback(() => {
    if (!matchingSession?.suggestion || queueLocked) return null
    if (tradeId && matchingSession.tradeId !== tradeId) return null
    return (
      matchingSession.candidates.find(
        (item) => item.id === matchingSession.suggestion?.candidateId,
      ) ?? null
    )
  }, [matchingSession, queueLocked, tradeId])

  const openAcceptForCandidate = useCallback((nextCandidate: MatchingCandidate) => {
    if (queueLocked) return
    setCandidate(nextCandidate)
    setOpen(true)
  }, [queueLocked])

  useEffect(() => {
    if (!enabled || queueLocked) return

    const suggestionId = matchingSession?.suggestion?.candidateId
    if (!suggestionId || consumedSuggestionIdRef.current === suggestionId) return

    const nextCandidate = resolveSuggestionCandidate()
    if (!nextCandidate) return

    consumedSuggestionIdRef.current = suggestionId
    setCandidate(nextCandidate)
    setOpen(true)
  }, [
    enabled,
    matchingSession?.suggestion,
    queueLocked,
    resolveSuggestionCandidate,
  ])

  useEffect(() => {
    if (enabled) return
    setOpen(false)
    setCandidate(null)
    consumedSuggestionIdRef.current = null
  }, [enabled])

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      setCandidate(null)
    }
  }, [])

  const handleConfirm = useCallback(
    async (candidateId: string) => {
      proposeMatch(candidateId)
      consumeSuggestion()
      setCandidate(null)
      setOpen(false)
    },
    [consumeSuggestion, proposeMatch],
  )

  return {
    acceptOpen: open,
    acceptCandidate: candidate,
    onAcceptOpenChange: handleOpenChange,
    onAcceptConfirm: handleConfirm,
    openAcceptForCandidate,
  }
}
