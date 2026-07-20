/**
 * HomeActivity
 *
 * 책임: 홈 대시보드 JSX 조립 (월렛·퀵액션·거래 리스트)
 * 비책임: 금액 입력 (→ TradeCompose), 매칭·결제 UI (→ Trade)
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
import { HomeQuickActions } from '../features/home/components/HomeQuickActions'
import { HomeSafetyBanner } from '../features/home/components/HomeSafetyBanner'
import { HomeTradeLists } from '../features/home/components/HomeTradeLists'
import { HOME_COMPACT } from '../features/home/constants/homeCompact'
import { useHomeScreen } from '../features/home/hooks/useHomeScreen'

const HomeActivity: ActivityComponentType<'Home'> = () => {
  const screen = useHomeScreen()
  const { wallet } = screen.viewModel

  return (
    <>
      {screen.authRequiredDialog}
      <AppScreen layerOffsetTop="safeArea" className="flex min-h-0 flex-1 flex-col">
        <ScreenLayout background="default">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <AppScreenContent
              className="min-h-0 flex-1 overflow-y-auto"
              ptr
              onPtrReady={() => {}}
              onPtrRefresh={screen.handlePtrRefresh}
            >
              <VStack gap="x0">
                <HomeHeader
                  unreadNotificationCount={screen.viewModel.unreadNotificationCount}
                />
                <VStack
                  style={{ paddingBottom: 'var(--home-body-bottom-padding)' }}
                >
                  <VStack px="spacingX.globalGutter" gap="x0">
                    <VStack gap="x3">
                      <HomeBalanceCard
                        availableCoin={wallet.availableCoin}
                        coinBalance={wallet.coinBalance}
                        escrowCoin={wallet.escrowCoin}
                        startCoinBalance={screen.balanceStartCoin}
                        replayKey={screen.balanceReplayKey}
                        balanceAnimated={screen.balanceReplayKey > 0}
                      />
                      <HomeQuickActions
                        disabledTrade={screen.hasBlockingTrade}
                        onAction={screen.handleQuickAction}
                      />
                    </VStack>
                    <VStack pt={HOME_COMPACT.layout.quickToSectionPt}>
                      <HomeTradeLists
                        attentionItems={screen.attentionItems}
                        inProgressItems={screen.inProgressItems}
                        onItemClick={screen.handleTradeListItemClick}
                      />
                    </VStack>
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
    </>
  )
}

export default HomeActivity
