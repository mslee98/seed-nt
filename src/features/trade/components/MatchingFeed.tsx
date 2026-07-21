import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, ScrollFog, Text, VStack } from '@seed-design/react'

import { BottomCTA } from '../../../shared/ui/BottomCTA'
import { formatCoinAmount } from '../../../shared/utils/formatAmount'
import { usePushNotification } from '../../pwa/hooks/usePushNotification'
import { PushEnableCard } from '../../pwa/components/PushEnableCard'
import {
  useMatchingSession,
  useMatchingSessionActions,
} from '../matching/hooks/useMatchingSession'
import type { MatchingCandidate } from '../matching/types'
import {
  getVisibleRevealedCandidates,
  hasRevealedExact,
  isQueueLocked,
  partitionRevealedCandidates,
} from '../matching/utils/matchingPhase'
import type { TradeRecord } from '../types'
import {
  formatMatchingCountdown,
  formatMatchingElapsed,
  getMatchingHeroCopy,
  getMatchingLiveAnnounce,
  getMatchingUiMode,
  MATCHING_LEAVE_OK_HINT,
} from '../copy'
import { MATCHING_TYPOGRAPHY } from '../constants/matchingTypography'
import { useMatchingNow } from '../hooks/useMatchingNow'
import { MatchingBottomActions } from './MatchingBottomActions'
import { MatchingCandidateList } from './MatchingCandidateList'
import type { MatchingCandidateFooterAction } from './MatchingCandidateCard'
import { MatchingCompactCondition } from './MatchingCompactCondition'
import { MatchingInlineMetrics } from './MatchingInlineMetrics'
import { MatchingPendingTimer } from './MatchingPendingTimer'
import { TradeCancelAlertDialog } from './TradeCancelAlertDialog'
import { TradeMotion } from './TradeMotion'

const SCROLL_FOG_CANDIDATE_THRESHOLD = 5
const HERO_SIZE_SEARCHING = 160
const HERO_SIZE_RESULT = 72

interface MatchingFeedProps {
  trade: TradeRecord
  onSelectCandidate?: (candidate: MatchingCandidate) => void
  onChangeConditions?: () => void | Promise<void>
  onStopMatching?: () => void | Promise<void>
}

