import { IconQuestionmarkCircleFill } from '@karrotmarket/react-monochrome-icon'
import { HStack, Text, VStack } from '@seed-design/react'
import { Callout } from 'seed-design/ui/callout'
import { Chip } from 'seed-design/ui/chip'
import {
  RadioSelectBoxItem,
  RadioSelectBoxRadiomark,
  RadioSelectBoxRoot,
} from 'seed-design/ui/select-box'
import { SegmentedControl } from 'seed-design/ui/segmented-control'

import { AmountHeroField } from '../../../shared/ui/AmountHeroField'
import { MotionChipButton, TapSegmentedControlItem } from '../../../shared/motion'
import { formatAmountNumber } from '../../../shared/utils/formatAmount'
import { QUICK_AMOUNTS, TRADE_COMPOSE_MATCHING_TIP } from '../constants/tradeCompose'
import { TRADE_COMPOSE_TYPOGRAPHY } from '../constants/tradeComposeTypography'
import type { SellMethod } from '../hooks/useTradeInputState'
import type { TradeSide } from '../types'

interface TradeComposeInputProps {
  side: TradeSide
  amountKrw: number | null
  amountInput: string
  amountStartKrw: number
  amountReplayKey: number
  amountError: string | null
  helperText?: string
  sellMethod: SellMethod
  minUnitInput: string
  minUnitError: string | null
  onSideChange: (side: TradeSide) => void
  onAmountInputChange: (value: string) => void
  onQuickAmountSelect: (amount: number) => void
  onSellMethodChange: (value: string) => void
  onMinUnitInputChange: (value: string) => void
}

function formatQuickAmountLabel(amount: number): string {
  if (amount >= 10_000 && amount % 10_000 === 0) {
    return `${amount / 10_000}만원`
  }
  return `${formatAmountNumber(amount)}원`
}

const t = TRADE_COMPOSE_TYPOGRAPHY

/** TradeCompose — 금액·판매 방식·최소 단위 (CTA는 Activity fixedBottom) */
export function TradeComposeInput({
  side,
  amountKrw,
  amountInput,
  amountStartKrw,
  amountReplayKey,
  amountError,
  helperText,
  sellMethod,
  minUnitInput,
  minUnitError,
  onSideChange,
  onAmountInputChange,
  onQuickAmountSelect,
  onSellMethodChange,
  onMinUnitInputChange,
}: TradeComposeInputProps) {
  const heading = side === 'BUY' ? '얼마를 구매할까요?' : '얼마를 판매할까요?'
  const showSplitMethod = side === 'SELL'
  const showMinUnit = showSplitMethod && sellMethod === 'split'

  return (
    <VStack gap="x5" width="full">
      <SegmentedControl
        value={side}
        onValueChange={(value) => onSideChange(value as TradeSide)}
        aria-label="거래 유형"
        className="trade-compose-segmented"
        style={{ width: '100%' }}
      >
        <TapSegmentedControlItem value="BUY">구매</TapSegmentedControlItem>
        <TapSegmentedControlItem value="SELL">판매</TapSegmentedControlItem>
      </SegmentedControl>

      <VStack gap="spacingY.betweenText" width="full">
        <VStack gap="x1" width="full">
          <Text textStyle={t.heading} color="fg.neutral" className="typo-title-tight">
            {heading}
          </Text>
          {helperText && !amountError && side === 'SELL' && (
            <Text textStyle={t.helper} color="fg.neutralMuted">
              {helperText}
            </Text>
          )}
        </VStack>

        <VStack gap="x2" width="full">
          <AmountHeroField
            variant="hero"
            value={amountInput}
            onValueChange={onAmountInputChange}
            amountKrw={amountKrw}
            startValue={amountStartKrw}
            replayKey={amountReplayKey}
            placeholder="금액을 입력하세요"
            errorMessage={amountError ?? undefined}
            invalid={!!amountError}
          />

          {helperText && !amountError && side === 'BUY' && (
            <Text textStyle={t.helper} color="fg.neutralMuted">
              {helperText}
            </Text>
          )}
        </VStack>

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
      </VStack>

      {side === 'BUY' && (
        <Callout
          tone="informative"
          prefixIcon={<IconQuestionmarkCircleFill />}
          description={TRADE_COMPOSE_MATCHING_TIP.BUY}
        />
      )}

      {showSplitMethod && (
        <VStack gap="spacingY.betweenText" width="full">
          <Text textStyle={t.heading} color="fg.neutral" className="typo-title-tight">
            어떻게 판매할까요?
          </Text>

          <RadioSelectBoxRoot
            value={sellMethod}
            onValueChange={onSellMethodChange}
            aria-label="판매 방식"
          >
            <RadioSelectBoxItem
              value="once"
              label="한번에 판매"
              description="한 명의 구매자와 전체 금액을 판매해요."
              suffix={<RadioSelectBoxRadiomark tone="brand" />}
            />
            <RadioSelectBoxItem
              value="split"
              label="나누어 판매"
              description="전체 매칭이 없으면 여러 거래로 나누어 제안해요."
              suffix={<RadioSelectBoxRadiomark tone="brand" />}
            />
          </RadioSelectBoxRoot>
        </VStack>
      )}

      {showMinUnit && (
        <VStack gap="spacingY.betweenText" width="full">
          <Text textStyle={t.heading} color="fg.neutral" className="typo-title-tight">
            한 거래당 최소 금액
          </Text>
          <AmountHeroField
            variant="field"
            value={minUnitInput}
            onValueChange={onMinUnitInputChange}
            amountKrw={null}
            placeholder="금액을 입력하세요"
            errorMessage={minUnitError ?? undefined}
            invalid={!!minUnitError}
          />
        </VStack>
      )}
    </VStack>
  )
}
