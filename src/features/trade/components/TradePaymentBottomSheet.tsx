import { useRef, useState } from 'react'
import { useActivityZIndexBase } from '@seed-design/stackflow'
import { Portal, VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from 'seed-design/ui/bottom-sheet'
import { useSnackbarAdapter } from 'seed-design/ui/snackbar'

import { useLayoutOverlay } from '../../../app/layouts/useLayoutOverlay'
import { showSnackbar } from '../../../shared/utils/showSnackbar'
import { useTradeDetail } from '../hooks/useTradeDetail'
import type { TradeDetailViewModel } from '../types'
import { TradeCancelAlertDialog } from './TradeCancelAlertDialog'
import { TradeRoomPanel } from './TradeRoomPanel'

interface TradePaymentBottomSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tradeId: string | null
}

function getSheetTitle(status: string | undefined, role: string | undefined): string {
  if (status === 'COMPLETED') return '거래 완료'
  if (status === 'PAYMENT_REPORTED' && role === 'SELLER') return '입금 확인'
  if (status === 'PAYMENT_PENDING' && role === 'BUYER') return '입금하기'
  if (status === 'PAYMENT_PENDING' && role === 'SELLER') return '입금 대기'
  if (status === 'PAYMENT_REPORTED' && role === 'BUYER') return '확인 대기'
  return '거래 진행'
}

interface TradeActionButtonsProps {
  trade: TradeDetailViewModel
  loading: boolean
  onReportPayment: () => void
  onConfirmPayment: () => void
  onRequestCancel: () => void
  onDevSkipPayment?: () => void
}

function TradeActionButtons({
  trade,
  loading,
  onReportPayment,
  onConfirmPayment,
  onRequestCancel,
  onDevSkipPayment,
}: TradeActionButtonsProps) {
  return (
    <VStack gap="x2" width="full">
      {trade.actions.includes('REPORT_PAYMENT') && (
        <ActionButton
          size="large"
          variant="brandSolid"
          flexGrow
          loading={loading}
          onClick={onReportPayment}
        >
          입금했어요
        </ActionButton>
      )}
      {trade.actions.includes('CONFIRM_PAYMENT') && (
        <ActionButton
          size="large"
          variant="brandSolid"
          flexGrow
          loading={loading}
          onClick={onConfirmPayment}
        >
          입금 확인
        </ActionButton>
      )}
      {trade.actions.includes('CANCEL') && (
        <ActionButton
          size="medium"
          variant="neutralWeak"
          flexGrow
          loading={loading}
          onClick={onRequestCancel}
        >
          거래 취소
        </ActionButton>
      )}
      {onDevSkipPayment && (
        <ActionButton
          size="medium"
          variant="neutralOutline"
          flexGrow
          loading={loading}
          onClick={onDevSkipPayment}
        >
          [목업] 입금 확인 건너뛰기
        </ActionButton>
      )}
    </VStack>
  )
}

export function TradePaymentBottomSheet({
  open,
  onOpenChange,
  tradeId,
}: TradePaymentBottomSheetProps) {
  const portalContainerRef = useRef<HTMLElement | null>(
    typeof document !== 'undefined' ? document.getElementById('app-frame-portal') : null,
  )
  const layerIndex = useActivityZIndexBase({ activityOffset: 1 })
  const snackbar = useSnackbarAdapter()
  const [loading, setLoading] = useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)

  const { trade, reportPayment, confirmPayment, cancelTrade, devForceCompletePayment } =
    useTradeDetail(tradeId ?? '')
  useLayoutOverlay(open && Boolean(tradeId))

  const runAction = async (action: () => Promise<unknown>) => {
    setLoading(true)
    try {
      await action()
    } catch {
      showSnackbar(snackbar, '요청을 처리하지 못했어요.', 'critical')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmCancel = () => {
    void runAction(cancelTrade)
  }

  if (!tradeId) return null

  const title = getSheetTitle(trade?.status, trade?.role)
  const showDevSkip =
    import.meta.env.DEV &&
    trade &&
    (trade.status === 'PAYMENT_PENDING' || trade.status === 'PAYMENT_REPORTED')
  const hasActions =
    trade &&
    trade.status !== 'COMPLETED' &&
    (trade.actions.includes('REPORT_PAYMENT') ||
      trade.actions.includes('CONFIRM_PAYMENT') ||
      trade.actions.includes('CANCEL'))
  const showActionFooter = trade && trade.status !== 'COMPLETED' && (hasActions || showDevSkip)

  return (
    <>
      <BottomSheetRoot open={open} onOpenChange={onOpenChange}>
        <Portal container={portalContainerRef}>
          <BottomSheetContent title={title} layerIndex={layerIndex} showHandle>
            <BottomSheetBody>
              {trade ? (
                <TradeRoomPanel
                  trade={trade}
                  onAccountCopied={() => showSnackbar(snackbar, '계좌번호를 복사했어요.')}
                  onCopyFailed={() =>
                    showSnackbar(snackbar, '계좌번호를 복사하지 못했어요.', 'critical')
                  }
                />
              ) : null}
            </BottomSheetBody>
            {showActionFooter && trade && (
              <BottomSheetFooter>
                <TradeActionButtons
                  trade={trade}
                  loading={loading}
                  onReportPayment={() => runAction(reportPayment)}
                  onConfirmPayment={() => runAction(confirmPayment)}
                  onRequestCancel={() => setCancelDialogOpen(true)}
                  onDevSkipPayment={
                    showDevSkip ? () => runAction(devForceCompletePayment) : undefined
                  }
                />
              </BottomSheetFooter>
            )}
            {trade?.status === 'COMPLETED' && (
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
            )}
          </BottomSheetContent>
        </Portal>
      </BottomSheetRoot>

      <TradeCancelAlertDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        variant="trade"
        onConfirm={handleConfirmCancel}
      />
    </>
  )
}
