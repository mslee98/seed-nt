import { VStack } from '@seed-design/react'

import type { MatchingCandidate } from '../matching/types'
import type { TradeDetailViewModel } from '../types'
import { MatchingFeed } from './MatchingFeed'

interface TradeLegMatchingScreenProps {
  trade: TradeDetailViewModel
  onSelectCandidate?: (candidate: MatchingCandidate) => void
  onBrowseStore?: () => void
  onBrowseCommunity?: () => void
}

export function TradeLegMatchingScreen({
  trade,
  onSelectCandidate,
  onBrowseStore,
  onBrowseCommunity,
}: TradeLegMatchingScreenProps) {
  return (
    <VStack
      flexGrow
      minHeight="full"
      px="spacingX.globalGutter"
      pt="spacingY.navToTitle"
      gap="x6"
      style={{ minHeight: 0 }}
    >
      <MatchingFeed
        trade={trade}
        onSelectCandidate={onSelectCandidate}
        onBrowseStore={onBrowseStore}
        onBrowseCommunity={onBrowseCommunity}
      />
    </VStack>
  )
}
