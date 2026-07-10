import { motion } from 'motion/react'
import type { ComponentProps } from 'react'

import { useTapScaleProps } from '../hooks/useTapScaleProps'

type PressableScaleProps = ComponentProps<typeof motion.button>

/**
 * 아이콘-only 등 커스텀 pressable용 탭 scale 버튼.
 * DS 컴포넌트는 `shared/motion`의 Motion* 래퍼를 사용합니다.
 */
export function PressableScale({
  children,
  whileTap,
  transition,
  type = 'button',
  ...props
}: PressableScaleProps) {
  const tapProps = useTapScaleProps('icon')

  return (
    <motion.button
      type={type}
      whileTap={whileTap ?? tapProps.whileTap}
      transition={transition ?? tapProps.transition}
      {...props}
    >
      {children}
    </motion.button>
  )
}
