import { useActivityZIndexBase } from '@seed-design/stackflow'
import { Portal, ResponsivePair } from '@seed-design/react'
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

const COPY = {
  report: {
    title: '입금했어요를 누를까요?',
    description: '아직 입금하지 않았다면 판매자 확인이 지연될 수 있어요.',
    confirm: '입금했어요',
  },
  confirm: {
    title: '입금을 확인할까요?',
    description: '계좌 입금 내역을 확인했을 때만 눌러 주세요.',
    confirm: '돈 받았어요',
  },
  deny: {
    title: '입금을 못 받으셨나요?',
    description: '분쟁 채팅으로 이어서 확인해요. 해당 건만 잠시 멈춰요.',
    confirm: '못 받았어요',
  },
} as const

interface TradePaymentConfirmAlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  variant: keyof typeof COPY
  onConfirm: () => void | Promise<void>
  /** true면 Dialog.Action 자동 닫힘 없이 onConfirm이 닫기까지 책임 (async report 등) */
  deferCloseToConfirm?: boolean
  confirmLoading?: boolean
}

export function TradePaymentConfirmAlertDialog({
  open,
  onOpenChange,
  variant,
  onConfirm,
  deferCloseToConfirm = false,
  confirmLoading = false,
}: TradePaymentConfirmAlertDialogProps) {
  const layerIndex = useActivityZIndexBase({ activityOffset: 3 })
  const copy = COPY[variant]
  const confirmVariant = variant === 'deny' ? 'criticalSolid' : 'brandSolid'

  const handleDismiss = () => {
    onOpenChange(false)
  }

  const handleDeferredConfirm = () => {
    void Promise.resolve(onConfirm()).catch(() => {
      // 실패 시 닫기·스낵바는 호출부에서 처리
    })
  }

  const handleImmediateConfirm = () => {
    void Promise.resolve(onConfirm())
      .then(() => onOpenChange(false))
      .catch(() => {
        // 실패 시 다이얼로그 유지 — 호출부에서 스낵바 처리
      })
  }

  return (
    <AlertDialogRoot open={open} onOpenChange={onOpenChange}>
      <Portal>
        <AlertDialogContent layerIndex={layerIndex}>
          <AlertDialogHeader>
            <AlertDialogTitle>{copy.title}</AlertDialogTitle>
            <AlertDialogDescription>{copy.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {deferCloseToConfirm ? (
              <ResponsivePair gap="x2" width="full">
                <ActionButton size="large" variant="neutralWeak" flexGrow onClick={handleDismiss}>
                  닫기
                </ActionButton>
                <ActionButton
                  size="large"
                  variant={confirmVariant}
                  flexGrow
                  loading={confirmLoading}
                  disabled={confirmLoading}
                  onClick={handleDeferredConfirm}
                >
                  {copy.confirm}
                </ActionButton>
              </ResponsivePair>
            ) : (
              <ResponsivePair gap="x2" width="full">
                <AlertDialogAction variant="neutralWeak" onClick={handleDismiss}>
                  닫기
                </AlertDialogAction>
                <AlertDialogAction variant={confirmVariant} onClick={handleImmediateConfirm}>
                  {copy.confirm}
                </AlertDialogAction>
              </ResponsivePair>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </Portal>
    </AlertDialogRoot>
  )
}
