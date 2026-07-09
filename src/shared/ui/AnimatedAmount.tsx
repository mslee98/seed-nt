import { HStack, Text } from '@seed-design/react'
import type { ComponentProps, CSSProperties, ReactNode } from 'react'
import AnimateNumber from 'seed-design/breeze/animate-number/animate-number'

import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

type TextStyle = ComponentProps<typeof Text>['textStyle']
type TextColor = ComponentProps<typeof Text>['color']

type AmountFormat = 'decimal' | 'currency'

const FG_COLOR_VAR: Partial<Record<string, string>> = {
  'fg.neutral': 'var(--seed-color-fg-neutral)',
  'fg.neutralMuted': 'var(--seed-color-fg-neutral-muted)',
  'fg.neutralSubtle': 'var(--seed-color-fg-neutral-subtle)',
}

interface AnimatedAmountProps {
  value: number
  startValue?: number
  replayKey?: string | number
  suffix?: ReactNode
  format?: AmountFormat
  currency?: 'KRW' | 'USD'
  locale?: string
  useGrouping?: boolean
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  numberTextStyle?: TextStyle
  suffixTextStyle?: TextStyle
  textColor?: TextColor
  fontSize?: number | string
  fontWeight?: CSSProperties['fontWeight']
  className?: string
  animated?: boolean
}

function formatStaticAmount({
  value,
  format,
  currency,
  locale,
  useGrouping,
  minimumFractionDigits,
  maximumFractionDigits,
}: {
  value: number
  format: AmountFormat
  currency: 'KRW' | 'USD'
  locale: string
  useGrouping: boolean
  minimumFractionDigits?: number
  maximumFractionDigits?: number
}) {
  return new Intl.NumberFormat(locale, {
    style: format,
    currency: format === 'currency' ? currency : undefined,
    useGrouping,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value)
}

/**
 * 금액 표시 + breeze `AnimateNumber` 래퍼.
 *
 * 포맷·suffix·`prefers-reduced-motion` fallback을 통합합니다.
 * `replayKey`가 바뀌면 `startValue`에서 `value`로 재생합니다.
 *
 * @example
 * ```tsx
 * const { replayKey, triggerReplay } = useAmountReplay()
 * <AnimatedAmount value={balance} suffix="원" startValue={0} replayKey={replayKey} />
 * ```
 */
export function AnimatedAmount({
  value,
  startValue = value,
  replayKey,
  suffix,
  format = 'decimal',
  currency = 'KRW',
  locale = 'ko-KR',
  useGrouping = true,
  minimumFractionDigits,
  maximumFractionDigits,
  numberTextStyle = 't5Bold',
  suffixTextStyle = numberTextStyle,
  textColor = 'fg.neutral',
  fontSize = 20,
  fontWeight = 700,
  className,
  animated = true,
}: AnimatedAmountProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const supportsIntegerAnimation = Number.isInteger(value) && Number.isInteger(startValue)
  const animatedColor =
    FG_COLOR_VAR[String(textColor)] ?? 'var(--seed-color-fg-neutral)'

  const fallbackText = formatStaticAmount({
    value,
    format,
    currency,
    locale,
    useGrouping,
    minimumFractionDigits,
    maximumFractionDigits,
  })

  if (prefersReducedMotion || !animated || !supportsIntegerAnimation) {
    return (
      <Text textStyle={numberTextStyle} color={textColor} className={className}>
        {fallbackText}
        {suffix}
      </Text>
    )
  }

  return (
    <HStack align="center" gap="x1">
      <AnimateNumber
        value={value}
        startValue={startValue}
        replayKey={replayKey}
        fontSize={fontSize}
        fontWeight={fontWeight}
        color={animatedColor}
        showComma={useGrouping && Math.abs(value) >= 1_000}
        className={className}
      />
      {suffix && (
        <Text textStyle={suffixTextStyle} color={textColor}>
          {suffix}
        </Text>
      )}
    </HStack>
  )
}

