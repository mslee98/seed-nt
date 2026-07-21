import { HStack, Text, VStack } from '@seed-design/react'

import { MATCHING_TYPOGRAPHY } from '../constants/matchingTypography'

interface MatchingStatsStripProps {
  elapsedLabel: string
  exactCount: number
  nearCount: number
}

export function MatchingStatsStrip({
  elapsedLabel,
  exactCount,
  nearCount,
}: MatchingStatsStripProps) {
  return (
    <HStack
      width="full"
      gap="x2"
      p="x3"
      bg="bg.neutralWeak"
      borderRadius="r3"
      justify="space-between"
    >
      <StatCell label="탐색 시간" value={elapsedLabel} />
      <StatCell label="정확" value={`${exactCount}건`} />
      <StatCell label="근사" value={`${nearCount}건`} />
    </HStack>
  )
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <VStack gap="x0_5" align="center" flexGrow minWidth="0">
      <Text textStyle={MATCHING_TYPOGRAPHY.helper} color="fg.neutralMuted">
        {label}
      </Text>
      <Text
        textStyle={MATCHING_TYPOGRAPHY.statValue}
        color="fg.neutral"
        className="tabular-nums"
      >
        {value}
      </Text>
    </VStack>
  )
}
