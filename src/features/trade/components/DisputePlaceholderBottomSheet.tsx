import { useRef } from 'react'
import { useActivityZIndexBase } from '@seed-design/stackflow'
import { Portal, Text, VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from 'seed-design/ui/bottom-sheet'
import { Callout } from 'seed-design/ui/callout'

import { useLayoutOverlay } from '../../../app/layouts/useLayoutOverlay'
import { formatAmount } from '../../home/utils/formatAmount'

interface DisputePlaceholderBottomSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  legIndex?: number
  amountKrw?: number
}

/** U6 — 분쟁 채팅 실구현 전 placeholder */
export function DisputePlaceholderBottomSheet({
  open,
  onOpenChange,
  legIndex,
  amountKrw,
}: DisputePlaceholderBottomSheetProps) {
  const portalContainerRef = useRef<HTMLElement | null>(
    typeof document !== 'undefined' ? document.getElementById('app-frame-portal') : null,
  )
  const layerIndex = useActivityZIndexBase({ activityOffset: 1 })

  useLayoutOverlay(open)

  const legLabel = legIndex ? `${legIndex}건` : '해당 건'

  return (
    <BottomSheetRoot open={open} onOpenChange={onOpenChange}>
      <Portal container={portalContainerRef}>
        <BottomSheetContent
          title="분쟁 검토 중"
          layerIndex={layerIndex}
          showHandle
          aria-describedby={undefined}
        >
          <BottomSheetBody>
            <VStack gap="x4" width="full">
              {amountKrw !== undefined && (
                <Text textStyle="t5Bold" color="fg.neutral" className="tabular-nums">
                  {legLabel} · {formatAmount(amountKrw)}
                </Text>
              )}
              <Callout
                tone="warning"
                description="입금 확인이 맞지 않아 검토 중이에요. 고객센터 연결과 채팅은 다음 단계에서 제공할 예정이에요."
              />
              <Text textStyle="t4Regular" color="fg.neutralSubtle">
                다른 leg 거래는 계속 진행할 수 있어요.
              </Text>
            </VStack>
          </BottomSheetBody>
          <BottomSheetFooter>
            <ActionButton
              size="large"
              variant="brandSolid"
              flexGrow
              onClick={() => onOpenChange(false)}
            >
              확인
            </ActionButton>
          </BottomSheetFooter>
        </BottomSheetContent>
      </Portal>
    </BottomSheetRoot>
  )
}
