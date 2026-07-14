import { HStack, VStack } from '@seed-design/react'
import { BottomActionButton } from '../../../shared/ui/BottomActionButton'

import type { MatchingCandidate } from '../matching/types'
import type { TradeDetailViewModel } from '../types'
import { TradeLegMatchingScreen } from './TradeLegMatchingScreen'
import { TradeRoomPanel } from './TradeRoomPanel'

interface TradeRoomScreenProps {
  trade: TradeDetailViewModel
  onContinueTrade?: () => void
  onGoHome: () => void
  onSelectMatchingCandidate?: (candidate: MatchingCandidate) => void
  onBrowseStore?: () => void
  onBrowseCommunity?: () => void
  onCopyAccount?: () => void
  onCopyFailed?: () => void
  onContactSupport?: () => void
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
  onBrowseStore,
  onBrowseCommunity,
  onCopyAccount,
  onCopyFailed,
  onContactSupport,
}: TradeRoomScreenProps) {
  if (trade.status === 'MATCHING') {
    return (
      <TradeLegMatchingScreen
        trade={trade}
        onSelectCandidate={onSelectMatchingCandidate}
        onBrowseStore={onBrowseStore}
        onBrowseCommunity={onBrowseCommunity}
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
          <BottomActionButton size="large" variant="brandSolid" onClick={onGoHome}>
            홈으로
          </BottomActionButton>
        </VStack>
      </VStack>
    )
  }

  const continueLabel = getContinueTradeLabel(trade)
  const isBuyerWaiting =
    trade.status === 'PAYMENT_REPORTED' && trade.role === 'BUYER'

  return (
    <VStack
      flexGrow
      minHeight="full"
      px="spacingX.globalGutter"
      pt="spacingY.navToTitle"
      pb="spacingY.screenBottom"
      gap="x6"
    >
      <TradeRoomPanel
        trade={trade}
        onAccountCopied={onCopyAccount}
        onCopyFailed={onCopyFailed}
      />
      {isBuyerWaiting && trade.sellerAccount && onCopyAccount && onContactSupport && (
        <VStack gap="x3" flexGrow justify="flex-end">
          <HStack gap="x2" width="full">
            <BottomActionButton
              size="large"
              variant="neutralWeak"
              flexGrow
              onClick={onCopyAccount}
            >
              계좌 다시 보기
            </BottomActionButton>
            <BottomActionButton
              size="large"
              variant="neutralOutline"
              flexGrow
              onClick={onContactSupport}
            >
              문의하기
            </BottomActionButton>
          </HStack>
        </VStack>
      )}
      {continueLabel && onContinueTrade && (
        <VStack gap="x3" flexGrow justify="flex-end">
          <BottomActionButton size="large" variant="brandSolid" onClick={onContinueTrade}>
            {continueLabel}
          </BottomActionButton>
        </VStack>
      )}
    </VStack>
  )
}
