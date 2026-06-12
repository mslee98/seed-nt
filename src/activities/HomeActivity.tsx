import type { ActivityComponentType } from '@stackflow/react'
import { useFlow } from '@stackflow/react'
import { VStack } from '@seed-design/react'
import { AppScreen, AppScreenContent } from 'seed-design/ui/app-screen'

import { ScreenLayout } from '../app/layouts/ScreenLayout'
import { HomeBalanceCard } from '../features/home/components/HomeBalanceCard'
import { HomeHeader } from '../features/home/components/HomeHeader'
import { HomeSafetyBanner } from '../features/home/components/HomeSafetyBanner'
import { HomeTradeInput } from '../features/home/components/HomeTradeInput'
import { useRequireAuth } from '../features/auth/hooks/useRequireAuth'
import { useHomeViewModel } from '../features/home/hooks/useHomeViewModel'
import { useTradeInputState } from '../features/home/hooks/useTradeInputState'

const HomeActivity: ActivityComponentType<'Home'> = () => {
  const { push } = useFlow()
  const requireAuth = useRequireAuth()
  const viewModel = useHomeViewModel()
  const tradeInput = useTradeInputState({ coinBalance: viewModel.wallet.coinBalance })

  const handleSubmit = () => {
    if (tradeInput.isSubmitDisabled || !tradeInput.amountKrw) return

    requireAuth(() => {
      push('TradeConfirm', {
        side: tradeInput.side,
        amountKrw: String(tradeInput.amountKrw),
        splitMode: tradeInput.splitMode,
      })
    })
  }

  return (
    <AppScreen layerOffsetTop="safeArea">
      <ScreenLayout>
        <AppScreenContent>
          <HomeHeader
            activeTrade={viewModel.activeTrade}
            unreadNotificationCount={viewModel.unreadNotificationCount}
          />
          <VStack
            position="relative"
            bleedTop="x6"
            style={{ paddingBottom: 'var(--home-body-bottom-padding)' }}
          >
            <VStack px="spacingX.globalGutter" gap="x4">
              <HomeBalanceCard
                coinBalance={viewModel.wallet.coinBalance}
                estimatedKrwValue={viewModel.wallet.estimatedKrwValue}
              />
              <HomeTradeInput
                side={tradeInput.side}
                amountKrw={tradeInput.amountKrw}
                amountInput={tradeInput.amountInput}
                amountError={tradeInput.amountError}
                helperText={tradeInput.helperText}
                isSubmitDisabled={tradeInput.isSubmitDisabled}
                onSideChange={tradeInput.setSide}
                onAmountInputChange={tradeInput.handleAmountInputChange}
                onQuickAmountSelect={tradeInput.handleQuickAmountSelect}
                onSubmit={handleSubmit}
              />
            </VStack>
            <VStack px="spacingX.globalGutter" pt="x6">
              <HomeSafetyBanner />
            </VStack>
          </VStack>
        </AppScreenContent>
      </ScreenLayout>
    </AppScreen>
  )
}

export default HomeActivity
