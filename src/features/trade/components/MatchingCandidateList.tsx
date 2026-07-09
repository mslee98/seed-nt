import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { VStack } from '@seed-design/react'
import { ListHeader } from 'seed-design/ui/list-header'

import type { MatchingCandidate } from '../matching/types'
import { partitionRevealedCandidates } from '../matching/utils/matchingPhase'
import { MatchingCandidateCard, type MatchingCandidateCardVariant } from './MatchingCandidateCard'

interface MatchingCandidateListProps {
  candidates: MatchingCandidate[]
  requestedAmountKrw: number
  pendingCandidateId: string | null
  queueLocked: boolean
  animate: boolean
  onSelectCandidate?: (candidate: MatchingCandidate) => void
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

function CandidateSection({
  title,
  candidates,
  requestedAmountKrw,
  pendingCandidateId,
  queueLocked,
  animate,
  onSelectCandidate,
}: {
  title: string
  candidates: MatchingCandidate[]
  requestedAmountKrw: number
  pendingCandidateId: string | null
  queueLocked: boolean
  animate: boolean
  onSelectCandidate?: (candidate: MatchingCandidate) => void
}) {
  if (candidates.length === 0) return null

  return (
    <VStack gap="x3" width="full">
      <ListHeader as="h3" variant="mediumWeak">
        {title}
      </ListHeader>
      {candidates.map((candidate) => {
        const variant: MatchingCandidateCardVariant =
          pendingCandidateId === candidate.id ? 'pending' : queueLocked ? 'locked' : 'default'

        return (
          <RevealedCard key={candidate.id} animate={animate}>
            <MatchingCandidateCard
              candidate={candidate}
              requestedAmountKrw={requestedAmountKrw}
              variant={variant}
              animate={animate}
              onSelect={onSelectCandidate}
            />
          </RevealedCard>
        )
      })}
    </VStack>
  )
}

export function MatchingCandidateList({
  candidates,
  requestedAmountKrw,
  pendingCandidateId,
  queueLocked,
  animate,
  onSelectCandidate,
}: MatchingCandidateListProps) {
  const { exact, near } = partitionRevealedCandidates(candidates, requestedAmountKrw)
  const showSectionTitles = exact.length > 0 && near.length > 0

  if (!showSectionTitles) {
    return (
      <VStack gap="x3" width="full">
        {candidates.map((candidate) => {
          const variant: MatchingCandidateCardVariant =
            pendingCandidateId === candidate.id ? 'pending' : queueLocked ? 'locked' : 'default'

          return (
            <RevealedCard key={candidate.id} animate={animate}>
              <MatchingCandidateCard
                candidate={candidate}
                requestedAmountKrw={requestedAmountKrw}
                variant={variant}
                animate={animate}
                onSelect={onSelectCandidate}
              />
            </RevealedCard>
          )
        })}
      </VStack>
    )
  }

  return (
    <VStack gap="x5" width="full">
      <CandidateSection
        title="추천"
        candidates={exact}
        requestedAmountKrw={requestedAmountKrw}
        pendingCandidateId={pendingCandidateId}
        queueLocked={queueLocked}
        animate={animate}
        onSelectCandidate={onSelectCandidate}
      />
      <CandidateSection
        title="비슷한 상대"
        candidates={near}
        requestedAmountKrw={requestedAmountKrw}
        pendingCandidateId={pendingCandidateId}
        queueLocked={queueLocked}
        animate={animate}
        onSelectCandidate={onSelectCandidate}
      />
    </VStack>
  )
}
