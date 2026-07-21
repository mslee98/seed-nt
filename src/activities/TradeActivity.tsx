import type { ActivityComponentType } from '@stackflow/react'
import { Text, VStack } from '@seed-design/react'

import { ActivityScreenLayout } from '../app/layouts/ActivityScreenLayout'
import { SplitTradeDashboard } from '../features/trade/components/SplitTradeDashboard'
import { TradeLegOverlays } from '../features/trade/components/TradeLegOverlays'
import { TradeRoomScreen } from '../features/trade/components/TradeRoomScreen'
import { useTradeDetail } from '../features/trade/hooks/useTradeDetail'
import { useTradeScreen } from '../features/trade/hooks/useTradeScreen'

/**
 * TradeActivity — split 대시보드 + leg micro-flow 시트, 또는 단건 leg 상세.
 *
 * @see docs/architecture/trade-platform-summary.md
 */
const TradeActivity: ActivityComponentType<'Trade'> = () => {
  const screen = useTradeScreen()
  const singleTradeId = screen.tradeId ?? ''
  const singleTrade = useTradeDetail(singleTradeId)

  const overlays = (
    <TradeLegOverlays
      paymentSheetTradeId={screen.paymentSheetTradeId}
      disputeSheetLeg={screen.disputeSheetLeg}
      acceptOpen={screen.acceptOpen}
      acceptCandidate={screen.acceptCandidate}
      onAcceptOpenChange={screen.onAcceptOpenChange}
      onAcceptConfirm={screen.onAcceptConfirm}
      onAcceptSkip={screen.onAcceptSkip}
      onPaymentOpenChange={(open) => {
        if (!open) screen.closePaymentSheet()
      }}
      onDisputeOpenChange={(open) => {
        if (!open) screen.closeDisputeSheet()
      }}
    />
  )

  if (screen.dashboard && !screen.tradeId) {
    return (
      <>
        {overlays}
        <ActivityScreenLayout title="거래">
          <SplitTradeDashboard
            dashboard={screen.dashboard}
            onLegPrimaryAction={screen.handleLegPrimaryAction}
            onStoreClick={screen.handleBrowseStore}
            onCommunityClick={screen.handleBrowseCommunity}
          />
        </ActivityScreenLayout>
      </>
    )
  }

  if (screen.tradeId && singleTrade.trade) {
    const trade = singleTrade.trade
    const preventSwipeBack =
      trade.status !== 'COMPLETED' &&
      trade.status !== 'CANCELLED' &&
      trade.status !== 'EXPIRED'

    return (
      <>
        {overlays}
        <ActivityScreenLayout
          title={
            trade.status === 'MATCHING'
              ? '매칭 중'
              : trade.status === 'PAYMENT_REPORTED' && trade.role === 'BUYER'
                ? '거래 진행'
                : '거래'
          }
          appScreenProps={{ preventSwipeBack }}
        >
          <TradeRoomScreen
            trade={trade}
            onContinueTrade={screen.handleSingleTradeContinue}
            onGoHome={screen.handleGoHome}
            onSelectMatchingCandidate={screen.openAcceptForCandidate}
            onChangeMatchingConditions={screen.handleChangeMatchingConditions}
            onStopMatching={screen.handleStopMatching}
            onBrowseStore={screen.handleBrowseStore}
            onBrowseCommunity={screen.handleBrowseCommunity}
            onCopyAccount={screen.handleCopyAccount}
            onCopyFailed={screen.handleCopyAccountFailed}
            onContactSupport={screen.handleContactSupport}
            onOpenDispute={screen.handleOpenBuyerDispute}
          />
        </ActivityScreenLayout>
      </>
    )
  }

  return (
    <>
      {overlays}
      <ActivityScreenLayout title="거래">
        <VStack
          px="spacingX.globalGutter"
          pt="spacingY.navToTitle"
          gap="spacingY.betweenText"
        >
          <Text textStyle="t7Bold" color="fg.neutral">
            거래를 찾을 수 없어요
          </Text>
        </VStack>
      </ActivityScreenLayout>
    </>
  )
}

export default TradeActivity
