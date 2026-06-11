export type TradeSide = 'BUY' | 'SELL'

export type TradeStatus =
  | 'MATCHING'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_REPORTED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'EXPIRED'

export type SplitMode = 'AUTO' | 'CUSTOM' | 'NONE'

export interface HomeViewModel {
  user: {
    id: string
    nickname: string
    isVerified: boolean
  }
  wallet: {
    coinBalance: number
    estimatedKrwValue: number
  }
  activeTrade?: {
    id: string
    role: 'BUYER' | 'SELLER'
    status: TradeStatus
    amountKrw: number
    coinAmount: number
    updatedAt: string
  }
  recentTrades: Array<{
    id: string
    type: TradeSide
    status: 'COMPLETED' | 'CANCELLED' | 'EXPIRED'
    amountKrw: number
    coinAmount: number
    completedAt: string
  }>
}

export interface TradeInputState {
  side: TradeSide
  amountKrw: number | null
  splitMode: SplitMode
  customSplitAmount?: number
}
