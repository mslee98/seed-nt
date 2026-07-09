import type { ComponentProps, CSSProperties, ReactNode } from 'react'
import { ScrollFog, VStack } from '@seed-design/react'

type VStackGap = ComponentProps<typeof VStack>['gap']

interface BottomSheetScrollAreaProps {
  children: ReactNode
  gap?: VStackGap
  /** ScrollFog 뷰포트 높이. 미지정 시 부모 flex 높이(100%) 사용 */
  maxHeight?: CSSProperties['maxHeight']
}

/**
 * SEED Bottom Sheet + ScrollFog padding 계약 (상 20px / 하 80px).
 *
 * @see https://seed-design.io/react/components/bottom-sheet#with-scroll-fog
 */
export function BottomSheetScrollArea({
  children,
  gap = 'x4',
  maxHeight,
}: BottomSheetScrollAreaProps) {
  const hostStyle: CSSProperties = maxHeight
    ? { maxHeight, height: maxHeight, minHeight: 0 }
    : { flex: 1, minHeight: 0, height: '100%' }

  return (
    <div className="bottom-sheet-scroll-fog-host" style={hostStyle}>
      <ScrollFog placement={['top', 'bottom']} hideScrollBar>
        <VStack pt="20px" pb="80px" px="x1" width="full" gap={gap}>
          {children}
        </VStack>
      </ScrollFog>
    </div>
  )
}
