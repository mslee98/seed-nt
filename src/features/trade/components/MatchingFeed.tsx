import { useMemo } from 'react'
import { HStack, ScrollFog, Text, VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'
import { PageBanner } from 'seed-design/ui/page-banner'

import { TextLinkButton } from '../../../shared/components/TextLinkButton'
import { BottomCTA } from '../../../shared/ui/BottomCTA'
import { usePushNotification } from '../../pwa/hooks/usePushNotification'
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
import { getMatchingHeroCopy, getMatchingUiMode, MATCHING_LEAVE_OK_HINT } from '../copy'
import { MatchingCandidateList } from './MatchingCandidateList'
import { PushEnableCard } from '../../pwa/components/PushEnableCard'
import { TradeMotion } from './TradeMotion'
import { WhileYouWaitSection } from './WhileYouWaitSection'

const SCROLL_FOG_CANDIDATE_THRESHOLD = 5
const HERO_MOTION_SIZE = 56

interface MatchingFeedProps {
  trade: TradeRecord
  onBrowseStore?: () => void
  onBrowseCommunity?: () => void
  onSelectCandidate?: (candidate: MatchingCandidate) => void
}

export function MatchingFeed({
  trade,
  onBrowseStore,
  onBrowseCommunity,
  onSelectCandidate,
}: MatchingFeedProps) {
  const matchingSession = useMatchingSession()
  const { withdrawProposal } = useMatchingSessionActions()
  const { eligibility, canShowWhileYouWait, requestPermission } = usePushNotification()

  const queueLocked = isQueueLocked(matchingSession)
  const pendingCandidateId = matchingSession?.pendingMatch?.candidateId ?? null

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
    amountKrw: trade.amountKrw,
    exactCount: exact.length,
    nearCount: near.length,
    role: trade.role,
  })

  const primaryCandidate = exact[0] ?? near[0] ?? null
  const isResultMode = uiMode === 'RESULT_EXACT' || uiMode === 'RESULT_NEAR'
  const showBottomCta =
    isResultMode && primaryCandidate !== null && Boolean(onSelectCandidate)

  const showSectionHeader = queueLocked || revealedCandidates.length > 0
  const showScrollFog = revealedCandidates.length >= SCROLL_FOG_CANDIDATE_THRESHOLD

  const primarySection = (
    <VStack gap="x4" width="full">
      {queueLocked && (
        <PageBanner
          tone="informative"
          variant="weak"
          title="승인되면 입금 단계로 넘어가요"
          description="잠시만 기다려 주세요."
        />
      )}

      {showSectionHeader && (
        <HStack justify="space-between" width="full">
          <Text textStyle="t7Bold" color="fg.neutral">
            {queueLocked ? '제안한 상대' : '찾은 상대'}
          </Text>
          {!queueLocked && (
            <Text textStyle="t3Regular" color="fg.neutralMuted">
              {revealedCandidates.length}명
            </Text>
          )}
        </HStack>
      )}

      {!queueLocked && revealedCandidates.length === 0 ? (
        <Text textStyle="t4Regular" color="fg.neutralMuted">
          상대를 찾고 있어요...
        </Text>
      ) : (
        <MatchingCandidateList
          candidates={revealedCandidates}
          requestedAmountKrw={trade.amountKrw}
          pendingCandidateId={pendingCandidateId}
          queueLocked={queueLocked}
          animate
          onSelectCandidate={queueLocked ? undefined : onSelectCandidate}
        />
      )}

      {queueLocked && <TextLinkButton onClick={withdrawProposal}>제안 취소</TextLinkButton>}
    </VStack>
  )

  const secondarySection = (
    <>
      {!queueLocked && canShowWhileYouWait && onBrowseStore && onBrowseCommunity && (
        <WhileYouWaitSection
          onStoreClick={onBrowseStore}
          onCommunityClick={onBrowseCommunity}
        />
      )}

      {!queueLocked && !canShowWhileYouWait && (
        <PushEnableCard eligibility={eligibility} onRequestPermission={requestPermission} />
      )}
    </>
  )

  // prefers-reduced-motion여도 히어로 APNG 유지 (제품 결정 B — ApngPlayer/mobile-motion 참고)
  const heroMotion =
    uiMode === 'PENDING' ? (
      <TradeMotion variant="waitingConfirm" size={HERO_MOTION_SIZE} />
    ) : (
      <TradeMotion variant="matchingSearch" size={HERO_MOTION_SIZE} />
    )

  return (
    <VStack gap="x4" width="full" className="matching-feed" flexGrow minHeight="full">
      <VStack gap="x3" width="full" flexShrink={0} px="x1">
        <HStack gap="x3" align="center" width="full">
          {heroMotion}
          <VStack gap="x1" align="flex-start" flexGrow minWidth="0">
            <Text textStyle="t6Bold" color="fg.neutral">
              {heroCopy.title}
            </Text>
            {heroCopy.description && (
              <Text textStyle="t4Regular" color="fg.neutralSubtle">
                {heroCopy.description}
              </Text>
            )}
            {heroCopy.summary && (
              <Text textStyle="t4Regular" color="fg.neutralMuted">
                {heroCopy.summary}
              </Text>
            )}
          </VStack>
        </HStack>

        <HStack
          width="full"
          px="x3"
          py="x2"
          bg="bg.neutralWeak"
          borderRadius="r2"
          align="center"
        >
          <Text textStyle="t3Regular" color="fg.neutralMuted">
            {MATCHING_LEAVE_OK_HINT}
          </Text>
        </HStack>
      </VStack>

      <div className="matching-feed-scroll-host">
        <ScrollFog placement={showScrollFog ? ['bottom'] : []}>
          <VStack gap="x6" width="full" pb="spacingY.screenBottom">
            {primarySection}
            {secondarySection}
          </VStack>
        </ScrollFog>
      </div>

      {showBottomCta && primaryCandidate && (
        <BottomCTA variant="inline" behavior="fixed">
          <ActionButton
            size="large"
            variant="brandSolid"
            flexGrow
            onClick={() => onSelectCandidate?.(primaryCandidate)}
          >
            가장 적합한 상대에게 제안하기
          </ActionButton>
        </BottomCTA>
      )}
    </VStack>
  )
}
