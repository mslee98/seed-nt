import { Box, HStack, Text, VStack } from '@seed-design/react'

import { formatAmount } from '../../home/utils/formatAmount'
import type { SplitDashboardViewModel, SplitLegViewModel } from '../types/splitDashboard'
import { SplitLegCard } from './SplitLegCard'
import { WhileYouWaitSection } from './WhileYouWaitSection'

interface SplitTradeDashboardProps {
  dashboard: SplitDashboardViewModel
  onLegPrimaryAction: (leg: SplitLegViewModel) => void
  onStoreClick: () => void
  onCommunityClick: () => void
}

export function SplitTradeDashboard({
  dashboard,
  onLegPrimaryAction,
  onStoreClick,
  onCommunityClick,
}: SplitTradeDashboardProps) {
  const sideLabel = dashboard.side === 'BUY' ? '구매' : '판매'
  const hasMatchingLeg = dashboard.legs.some((leg) => leg.uiPhase === 'matching')

  return (
    <VStack
      flexGrow
      px="spacingX.globalGutter"
      pt="spacingY.navToTitle"
      pb="spacingY.screenBottom"
      gap="x6"
    >
      <VStack gap="x3" width="full">
        <VStack gap="x1">
          <Text textStyle="screenTitle" color="fg.neutral" className="tabular-nums">
            {formatAmount(dashboard.totalAmountKrw)} {sideLabel} 중
          </Text>
          <Text textStyle="t5Regular" color="fg.neutralMuted" className="tabular-nums">
            {formatAmount(dashboard.completedKrw)} / {formatAmount(dashboard.totalAmountKrw)}
          </Text>
        </VStack>

        <VStack gap="x2" width="full">
          <Box
            width="full"
            height="6px"
            borderRadius="full"
            bg="bg.neutralWeak"
            style={{ overflow: 'hidden' }}
          >
            <Box
              height="full"
              borderRadius="full"
              bg="bg.brandSolid"
              style={{ width: `${dashboard.progressPercent}%` }}
            />
          </Box>
          <HStack justify="space-between" width="full">
            <Text textStyle="t4Regular" color="fg.neutralSubtle">
              {dashboard.completedLegs}/{dashboard.totalLegs}건 완료
            </Text>
            <Text textStyle="t4Regular" color="fg.neutralSubtle" className="tabular-nums">
              {dashboard.progressPercent}%
            </Text>
          </HStack>
        </VStack>
      </VStack>

      <VStack gap="x3" width="full">
        {dashboard.legs.map((leg) => (
          <SplitLegCard
            key={leg.index}
            leg={leg}
            totalLegs={dashboard.totalLegs}
            onPrimaryAction={onLegPrimaryAction}
          />
        ))}
      </VStack>

      {hasMatchingLeg && (
        <WhileYouWaitSection onStoreClick={onStoreClick} onCommunityClick={onCommunityClick} />
      )}
    </VStack>
  )
}
