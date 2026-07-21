import type { ComponentProps } from 'react'
import type { Text } from '@seed-design/react'

import { SEED_TYPO_ROLES } from '../../../shared/constants/typography'

type TextStyle = NonNullable<ComponentProps<typeof Text>['textStyle']>

/**
 * 홈 월렛 compact 타이포 (SEED textStyle).
 * 잔액 숫자(~44px)는 `AnimatedAmount variant="balance"` + `.balance-amount`.
 */
export const HOME_TYPOGRAPHY = {
  heroAvailableLabel: 't3Regular',
  heroUnit: 't5Medium',
  heroEmptyTitle: 't6Bold',
  heroEmptyDesc: SEED_TYPO_ROLES.pageDesc,
  metaLabel: 't3Regular',
  metaValue: 't5Bold',
  quickLabel: 't4Medium',
  sectionTitle: SEED_TYPO_ROLES.pageTitle,
  taskTitle: SEED_TYPO_ROLES.rowTitle,
  taskStatus: 't4Medium',
  taskDesc: SEED_TYPO_ROLES.pageDesc,
} as const satisfies Record<string, TextStyle>
