import { Box, HStack, Text, VStack } from '@seed-design/react'
import { Chip } from 'seed-design/ui/chip'
import { List, ListSwitchItem } from 'seed-design/ui/list'
import { SegmentedControl } from 'seed-design/ui/segmented-control'

import { AmountHeroField } from '../../../shared/ui/AmountHeroField'
import { BottomActionButton } from '../../../shared/ui/BottomActionButton'
import { MotionChipButton, TapSegmentedControlItem } from '../../../shared/motion'
import { QUICK_AMOUNTS } from '../constants'
import { formatAmount, formatAmountNumber } from '../utils/formatAmount'
import type { SplitRecommendation } from '../utils/splitRecommendation'
import type { TradeSide } from '../types'

interface HomeTradeInputProps {
  side: TradeSide
  amountKrw: number | null
  amountInput: string
  amountStartKrw: number
  amountReplayKey: number
  amountError: string | null
  helperText?: string
  isSubmitDisabled: boolean
  showSplitSellToggle: boolean
  splitSellEnabled: boolean
  splitRecommendation: SplitRecommendation | null
  onSideChange: (side: TradeSide) => void
  onAmountInputChange: (value: string) => void
  onAmountBlur: () => void
  onQuickAmountSelect: (amount: number) => void
  onSplitSellEnabledChange: (enabled: boolean) => void
  onSubmit: () => void
}

function formatQuickAmountLabel(amount: number): string {
  if (amount >= 10_000 && amount % 10_000 === 0) {
    return `${amount / 10_000}만원`
  }
  return `${formatAmountNumber(amount)}원`
}

export function HomeTradeInput({
  side,
  amountKrw,
  amountInput,
  amountStartKrw,
  amountReplayKey,
  amountError,
  helperText,
  isSubmitDisabled,
  showSplitSellToggle,
  splitSellEnabled,
  splitRecommendation,
  onSideChange,
  onAmountInputChange,
  onAmountBlur,
  onQuickAmountSelect,
  onSplitSellEnabledChange,
  onSubmit,
}: HomeTradeInputProps) {
  const ctaLabel = !amountKrw
    ? '금액을 입력해 주세요'
    : side === 'BUY'
      ? `${formatAmount(amountKrw)} 구매하기`
      : `${formatAmount(amountKrw)} 판매 등록하기`

  const splitDetail =
    splitRecommendation &&
    `${formatAmountNumber(splitRecommendation.unitAmount)}원씩 ${splitRecommendation.count}건으로 거래해요`

  return (
    <VStack
      bg="bg.layerDefault"
      borderWidth="1"
      borderColor="stroke.neutralWeak"
      borderRadius="r5"
      boxShadow="s2"
    >
      <VStack p="x5" gap="spacingY.componentDefault">
        <HStack align="center" gap="x2">
          <Box
            width="7px"
            height="7px"
            flexShrink={0}
            borderRadius="full"
            bg="bg.brandSolid"
          />
          <Text textStyle="t4Bold" color="fg.neutral">
            거래할 금액
          </Text>
        </HStack>

        <SegmentedControl
          value={side}
          onValueChange={(value) => onSideChange(value as TradeSide)}
          aria-label="거래 유형"
        >
          <TapSegmentedControlItem value="BUY">구매</TapSegmentedControlItem>
          <TapSegmentedControlItem value="SELL">판매</TapSegmentedControlItem>
        </SegmentedControl>

        <AmountHeroField
          value={amountInput}
          onValueChange={onAmountInputChange}
          amountKrw={amountKrw}
          startValue={amountStartKrw}
          replayKey={amountReplayKey}
          description={helperText}
          errorMessage={amountError ?? undefined}
          invalid={!!amountError}
          onBlur={onAmountBlur}
        />

        <HStack gap="x2" flexWrap="wrap">
          {QUICK_AMOUNTS.map((amount) => (
            <MotionChipButton
              key={amount}
              size="medium"
              variant="outlineWeak"
              onClick={() => onQuickAmountSelect(amount)}
            >
              <Chip.Label className="tabular-nums">{formatQuickAmountLabel(amount)}</Chip.Label>
            </MotionChipButton>
          ))}
        </HStack>

        {showSplitSellToggle && splitDetail && (
          <VStack
            width="full"
            bg="bg.layerDefault"
            borderWidth="1"
            borderColor="stroke.neutralWeak"
            borderRadius="r4"
          >
            <List width="full" itemBorderRadius="r2" aria-label="분할 판매 설정">
              <ListSwitchItem
                title="나눠서 판매하기"
                detail={splitDetail}
                checked={splitSellEnabled}
                onCheckedChange={onSplitSellEnabledChange}
              />
            </List>
          </VStack>
        )}

        <VStack pt="x1">
          <BottomActionButton
            size="large"
            variant="brandSolid"
            disabled={isSubmitDisabled}
            onClick={onSubmit}
            className="tabular-nums"
          >
            {ctaLabel}
          </BottomActionButton>
        </VStack>
      </VStack>
    </VStack>
  )
}
