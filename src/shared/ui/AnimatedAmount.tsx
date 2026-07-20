import { HStack, Text } from '@seed-design/react'
import type { ComponentProps, CSSProperties, ReactNode } from 'react'
import AnimateNumber from 'seed-design/breeze/animate-number/animate-number'

import {
  type AmountTypographyVariant,
  resolveAnimateNumberTypography,
} from '../constants/typography'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

type TextStyle = ComponentProps<typeof Text>['textStyle']
type TextColor = ComponentProps<typeof Text>['color']

type AmountFormat = 'decimal' | 'currency'

const FG_COLOR_VAR: Partial<Record<string, string>> = {
  'fg.neutral': 'var(--seed-color-fg-neutral)',
  'fg.neutralMuted': 'var(--seed-color-fg-neutral-muted)',
  'fg.neutralSubtle': 'var(--seed-color-fg-neutral-subtle)',
  'fg.neutralInverted': 'var(--seed-color-fg-neutral-inverted)',
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
  /** inline: SEED textStyle, hero: 입력 대형 금액, balance: 홈 월렛 잔액 */
  variant?: AmountTypographyVariant
  /** inline variant에서 AnimateNumber·fallback 공통 타이포 소스 */
  numberTextStyle?: TextStyle
  suffixTextStyle?: TextStyle
  textColor?: TextColor
  /** preset override — 일반적으로 지정하지 않음 */
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

function joinClassNames(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ')
}

/**
 * 금액 표시 + breeze `AnimateNumber` 래퍼.
 *
 * `variant="inline"`은 `numberTextStyle`, `hero`는 `.amount-hero`, `balance`는 `.balance-amount`.
 * `replayKey`가 바뀌면 `startValue`에서 `value`로 재생합니다.
 *
 * @example
 * ```tsx
 * <AnimatedAmount value={amountKrw} variant="hero" suffix="원" replayKey={replayKey} />
 * <AnimatedAmount value={available} variant="balance" replayKey={replayKey} />
 * <AnimatedAmount value={balance} numberTextStyle="t5Bold" replayKey={replayKey} />
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
  variant = 'inline',
  numberTextStyle = 't5Bold',
  suffixTextStyle = numberTextStyle,
  textColor = 'fg.neutral',
  fontSize,
  fontWeight,
  className,
  animated = true,
}: AnimatedAmountProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const supportsIntegerAnimation = Number.isInteger(value) && Number.isInteger(startValue)
  const usesCssPreset = variant === 'hero' || variant === 'balance'
  const animatedColor =
    FG_COLOR_VAR[String(textColor)] ?? 'var(--seed-color-fg-neutral)'
  const resolvedTypography = resolveAnimateNumberTypography(variant, numberTextStyle)
  const resolvedFontSize = fontSize ?? resolvedTypography.fontSize
  const resolvedFontWeight = fontWeight ?? resolvedTypography.fontWeight
  const numberClassName = joinClassNames(
    variant === 'hero' ? 'amount-hero' : variant === 'balance' ? 'balance-amount' : 'tabular-nums',
    className,
  )
  const suffixClassName = variant === 'hero' ? 'amount-hero-suffix' : undefined

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
    if (suffix) {
      return (
        <HStack align="center" gap="x1" className={className}>
          {usesCssPreset ? (
            <span className={numberClassName} style={{ color: animatedColor }}>
              {fallbackText}
            </span>
          ) : (
            <Text textStyle={numberTextStyle} color={textColor} className={numberClassName}>
              {fallbackText}
            </Text>
          )}
          {usesCssPreset && suffixClassName ? (
            <span className={suffixClassName} style={{ color: animatedColor }}>
              {suffix}
            </span>
          ) : usesCssPreset ? (
            <span style={{ color: animatedColor }}>{suffix}</span>
          ) : (
            <Text textStyle={suffixTextStyle} color={textColor}>
              {suffix}
            </Text>
          )}
        </HStack>
      )
    }

    if (usesCssPreset) {
      return (
        <span className={numberClassName} style={{ color: animatedColor }}>
          {fallbackText}
        </span>
      )
    }

    return (
      <Text textStyle={numberTextStyle} color={textColor} className={numberClassName}>
        {fallbackText}
      </Text>
    )
  }

  return (
    <HStack align="center" gap="x1">
      <AnimateNumber
        value={value}
        startValue={startValue}
        replayKey={replayKey}
        fontSize={resolvedFontSize}
        fontWeight={resolvedFontWeight}
        color={animatedColor}
        showComma={useGrouping && Math.abs(value) >= 1_000}
        className={numberClassName}
      />
      {suffix &&
        (usesCssPreset && suffixClassName ? (
          <span className={suffixClassName} style={{ color: animatedColor }}>
            {suffix}
          </span>
        ) : usesCssPreset ? (
          <span style={{ color: animatedColor }}>{suffix}</span>
        ) : (
          <Text textStyle={suffixTextStyle} color={textColor}>
            {suffix}
          </Text>
        ))}
    </HStack>
  )
}
