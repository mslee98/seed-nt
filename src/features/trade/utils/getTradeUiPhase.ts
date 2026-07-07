import type { TradeStatus } from '../../home/types'

export type TradeUiPhase = 'idle' | 'matching_order' | 'trade_in_progress'

export function getTradeUiPhase(status: TradeStatus | undefined): TradeUiPhase {
  if (!status) return 'idle'
  if (status === 'MATCHING') return 'matching_order'
  if (status === 'PAYMENT_PENDING' || status === 'PAYMENT_REPORTED') {
    return 'trade_in_progress'
  }
  return 'idle'
}
