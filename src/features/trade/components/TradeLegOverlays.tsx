import { MatchingAcceptBottomSheet } from './MatchingAcceptBottomSheet'
import { DisputePlaceholderBottomSheet } from './DisputePlaceholderBottomSheet'
import { TradePaymentBottomSheet } from './TradePaymentBottomSheet'
import type { MatchingCandidate } from '../matching/types'
import type { SplitLegViewModel } from '../types/splitDashboard'

interface TradeLegOverlaysProps {
  paymentSheetTradeId: string | null
  disputeSheetLeg: SplitLegViewModel | null
  acceptOpen: boolean
  acceptCandidate: MatchingCandidate | null
  onAcceptOpenChange: (open: boolean) => void
  onAcceptConfirm: (candidateId: string) => void | Promise<void>
  onAcceptSkip: (candidateId: string) => void
  onPaymentOpenChange: (open: boolean) => void
  onDisputeOpenChange: (open: boolean) => void
}

export function TradeLegOverlays({
  paymentSheetTradeId,
  disputeSheetLeg,
  acceptOpen,
  acceptCandidate,
  onAcceptOpenChange,
  onAcceptConfirm,
  onAcceptSkip,
  onPaymentOpenChange,
  onDisputeOpenChange,
}: TradeLegOverlaysProps) {
  return (
    <>
      <MatchingAcceptBottomSheet
        open={acceptOpen}
        onOpenChange={onAcceptOpenChange}
        candidate={acceptCandidate}
        onConfirm={onAcceptConfirm}
        onSkip={onAcceptSkip}
      />
      <TradePaymentBottomSheet
        open={paymentSheetTradeId !== null}
        onOpenChange={onPaymentOpenChange}
        tradeId={paymentSheetTradeId}
      />
      <DisputePlaceholderBottomSheet
        open={disputeSheetLeg !== null}
        onOpenChange={onDisputeOpenChange}
        legIndex={disputeSheetLeg?.index}
        amountKrw={disputeSheetLeg?.amountKrw}
      />
    </>
  )
}
