import type { ActivityComponentType } from '@stackflow/react'
import { useActivityParams, useFlow } from '@stackflow/react'
import { useState } from 'react'
import { useLoading } from 'react-simplikit'
import { Text, VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'

import { ActivityScreenLayout } from '../app/layouts/ActivityScreenLayout'
import type { TradeSide } from '../features/home/types'
import { formatAmount, formatCoinUnit, krwToCoin } from '../features/home/utils/formatAmount'
import { createTradeOrder } from '../features/trade/stores/tradeSession.store'

const TradeConfirmActivity: ActivityComponentType<'TradeConfirm'> = () => {
  const { side, amountKrw, splitMode } = useActivityParams<'TradeConfirm'>()
  const { replace } = useFlow()
  const [loading, startLoading] = useLoading()
  const [error, setError] = useState<string | null>(null)

  const amount = Number(amountKrw)
  const tradeSide = side as TradeSide
  const coinAmount = krwToCoin(amount)

  const title =
    tradeSide === 'BUY'
      ? `${formatAmount(amount)} 구매할까요?`
      : `${formatAmount(amount)} 판매 등록할까요?`

  const coinLabel =
    tradeSide === 'BUY'
      ? `받을 코인 ${formatCoinUnit(coinAmount)}`
      : `판매할 코인 ${formatCoinUnit(coinAmount)}`

  const handleStartMatching = async () => {
    setError(null)

    try {
      await startLoading(
        createTradeOrder({ side: tradeSide, amountKrw: amount }).then(() => {
          replace('Home', {}, { animate: true })
        }),
      )
    } catch (err) {
      if (err instanceof Error && err.message === 'ACTIVE_TRADE_LIMIT') {
        setError('이미 진행 중인 거래가 있어요.')
      } else {
        setError('거래를 시작하지 못했어요. 다시 시도해 주세요.')
      }
    }
  }

  return (
    <ActivityScreenLayout
      title="거래 확인"
      appScreenProps={{ preventSwipeBack: true }}
      fixedBottom={
        <ActionButton
          size="large"
          variant="brandSolid"
          loading={loading}
          onClick={handleStartMatching}
        >
          매칭 시작하기
        </ActionButton>
      }
    >
      <VStack
        gap="spacingY.componentDefault"
        px="spacingX.globalGutter"
        pt="spacingY.navToTitle"
        pb="spacingY.screenBottom"
      >
        <Text textStyle="screenTitle" color="fg.neutral" className="tabular-nums">
          {title}
        </Text>
        <Text textStyle="t5Regular" color="fg.neutralMuted" className="tabular-nums">
          {coinLabel}
        </Text>
        {splitMode === 'AUTO' && tradeSide === 'SELL' && (
          <Text textStyle="t4Regular" color="fg.neutralSubtle">
            큰 금액은 여러 거래로 나눠 더 빨리 매칭할 수 있어요.
          </Text>
        )}
        {error && (
          <Text textStyle="t4Regular" color="fg.critical">
            {error}
          </Text>
        )}
      </VStack>
    </ActivityScreenLayout>
  )
}

export default TradeConfirmActivity
