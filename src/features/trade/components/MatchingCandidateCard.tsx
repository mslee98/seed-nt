import type { KeyboardEvent, MouseEvent } from 'react'
import { IconChevronRightLine } from '@karrotmarket/react-monochrome-icon'
import { Badge, Box, HStack, Icon, Text, VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'

import { formatAmount } from '../../home/utils/formatAmount'
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
  onSelect,
}: {
  candidate: MatchingCandidate
  requestedAmountKrw: number
  variant: MatchingCandidateCardVariant
  onSelect?: (candidate: MatchingCandidate) => void
}) {
  const isExact = candidate.matchType === 'EXACT'
  const isLocked = variant === 'locked'
  const amountDelta = formatAmountDelta(requestedAmountKrw, candidate.amountKrw)
  const showExactCta = isExact && Boolean(onSelect) && !isLocked && variant !== 'pending'

  const handleExactCtaClick = (event: MouseEvent) => {
    event.stopPropagation()
    onSelect?.(candidate)
  }

  return (
    <VStack gap="x2" align="flex-start" width="full" flexGrow={1}>
      <HStack justify="space-between" align="center" width="full" gap="x2">
        <Text textStyle="t6Bold" color="fg.neutral">
          {candidate.nickname}
        </Text>
        <Badge tone={isExact ? 'brand' : 'neutral'} variant="weak" size="medium">
          {isExact ? '추천' : '비슷한 금액'}
        </Badge>
      </HStack>

      <VStack gap="x0_5" align="flex-start" width="full">
        <Text textStyle="t6Bold" color="fg.neutral" className="tabular-nums">
          {formatAmount(candidate.amountKrw)}
        </Text>
        {amountDelta && (
          <Text textStyle="t4Regular" color="fg.neutralMuted" className="tabular-nums">
            {amountDelta}
          </Text>
        )}
      </VStack>

      <MatchingCandidateTagGroup candidate={candidate} />

      {variant === 'pending' && (
        <Text textStyle="t4Regular" color="fg.brand">
          상대 확인 중이에요
        </Text>
      )}

      {showExactCta && (
        <Box width="full" pt="x1">
          <ActionButton
            size="medium"
            variant="brandSolid"
            flexGrow
            onClick={handleExactCtaClick}
          >
            이 상대에게 제안하기
          </ActionButton>
        </Box>
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
  const isNearSelectable = Boolean(onSelect) && !isLocked && !isExact
  const isSelectable = isNearSelectable

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
      bg="bg.layerDefault"
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
        onSelect={onSelect}
      />
      {isSelectable && (
        <Box flexShrink={0}>
          <Icon svg={<IconChevronRightLine />} size="x5" color="fg.neutralSubtle" />
        </Box>
      )}
    </HStack>
  )
}
