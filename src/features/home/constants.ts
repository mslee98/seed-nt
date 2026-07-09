/** 1 Coin = 1원 (1:1) */
export const COIN_TO_KRW = 1

/** @deprecated COIN_TO_KRW 사용 */
export const MS_TO_KRW = COIN_TO_KRW

export const TRADE_LIMITS = {
  minAmount: 10_000,
  maxAmount: 5_000_000,
} as const

export const QUICK_AMOUNTS = [10_000, 50_000, 100_000, 500_000, 1_000_000] as const
