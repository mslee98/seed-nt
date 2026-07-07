import { VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'

import { TradeRoomPanel } from './TradeRoomPanel'
import type { TradeDetailViewModel } from '../types'

interface TradeRoomScreenProps {
  trade: TradeDetailViewModel
  onReportPayment: () => Promise<unknown>
  onConfirmPayment: () => Promise<unknown>
  onCancel: () => Promise<unknown>
  onGoHome: () => void
}

export function TradeRoomScreen({
  trade,
  onReportPayment,
  onConfirmPayment,
  onCancel,
  onGoHome,
}: TradeRoomScreenProps) {
  if (trade.status === 'COMPLETED') {
    return (
      <VStack
        flexGrow
        px="spacingX.globalGutter"
        pt="spacingY.navToTitle"
        pb="spacingY.screenBottom"
        gap="x6"
      >
        <TradeRoomPanel trade={trade} />
        <ActionButton size="large" variant="brandSolid" onClick={onGoHome}>
          홈으로
        </ActionButton>
      </VStack>
    )
  }

  return (
    <VStack
      flexGrow
      minHeight="full"
      px="spacingX.globalGutter"
      pt="spacingY.navToTitle"
      pb="spacingY.screenBottom"
      gap="x6"
    >
      <TradeRoomPanel trade={trade} />
      <VStack gap="x3" flexGrow justify="flex-end">
        {trade.actions.includes('REPORT_PAYMENT') && (
          <ActionButton size="large" variant="brandSolid" onClick={() => onReportPayment()}>
            입금했어요
          </ActionButton>
        )}
        {trade.actions.includes('CONFIRM_PAYMENT') && (
          <ActionButton size="large" variant="brandSolid" onClick={() => onConfirmPayment()}>
            입금 확인
          </ActionButton>
        )}
        {trade.actions.includes('CANCEL') && (
          <ActionButton size="medium" variant="neutralWeak" onClick={() => onCancel()}>
            거래 취소
          </ActionButton>
        )}
      </VStack>
    </VStack>
  )
}
