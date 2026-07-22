import { useRef } from 'react'
import { HStack, Portal, VStack } from '@seed-design/react'
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from 'seed-design/ui/bottom-sheet'

import { useLayoutOverlay } from '../../../app/layouts/useLayoutOverlay'
import { CHROME_ALERT_DIALOG_LAYER_INDEX } from '../../../shared/constants/app-layout'
import { BottomActionButton } from '../../../shared/ui/BottomActionButton'
import { DeviceContextDevDetails } from './DeviceContextDevPanel'

interface DeviceContextDevSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** DEV 전용: 모바일에서 FAB로 여는 기기 판별 시트 */
export function DeviceContextDevSheet({ open, onOpenChange }: DeviceContextDevSheetProps) {
  const portalContainerRef = useRef<HTMLElement | null>(
    typeof document !== 'undefined' ? document.getElementById('app-frame-portal') : null,
  )

  useLayoutOverlay(open)

  return (
    <BottomSheetRoot open={open} onOpenChange={onOpenChange}>
      <Portal container={portalContainerRef}>
        <BottomSheetContent
          title="[DEV] 기기 판별"
          description="접속 환경 힌트를 확인해요."
          layerIndex={CHROME_ALERT_DIALOG_LAYER_INDEX}
          showHandle
        >
          <BottomSheetBody>
            <VStack gap="spacingY.betweenText">
              <DeviceContextDevDetails />
            </VStack>
          </BottomSheetBody>
          <BottomSheetFooter>
            <HStack gap="x2" width="full">
              <BottomActionButton variant="neutralWeak" onClick={() => onOpenChange(false)}>
                닫기
              </BottomActionButton>
            </HStack>
          </BottomSheetFooter>
        </BottomSheetContent>
      </Portal>
    </BottomSheetRoot>
  )
}
