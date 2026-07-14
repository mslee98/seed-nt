import { Badge, Box, HStack, Text, VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'

import { formatAmount } from '../../../shared/utils/formatAmount'
import type { SplitLegViewModel } from '../types/splitDashboard'
import { getSplitLegActionLabel } from '../utils/mapSplitDashboard'

interface SplitLegCardProps {
  leg: SplitLegViewModel
  totalLegs: number
  onPrimaryAction: (leg: SplitLegViewModel) => void
}

function getPhaseBadge(leg: SplitLegViewModel) {
  switch (leg.uiPhase) {
    case 'done':
      return { tone: 'neutral' as const, label: '완료' }
    case 'disputed':
      return { tone: 'critical' as const, label: '분쟁' }
    case 'payment_confirm':
      return { tone: 'warning' as const, label: '입금 확인' }
    case 'payment_pending':
      return { tone: 'brand' as const, label: '입금 대기' }
    case 'matching':
    default:
      return { tone: 'warning' as const, label: '매칭 중' }
  }
}

export function SplitLegCard({ leg, totalLegs, onPrimaryAction }: SplitLegCardProps) {
  const badge = getPhaseBadge(leg)
  const actionLabel = getSplitLegActionLabel(leg.primaryAction)
  const isDone = leg.uiPhase === 'done'
  const isDisputed = leg.uiPhase === 'disputed'
  const showPrimaryAction = leg.primaryAction !== 'NONE'

  return (
    <VStack
      width="full"
      p="x4"
      gap="x3"
      bg="bg.layerDefault"
      borderWidth="1"
      borderColor="stroke.neutralWeak"
      borderRadius="r4"
      className="split-leg-card"
    >
      <HStack align="flex-start" justify="space-between" width="full" gap="x3">
        <VStack gap="x1" align="flex-start" flexGrow={1}>
          <HStack align="center" gap="x2">
            <Badge tone={badge.tone} variant="weak" size="medium">
              {badge.label}
            </Badge>
            <Text textStyle="t4Regular" color="fg.neutralMuted">
              {leg.index}/{totalLegs}건
            </Text>
          </HStack>
          <Text textStyle="t6Bold" color="fg.neutral" className="tabular-nums">
            {formatAmount(leg.amountKrw)}
          </Text>
          <Text textStyle="t4Regular" color="fg.neutralSubtle">
            {leg.statusLine}
          </Text>
          {leg.counterpartyNickname && (
            <Text textStyle="t4Regular" color="fg.neutralMuted">
              {leg.counterpartyNickname}
            </Text>
          )}
        </VStack>
        <Box
          width="8px"
          height="8px"
          flexShrink={0}
          borderRadius="full"
          style={{
            marginTop: 'var(--seed-dimension-x1)',
            opacity: isDone ? 1 : leg.uiPhase === 'matching' ? 0.7 : 1,
          }}
          bg={isDone ? 'bg.brandSolid' : 'bg.neutralWeak'}
        />
      </HStack>

      {!isDone && !isDisputed && showPrimaryAction && (
        <ActionButton
          size="medium"
          variant={leg.primaryAction === 'CONFIRM_PAYMENT' ? 'brandSolid' : 'neutralOutline'}
          onClick={() => onPrimaryAction(leg)}
        >
          {actionLabel}
        </ActionButton>
      )}
      {(isDone || isDisputed) && showPrimaryAction && (
        <ActionButton
          size="medium"
          variant="neutralWeak"
          onClick={() => onPrimaryAction(leg)}
        >
          {actionLabel}
        </ActionButton>
      )}
    </VStack>
  )
}
