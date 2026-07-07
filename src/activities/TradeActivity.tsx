import type { ActivityComponentType } from '@stackflow/react'
import { useActivityParams, useFlow } from '@stackflow/react'
import { Text, VStack } from '@seed-design/react'

import { ActivityScreenLayout } from '../app/layouts/ActivityScreenLayout'
import { TradeRoomScreen } from '../features/trade/components/TradeRoomScreen'
import { useTradeDetail } from '../features/trade/hooks/useTradeDetail'

const TradeActivity: ActivityComponentType<'Trade'> = () => {
  const { tradeId } = useActivityParams<'Trade'>()
  const { replace } = useFlow()
  const { trade, reportPayment, confirmPayment, cancelTrade } = useTradeDetail(tradeId)

  if (!trade) {
    return (
      <ActivityScreenLayout title="거래">
        <VStack
          px="spacingX.globalGutter"
          pt="spacingY.navToTitle"
          gap="spacingY.betweenText"
        >
          <Text textStyle="screenTitle" color="fg.neutral">
            거래를 찾을 수 없어요
          </Text>
        </VStack>
      </ActivityScreenLayout>
    )
  }

  const preventSwipeBack =
    trade.status !== 'COMPLETED' &&
    trade.status !== 'CANCELLED' &&
    trade.status !== 'EXPIRED'

  return (
    <ActivityScreenLayout
      title="거래"
      appScreenProps={{ preventSwipeBack }}
    >
      <TradeRoomScreen
        trade={trade}
        onReportPayment={reportPayment}
        onConfirmPayment={confirmPayment}
        onCancel={cancelTrade}
        onGoHome={() => replace('Home', {}, { animate: true })}
      />
    </ActivityScreenLayout>
  )
}

export default TradeActivity
