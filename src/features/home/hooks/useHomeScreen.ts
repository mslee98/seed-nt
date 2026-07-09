import { useActivity, useFlow } from '@stackflow/react'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useBooleanState } from 'react-simplikit'

import { useRequireAuth } from '../../auth/hooks/useRequireAuth'
import { clearAttention } from '../../notifications/hooks/useNotifications'
import { useHomeNotificationAttention } from '../../notifications/hooks/useHomeNotificationAttention'
import { useAmountReplay } from '../../../shared/hooks/useAmountReplay'
import { useActiveSplitGroup } from '../../trade/hooks/useActiveSplitGroup'
import { useActiveTrade } from '../../trade/hooks/useActiveTrade'
import { useMatchingSession } from '../../trade/matching/hooks/useMatchingSession'
import {
  createTradeOrder,
  isSplitGroupInProgress,
  isTerminalStatus,
} from '../../trade/stores/tradeSession.store'
import { getHomeActiveTradeCopy } from '../utils/getHomeActiveTradeCopy'
import { useHomeViewModel } from './useHomeViewModel'
import { useTradeInputState } from './useTradeInputState'

/**
 * Home Activity orchestration.
 *
 * 입력·확인 시트 후 Trade로 push합니다. 매칭·결제 UI는 Trade Activity에 위임합니다.
 *
 * @see docs/domains/trade.md
 * @see docs/domains/notifications.md
 */
export function useHomeScreen() {
  const { isActive } = useActivity()
  const { push } = useFlow()
  const { requireAuth, authRequiredDialog } = useRequireAuth('trade')
  const viewModel = useHomeViewModel()
  const activeTrade = useActiveTrade()
  const matchingSession = useMatchingSession()
  const splitGroup = useActiveSplitGroup()
  const tradeInput = useTradeInputState({ coinBalance: viewModel.wallet.coinBalance })
  const { replayKey: balanceReplayKey, triggerReplay: triggerBalanceReplay } = useAmountReplay()

  const [confirmOpen, openConfirm, closeConfirm] = useBooleanState(false)
  const prevTradeStatusRef = useRef(activeTrade?.status)

  const hasBlockingTrade =
    isSplitGroupInProgress() ||
    (activeTrade !== null && !isTerminalStatus(activeTrade.status) && !splitGroup)

  const headerSplitGroup =
    splitGroup && isSplitGroupInProgress() ? splitGroup : null

  const headerActiveTrade = (() => {
    if (headerSplitGroup) return undefined
    if (activeTrade && !isTerminalStatus(activeTrade.status)) return activeTrade
    return viewModel.activeTrade
  })()

  const headerActiveTradeCopy = useMemo(() => {
    if (!headerActiveTrade) return null
    return getHomeActiveTradeCopy({
      status: headerActiveTrade.status,
      role: headerActiveTrade.role,
      matchingSession:
        headerActiveTrade.status === 'MATCHING' && activeTrade?.id === headerActiveTrade.id
          ? matchingSession
          : null,
    })
  }, [activeTrade?.id, headerActiveTrade, matchingSession])

  const { needsAttention } = useHomeNotificationAttention({
    activeTradeId: headerActiveTrade?.id,
    activeTradeStatus: headerActiveTrade?.status,
    activeTradeRole: headerActiveTrade?.role,
    matchingSession,
  })

  const handleSubmit = () => {
    if (tradeInput.isSubmitDisabled || !tradeInput.amountKrw || hasBlockingTrade) return

    requireAuth(() => {
      openConfirm()
    })
  }

  const handleConfirmTrade = useCallback(async () => {
    if (!tradeInput.amountKrw) return

    const result = await createTradeOrder({
      side: tradeInput.side,
      amountKrw: tradeInput.amountKrw,
      splitMode: tradeInput.splitMode,
    })

    if (result.splitGroupId) {
      push('Trade', { splitGroupId: result.splitGroupId }, { animate: true })
      return
    }

    push('Trade', { tradeId: result.trade.id }, { animate: true })
  }, [push, tradeInput.amountKrw, tradeInput.side, tradeInput.splitMode])

  const handleActiveTradeClick = useCallback(() => {
    if (headerActiveTrade) {
      clearAttention(headerActiveTrade.id)
    }

    if (splitGroup) {
      push('Trade', { splitGroupId: splitGroup.id }, { animate: true })
      return
    }
    if (activeTrade) {
      push('Trade', { tradeId: activeTrade.id }, { animate: true })
    }
  }, [activeTrade, headerActiveTrade, push, splitGroup])

  const handlePtrRefresh = useCallback(async () => {
    await viewModel.refresh()
    triggerBalanceReplay()
  }, [triggerBalanceReplay, viewModel])

  const refreshBalance = useCallback(async () => {
    await viewModel.refresh()
    triggerBalanceReplay()
  }, [triggerBalanceReplay, viewModel])

  useEffect(() => {
    const prevStatus = prevTradeStatusRef.current
    const nextStatus = activeTrade?.status

    if (prevStatus !== 'COMPLETED' && nextStatus === 'COMPLETED' && isActive) {
      void refreshBalance()
    }

    prevTradeStatusRef.current = nextStatus
  }, [activeTrade, isActive, refreshBalance])

  const handleConfirmOpenChange = useCallback(
    (open: boolean) => {
      if (open) openConfirm()
      else closeConfirm()
    },
    [closeConfirm, openConfirm],
  )

  return {
    authRequiredDialog,
    viewModel,
    tradeInput,
    balanceReplayKey,
    confirmOpen,
    openConfirm,
    closeConfirm,
    handleConfirmOpenChange,
    hasBlockingTrade,
    headerActiveTrade,
    headerActiveTradeCopy,
    headerSplitGroup,
    needsAttention,
    handleSubmit,
    handleConfirmTrade,
    handleActiveTradeClick,
    handlePtrRefresh,
  }
}
