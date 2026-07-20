import type { ComponentProps } from 'react'
import type { Text } from '@seed-design/react'

type TextStyle = NonNullable<ComponentProps<typeof Text>['textStyle']>

/**
 * 홈 월렛 compact 타이포 (SEED textStyle).
 * 잔액 숫자(~40px)는 `AnimatedAmount variant="balance"` + `.balance-amount`.
 */
export const HOME_TYPOGRAPHY = {
  heroAvailableLabel: 't5Medium',
  heroUnit: 't6Bold',
  heroEmptyTitle: 't5Bold',
  heroEmptyDesc: 't4Regular',
  metaLabel: 't4Medium',
  metaValue: 't6Bold',
  quickLabel: 't4Medium',
  sectionTitle: 't7Bold',
  taskTitle: 't5Bold',
  taskStatus: 't4Medium',
  taskDesc: 't4Regular',
} as const satisfies Record<string, TextStyle>
