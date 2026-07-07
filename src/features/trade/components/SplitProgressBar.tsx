import { Box, HStack, Text, VStack } from '@seed-design/react'

import type { MatchingPhase } from '../matching/types'
import type { SplitGroup, TradeRecord } from '../types'
import { getSplitProgressLabel } from '../utils/splitProgressCopy'

interface SplitProgressBarProps {
  splitGroup: SplitGroup
  activeTrade: TradeRecord
  matchingPhase?: MatchingPhase | null
}

function getSegmentTone(
  index: number,
  completedLegs: number,
  currentLegIndex: number,
): 'completed' | 'active' | 'pending' {
  const legNumber = index + 1
  if (legNumber <= completedLegs) return 'completed'
  if (legNumber === currentLegIndex) return 'active'
  return 'pending'
}

export function SplitProgressBar({
  splitGroup,
  activeTrade,
  matchingPhase,
}: SplitProgressBarProps) {
  if (splitGroup.totalLegs <= 1) return null

  const currentLegIndex = activeTrade.splitLegIndex ?? 1
  const label = getSplitProgressLabel({
    splitGroup,
    legIndex: currentLegIndex,
    side: activeTrade.side,
    tradeStatus: activeTrade.status,
    matchingPhase,
  })

  return (
    <VStack gap="x2" width="full" className="split-progress-bar">
      <HStack gap="x1" width="full" className="split-progress-bar__segments">
        {Array.from({ length: splitGroup.totalLegs }, (_, index) => {
          const tone = getSegmentTone(index, splitGroup.completedLegs, currentLegIndex)
          return (
            <Box
              key={index}
              flexGrow={1}
              height="4px"
              borderRadius="full"
              bg={
                tone === 'completed' || tone === 'active'
                  ? 'bg.brandSolid'
                  : 'bg.neutralWeak'
              }
              style={{ opacity: tone === 'pending' ? 0.6 : 1 }}
            />
          )
        })}
      </HStack>
      <Text textStyle="t4Regular" color="fg.neutralSubtle" className="tabular-nums">
        {label}
      </Text>
    </VStack>
  )
}
