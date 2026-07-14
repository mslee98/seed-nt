import type { KeyboardEvent } from 'react'
import { IconChevronRightLine } from '@karrotmarket/react-monochrome-icon'
import { Badge, Box, HStack, Icon, Text, VStack } from '@seed-design/react'

import { formatAmount } from '../../../shared/utils/formatAmount'
import type { MatchingCandidate } from '../matching/types'
import { formatAmountDelta } from '../utils/formatAmountDelta'
import { MatchingCandidateTagGroup } from './MatchingCandidateTagGroup'

export type MatchingCandidateCardVariant = 'default' | 'pending' | 'locked'

interface MatchingCandidateCardProps {
  candidate: MatchingCandidate
  requestedAmountKrw: number
  variant?: MatchingCandidateCardVariant
  animate?: boolean
  onSelect?: (candidate: MatchingCandidate) => void
}

function resolveBorderColor(
  variant: MatchingCandidateCardVariant,
  isExact: boolean,
): 'stroke.neutralWeak' | 'stroke.brandWeak' {
  if (variant === 'pending' || isExact) return 'stroke.brandWeak'
  return 'stroke.neutralWeak'
}

function CandidateContent({
  candidate,
  requestedAmountKrw,
  variant,
}: {
  candidate: MatchingCandidate
  requestedAmountKrw: number
  variant: MatchingCandidateCardVariant
}) {
  const isExact = candidate.matchType === 'EXACT'
  const amountDelta = formatAmountDelta(requestedAmountKrw, candidate.amountKrw)

  return (
    <VStack gap="x2" align="flex-start" width="full" flexGrow={1}>
      <HStack justify="space-between" align="center" width="full" gap="x2">
        {isExact ? (
          <Badge tone="brand" variant="weak" size="medium">
            가장 적합한 상대
          </Badge>
        ) : (
          <Text textStyle="t6Bold" color="fg.neutral">
            {candidate.nickname}
          </Text>
        )}
        <Badge tone={isExact ? 'brand' : 'neutral'} variant="weak" size="medium">
          {isExact ? '금액 정확히 일치' : '비슷한 금액'}
        </Badge>
      </HStack>

      {isExact && (
        <Text textStyle="t6Bold" color="fg.neutral">
          {candidate.nickname}
        </Text>
      )}

      <VStack gap="x0_5" align="flex-start" width="full">
        <Text textStyle="t6Bold" color="fg.neutral" className="tabular-nums">
          {formatAmount(candidate.amountKrw)}
        </Text>
        {isExact && !amountDelta ? (
          <Text textStyle="t4Regular" color="fg.neutralMuted">
            요청 금액과 정확히 일치해요
          </Text>
        ) : amountDelta ? (
          <Text textStyle="t4Regular" color="fg.neutralMuted" className="tabular-nums">
            {amountDelta}
          </Text>
        ) : null}
      </VStack>

      <MatchingCandidateTagGroup candidate={candidate} />

      {variant === 'pending' && (
        <Text textStyle="t4Regular" color="fg.brand">
          상대 확인 중이에요
        </Text>
      )}
    </VStack>
  )
}

export function MatchingCandidateCard({
  candidate,
  requestedAmountKrw,
  variant = 'default',
  animate = false,
  onSelect,
}: MatchingCandidateCardProps) {
  const isLocked = variant === 'locked'
  const isExact = candidate.matchType === 'EXACT'
  const isSelectable = Boolean(onSelect) && !isLocked && variant !== 'pending'

  const rootClassName = [
    animate ? 'matching-candidate-item--enter' : '',
    isLocked ? 'matching-candidate-item--locked' : '',
    variant === 'pending' ? 'matching-candidate-item--pending' : '',
    isSelectable ? 'matching-candidate-item--selectable' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const handleClick = () => {
    if (!isSelectable || !onSelect) return
    onSelect(candidate)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isSelectable || !onSelect) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect(candidate)
    }
  }

  return (
    <HStack
      className={rootClassName || undefined}
      width="full"
      p="x4"
      gap="x3"
      align="center"
      bg={isExact && variant !== 'locked' ? 'bg.brandWeak' : 'bg.layerDefault'}
      borderWidth="1"
      borderColor={resolveBorderColor(variant, isExact)}
      borderRadius="r4"
      role={isSelectable ? 'button' : undefined}
      tabIndex={isSelectable ? 0 : undefined}
      onClick={isSelectable ? handleClick : undefined}
      onKeyDown={isSelectable ? handleKeyDown : undefined}
    >
      <CandidateContent
        candidate={candidate}
        requestedAmountKrw={requestedAmountKrw}
        variant={variant}
      />
      {isSelectable && (
        <Box flexShrink={0}>
          <Icon svg={<IconChevronRightLine />} size="x5" color="fg.neutralSubtle" />
        </Box>
      )}
    </HStack>
  )
}
