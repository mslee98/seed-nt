import { useActivityZIndexBase } from '@seed-design/stackflow'
import { Portal, ResponsivePair } from '@seed-design/react'

import {
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogRoot,
  AlertDialogTitle,
} from 'seed-design/ui/alert-dialog'

interface SignupExitAlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirmExit: () => void
}

export function SignupExitAlertDialog({
  open,
  onOpenChange,
  onConfirmExit,
}: SignupExitAlertDialogProps) {
  const layerIndex = useActivityZIndexBase({ activityOffset: 2 })

  return (
    <AlertDialogRoot open={open} onOpenChange={onOpenChange}>
      <Portal>
        <AlertDialogContent layerIndex={layerIndex}>
          <AlertDialogHeader>
            <AlertDialogTitle>가입을 그만둘까요?</AlertDialogTitle>
            <AlertDialogDescription>
              입력한 정보는 저장되지 않아요.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <ResponsivePair gap="x2" width="full">
              <AlertDialogAction variant="neutralWeak" onClick={() => onOpenChange(false)}>
                닫기
              </AlertDialogAction>
              <AlertDialogAction
                variant="criticalSolid"
                onClick={() => {
                  onConfirmExit()
                  onOpenChange(false)
                }}
              >
                그만두기
              </AlertDialogAction>
            </ResponsivePair>
          </AlertDialogFooter>
        </AlertDialogContent>
      </Portal>
    </AlertDialogRoot>
  )
}
