import { useActivityParams, useFlow } from '@stackflow/react'
import { useCallback, useSyncExternalStore } from 'react'
import { useBooleanState } from 'react-simplikit'

import { useRequireAuth } from '../../auth/hooks/useRequireAuth'
import { getHomeWallet, subscribeHomeWallet } from '../../home/stores/homeWallet.store'
import {
  createTradeOrder,
  isSplitGroupInProgress,
  isTerminalStatus,
} from '../stores/tradeSession.store'
import { useActiveSplitGroup } from './useActiveSplitGroup'
import { useActiveTrade } from './useActiveTrade'
import { useTradeInputState } from './useTradeInputState'

/**
 * TradeCompose Activity orchestration.
 * 금액 입력·확인 후 Trade 방으로 replace합니다.
 */
export function useTradeComposeScreen() {
  const { side: initialSide } = useActivityParams<'TradeCompose'>()
  const { replace } = useFlow()
  const { requireAuth, authRequiredDialog } = useRequireAuth('trade')
  const activeTrade = useActiveTrade()
  const splitGroup = useActiveSplitGroup()

  const wallet = useSyncExternalStore(subscribeHomeWallet, getHomeWallet, getHomeWallet)
  const availableCoin = wallet.availableCoin

  const tradeInput = useTradeInputState({
    coinBalance: availableCoin,
    initialSide: initialSide === 'SELL' ? 'SELL' : 'BUY',
  })

  const [confirmOpen, openConfirm, closeConfirm] = useBooleanState(false)

  const hasBlockingTrade =
    isSplitGroupInProgress() ||
    (activeTrade !== null && !isTerminalStatus(activeTrade.status) && !splitGroup)

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
      replace('Trade', { splitGroupId: result.splitGroupId }, { animate: true })
      return
    }

    replace('Trade', { tradeId: result.trade.id }, { animate: true })
  }, [
    replace,
    tradeInput.amountKrw,
    tradeInput.isSubmitDisabled,
    tradeInput.side,
    tradeInput.splitMode,
  ])

  const handleConfirmOpenChange = useCallback(
    (open: boolean) => {
      if (open) openConfirm()
      else closeConfirm()
    },
    [closeConfirm, openConfirm],
  )

  return {
    authRequiredDialog,
    tradeInput,
    confirmOpen,
    hasBlockingTrade,
    handleSubmit,
    handleConfirmTrade,
    handleConfirmOpenChange,
  }
}
