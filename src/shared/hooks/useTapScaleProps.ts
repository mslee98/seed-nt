import type { TargetAndTransition, Transition } from 'motion/react'

import { TAP_SCALE, tapSpringTransition, type TapScaleVariant } from '../motion/tapScale'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

export interface TapScaleMotionProps {
  whileTap?: TargetAndTransition
  transition?: Transition
}

/**
 * DS `motion.create` 래퍼·커스텀 pressable에 공통으로 쓰는 whileTap/transition.
 * `prefers-reduced-motion`이면 빈 객체를 반환합니다.
 */
export function useTapScaleProps(variant: TapScaleVariant = 'icon'): TapScaleMotionProps {
  const prefersReducedMotion = usePrefersReducedMotion()

  if (prefersReducedMotion) {
    return {}
  }

  return {
    whileTap: { scale: TAP_SCALE[variant] },
    transition: tapSpringTransition,
  }
}
