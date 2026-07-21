import type { ComponentProps, CSSProperties } from 'react'
import type { Text } from '@seed-design/react'

type TextStyle = NonNullable<ComponentProps<typeof Text>['textStyle']>

/**
 * Toss 밀도 → SEED `textStyle` 역할 카탈로그 (중복 키 없음).
 * JSX에서는 값을 직접 쓰세요: `textStyle="t7Bold"`.
 * 홈 preset 등에서 참조할 때 import 합니다.
 *
 * @see docs/conventions/typography.md
 */
export const SEED_TYPO_ROLES = {
  /** 탑 네비 ≈ 15 SemiBold → t5Medium */
  navTitle: 't5Medium',
  /** 화면 H1·섹션 헤더 ≈ 20 Bold */
  pageTitle: 't7Bold',
  /** 가입·온보딩 히어로만 (26 Bold) */
  pageTitleHero: 'screenTitle',
  /** H1·섹션 보조·캡션 ≈ 13 Regular */
  pageDesc: 't3Regular',
  /** 리스트 행·카드 타이틀 */
  rowTitle: 't5Bold',
  body: 't4Regular',
  amountInline: 't6Bold',
} as const satisfies Record<string, TextStyle>

export type SeedTypoRole = keyof typeof SEED_TYPO_ROLES

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

/** 홈 월렛 사용 가능 잔액 — ~44px / lh 1.15 / 750 (SEED t 스케일 밖) */
export const BALANCE_ANIMATE_NUMBER_TYPOGRAPHY: AnimateNumberTypography = {
  fontSize: '2.75rem',
  fontWeight: 750,
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
