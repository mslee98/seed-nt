import type { ReactNode } from 'react'
import { VStack } from '@seed-design/react'

import { APP_LAYOUT } from '../constants/app-layout'
import { useKeyboardInset } from '../hooks/useKeyboardInset'

export { BottomActionButton } from './BottomActionButton'

export type BottomCTABehavior = 'keyboardAdaptive' | 'fixed' | 'hiddenWhenKeyboard'

interface BottomCTAProps {
  children: ReactNode
  behavior?: BottomCTABehavior
  /** Activity: viewport 하단 고정 | sheet: footer 내부 inset만 */
  variant?: 'fixed' | 'inline'
  className?: string
}

export function BottomCTA({
  children,
  behavior = 'keyboardAdaptive',
  variant = 'fixed',
  className,
}: BottomCTAProps) {
  const keyboardInset = useKeyboardInset()

  if (behavior === 'hiddenWhenKeyboard' && keyboardInset > 0) {
    return null
  }

  const bottomOffset =
    behavior === 'keyboardAdaptive' ? `var(${/* KEYBOARD_INSET_CSS_VAR */ '--keyboard-inset'}, 0px)` : '0px'

  if (variant === 'inline') {
    return (
      <VStack
        width="full"
        px="spacingX.globalGutter"
        py="x4"
        shrink={0}
        bg="bg.neutralWeak"
        className={className}
        style={{
          paddingBottom: `calc(${bottomOffset} + env(safe-area-inset-bottom, 0px))`,
        }}
      >
        {children}
      </VStack>
    )
  }

  return (
    <div
      className={['bottom-cta', className].filter(Boolean).join(' ')}
      style={{
        ['--bottom-cta-offset' as string]: bottomOffset,
        minHeight: APP_LAYOUT.fixedBottom.minHeight,
      }}
    >
      <VStack width="full" px="spacingX.globalGutter" py="x4">
        {children}
      </VStack>
    </div>
  )
}
