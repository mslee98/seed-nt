import { useActivity, useFlow } from '@stackflow/react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useAuthRequiredPrompt } from '../../auth/hooks/useAuthRequiredPrompt'
import { clearAttention } from '../../notifications/hooks/useNotifications'
import { useAmountReplay } from '../../../shared/hooks/useAmountReplay'
import { useActiveSplitGroup } from '../../trade/hooks/useActiveSplitGroup'
import { useActiveTrade } from '../../trade/hooks/useActiveTrade'
import { useMatchingSession } from '../../trade/matching/hooks/useMatchingSession'
import {
  isSplitGroupInProgress,
  isTerminalStatus,
} from '../../trade/stores/tradeSession.store'
import type { TradeSide } from '../../trade/types'
import { consumePendingBalanceReplay } from '../stores/homeWallet.store'
import type { HomeQuickActionId } from '../components/HomeQuickActions'
import { MOCK_HOME_TRADE_LISTS } from '../mocks/homeTradeLists.mock'
import {
  buildHomeTradeLists,
  type HomeTradeListItem,
} from '../utils/buildHomeTradeLists'
import { useHomeViewModel } from './useHomeViewModel'

/**
 * Home Activity orchestration.
 * 월렛·퀵액션·거래 리스트. 금액 입력은 TradeCompose에 위임합니다.
 *
 * @see docs/domains/trade.md
 */
export function useHomeScreen() {
  const { isActive } = useActivity()
  const { push } = useFlow()
  const { promptAuth, authRequiredDialog } = useAuthRequiredPrompt({
    onNavigateToSignup: () => push('SignupIdentity', {}),
  })
  const viewModel = useHomeViewModel()
  const activeTrade = useActiveTrade()
  const matchingSession = useMatchingSession()
  const splitGroup = useActiveSplitGroup()
  const { replayKey: balanceReplayKey, triggerReplay: triggerBalanceReplay } = useAmountReplay()
  const [balanceStartCoin, setBalanceStartCoin] = useState(0)

  const hasBlockingTrade =
    isSplitGroupInProgress() ||
    (activeTrade !== null && !isTerminalStatus(activeTrade.status) && !splitGroup)

  const { attentionItems, inProgressItems } = useMemo(() => {
    const live = buildHomeTradeLists({
      activeTrade,
      splitGroup: splitGroup && isSplitGroupInProgress() ? splitGroup : null,
      matchingSession,
      fallbackActiveTrade: viewModel.activeTrade,
    })

    // 진행 거래가 없으면 시안용 목업 리스트를 보여 줍니다 (테스트 UI).
    if (
      import.meta.env.DEV &&
      live.attentionItems.length === 0 &&
      live.inProgressItems.length === 0
    ) {
      return MOCK_HOME_TRADE_LISTS
    }

    return live
  }, [activeTrade, matchingSession, splitGroup, viewModel.activeTrade])

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
    const startCoin = viewModel.wallet.availableCoin
    await viewModel.refresh()
    scheduleBalanceReplay(startCoin)
  }, [scheduleBalanceReplay, viewModel])

  /** 거래 완료 후 Home 복귀 시 pending replay */
  useEffect(() => {
    if (!isActive) return

    const pending = consumePendingBalanceReplay()
    if (!pending) return

    // rAF로 레이아웃 이후 재생 — effect 내 동기 setState lint 회피
    const frame = requestAnimationFrame(() => {
      scheduleBalanceReplay(pending.from)
    })
    return () => cancelAnimationFrame(frame)
  }, [isActive, scheduleBalanceReplay, viewModel.wallet.availableCoin])

  const navigateCompose = useCallback(
    (side: TradeSide) => {
      promptAuth(() => {
        push('TradeCompose', { side }, { animate: true })
      }, 'trade')
    },
    [promptAuth, push],
  )

  const handleQuickAction = useCallback(
    (id: HomeQuickActionId) => {
      if (id === 'buy') {
        navigateCompose('BUY')
        return
      }
      if (id === 'sell') {
        navigateCompose('SELL')
        return
      }
      if (id === 'exchange') {
        promptAuth(() => {
          push('Detail', { id: 'transactions' }, { animate: true })
        }, 'transactions')
        return
      }
      promptAuth(() => {
        push('Detail', { id: 'profile' }, { animate: true })
      }, 'profile')
    },
    [navigateCompose, promptAuth, push],
  )

  const handleTradeListItemClick = useCallback(
    (item: HomeTradeListItem) => {
      // DEV 시안 목업 행은 거래 방이 없어 네비게이션하지 않습니다.
      if (item.id.startsWith('mock-')) return

      if (item.tradeId) {
        clearAttention(item.tradeId)
      }

      if (item.splitGroupId) {
        push('Trade', { splitGroupId: item.splitGroupId }, { animate: true })
        return
      }
      if (item.tradeId) {
        push('Trade', { tradeId: item.tradeId }, { animate: true })
      }
    },
    [push],
  )

  return {
    authRequiredDialog,
    viewModel,
    balanceReplayKey,
    balanceStartCoin,
    hasBlockingTrade,
    attentionItems,
    inProgressItems,
    handleQuickAction,
    handleTradeListItemClick,
    handlePtrRefresh,
  }
}
