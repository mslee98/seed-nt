import { VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'

import type { MatchingCandidate } from '../matching/types'
import type { TradeDetailViewModel } from '../types'
import { TradeLegMatchingScreen } from './TradeLegMatchingScreen'
import { TradeRoomPanel } from './TradeRoomPanel'

interface TradeRoomScreenProps {
  trade: TradeDetailViewModel
  onContinueTrade?: () => void
  onGoHome: () => void
  onSelectMatchingCandidate?: (candidate: MatchingCandidate) => void
}

function getContinueTradeLabel(trade: TradeDetailViewModel): string | null {
  if (trade.status === 'PAYMENT_PENDING' && trade.role === 'BUYER') return '입금하기'
  if (trade.status === 'PAYMENT_REPORTED' && trade.role === 'SELLER') return '입금 확인하기'
  if (trade.status === 'DISPUTED') return '분쟁 안내 보기'
  return null
}

export function TradeRoomScreen({
  trade,
  onContinueTrade,
  onGoHome,
  onSelectMatchingCandidate,
}: TradeRoomScreenProps) {
  if (trade.status === 'MATCHING') {
    return (
      <TradeLegMatchingScreen
        trade={trade}
        onSelectCandidate={onSelectMatchingCandidate}
      />
    )
  }

  if (trade.status === 'COMPLETED') {
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
          <ActionButton size="large" variant="brandSolid" onClick={onGoHome}>
            홈으로
          </ActionButton>
        </VStack>
      </VStack>
    )
  }

  const continueLabel = getContinueTradeLabel(trade)

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
      {continueLabel && onContinueTrade && (
        <VStack gap="x3" flexGrow justify="flex-end">
          <ActionButton size="large" variant="brandSolid" onClick={onContinueTrade}>
            {continueLabel}
          </ActionButton>
        </VStack>
      )}
    </VStack>
  )
}
