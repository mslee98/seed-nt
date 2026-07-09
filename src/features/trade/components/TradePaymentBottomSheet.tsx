import { useEffect, useRef, useState } from 'react'
import { useActivityZIndexBase } from '@seed-design/stackflow'
import { Box, HStack, Portal, Text, VStack } from '@seed-design/react'
import { useBooleanState, useLoading } from 'react-simplikit'
import { ActionButton } from 'seed-design/ui/action-button'
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from 'seed-design/ui/bottom-sheet'
import { useSnackbarAdapter } from 'seed-design/ui/snackbar'

import { useLayoutOverlay } from '../../../app/layouts/useLayoutOverlay'
import { BottomSheetScrollArea } from '../../../shared/ui/BottomSheetScrollArea'
import { showSnackbar } from '../../../shared/utils/showSnackbar'
import { useTradeDetail } from '../hooks/useTradeDetail'
import type { TradeDetailViewModel } from '../types'
import { getPaymentFooterDismissHint } from '../utils/paymentCopy'
import {
  getReportPaymentErrorMessage,
  logReportPaymentDev,
  releaseOverlayFocus,
  waitOverlayTick,
} from '../utils/reportPaymentFeedback'
import { DisputePlaceholderBottomSheet } from './DisputePlaceholderBottomSheet'
import { TradeCancelAlertDialog } from './TradeCancelAlertDialog'
import { TradePaymentBuyerPanel } from './TradePaymentBuyerPanel'
import { TradePaymentBuyerWaitingPanel } from './TradePaymentBuyerWaitingPanel'
import { TradePaymentConfirmAlertDialog } from './TradePaymentConfirmAlertDialog'
import { TradeRoomPanel } from './TradeRoomPanel'

interface TradePaymentBottomSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tradeId: string | null
}

function getSheetTitle(status: string | undefined, role: string | undefined): string {
  if (status === 'COMPLETED') return '거래 완료'
  if (status === 'DISPUTED') return '분쟁 검토 중'
  if (status === 'PAYMENT_REPORTED' && role === 'SELLER') return '입금 확인'
  if (status === 'PAYMENT_PENDING' && role === 'BUYER') return '입금하기'
  if (status === 'PAYMENT_PENDING' && role === 'SELLER') return '입금 대기'
  if (status === 'PAYMENT_REPORTED' && role === 'BUYER') return '확인 대기'
  return '거래 진행'
}

function isBuyerCompactSheet(trade: TradeDetailViewModel): boolean {
  return (
    (trade.status === 'PAYMENT_PENDING' || trade.status === 'PAYMENT_REPORTED') &&
    trade.role === 'BUYER'
  )
}

function renderSheetPanel(
  trade: TradeDetailViewModel,
  callbacks: {
    onAccountCopied: () => void
    onMemoCopied: () => void
    onCopyFailed: () => void
  },
) {
  if (trade.status === 'PAYMENT_PENDING' && trade.role === 'BUYER') {
    return <TradePaymentBuyerPanel trade={trade} {...callbacks} />
  }
  if (trade.status === 'PAYMENT_REPORTED' && trade.role === 'BUYER') {
    return <TradePaymentBuyerWaitingPanel />
  }
  return <TradeRoomPanel trade={trade} {...callbacks} />
}

interface TradeActionButtonsProps {
  trade: TradeDetailViewModel
  loading: boolean
  onReportPayment: () => void
  onConfirmPayment: () => void
  onDenyPayment: () => void
  onDismiss: () => void
  onRequestCancel: () => void
  onDevSkipPayment?: () => void
}

