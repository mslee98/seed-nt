import type { TradeSide, TradeStatus } from '../../home/types'
import { formatAmount } from '../../home/utils/formatAmount'
import type { MatchingPhase } from '../matching/types'
import type { SplitGroup } from '../types'

export function formatSplitLegSuffix(legIndex: number, totalLegs: number): string {
  return ` (${legIndex}/${totalLegs})`
}

export function getSplitProgressLabel(input: {
  splitGroup: SplitGroup
  legIndex: number
  side: TradeSide
  tradeStatus: TradeStatus
  matchingPhase?: MatchingPhase | null
}): string {
  const { splitGroup, legIndex, side, tradeStatus, matchingPhase } = input
  const sideLabel = side === 'BUY' ? '구매' : '판매'
  const progress = `${legIndex}/${splitGroup.totalLegs}`

  if (matchingPhase === 'PENDING_APPROVAL') {
    return `${progress} · 상대 승인을 기다리고 있어요`
  }

  if (tradeStatus === 'PAYMENT_PENDING' || tradeStatus === 'PAYMENT_REPORTED') {
    return `${progress} · 입금 진행 중`
  }

  return `${formatAmount(splitGroup.totalAmountKrw)} ${sideLabel} · ${progress} 진행 중`
}
