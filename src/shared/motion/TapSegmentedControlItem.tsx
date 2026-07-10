import { forwardRef } from 'react'
import {
  SegmentedControlItem,
  type SegmentedControlItemProps,
} from 'seed-design/ui/segmented-control'

import { TAP_SCALE_SEGMENT_CLASS } from './tapScale'

function joinClassNames(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ')
}

/**
 * SegmentedControlItem은 label+radio 구조라 `motion.create` 대신 CSS `:active` scale을 씁니다.
 */
export const TapSegmentedControlItem = forwardRef<
  HTMLInputElement,
  SegmentedControlItemProps
>(function TapSegmentedControlItem({ className, ...props }, ref) {
  return (
    <SegmentedControlItem
      ref={ref}
      className={joinClassNames(TAP_SCALE_SEGMENT_CLASS, className)}
      {...props}
    />
  )
})

TapSegmentedControlItem.displayName = 'TapSegmentedControlItem'
