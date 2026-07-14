import type { TradeSide, TradeStatus } from '../trade/types'

export interface TransactionItem {
  id: string
  type: TradeSide
  status: TradeStatus | 'COMPLETED' | 'CANCELLED' | 'EXPIRED'
  amountKrw: number
  coinAmount: number
  completedAt: string
}

export interface TransactionsViewModel {
  items: TransactionItem[]
}
