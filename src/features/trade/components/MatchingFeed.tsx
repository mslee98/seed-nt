import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useFlow } from '@stackflow/react'
import { motion } from 'motion/react'
import { Badge, HStack, Text, VStack } from '@seed-design/react'

import { TextLinkButton } from '../../../shared/components/TextLinkButton'
import { usePrefersReducedMotion } from '../../../shared/hooks/usePrefersReducedMotion'
import { formatAmount } from '../../home/utils/formatAmount'
import { usePushNotification } from '../../pwa/hooks/usePushNotification'
import {
  useMatchingSession,
  useMatchingSessionActions,
} from '../matching/hooks/useMatchingSession'
import { revealAllCandidates } from '../matching/matchingSession.store'
import { getVisibleRevealedCandidates, isQueueLocked } from '../matching/utils/matchingPhase'
import type { MatchingCandidate } from '../matching/types'
import type { TradeRecord } from '../types'
import { getMatchingCopy } from '../utils/matchingCopy'
import { MatchingAcceptBottomSheet } from './MatchingAcceptBottomSheet'
import { MatchingCandidateCard } from './MatchingCandidateCard'
import { PushEnableCard } from './PushEnableCard'
import { TradeMotion } from './TradeMotion'
import { WhileYouWaitSection } from './WhileYouWaitSection'

interface MatchingFeedProps {
  trade: TradeRecord
}

function RevealedCard({ children, animate }: { children: ReactNode; animate: boolean }) {
  if (!animate) {
    return <>{children}</>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.2, 0.1, 0.21, 0.99] }}
    >
      {children}
    </motion.div>
  )
}

export function MatchingFeed({ trade }: MatchingFeedProps) {
  const { push } = useFlow()
  const matchingSession = useMatchingSession()
  const { proposeMatch, withdrawProposal, setMatchingMode } = useMatchingSessionActions()
  const { eligibility, canShowWhileYouWait, requestPermission } = usePushNotification()
  const prefersReducedMotion = usePrefersReducedMotion()
  const [selectedCandidate, setSelectedCandidate] = useState<MatchingCandidate | null>(null)
  const [acceptOpen, setAcceptOpen] = useState(false)

  const mode = matchingSession?.mode ?? 'FLEXIBLE'
  const matchingCopy = getMatchingCopy(trade)
  const isExactMode = mode === 'EXACT'
  const queueLocked = isQueueLocked(matchingSession)
  const pendingCandidateId = matchingSession?.pendingMatch?.candidateId ?? null

  const revealedCandidates = useMemo(
    () => getVisibleRevealedCandidates(matchingSession),
    [matchingSession],
  )

  const handleStoreClick = () => {
    push('Detail', { id: 'store' })
  }

  const handleCommunityClick = () => {
    push('Detail', { id: 'community' })
  }

  const handleSelectCandidate = (candidate: MatchingCandidate) => {
    if (queueLocked) return
    setSelectedCandidate(candidate)
    setAcceptOpen(true)
  }

  const handleConfirmPropose = (candidateId: string) => {
    proposeMatch(candidateId)
    setSelectedCandidate(null)
  }

  const toggleMode = () => {
    if (queueLocked) return
    setMatchingMode(isExactMode ? 'FLEXIBLE' : 'EXACT')
  }

  useEffect(() => {
    if (!prefersReducedMotion || !matchingSession || matchingSession.mode !== 'FLEXIBLE') {
      return
    }
    if (queueLocked) return
    revealAllCandidates()
  }, [prefersReducedMotion, matchingSession?.tradeId, matchingSession?.mode, queueLocked])

  const statusBadgeLabel = queueLocked ? '승인 대기 중' : '매칭 중'

  return (
    <>
      <VStack gap="x4" width="full" className="matching-feed">
        <HStack gap="x3" align="center">
          <TradeMotion variant="matching" size={48} />
          <VStack gap="x1" flexGrow style={{ minWidth: 0 }}>
            <Badge tone="warning" variant="weak" size="medium">
              {statusBadgeLabel}
            </Badge>
            <Text textStyle="t5Bold" color="fg.neutral">
              {queueLocked ? '상대 승인을 기다리고 있어요' : matchingCopy.title}
            </Text>
            <Text textStyle="t4Regular" color="fg.neutralSubtle" className="tabular-nums">
              {formatAmount(trade.amountKrw)}
            </Text>
          </VStack>
        </HStack>

        {isExactMode && !queueLocked ? (
          <Text textStyle="t4Regular" color="fg.neutralSubtle">
            정확히 {formatAmount(trade.amountKrw)}만 기다릴게요.
          </Text>
        ) : (
          <VStack gap="x3" width="full">
            {!queueLocked && revealedCandidates.length === 0 && (
              <Text textStyle="t4Regular" color="fg.neutralMuted">
                상대를 찾고 있어요...
              </Text>
            )}
            {revealedCandidates.map((candidate) => {
              const variant =
                pendingCandidateId === candidate.id
                  ? 'pending'
                  : queueLocked
                    ? 'locked'
                    : 'default'

              return (
                <RevealedCard key={candidate.id} animate={!prefersReducedMotion}>
                  <MatchingCandidateCard
                    candidate={candidate}
                    variant={variant}
                    animate={!prefersReducedMotion}
                    onSelect={handleSelectCandidate}
                  />
                </RevealedCard>
              )
            })}
          </VStack>
        )}

        {queueLocked ? (
          <TextLinkButton onClick={withdrawProposal}>제안 취소</TextLinkButton>
        ) : (
          <TextLinkButton onClick={toggleMode}>
            {isExactMode ? '비슷한 금액도 괜찮아요' : '정확한 금액만 기다릴게요'}
          </TextLinkButton>
        )}

        {!queueLocked && canShowWhileYouWait && (
          <WhileYouWaitSection
            onStoreClick={handleStoreClick}
            onCommunityClick={handleCommunityClick}
          />
        )}

        {!queueLocked && !canShowWhileYouWait && (
          <PushEnableCard eligibility={eligibility} onRequestPermission={requestPermission} />
        )}
      </VStack>

      <MatchingAcceptBottomSheet
        open={acceptOpen}
        onOpenChange={setAcceptOpen}
        candidate={selectedCandidate}
        onConfirm={handleConfirmPropose}
      />
    </>
  )
}
