import { useEffect, useRef, useState } from 'react'
import { useBooleanState, useLoading } from 'react-simplikit'
import { useSnackbarAdapter } from 'seed-design/ui/snackbar'

import { useLayoutOverlay } from '../../../app/layouts/useLayoutOverlay'
import { showSnackbar } from '../../../shared/utils/showSnackbar'
import {
  getReportPaymentErrorMessage,
  logReportPaymentDev,
  releaseOverlayFocus,
  waitOverlayTick,
} from '../utils/reportPaymentFeedback'
import { useTradeDetail } from './useTradeDetail'

interface UseTradePaymentSheetOptions {
  open: boolean
  onOpenChange: (open: boolean) => void
  tradeId: string | null
}

export function useTradePaymentSheet({ open, onOpenChange, tradeId }: UseTradePaymentSheetOptions) {
  const portalContainerRef = useRef<HTMLElement | null>(
    typeof document !== 'undefined' ? document.getElementById('app-frame-portal') : null,
  )
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
  const { trade, reportPayment, confirmPayment, denyPayment, cancelTrade } =
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

  const copyCallbacks = {
    onAccountCopied: () => showSnackbar(snackbar, '계좌번호를 복사했어요.'),
    onCopyFailed: () => showSnackbar(snackbar, '복사하지 못했어요.', 'critical'),
  }

  const hasActions =
    trade &&
    trade.status !== 'COMPLETED' &&
    trade.status !== 'DISPUTED' &&
    (trade.actions.includes('REPORT_PAYMENT') ||
      trade.actions.includes('CONFIRM_PAYMENT') ||
      trade.actions.includes('CANCEL'))

  const showActionFooter =
    trade && trade.status !== 'COMPLETED' && hasActions

  return {
    portalContainerRef,
    mountedTradeId,
    trade,
    loading,
    open,
    cancelDialogOpen,
    reportDialogOpen,
    confirmDialogOpen,
    denyDialogOpen,
    disputeOpen,
    showActionFooter,
    copyCallbacks,
    handleSheetOpenChange,
    handleConfirmCancel,
    handleReportPayment,
    handleConfirmPayment,
    handleDenyPayment,
    handleReportPaymentWithFeedback,
    handleReportDialogOpenChange,
    openCancelDialog,
    closeCancelDialog,
    openConfirmDialog,
    closeConfirmDialog,
    openDenyDialog,
    closeDenyDialog,
    openDisputeSheet,
    closeDisputeSheet,
    runAction,
    confirmPayment,
    denyPayment,
  }
}
