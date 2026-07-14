import type { SplitMode, TradeSide, TradeStatus } from '../trade/types'

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
  unreadNotificationCount: number
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
