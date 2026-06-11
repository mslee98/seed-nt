import type { ActivityComponentType } from '@stackflow/react'
import { useActivityParams } from '@stackflow/react'
import { useState } from 'react'
import { Text, VStack } from '@seed-design/react'
import {
  AppBar,
  AppBarBackButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
} from 'seed-design/ui/app-bar'
import { AppScreen, AppScreenContent } from 'seed-design/ui/app-screen'
import { ActionButton } from 'seed-design/ui/action-button'

import { ScreenLayout } from '../app/layouts/ScreenLayout'
import { formatAmount, krwToCoin } from '../features/home/utils/formatAmount'
import type { TradeSide } from '../features/home/types'

const TradeConfirmActivity: ActivityComponentType<'TradeConfirm'> = () => {
  const { side, amountKrw, splitMode } = useActivityParams<'TradeConfirm'>()
  const [loading, setLoading] = useState(false)

  const amount = Number(amountKrw)
  const tradeSide = side as TradeSide
  const coinAmount = krwToCoin(amount)

  const title =
    tradeSide === 'BUY'
      ? `${formatAmount(amount)} 구매할까요?`
      : `${formatAmount(amount)} 판매 등록할까요?`

  const coinLabel =
    tradeSide === 'BUY'
      ? `받을 코인 ${coinAmount} MS`
      : `판매할 코인 ${coinAmount} MS`

  const handleStartMatching = () => {
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      window.alert('매칭을 시작했어요. (mock)')
    }, 1500)
  }

  return (
    <AppScreen>
      <ScreenLayout
        navigation={
          <AppBar>
            <AppBarLeft>
              <AppBarBackButton />
            </AppBarLeft>
            <AppBarMain title="거래 확인" />
            <AppBarRight />
          </AppBar>
        }
        fixedBottom={
          <VStack px="spacingX.globalGutter" py="x4">
            <ActionButton
              size="large"
              variant="brandSolid"
              loading={loading}
              onClick={handleStartMatching}
            >
              매칭 시작하기
            </ActionButton>
          </VStack>
        }
      >
        <AppScreenContent>
          <VStack
            minHeight="full"
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
          </VStack>
        </AppScreenContent>
      </ScreenLayout>
    </AppScreen>
  )
}

export default TradeConfirmActivity
