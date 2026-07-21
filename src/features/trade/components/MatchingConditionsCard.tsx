import { Text, VStack } from '@seed-design/react'

import { formatAmount, formatCoinUnit } from '../../../shared/utils/formatAmount'
import { MATCHING_TYPOGRAPHY } from '../constants/matchingTypography'
import type { TradeRecord } from '../types'

interface MatchingConditionsCardProps {
  trade: Pick<TradeRecord, 'coinAmount' | 'amountKrw'>
}

export function MatchingConditionsCard({ trade }: MatchingConditionsCardProps) {
  return (
    <VStack
      width="full"
      gap="x3"
      p="x4"
      bg="bg.layerDefault"
      borderWidth="1"
      borderColor="stroke.neutralWeak"
      borderRadius="r4"
      align="flex-start"
    >
      <Text textStyle={MATCHING_TYPOGRAPHY.rowTitle} color="fg.neutral">
        현재 찾는 조건
      </Text>
      <ConditionRow label="받을 코인" value={formatCoinUnit(trade.coinAmount)} />
      <ConditionRow label="지불 금액" value={formatAmount(trade.amountKrw)} />
      <ConditionRow label="수수료" value="없어요" />
    </VStack>
  )
}

function ConditionRow({ label, value }: { label: string; value: string }) {
  return (
    <VStack gap="x0_5" align="flex-start" width="full">
      <Text textStyle={MATCHING_TYPOGRAPHY.helper} color="fg.neutralMuted">
        {label}
      </Text>
      <Text
        textStyle={MATCHING_TYPOGRAPHY.amount}
        color="fg.neutral"
        className="tabular-nums"
      >
        {value}
      </Text>
    </VStack>
  )
}
