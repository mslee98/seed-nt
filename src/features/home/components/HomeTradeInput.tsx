import { Box, HStack, Text, VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'
import { Chip } from 'seed-design/ui/chip'
import { PageBanner, PageBannerButton } from 'seed-design/ui/page-banner'
import {
  SegmentedControl,
  SegmentedControlItem,
} from 'seed-design/ui/segmented-control'
import { TextField, TextFieldInput } from 'seed-design/ui/text-field'

import { QUICK_AMOUNTS } from '../constants'
import { formatAmount, formatAmountNumber } from '../utils/formatAmount'
import { getSplitRecommendation } from '../utils/splitRecommendation'
import type { TradeSide } from '../types'

interface HomeTradeInputProps {
  side: TradeSide
  amountKrw: number | null
  amountInput: string
  amountError: string | null
  helperText?: string
  isSubmitDisabled: boolean
  onSideChange: (side: TradeSide) => void
  onAmountInputChange: (value: string) => void
  onQuickAmountSelect: (amount: number) => void
  onSubmit: () => void
}

function formatQuickAmountLabel(amount: number): string {
  if (amount >= 10_000) {
    return `${amount / 10_000}만원`
  }
  return `${amount.toLocaleString('ko-KR')}원`
}

export function HomeTradeInput({
  side,
  amountKrw,
  amountInput,
  amountError,
  helperText,
  isSubmitDisabled,
  onSideChange,
  onAmountInputChange,
  onQuickAmountSelect,
  onSubmit,
}: HomeTradeInputProps) {
  const ctaLabel = !amountKrw
    ? '금액을 입력해 주세요'
    : side === 'BUY'
      ? `${formatAmount(amountKrw)} 구매하기`
      : `${formatAmount(amountKrw)} 판매 등록하기`

  const splitRecommendation =
    side === 'SELL' && amountKrw ? getSplitRecommendation(amountKrw) : null

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
            <Text textStyle="t5Bold" color="fg.neutral">
              거래할 금액
            </Text>
          </HStack>

          <SegmentedControl
            value={side}
            onValueChange={(value) => onSideChange(value as TradeSide)}
            aria-label="거래 유형"
          >
            <SegmentedControlItem value="BUY">구매</SegmentedControlItem>
            <SegmentedControlItem value="SELL">판매</SegmentedControlItem>
          </SegmentedControl>

          <TextField
            label="금액"
            labelVisuallyHidden
            suffix="원"
            description={helperText}
            errorMessage={amountError ?? undefined}
            invalid={!!amountError}
            value={amountInput}
            onValueChange={({ value }) => onAmountInputChange(value)}
            className="tabular-nums"
          >
            <TextFieldInput
              placeholder="금액 입력"
              inputMode="numeric"
              pattern="[0-9]*"
              className="tabular-nums"
            />
          </TextField>

          <HStack gap="x2" flexWrap="wrap">
            {QUICK_AMOUNTS.map((amount) => {
              const isSelected = amountKrw === amount
              return (
                <Chip.Toggle
                  key={amount}
                  size="medium"
                  variant={isSelected ? 'outlineStrong' : 'outlineWeak'}
                  checked={isSelected}
                  onCheckedChange={(checked) => {
                    if (checked) onQuickAmountSelect(amount)
                  }}
                >
                  <Chip.Label className="tabular-nums">{formatQuickAmountLabel(amount)}</Chip.Label>
                </Chip.Toggle>
              )
            })}
          </HStack>

          {splitRecommendation && amountKrw && (
            <PageBanner
              tone="warning"
              variant="weak"
              title="큰 금액은 나눠서 더 빨리 판매할 수 있어요"
              description={`예상 분할: ${formatAmountNumber(splitRecommendation.unitAmount)}원 × ${splitRecommendation.count}건`}
              suffix={
                <PageBannerButton
                  onClick={() => window.alert('분할 방식 설정은 준비 중이에요.')}
                >
                  분할 방식 바꾸기
                </PageBannerButton>
              }
            />
          )}

          <VStack pt="x1">
            <ActionButton
              size="large"
              variant="brandSolid"
              disabled={isSubmitDisabled}
              onClick={onSubmit}
              className="tabular-nums"
            >
              {ctaLabel}
            </ActionButton>
          </VStack>
        </VStack>
      </VStack>
  )
}
