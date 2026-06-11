import { useActivityZIndexBase } from '@seed-design/stackflow'
import type { ActivityComponentType } from '@stackflow/react'
import { useActivity, useFlow } from '@stackflow/react'
import { ResponsivePair, VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'
import {
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogRoot,
  AlertDialogTitle,
} from 'seed-design/ui/alert-dialog'

const AlertDialogActivity: ActivityComponentType<'AlertDialog'> = () => {
  const { pop } = useFlow()
  const { isActive } = useActivity()
  const layerIndex = useActivityZIndexBase()

  return (
    <AlertDialogRoot
      open={isActive}
      onOpenChange={(open) => !open && pop()}
    >
      <AlertDialogContent layerIndex={layerIndex}>
        <AlertDialogHeader>
          <AlertDialogTitle>알림을 켤까요?</AlertDialogTitle>
          <AlertDialogDescription>
            새 댓글과 채팅 메시지를 놓치지 않도록 알림을 받을 수 있어요.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <VStack gap="spacingY.betweenText">
            <ResponsivePair gap="x2">
              <AlertDialogAction asChild>
                <ActionButton>확인</ActionButton>
              </AlertDialogAction>
              <ActionButton variant="neutralWeak" onClick={pop}>
                취소
              </ActionButton>
            </ResponsivePair>
          </VStack>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogRoot>
  )
}

export default AlertDialogActivity
