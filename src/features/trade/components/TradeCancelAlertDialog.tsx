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

const COPY = {
  matching: {
    title: '매칭을 취소할까요?',
    description: '취소하면 다시 처음부터 매칭을 시작해야 해요.',
    confirm: '매칭 취소',
  },
  trade: {
    title: '거래를 취소할까요?',
    description: '진행 중인 거래가 종료돼요.',
    confirm: '거래 취소',
  },
} as const

interface TradeCancelAlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  variant: keyof typeof COPY
  onConfirm: () => void
  splitContext?: { legIndex: number; totalLegs: number }
}

export function TradeCancelAlertDialog({
  open,
  onOpenChange,
  variant,
  onConfirm,
  splitContext,
}: TradeCancelAlertDialogProps) {
  const layerIndex = useActivityZIndexBase({ activityOffset: 2 })
  const copy = COPY[variant]
  const description =
    variant === 'matching' && splitContext
      ? `${splitContext.totalLegs}건 중 ${splitContext.legIndex}건만 진행 중이에요. 전체를 취소할까요?`
      : copy.description

  return (
    <AlertDialogRoot open={open} onOpenChange={onOpenChange}>
      <Portal>
        <AlertDialogContent layerIndex={layerIndex}>
          <AlertDialogHeader>
            <AlertDialogTitle>{copy.title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <ResponsivePair gap="x2" width="full">
              <AlertDialogAction variant="neutralWeak" onClick={() => onOpenChange(false)}>
                닫기
              </AlertDialogAction>
              <AlertDialogAction
                variant="criticalSolid"
                onClick={() => {
                  onConfirm()
                  onOpenChange(false)
                }}
              >
                {copy.confirm}
              </AlertDialogAction>
            </ResponsivePair>
          </AlertDialogFooter>
        </AlertDialogContent>
      </Portal>
    </AlertDialogRoot>
  )
}
