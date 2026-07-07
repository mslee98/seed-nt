import { IconChevronRightLine } from '@karrotmarket/react-monochrome-icon'
import { Badge, Box, HStack, Icon, Text, VStack } from '@seed-design/react'
import { List, ListButtonItem, ListItem } from 'seed-design/ui/list'

import { formatAmount } from '../../home/utils/formatAmount'
import { formatCandidateCoin } from '../matching/matchingSession.mock'
import type { MatchingCandidate } from '../matching/types'

export type MatchingCandidateCardVariant = 'default' | 'pending' | 'locked'

interface MatchingCandidateCardProps {
  candidate: MatchingCandidate
  variant?: MatchingCandidateCardVariant
  animate?: boolean
  onSelect?: (candidate: MatchingCandidate) => void
}

function CandidateTitle({
  candidate,
  variant,
}: {
  candidate: MatchingCandidate
  variant: MatchingCandidateCardVariant
}) {
  const isExact = candidate.matchType === 'EXACT'

  return (
    <VStack gap="x1" align="flex-start" width="full">
      <HStack align="center" justify="space-between" width="full">
        <Badge tone={isExact ? 'brand' : 'neutral'} variant="weak" size="medium">
          {isExact ? '금액 일치' : '비슷한 금액'}
        </Badge>
        <Text textStyle="t4Regular" color="fg.neutralMuted">
          거래 {candidate.tradeCount}회
        </Text>
      </HStack>
      <Text textStyle="t6Bold" color="fg.neutral" className="tabular-nums">
        {formatAmount(candidate.amountKrw)}
      </Text>
      {variant === 'pending' && (
        <Text textStyle="t4Regular" color="fg.brand">
          상대 확인 중이에요
        </Text>
      )}
    </VStack>
  )
}

function candidateDetail(candidate: MatchingCandidate) {
  return `${formatCandidateCoin(candidate.amountKrw)} · ${candidate.nickname}`
}

export function MatchingCandidateCard({
  candidate,
  variant = 'default',
  animate = false,
  onSelect,
}: MatchingCandidateCardProps) {
  const isInteractive = variant === 'default'
  const rootClassName = [
    animate ? 'matching-candidate-item--enter' : '',
    variant === 'locked' ? 'matching-candidate-item--locked' : '',
    variant === 'pending' ? 'matching-candidate-item--pending' : '',
  ]
    .filter(Boolean)
    .join(' ')

  if (isInteractive) {
    return (
      <List>
        <ListButtonItem
          rootProps={rootClassName ? { className: rootClassName } : undefined}
          title={<CandidateTitle candidate={candidate} variant="default" />}
          detail={candidateDetail(candidate)}
          suffix={<Icon svg={<IconChevronRightLine />} size="x5" color="fg.neutralSubtle" />}
          onClick={() => onSelect?.(candidate)}
        />
      </List>
    )
  }

  return (
    <Box className={rootClassName || undefined} width="full">
      <List>
        <ListItem
          title={<CandidateTitle candidate={candidate} variant={variant} />}
          detail={candidateDetail(candidate)}
        />
      </List>
    </Box>
  )
}
