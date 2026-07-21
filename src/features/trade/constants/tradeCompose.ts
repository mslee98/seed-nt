import { AMOUNT_UNIT_KRW } from '../../../shared/constants/money'

export const TRADE_LIMITS = {
  minAmount: AMOUNT_UNIT_KRW,
  maxAmount: 5_000_000,
} as const

export const QUICK_AMOUNTS = [10_000, 50_000, 100_000, 500_000, 1_000_000] as const

export const TRADE_COMPOSE_MATCHING_TIP = {
  BUY: '구매는 한 명의 판매자와 전체 금액으로 매칭돼요.',
  SELL: '판매는 조건에 맞는 구매자와 매칭돼요. 나눠서 팔 수도 있어요.',
} as const
