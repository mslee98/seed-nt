/**
 * HomeActivity
 *
 * 책임: 홈 화면 JSX 조립 (입력·잔액·확인 시트)
 * 비책임: 매칭·split 진행 UI (→ TradeActivity)
 *
 * @see docs/stackflow/README.md
 * @see docs/domains/trade.md
 */
import type { ActivityComponentType } from '@stackflow/react'
import { VStack } from '@seed-design/react'
import { AppScreen, AppScreenContent } from 'seed-design/ui/app-screen'

import { ScreenLayout } from '../app/layouts/ScreenLayout'
import { HomeBalanceCard } from '../features/home/components/HomeBalanceCard'
import { HomeHeader } from '../features/home/components/HomeHeader'
import { HomeSafetyBanner } from '../features/home/components/HomeSafetyBanner'
import { HomeTradeInput } from '../features/home/components/HomeTradeInput'
import { useHomeScreen } from '../features/home/hooks/useHomeScreen'
import { TradeConfirmBottomSheet } from '../features/trade/components/TradeConfirmBottomSheet'

const HomeActivity: ActivityComponentType<'Home'> = () => {
  const screen = useHomeScreen()

  return (
    <>
      {screen.authRequiredDialog}
      <AppScreen layerOffsetTop="safeArea" className="flex min-h-0 flex-1 flex-col">
        <ScreenLayout>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <AppScreenContent
              className="min-h-0 flex-1 overflow-y-auto"
              ptr
              onPtrReady={() => {}}
              onPtrRefresh={screen.handlePtrRefresh}
            >
              <VStack gap="x0">
                <HomeHeader
                  activeTrade={screen.headerActiveTrade}
                  activeTradeCopy={screen.headerActiveTradeCopy}
                  activeSplitGroup={screen.headerSplitGroup}
                  unreadNotificationCount={screen.viewModel.unreadNotificationCount}
                  needsAttention={screen.needsAttention}
                  onActiveTradeClick={screen.handleActiveTradeClick}
                />
                <VStack
                  position="relative"
                  bleedTop="x6"
                  style={{ paddingBottom: 'var(--home-body-bottom-padding)' }}
                >
                  <VStack px="spacingX.globalGutter" gap="x4">
                    <HomeBalanceCard
                      coinBalance={screen.viewModel.wallet.coinBalance}
                      startCoinBalance={0}
                      replayKey={screen.balanceReplayKey}
                    />
                    <HomeTradeInput
                      side={screen.tradeInput.side}
                      amountKrw={screen.tradeInput.amountKrw}
                      amountInput={screen.tradeInput.amountInput}
                      amountError={screen.tradeInput.amountError}
                      helperText={
                        screen.hasBlockingTrade
                          ? '진행 중인 거래가 끝나면 새 거래를 시작할 수 있어요.'
                          : screen.tradeInput.helperText
                      }
                      isSubmitDisabled={
                        screen.tradeInput.isSubmitDisabled || screen.hasBlockingTrade
                      }
                      showSplitSellToggle={screen.tradeInput.showSplitSellToggle}
                      splitSellEnabled={screen.tradeInput.splitSellEnabled}
                      splitRecommendation={screen.tradeInput.splitRecommendation}
                      onSideChange={screen.tradeInput.setSide}
                      onAmountInputChange={screen.tradeInput.handleAmountInputChange}
                      onQuickAmountSelect={screen.tradeInput.handleQuickAmountSelect}
                      onSplitSellEnabledChange={screen.tradeInput.setSplitSellEnabled}
                      onSubmit={screen.handleSubmit}
                    />
                  </VStack>
                  <VStack px="spacingX.globalGutter" pt="x6">
                    <HomeSafetyBanner />
                  </VStack>
                </VStack>
              </VStack>
            </AppScreenContent>
          </div>
        </ScreenLayout>
      </AppScreen>

      {screen.tradeInput.amountKrw !== null && (
        <TradeConfirmBottomSheet
          open={screen.confirmOpen}
          onOpenChange={screen.handleConfirmOpenChange}
          side={screen.tradeInput.side}
          amountKrw={screen.tradeInput.amountKrw}
          splitMode={screen.tradeInput.splitMode}
          onConfirm={screen.handleConfirmTrade}
        />
      )}
    </>
  )
}

export default HomeActivity
