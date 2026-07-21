import { useRef } from 'react'
import { useActivityZIndexBase } from '@seed-design/stackflow'
import { HStack, Portal, Text, VStack } from '@seed-design/react'
import { useLayoutOverlay } from '../../../app/layouts/useLayoutOverlay'
import { BottomActionButton } from '../../../shared/ui/BottomActionButton'
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from 'seed-design/ui/bottom-sheet'

import {
  detectInstallGuidePlatform,
  getInstallGuideDescription,
  getInstallGuideSteps,
} from '../services/detectInstallPlatform'

interface InstallGuideBottomSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InstallGuideBottomSheet({ open, onOpenChange }: InstallGuideBottomSheetProps) {
  const portalContainerRef = useRef<HTMLElement | null>(
    typeof document !== 'undefined' ? document.getElementById('app-frame-portal') : null,
  )
  const platform = detectInstallGuidePlatform()
  const description = getInstallGuideDescription(platform)
  const steps = getInstallGuideSteps(platform)
  const layerIndex = useActivityZIndexBase({ activityOffset: 1 })

  useLayoutOverlay(open)

  return (
    <BottomSheetRoot open={open} onOpenChange={onOpenChange}>
      <Portal container={portalContainerRef}>
        <BottomSheetContent
          title="앱처럼 홈 화면에 추가해요"
          description={description}
          layerIndex={layerIndex}
          showHandle
        >
          <BottomSheetBody>
            <VStack gap="spacingY.betweenText">
              <Text textStyle="t3Regular" color="fg.neutralMuted">
                브라우저 메뉴에서 홈 화면에 추가하면, 앱처럼 더 빠르게 거래를 확인할 수 있어요.
              </Text>
              {steps && (
                <Text textStyle="t4Regular" color="fg.neutralSubtle">
                  {steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}
                </Text>
              )}
            </VStack>
          </BottomSheetBody>
          <BottomSheetFooter>
            <HStack gap="x2" width="full">
              <BottomActionButton variant="neutralWeak" onClick={() => onOpenChange(false)}>
                닫기
              </BottomActionButton>
              <BottomActionButton variant="neutralSolid" flexGrow onClick={() => onOpenChange(false)}>
                확인
              </BottomActionButton>
            </HStack>
          </BottomSheetFooter>
        </BottomSheetContent>
      </Portal>
    </BottomSheetRoot>
  )
}
