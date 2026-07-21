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
import { TRADE_COMPOSE_TYPOGRAPHY } from '../features/trade/constants/tradeComposeTypography'
import { useTradeComposeScreen } from '../features/trade/hooks/useTradeComposeScreen'
import { BottomActionButton } from '../shared/ui/BottomActionButton'

const TradeComposeActivity: ActivityComponentType<'TradeCompose'> = () => {
  const screen = useTradeComposeScreen()
  const isSubmitDisabled =
    screen.tradeInput.isSubmitDisabled || screen.hasBlockingTrade

  return (
    <>
      {screen.authRequiredDialog}
      <ActivityScreenLayout
        title="구매/판매"
        bottomCTABehavior="keyboardAdaptive"
        fixedBottom={
          <BottomActionButton
            size="large"
            variant="brandSolid"
            disabled={isSubmitDisabled}
            onClick={screen.handleSubmit}
          >
            다음
          </BottomActionButton>
        }
      >
        <VStack
          px="spacingX.globalGutter"
          pt="x4"
          pb="x2"
          gap="x4"
          flexGrow
          minHeight="full"
        >
          {screen.hasBlockingTrade && (
            <Text textStyle={TRADE_COMPOSE_TYPOGRAPHY.notice} color="fg.neutralMuted">
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
            sellMethod={screen.tradeInput.sellMethod}
            minUnitInput={screen.tradeInput.minUnitInput}
            minUnitError={screen.tradeInput.minUnitError}
            onSideChange={screen.tradeInput.setSide}
            onAmountInputChange={screen.tradeInput.handleAmountInputChange}
            onQuickAmountSelect={screen.tradeInput.handleQuickAmountSelect}
            onSellMethodChange={screen.tradeInput.handleSellMethodChange}
            onMinUnitInputChange={screen.tradeInput.handleMinUnitInputChange}
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
          unitAmountKrw={screen.tradeInput.unitAmountKrw}
          onConfirm={screen.handleConfirmTrade}
        />
      )}
    </>
  )
}

export default TradeComposeActivity
