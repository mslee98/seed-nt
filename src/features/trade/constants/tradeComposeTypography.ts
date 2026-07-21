import type { ComponentProps } from 'react'
import type { Text } from '@seed-design/react'

import { SEED_TYPO_ROLES } from '../../../shared/constants/typography'

type TextStyle = NonNullable<ComponentProps<typeof Text>['textStyle']>

/**
 * TradeCompose 타이포 — 홈(`HOME_TYPOGRAPHY`)과 동일 역할 토큰.
 * 금액 숫자는 `AmountHeroField variant="hero"` + `.amount-hero`.
 */
export const TRADE_COMPOSE_TYPOGRAPHY = {
  /** 화면 H1 — 홈 sectionTitle과 동일 */
  heading: SEED_TYPO_ROLES.pageTitle,
  /** 금액 아래 helper — 홈 pageDesc / taskDesc */
  helper: SEED_TYPO_ROLES.pageDesc,
  /** 차단·진행 중 안내 */
  notice: SEED_TYPO_ROLES.body,
} as const satisfies Record<string, TextStyle>
