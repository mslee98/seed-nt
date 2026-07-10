import { useEffect, useMemo } from 'react'
import { useFlow } from '@stackflow/react'
import { Badge, HStack, ScrollFog, Text, VStack } from '@seed-design/react'
import { PageBanner } from 'seed-design/ui/page-banner'

import { TextLinkButton } from '../../../shared/components/TextLinkButton'
import { usePrefersReducedMotion } from '../../../shared/hooks/usePrefersReducedMotion'
import { formatAmount } from '../../home/utils/formatAmount'
import { usePushNotification } from '../../pwa/hooks/usePushNotification'
import {
  useMatchingSession,
  useMatchingSessionActions,
} from '../matching/hooks/useMatchingSession'
import { revealAllCandidates } from '../matching/matchingSession.store'
import type { MatchingCandidate } from '../matching/types'
import {
  getVisibleRevealedCandidates,
  hasRevealedExact,
  isQueueLocked,
} from '../matching/utils/matchingPhase'
import type { TradeRecord } from '../types'
import { getMatchingHeroCopy } from '../copy'
import { MatchingCandidateList } from './MatchingCandidateList'
import { PushEnableCard } from './PushEnableCard'
import { TradeMotion } from './TradeMotion'
import { WhileYouWaitSection } from './WhileYouWaitSection'

const SCROLL_FOG_CANDIDATE_THRESHOLD = 5

interface MatchingFeedProps {
  trade: TradeRecord
  onNavigateAway?: () => void
  onSelectCandidate?: (candidate: MatchingCandidate) => void
}

export function MatchingFeed({ trade, onNavigateAway, onSelectCandidate }: MatchingFeedProps) {
  const { push } = useFlow()
  const matchingSession = useMatchingSession()
  const { withdrawProposal } = useMatchingSessionActions()
  const { eligibility, canShowWhileYouWait, requestPermission } = usePushNotification()
  const prefersReducedMotion = usePrefersReducedMotion()

  const queueLocked = isQueueLocked(matchingSession)
  const pendingCandidateId = matchingSession?.pendingMatch?.candidateId ?? null

  const revealedCandidates = useMemo(
    () => getVisibleRevealedCandidates(matchingSession),
    [matchingSession],
  )

  const hasExact = hasRevealedExact(matchingSession)
  const heroCopy = getMatchingHeroCopy({
    queueLocked,
    revealedCount: revealedCandidates.length,
    hasExact,
    role: trade.role,
  })

  const showSectionHeader = queueLocked || revealedCandidates.length > 0
  const showScrollFog = revealedCandidates.length >= SCROLL_FOG_CANDIDATE_THRESHOLD

  const handleStoreClick = () => {
    onNavigateAway?.()
    push('Detail', { id: 'store' })
  }

  const handleCommunityClick = () => {
    onNavigateAway?.()
    push('Detail', { id: 'community' })
  }

  useEffect(() => {
    if (!prefersReducedMotion || !matchingSession) {
      return
    }
    if (queueLocked) return
    revealAllCandidates()
  }, [prefersReducedMotion, matchingSession?.tradeId, queueLocked])

  const statusBadgeLabel = queueLocked ? '승인 대기 중' : '매칭 중'

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
          <Text textStyle="t4Bold" color="fg.neutral">
            {queueLocked ? '제안한 상대' : '찾은 상대'}
          </Text>
          {!queueLocked && (
            <Text textStyle="t4Regular" color="fg.neutralMuted">
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
          animate={!prefersReducedMotion}
          onSelectCandidate={queueLocked ? undefined : onSelectCandidate}
        />
      )}

      {queueLocked && <TextLinkButton onClick={withdrawProposal}>제안 취소</TextLinkButton>}
    </VStack>
  )

  const secondarySection = (
    <>
      {!queueLocked && canShowWhileYouWait && (
        <WhileYouWaitSection
          onStoreClick={handleStoreClick}
          onCommunityClick={handleCommunityClick}
        />
      )}

      {!queueLocked && !canShowWhileYouWait && (
        <PushEnableCard eligibility={eligibility} onRequestPermission={requestPermission} />
      )}
    </>
  )

  return (
    <VStack gap="x4" width="full" className="matching-feed" flexGrow minHeight="full">
      <VStack gap="x3" align="center" width="full" flexShrink={0}>
        <TradeMotion
          variant={queueLocked ? 'waitingConfirm' : 'matching'}
          size={48}
        />
        <VStack gap="x1" align="center" width="full">
          <Badge tone="warning" variant="weak" size="medium">
            {statusBadgeLabel}
          </Badge>
          <Text textStyle="t6Bold" color="fg.neutral">
            {heroCopy.title}
          </Text>
          {heroCopy.description && (
            <Text textStyle="t4Regular" color="fg.neutralSubtle">
              {heroCopy.description}
            </Text>
          )}
          <Text textStyle="t4Regular" color="fg.neutralMuted" className="tabular-nums">
            {formatAmount(trade.amountKrw)}
          </Text>
        </VStack>
      </VStack>

      <div className="matching-feed-scroll-host">
        <ScrollFog placement={showScrollFog ? ['bottom'] : []}>
          <VStack gap="x6" width="full" pb="spacingY.screenBottom">
            {primarySection}
            {secondarySection}
          </VStack>
        </ScrollFog>
      </div>
    </VStack>
  )
}