function TradeActionButtons({
  trade,
  loading,
  onReportPayment,
  onConfirmPayment,
  onDenyPayment,
  onDismiss,
  onRequestCancel,
  onDevSkipPayment,
}: TradeActionButtonsProps) {
  const isBuyerPending = trade.status === 'PAYMENT_PENDING' && trade.role === 'BUYER'
  const isSellerReported = trade.status === 'PAYMENT_REPORTED' && trade.role === 'SELLER'

  return (
    <VStack gap="x2" width="full">
      {isBuyerPending && (
        <>
          <Text textStyle="t4Regular" color="fg.neutralSubtle">
            {getPaymentFooterDismissHint()}
          </Text>
          <HStack gap="x2" width="full">
            <ActionButton
              size="large"
              variant="neutralWeak"
              flexGrow
              disabled={loading}
              onClick={onDismiss}
            >
              아직이에요
            </ActionButton>
            <ActionButton
              size="large"
              variant="brandSolid"
              flexGrow
              loading={loading}
              onClick={onReportPayment}
            >
              입금했어요
            </ActionButton>
          </HStack>
        </>
      )}

      {isSellerReported && (
        <HStack gap="x2" width="full">
          <ActionButton
            size="large"
            variant="neutralOutline"
            flexGrow
            loading={loading}
            onClick={onDenyPayment}
          >
            못 받았어요
          </ActionButton>
          <ActionButton
            size="large"
            variant="brandSolid"
            flexGrow
            loading={loading}
            onClick={onConfirmPayment}
          >
            돈 받았어요
          </ActionButton>
        </HStack>
      )}

      {trade.actions.includes('CANCEL') && !isBuyerPending && !isSellerReported && (
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
  const [loading, startLoading] = useLoading()
  const [cancelDialogOpen, openCancelDialog, closeCancelDialog] = useBooleanState(false)
  const [reportDialogOpen, openReportDialog, closeReportDialog] = useBooleanState(false)
  const [confirmDialogOpen, openConfirmDialog, closeConfirmDialog] = useBooleanState(false)
  const [denyDialogOpen, openDenyDialog, closeDenyDialog] = useBooleanState(false)
  const [disputeOpen, openDisputeSheet, closeDisputeSheet] = useBooleanState(false)
  const [mountedTradeId, setMountedTradeId] = useState<string | null>(tradeId)

  useEffect(() => {
    if (tradeId) setMountedTradeId(tradeId)
  }, [tradeId])

  useEffect(() => {
    const hasOpenDialog =
      cancelDialogOpen ||
      reportDialogOpen ||
      confirmDialogOpen ||
      denyDialogOpen ||
      disputeOpen

    if (!tradeId && !open && !loading && !hasOpenDialog) {
      setMountedTradeId(null)
    }
  }, [
    cancelDialogOpen,
    confirmDialogOpen,
    denyDialogOpen,
    disputeOpen,
    loading,
    open,
    reportDialogOpen,
    tradeId,
  ])

  const activeTradeId = mountedTradeId ?? ''
  const { trade, reportPayment, confirmPayment, denyPayment, cancelTrade, devForceCompletePayment } =
    useTradeDetail(activeTradeId)
  useLayoutOverlay(open && Boolean(mountedTradeId))

  const runAction = async (action: () => Promise<unknown>) => {
    try {
      await startLoading(action())
    } catch {
      showSnackbar(snackbar, '요청을 처리하지 못했어요.', 'critical')
    }
  }

  const handleConfirmCancel = () => {
    void runAction(cancelTrade)
  }

  const handleReportPayment = () => {
    openReportDialog()
  }

  const handleConfirmPayment = () => {
    openConfirmDialog()
  }

  const handleDenyPayment = () => {
    openDenyDialog()
  }

  const handleReportPaymentWithFeedback = async () => {
    if (!activeTradeId) {
      throw new Error('TRADE_NOT_FOUND')
    }

    logReportPaymentDev('start', activeTradeId, { status: trade?.status, version: trade?.version })

    try {
      const updated = await startLoading(reportPayment())
      logReportPaymentDev('success', activeTradeId, {
        status: updated?.status,
        version: updated?.version,
      })

      closeReportDialog()
      releaseOverlayFocus()
      await waitOverlayTick()

      onOpenChange(false)
      showSnackbar(
        snackbar,
        '입금했어요를 눌렀어요. 판매자가 확인하고 있어요.',
      )
    } catch (error) {
      logReportPaymentDev('error', activeTradeId, {
        message: error instanceof Error ? error.message : String(error),
        status: trade?.status,
        version: trade?.version,
      })

      closeReportDialog()
      releaseOverlayFocus()
      await waitOverlayTick()

      showSnackbar(snackbar, getReportPaymentErrorMessage(error), 'critical')
      throw error
    }
  }

  const handleSheetOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && loading) return
    onOpenChange(nextOpen)
  }

  const handleReportDialogOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && loading) return
    if (nextOpen) openReportDialog()
    else closeReportDialog()
  }

  if (!mountedTradeId) return null

  const title = getSheetTitle(trade?.status, trade?.role)
  const showDevSkip =
    import.meta.env.DEV &&
    trade &&
    (trade.status === 'PAYMENT_PENDING' || trade.status === 'PAYMENT_REPORTED')
  const hasActions =
    trade &&
    trade.status !== 'COMPLETED' &&
    trade.status !== 'DISPUTED' &&
    (trade.actions.includes('REPORT_PAYMENT') ||
      trade.actions.includes('CONFIRM_PAYMENT') ||
      trade.actions.includes('CANCEL'))
  const showActionFooter = trade && trade.status !== 'COMPLETED' && (hasActions || showDevSkip)
  const useCompactLayout = trade ? isBuyerCompactSheet(trade) : false

  const copyCallbacks = {
    onAccountCopied: () => showSnackbar(snackbar, '계좌번호를 복사했어요.'),
    onMemoCopied: () => showSnackbar(snackbar, '메모를 복사했어요.'),
    onCopyFailed: () => showSnackbar(snackbar, '복사하지 못했어요.', 'critical'),
  }

  return (
    <>
      <BottomSheetRoot open={open} onOpenChange={handleSheetOpenChange}>
        <Portal container={portalContainerRef}>
          <BottomSheetContent
            title={title}
            layerIndex={layerIndex}
            showHandle
            aria-describedby={undefined}
            className={useCompactLayout ? undefined : 'bottom-sheet-scroll-content'}
          >
            <BottomSheetBody className={useCompactLayout ? undefined : 'bottom-sheet-scroll-body'}>
              {trade ? (
                useCompactLayout ? (
                  renderSheetPanel(trade, copyCallbacks)
                ) : (
                  <Box className="bottom-sheet-scroll-viewport" width="full">
                    <BottomSheetScrollArea>
                      {renderSheetPanel(trade, copyCallbacks)}
                    </BottomSheetScrollArea>
                  </Box>
                )
              ) : null}
            </BottomSheetBody>
            {showActionFooter && trade && (
              <BottomSheetFooter>
                <TradeActionButtons
                  trade={trade}
                  loading={loading}
                  onReportPayment={handleReportPayment}
                  onConfirmPayment={handleConfirmPayment}
                  onDenyPayment={handleDenyPayment}
                  onDismiss={() => handleSheetOpenChange(false)}
                  onRequestCancel={openCancelDialog}
                  onDevSkipPayment={
                    showDevSkip ? () => runAction(devForceCompletePayment) : undefined
                  }
                />
              </BottomSheetFooter>
            )}
            {trade?.status === 'DISPUTED' && (
              <BottomSheetFooter>
                <ActionButton
                  size="large"
                  variant="brandSolid"
                  flexGrow
                  onClick={openDisputeSheet}
                >
                  분쟁 안내 보기
                </ActionButton>
              </BottomSheetFooter>
            )}
            {trade?.status === 'COMPLETED' && (
              <BottomSheetFooter>
                <ActionButton
                  size="large"
                  variant="brandSolid"
                  flexGrow
                  onClick={() => handleSheetOpenChange(false)}
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
        onOpenChange={(open) => (open ? openCancelDialog() : closeCancelDialog())}
        variant="trade"
        splitContext={
          trade?.splitLegIndex && trade.splitTotalLegs
            ? { legIndex: trade.splitLegIndex, totalLegs: trade.splitTotalLegs }
            : undefined
        }
        onConfirm={handleConfirmCancel}
      />

      <TradePaymentConfirmAlertDialog
        open={reportDialogOpen}
        onOpenChange={handleReportDialogOpenChange}
        variant="report"
        deferCloseToConfirm
        confirmLoading={loading}
        onConfirm={handleReportPaymentWithFeedback}
      />

      <TradePaymentConfirmAlertDialog
        open={confirmDialogOpen}
        onOpenChange={(open) => (open ? openConfirmDialog() : closeConfirmDialog())}
        variant="confirm"
        onConfirm={() => void runAction(confirmPayment)}
      />

      <TradePaymentConfirmAlertDialog
        open={denyDialogOpen}
        onOpenChange={(open) => (open ? openDenyDialog() : closeDenyDialog())}
        variant="deny"
        onConfirm={() => {
          void runAction(async () => {
            await denyPayment()
            openDisputeSheet()
          })
        }}
      />

      <DisputePlaceholderBottomSheet
        open={disputeOpen}
        onOpenChange={(open) => (open ? openDisputeSheet() : closeDisputeSheet())}
        legIndex={trade?.splitLegIndex}
        amountKrw={trade?.amountKrw}
      />
    </>
  )
}
