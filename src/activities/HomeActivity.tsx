import type { ActivityComponentType } from '@stackflow/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { VStack } from '@seed-design/react'
import { AppScreen, AppScreenContent } from 'seed-design/ui/app-screen'
import { useSnackbarAdapter } from 'seed-design/ui/snackbar'

import { ScreenLayout } from '../app/layouts/ScreenLayout'
import { useRequireAuth } from '../features/auth/hooks/useRequireAuth'
import { HomeBalanceCard } from '../features/home/components/HomeBalanceCard'
import { HomeHeader } from '../features/home/components/HomeHeader'
import { HomeSafetyBanner } from '../features/home/components/HomeSafetyBanner'
import { HomeTradeInput } from '../features/home/components/HomeTradeInput'
import { HomeTradeInputSummary } from '../features/home/components/HomeTradeInputSummary'
import { useHomeViewModel } from '../features/home/hooks/useHomeViewModel'
import { useTradeInputState } from '../features/home/hooks/useTradeInputState'
import {
  HomeMatchingDock,
  notifyTradeMatchedIfReady,
} from '../features/trade/components/HomeMatchingDock'
import { MatchingFeed } from '../features/trade/components/MatchingFeed'
import { SplitProgressBar } from '../features/trade/components/SplitProgressBar'
import { TradeConfirmBottomSheet } from '../features/trade/components/TradeConfirmBottomSheet'
import { TradePaymentBottomSheet } from '../features/trade/components/TradePaymentBottomSheet'
import { useActiveSplitGroup } from '../features/trade/hooks/useActiveSplitGroup'
import { useActiveTrade } from '../features/trade/hooks/useActiveTrade'
import { useMatchingSession } from '../features/trade/matching/hooks/useMatchingSession'
import {
  cancelTrade,
  createTradeOrder,
  getActiveTrade,
  isTerminalStatus,
  setOnTradeMatched,
} from '../features/trade/stores/tradeSession.store'
import { getTradeUiPhase } from '../features/trade/utils/getTradeUiPhase'
import { showSnackbar } from '../shared/utils/showSnackbar'

const DOCK_STATUSES = ['MATCHING', 'PAYMENT_PENDING', 'PAYMENT_REPORTED'] as const

function shouldShowTradeDock(status: string | undefined): boolean {
  return DOCK_STATUSES.includes(status as (typeof DOCK_STATUSES)[number])
}

