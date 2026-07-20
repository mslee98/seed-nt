/**
 * TradeComposeActivity
 *
 * 책임: 거래 금액 입력·확인 JSX 조립
 * 비책임: 매칭·결제 UI (→ TradeActivity)
 */
import type { ActivityComponentType } from '@stackflow/react'
import { Text, VStack } from '@seed-design/react'

import { ActivityScreenLayout } from '../app/layouts/ActivityScreenLayout'
import { TradeComposeInput } from '../features/trade/components/TradeComposeInput'
import { TradeConfirmAlertDialog } from '../features/trade/components/TradeConfirmAlertDialog'
import { useTradeComposeScreen } from '../features/trade/hooks/useTradeComposeScreen'

const TradeComposeActivity: ActivityComponentType<'TradeCompose'> = () => {
  const screen = useTradeComposeScreen()
  const title = screen.tradeInput.side === 'BUY' ? '구매하기' : '판매하기'

  return (
    <>
      {screen.authRequiredDialog}
      <ActivityScreenLayout title={title}>
        <VStack px="spacingX.globalGutter" pt="x4" pb="x6" gap="x4">
          {screen.hasBlockingTrade && (
            <Text textStyle="t4Regular" color="fg.neutralMuted">
              진행 중인 거래가 끝나면 새 거래를 시작할 수 있어요.
            </Text>
          )}
          <TradeComposeInput
            side={screen.tradeInput.side}
            amountKrw={screen.tradeInput.amountKrw}
            amountInput={screen.tradeInput.amountInput}
            amountStartKrw={screen.tradeInput.amountStartKrw}
            amountReplayKey={screen.tradeInput.amountReplayKey}
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
      </ActivityScreenLayout>

      {screen.tradeInput.amountKrw !== null && (
        <TradeConfirmAlertDialog
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

export default TradeComposeActivity
