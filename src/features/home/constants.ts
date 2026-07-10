/** 1 Coin = 1원 (1:1) */
export const COIN_TO_KRW = 1

/** @deprecated COIN_TO_KRW 사용 */
export const MS_TO_KRW = COIN_TO_KRW

/** 거래 금액 입력·검증 단위 (1만 원) */
export const AMOUNT_UNIT_KRW = 10_000 as const

export const TRADE_LIMITS = {
  minAmount: AMOUNT_UNIT_KRW,
  maxAmount: 5_000_000,
} as const

export const QUICK_AMOUNTS = [10_000, 50_000, 100_000, 1_000_000] as const