const HomeActivity: ActivityComponentType<'Home'> = () => {
  const { requireAuth, authRequiredDialog } = useRequireAuth('trade')
  const snackbar = useSnackbarAdapter()
  const viewModel = useHomeViewModel()
  const activeTrade = useActiveTrade()
  const splitGroup = useActiveSplitGroup()
  const matchingSession = useMatchingSession()
  const tradeInput = useTradeInputState({ coinBalance: viewModel.wallet.coinBalance })

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const prevCompletedLegsRef = useRef(splitGroup?.completedLegs ?? 0)

  const hasBlockingTrade = activeTrade !== null && !isTerminalStatus(activeTrade.status)
  const showTradeDock = activeTrade !== null && shouldShowTradeDock(activeTrade.status)
  const tradeUiPhase = getTradeUiPhase(activeTrade?.status)
  const showMatchingFeed = tradeUiPhase === 'matching_order' && activeTrade !== null

  const headerActiveTrade = (() => {
    if (showTradeDock) return undefined
    if (activeTrade && !isTerminalStatus(activeTrade.status)) return activeTrade
    return viewModel.activeTrade
  })()

  const handleSubmit = () => {
    if (tradeInput.isSubmitDisabled || !tradeInput.amountKrw || hasBlockingTrade) return

    requireAuth(() => {
      setConfirmOpen(true)
    })
  }

  const handleConfirmTrade = useCallback(async () => {
    if (!tradeInput.amountKrw) return
    await createTradeOrder({
      side: tradeInput.side,
      amountKrw: tradeInput.amountKrw,
      splitMode: tradeInput.splitMode,
    })
  }, [tradeInput.amountKrw, tradeInput.side, tradeInput.splitMode])

  const handleOpenPayment = useCallback(() => {
    if (!activeTrade) return
    setPaymentOpen(true)
  }, [activeTrade])

  const handleCancelMatching = useCallback(async () => {
    if (!activeTrade) return
    try {
      await cancelTrade(activeTrade.id, activeTrade.version)
      showSnackbar(snackbar, '매칭을 취소했어요.')
    } catch {
      showSnackbar(snackbar, '취소하지 못했어요.')
    }
  }, [activeTrade, snackbar])

  useEffect(() => {
    setOnTradeMatched((tradeId) => {
      const trade = getActiveTrade()
      if (trade?.id === tradeId && trade.status === 'PAYMENT_PENDING') {
        notifyTradeMatchedIfReady(trade)
        showSnackbar(snackbar, '매칭이 완료됐어요. 거래를 이어해 주세요.')
      }
    })
    return () => setOnTradeMatched(null)
  }, [snackbar])

  useEffect(() => {
    const onOpenPayment = (event: Event) => {
      const tradeId = (event as CustomEvent<{ tradeId: string }>).detail?.tradeId
      const trade = getActiveTrade()
      if (tradeId && trade?.id === tradeId) {
        setPaymentOpen(true)
      }
    }
    window.addEventListener('brit:open-trade-payment', onOpenPayment)
    return () => {
      window.removeEventListener('brit:open-trade-payment', onOpenPayment)
    }
  }, [])

  useEffect(() => {
    if (
      activeTrade?.status === 'CANCELLED' ||
      activeTrade?.status === 'EXPIRED' ||
      !activeTrade
    ) {
      setPaymentOpen(false)
    }
  }, [activeTrade?.status, activeTrade?.id])

  useEffect(() => {
    if (!splitGroup) {
      prevCompletedLegsRef.current = 0
      return
    }

    const prev = prevCompletedLegsRef.current
    const next = splitGroup.completedLegs

    if (next > prev && next < splitGroup.totalLegs) {
      showSnackbar(snackbar, '1건 완료했어요. 다음 거래를 이어갈게요.')
    }

    prevCompletedLegsRef.current = next
  }, [splitGroup?.completedLegs, splitGroup?.totalLegs, snackbar])

  const splitContext =
    splitGroup && activeTrade?.splitLegIndex
      ? { legIndex: activeTrade.splitLegIndex, totalLegs: splitGroup.totalLegs }
      : undefined

  return (
    <>
      {authRequiredDialog}
      <AppScreen layerOffsetTop="safeArea" className="flex min-h-0 flex-1 flex-col">
        <ScreenLayout>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <AppScreenContent
              className="min-h-0 flex-1 overflow-y-auto"
              ptr
              onPtrReady={() => {}}
              onPtrRefresh={viewModel.refresh}
            >
              <VStack gap="x0">
                <HomeHeader
                  compact={showMatchingFeed}
                  activeTrade={headerActiveTrade}
                  unreadNotificationCount={viewModel.unreadNotificationCount}
                  onActiveTradeClick={handleOpenPayment}
                />
                <VStack
                  position="relative"
                  bleedTop="x6"
                  style={{
                    paddingBottom: showTradeDock
                      ? 'var(--seed-dimension-x4)'
                      : 'var(--home-body-bottom-padding)',
                  }}
                >
                  <VStack px="spacingX.globalGutter" gap="x4">
                    {showMatchingFeed && activeTrade && splitGroup && (
                      <SplitProgressBar
                        splitGroup={splitGroup}
                        activeTrade={activeTrade}
                        matchingPhase={matchingSession?.phase}
                      />
                    )}
                    {showMatchingFeed && activeTrade && (
                      <MatchingFeed trade={activeTrade} />
                    )}
                    <HomeBalanceCard
                      coinBalance={viewModel.wallet.coinBalance}
                      estimatedKrwValue={viewModel.wallet.estimatedKrwValue}
                    />
                    {showMatchingFeed && activeTrade ? (
                      <HomeTradeInputSummary
                        side={activeTrade.side}
                        amountKrw={activeTrade.amountKrw}
                      />
                    ) : (
                      <HomeTradeInput
                        side={tradeInput.side}
                        amountKrw={tradeInput.amountKrw}
                        amountInput={tradeInput.amountInput}
                        amountError={tradeInput.amountError}
                        helperText={
                          hasBlockingTrade
                            ? '진행 중인 거래가 끝나면 새 거래를 시작할 수 있어요.'
                            : tradeInput.helperText
                        }
                        isSubmitDisabled={tradeInput.isSubmitDisabled || hasBlockingTrade}
                        onSideChange={tradeInput.setSide}
                        onAmountInputChange={tradeInput.handleAmountInputChange}
                        onQuickAmountSelect={tradeInput.handleQuickAmountSelect}
                        onSubmit={handleSubmit}
                        onSplitModeClick={() =>
                          showSnackbar(snackbar, '분할 방식 설정은 준비 중이에요.')
                        }
                      />
                    )}
                  </VStack>
                  <VStack px="spacingX.globalGutter" pt="x6">
                    <HomeSafetyBanner />
                  </VStack>
                </VStack>
              </VStack>
            </AppScreenContent>

            {showTradeDock && activeTrade && (
              <HomeMatchingDock
                trade={activeTrade}
                compact={showMatchingFeed}
                splitContext={splitContext}
                onContinueTrade={handleOpenPayment}
                onCancel={activeTrade.status === 'MATCHING' ? handleCancelMatching : undefined}
              />
            )}
          </div>
        </ScreenLayout>
      </AppScreen>

      {tradeInput.amountKrw !== null && (
        <TradeConfirmBottomSheet
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          side={tradeInput.side}
          amountKrw={tradeInput.amountKrw}
          splitMode={tradeInput.splitMode}
          onConfirm={handleConfirmTrade}
        />
      )}

      {paymentOpen && activeTrade && (
        <TradePaymentBottomSheet
          open={paymentOpen}
          onOpenChange={setPaymentOpen}
          tradeId={activeTrade.id}
        />
      )}
    </>
  )
}

export default HomeActivity