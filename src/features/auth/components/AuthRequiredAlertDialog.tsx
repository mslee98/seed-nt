import { useRef } from 'react'
import { useActivityZIndexBase } from '@seed-design/stackflow'
import { Portal, ResponsivePair, VStack } from '@seed-design/react'

import {
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogRoot,
  AlertDialogTitle,
} from 'seed-design/ui/alert-dialog'

import {
  AUTH_REQUIRED_COPY,
  type AuthRequiredReason,
} from '../constants/authRequiredCopy'

interface AuthRequiredAlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reason?: AuthRequiredReason
  onSignUp: () => void
  onLogin?: () => void
  /** Stack 밖(바텀 nav 등)에서 사용 시 명시 */
  layerIndex?: number
}

export function AuthRequiredAlertDialog({
  open,
  onOpenChange,
  reason = 'default',
  onSignUp,
  onLogin,
  layerIndex: layerIndexProp,
}: AuthRequiredAlertDialogProps) {
  const portalContainerRef = useRef<HTMLElement | null>(
    typeof document !== 'undefined' ? document.getElementById('app-frame-portal') : null,
  )
  const activityLayerIndex = useActivityZIndexBase({ activityOffset: 2 })
  const layerIndex = layerIndexProp ?? activityLayerIndex
  const copy = AUTH_REQUIRED_COPY[reason]

  return (
    <AlertDialogRoot open={open} onOpenChange={onOpenChange}>
      <Portal container={portalContainerRef}>
        <AlertDialogContent layerIndex={layerIndex}>
          <AlertDialogHeader>
            <AlertDialogTitle>{copy.title}</AlertDialogTitle>
            <AlertDialogDescription>{copy.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <VStack gap="x2" width="full">
              <ResponsivePair gap="x2" width="full">
                <AlertDialogAction variant="neutralWeak" onClick={() => onOpenChange(false)}>
                  닫기
                </AlertDialogAction>
                <AlertDialogAction
                  variant="brandSolid"
                  onClick={() => {
                    onSignUp()
                    onOpenChange(false)
                  }}
                >
                  가입하기
                </AlertDialogAction>
              </ResponsivePair>
              {onLogin && (
                <AlertDialogAction
                  variant="neutralOutline"
                  onClick={() => {
                    onLogin()
                    onOpenChange(false)
                  }}
                >
                  로그인
                </AlertDialogAction>
              )}
            </VStack>
          </AlertDialogFooter>
        </AlertDialogContent>
      </Portal>
    </AlertDialogRoot>
  )
}
