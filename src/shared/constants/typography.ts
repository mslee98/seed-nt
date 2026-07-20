import type { ComponentProps, CSSProperties } from 'react'
import type { Text } from '@seed-design/react'

type TextStyle = NonNullable<ComponentProps<typeof Text>['textStyle']>

export type AmountTypographyVariant = 'inline' | 'hero' | 'balance'

export interface AnimateNumberTypography {
  fontSize: string
  fontWeight: CSSProperties['fontWeight']
}

const INLINE_ANIMATE_NUMBER_TYPOGRAPHY: Partial<Record<TextStyle, AnimateNumberTypography>> = {
  t5Bold: { fontSize: '1.0625rem', fontWeight: 700 },
  t6Bold: { fontSize: '1.25rem', fontWeight: 700 },
}

const DEFAULT_INLINE_ANIMATE_NUMBER_TYPOGRAPHY = INLINE_ANIMATE_NUMBER_TYPOGRAPHY.t5Bold!

export const HERO_ANIMATE_NUMBER_TYPOGRAPHY: AnimateNumberTypography = {
  fontSize: '2rem',
  fontWeight: 750,
}

/** 홈 월렛 사용 가능 잔액 — ~40px / lh 1.2 Bold (SEED t 스케일 밖) */
export const BALANCE_ANIMATE_NUMBER_TYPOGRAPHY: AnimateNumberTypography = {
  fontSize: '2.5rem',
  fontWeight: 700,
}

/**
 * breeze `AnimateNumber`는 CSS var()를 파싱하지 못해 rem 리터럴로 맞춥니다.
 * hero/balance variant는 tracking/line-height를 CSS utility가 담당합니다.
 */
export function resolveAnimateNumberTypography(
  variant: AmountTypographyVariant,
  textStyle: TextStyle | undefined,
): AnimateNumberTypography {
  if (variant === 'hero') {
    return HERO_ANIMATE_NUMBER_TYPOGRAPHY
  }

  if (variant === 'balance') {
    return BALANCE_ANIMATE_NUMBER_TYPOGRAPHY
  }

  if (!textStyle) return DEFAULT_INLINE_ANIMATE_NUMBER_TYPOGRAPHY
  return INLINE_ANIMATE_NUMBER_TYPOGRAPHY[textStyle] ?? DEFAULT_INLINE_ANIMATE_NUMBER_TYPOGRAPHY
}