export function MatchingFeed({
  trade,
  onSelectCandidate,
  onChangeConditions,
  onStopMatching,
}: MatchingFeedProps) {
  const matchingSession = useMatchingSession()
  const { withdrawProposal } = useMatchingSessionActions()
  const { eligibility, requestPermission } = usePushNotification()
  const [stopDialogOpen, setStopDialogOpen] = useState(false)
  const [actionPending, setActionPending] = useState(false)
  const seenExactIdsRef = useRef<Set<string>>(new Set())
  const [newExactIds, setNewExactIds] = useState<ReadonlySet<string>>(() => new Set())
  const [liveAnnounce, setLiveAnnounce] = useState('')

  const queueLocked = isQueueLocked(matchingSession)
  const pendingCandidateId = matchingSession?.pendingMatch?.candidateId ?? null
  const pendingExpiresAt = matchingSession?.pendingMatch?.expiresAt
  const sessionStartedAt = matchingSession?.startedAt ?? trade.matchingStartedAt

  const nowMs = useMatchingNow(true)

  const revealedCandidates = useMemo(
    () => getVisibleRevealedCandidates(matchingSession),
    [matchingSession],
  )

  const hasExact = hasRevealedExact(matchingSession)
  const { exact, near } = useMemo(
    () => partitionRevealedCandidates(revealedCandidates, trade.amountKrw),
    [revealedCandidates, trade.amountKrw],
  )

  const uiMode = getMatchingUiMode({
    queueLocked,
    revealedCount: revealedCandidates.length,
    hasExact,
  })

  const heroCopy = getMatchingHeroCopy({
    mode: uiMode,
    role: trade.role,
    exactCount: exact.length,
    nearCount: near.length,
  })

  const isSearching = uiMode === 'SEARCHING'
  const isPending = uiMode === 'PENDING'
  const isResultMode = uiMode === 'RESULT_EXACT' || uiMode === 'RESULT_NEAR'

  useEffect(() => {
    const fresh = exact.filter((candidate) => !seenExactIdsRef.current.has(candidate.id))
    if (fresh.length === 0) return

    fresh.forEach((candidate) => seenExactIdsRef.current.add(candidate.id))
    setNewExactIds(new Set(fresh.map((candidate) => candidate.id)))
    setLiveAnnounce(
      getMatchingLiveAnnounce({
        exactCount: exact.length,
        coinLabel: formatCoinAmount(fresh[0]!.amountKrw),
      }),
    )
  }, [exact])

  const listCandidates = useMemo(() => {
    if (!isPending) return revealedCandidates
    if (!pendingCandidateId) return []
    return revealedCandidates.filter((candidate) => candidate.id === pendingCandidateId)
  }, [isPending, pendingCandidateId, revealedCandidates])

  const showScrollFog = listCandidates.length >= SCROLL_FOG_CANDIDATE_THRESHOLD
  const heroSize = isSearching ? HERO_SIZE_SEARCHING : HERO_SIZE_RESULT

  const getFooterAction = (
    candidate: MatchingCandidate,
  ): MatchingCandidateFooterAction | undefined => {
    if (isPending && candidate.id === pendingCandidateId) {
      return {
        kind: 'cancel',
        label: '요청 취소',
        onClick: withdrawProposal,
      }
    }

    if (!isResultMode || candidate.matchType !== 'EXACT') return undefined

    return {
      kind: 'button',
      label: '거래 요청하기',
      onClick: () => onSelectCandidate?.(candidate),
    }
  }

  const runAction = async (action?: () => void | Promise<void>) => {
    if (!action || actionPending) return
    setActionPending(true)
    try {
      await action()
    } finally {
      setActionPending(false)
    }
  }

  const handleChangeConditions = () => {
    void runAction(onChangeConditions)
  }

  return (
    <VStack gap="x4" width="full" className="matching-feed" flexGrow minHeight="full">
      <span
        aria-live="polite"
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          overflow: 'hidden',
          clip: 'rect(0 0 0 0)',
        }}
      >
        {liveAnnounce}
      </span>

      {!isPending && (
        <VStack
          gap="x3"
          width="full"
          flexShrink={0}
          align="center"
          px="spacingX.globalGutter"
          pt="spacingY.navToTitle"
        >
          <Box aria-hidden="true">
            <TradeMotion variant="matchingSearch" size={heroSize} />
          </Box>
          {isResultMode && (
            <Text textStyle={MATCHING_TYPOGRAPHY.helper} color="fg.neutralMuted">
              계속 찾는 중
            </Text>
          )}
          <VStack gap="x1" align="center" width="full">
            <Text
              as="h1"
              textStyle={MATCHING_TYPOGRAPHY.heading}
              color="fg.neutral"
              style={{ textAlign: 'center' }}
            >
              {heroCopy.title}
            </Text>
            {heroCopy.description && (
              <Text
                textStyle={MATCHING_TYPOGRAPHY.body}
                color="fg.neutralSubtle"
                style={{ textAlign: 'center' }}
              >
                {heroCopy.description}
              </Text>
            )}
          </VStack>
        </VStack>
      )}

      {isPending && (
        <VStack
          gap="x3"
          width="full"
          flexShrink={0}
          align="center"
          px="spacingX.globalGutter"
          pt="spacingY.navToTitle"
        >
          <Text
            as="h1"
            textStyle={MATCHING_TYPOGRAPHY.heading}
            color="fg.neutral"
            style={{ textAlign: 'center' }}
          >
            {heroCopy.title}
          </Text>
          {heroCopy.description && (
            <Text
              textStyle={MATCHING_TYPOGRAPHY.body}
              color="fg.neutralSubtle"
              style={{ textAlign: 'center' }}
            >
              {heroCopy.description}
            </Text>
          )}
          {pendingExpiresAt && (
            <MatchingPendingTimer
              countdownLabel={formatMatchingCountdown(pendingExpiresAt, nowMs)}
            />
          )}
        </VStack>
      )}

      <div className="matching-feed-scroll-host">
        <ScrollFog placement={showScrollFog ? ['bottom'] : []}>
          <VStack gap="x5" width="full" px="spacingX.globalGutter" pb="spacingY.screenBottom">
            {!isPending && (
              <MatchingInlineMetrics
                exactCount={exact.length}
                nearCount={near.length}
                elapsedLabel={formatMatchingElapsed(sessionStartedAt, nowMs)}
              />
            )}

            {isResultMode && listCandidates.length > 0 && (
              <MatchingCandidateList
                candidates={listCandidates}
                requestedAmountKrw={trade.amountKrw}
                pendingCandidateId={pendingCandidateId}
                queueLocked={queueLocked}
                animate
                onSelectCandidate={onSelectCandidate}
                getFooterAction={getFooterAction}
                newExactIds={newExactIds}
                exactTitle="정확 매칭"
                nearTitle="비슷한 조건"
              />
            )}

            {isPending && listCandidates.length > 0 && (
              <MatchingCandidateList
                candidates={listCandidates}
                requestedAmountKrw={trade.amountKrw}
                pendingCandidateId={pendingCandidateId}
                queueLocked={queueLocked}
                animate
                getFooterAction={getFooterAction}
                exactTitle="요청한 제안"
                nearTitle="비슷한 조건"
              />
            )}

            <MatchingCompactCondition
              trade={trade}
              onChangeConditions={
                onChangeConditions && !isPending ? handleChangeConditions : undefined
              }
            />

            {isSearching && (
              <Text textStyle={MATCHING_TYPOGRAPHY.helper} color="fg.neutralMuted">
                {MATCHING_LEAVE_OK_HINT}
              </Text>
            )}

            {isSearching && (
              <PushEnableCard eligibility={eligibility} onRequestPermission={requestPermission} />
            )}
          </VStack>
        </ScrollFog>
      </div>

      {onStopMatching && (
        <BottomCTA variant="inline" behavior="fixed">
          <MatchingBottomActions
            disabled={actionPending}
            onStopMatching={() => setStopDialogOpen(true)}
          />
        </BottomCTA>
      )}

      <TradeCancelAlertDialog
        open={stopDialogOpen}
        onOpenChange={setStopDialogOpen}
        variant="matching"
        onConfirm={() => void runAction(onStopMatching)}
        splitContext={
          trade.splitLegIndex && trade.splitTotalLegs
            ? { legIndex: trade.splitLegIndex, totalLegs: trade.splitTotalLegs }
            : undefined
        }
      />
    </VStack>
  )
}
