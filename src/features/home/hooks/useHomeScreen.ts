import { useActivity, useFlow } from '@stackflow/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
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
import { getHomeActiveTradeCopy } from '../../trade/copy'
import { consumePendingBalanceReplay } from '../stores/homeWallet.store'
import { useHomeViewModel } from './useHomeViewModel'
import { useTradeInputState } from './useTradeInputState'

/**
 * Home Activity orchestration.
 *
 * 입력·확인 다이얼로그 후 Trade로 push합니다. 매칭·결제 UI는 Trade Activity에 위임합니다.
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
  const [balanceStartCoin, setBalanceStartCoin] = useState(0)

  const [confirmOpen, openConfirm, closeConfirm] = useBooleanState(false)

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
    if (tradeInput.isSubmitDisabled || !tradeInput.amountKrw) return

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
  }, [
    push,
    tradeInput.amountKrw,
    tradeInput.isSubmitDisabled,
    tradeInput.side,
    tradeInput.splitMode,
  ])

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

  /** AnimateNumber 마운트·레이아웃 후 replay (첫 프레임 최종값 플래시 방지) */
  const scheduleBalanceReplay = useCallback(
    (startCoin: number) => {
      setBalanceStartCoin(startCoin)

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          triggerBalanceReplay()
        })
      })
    },
    [triggerBalanceReplay],
  )

  const handlePtrRefresh = useCallback(async () => {
    const startCoin = viewModel.wallet.coinBalance
    await viewModel.refresh()
    scheduleBalanceReplay(startCoin)
  }, [scheduleBalanceReplay, viewModel])

  /** 거래 완료 후 Home 복귀 시 pending replay */
  useEffect(() => {
    if (!isActive) return

    const pending = consumePendingBalanceReplay()
    if (!pending) return

    scheduleBalanceReplay(pending.from)
  }, [isActive, scheduleBalanceReplay, viewModel.wallet.coinBalance])

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
    balanceStartCoin,
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
