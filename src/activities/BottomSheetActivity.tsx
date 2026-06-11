import { useActivityZIndexBase } from '@seed-design/stackflow'
import type { ActivityComponentType } from '@stackflow/react'
import { useActivity, useFlow } from '@stackflow/react'
import { Text, VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from 'seed-design/ui/bottom-sheet'

const BottomSheetActivity: ActivityComponentType<'BottomSheet'> = () => {
  const { pop } = useFlow()
  const { isActive } = useActivity()
  const layerIndex = useActivityZIndexBase()

  return (
    <BottomSheetRoot
      open={isActive}
      onOpenChange={(open) => !open && pop()}
    >
      <BottomSheetContent
        title="필터"
        description="보고 싶은 소식 유형을 선택해 주세요."
        showHandle
        layerIndex={layerIndex}
      >
        <BottomSheetBody>
          <VStack gap="spacingY.betweenText">
            <Text textStyle="t4Regular" color="fg.neutralMuted">
              중고거래, 동네생활, 알바 등 관심 카테고리를 골라볼 수 있어요.
            </Text>
            <Text textStyle="t4Regular" color="fg.neutralSubtle">
              아래로 드래그하면 닫힙니다.
            </Text>
          </VStack>
        </BottomSheetBody>
        <BottomSheetFooter>
          <ActionButton onClick={pop}>
            확인
          </ActionButton>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheetRoot>
  )
}

export default BottomSheetActivity
