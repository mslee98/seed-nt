import { IconChevronRightLine } from '@karrotmarket/react-monochrome-icon'
import { HStack, Icon, Text } from '@seed-design/react'

import { formatCoinUnit } from '../../../shared/utils/formatAmount'
import { MATCHING_TYPOGRAPHY } from '../constants/matchingTypography'
import type { TradeRecord } from '../types'

interface MatchingCompactConditionProps {
  trade: Pick<TradeRecord, 'side' | 'coinAmount'>
  onChangeConditions?: () => void
}

export function MatchingCompactCondition({
  trade,
  onChangeConditions,
}: MatchingCompactConditionProps) {
  const sideLabel = trade.side === 'BUY' ? '구매' : '판매'
  const summary = `${sideLabel} ${formatCoinUnit(trade.coinAmount)} · 수수료 없음`

  if (!onChangeConditions) {
    return (
      <HStack
        width="full"
        px="x3"
        py="x3"
        bg="bg.neutralWeak"
        borderRadius="r3"
        align="center"
      >
        <Text textStyle={MATCHING_TYPOGRAPHY.body} color="fg.neutral" className="tabular-nums">
          {summary}
        </Text>
      </HStack>
    )
  }

  return (
    <button
      type="button"
      onClick={onChangeConditions}
      className="matching-compact-condition"
      style={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        padding: '12px',
        border: 'none',
        borderRadius: 'var(--seed-radius-r3)',
        background: 'var(--seed-color-bg-neutral-weak)',
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      <Text textStyle={MATCHING_TYPOGRAPHY.body} color="fg.neutral" className="tabular-nums">
        {summary}
      </Text>
      <HStack gap="x0_5" align="center" flexShrink={0}>
        <Text textStyle="t4Medium" color="fg.brand">
          조건 변경
        </Text>
        <Icon svg={<IconChevronRightLine />} size="x4" color="fg.brand" />
      </HStack>
    </button>
  )
}
