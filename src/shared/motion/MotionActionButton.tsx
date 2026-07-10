import { motion } from 'motion/react'
import { forwardRef } from 'react'
import { ActionButton, type ActionButtonProps } from 'seed-design/ui/action-button'

import { useTapScaleProps } from '../hooks/useTapScaleProps'

export const MotionActionButton = forwardRef<
  React.ElementRef<typeof ActionButton>,
  ActionButtonProps
>(function MotionActionButton({ style, flexGrow, ...props }, ref) {
  const tapProps = useTapScaleProps('cta')

  const wrapperStyle = flexGrow
    ? { display: 'flex' as const, flexGrow: 1, minWidth: 0 }
    : { display: 'block' as const, width: '100%' }

  return (
    <motion.div style={wrapperStyle} {...tapProps}>
      <ActionButton
        ref={ref}
        flexGrow={flexGrow}
        style={{ width: '100%', ...style }}
        {...props}
      />
    </motion.div>
  )
})

MotionActionButton.displayName = 'MotionActionButton'
