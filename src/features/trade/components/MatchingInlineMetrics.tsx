import { Text } from '@seed-design/react'

import { MATCHING_TYPOGRAPHY } from '../constants/matchingTypography'

interface MatchingInlineMetricsProps {
  exactCount: number
  nearCount: number
  elapsedLabel: string
}

export function MatchingInlineMetrics({
  exactCount,
  nearCount,
  elapsedLabel,
}: MatchingInlineMetricsProps) {
  return (
    <Text
      textStyle={MATCHING_TYPOGRAPHY.helper}
      color="fg.neutralMuted"
      className="tabular-nums"
      style={{ textAlign: 'center', width: '100%' }}
    >
      {`정확 ${exactCount}건 · 근사 ${nearCount}건 · ${elapsedLabel}`}
    </Text>
  )
}
