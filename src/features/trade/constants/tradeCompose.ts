import { AMOUNT_UNIT_KRW } from '../../../shared/constants/money'

export const TRADE_LIMITS = {
  minAmount: AMOUNT_UNIT_KRW,
  maxAmount: 5_000_000,
} as const

export const QUICK_AMOUNTS = [10_000, 50_000, 100_000, 1_000_000] as const
