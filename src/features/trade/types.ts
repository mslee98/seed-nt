import type { SplitMode, TradeSide, TradeStatus } from '../home/types'

export type TradeRole = 'BUYER' | 'SELLER'

export type TradeAction = 'REPORT_PAYMENT' | 'CONFIRM_PAYMENT' | 'CANCEL' | 'CONTINUE'

export type SplitLegStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'

export interface SplitLeg {
  index: number
  tradeId: string
  amountKrw: number
  status: SplitLegStatus
}

export interface SplitGroup {
  id: string
  side: TradeSide
  totalAmountKrw: number
  unitAmountKrw: number
  totalLegs: number
  completedLegs: number
  legs: SplitLeg[]
  createdAt: string
}

export interface TradeRecord {
  id: string
  side: TradeSide
  role: TradeRole
  status: TradeStatus
  amountKrw: number
  coinAmount: number
  version: number
  matchingStartedAt: string
  updatedAt: string
  paymentDeadline?: string
  reportedAt?: string
  completedAt?: string
  splitGroupId?: string
  splitLegIndex?: number
  splitTotalLegs?: number
}

export interface TradeDetailViewModel extends TradeRecord {
  actions: TradeAction[]
  counterpartyNickname: string
  sellerAccount?: {
    bankName: string
    accountNumber: string
    accountNumberMasked: string
    holderName: string
  }
}

export interface CreateTradeOrderInput {
  side: TradeSide
  amountKrw: number
  splitMode?: SplitMode
}
