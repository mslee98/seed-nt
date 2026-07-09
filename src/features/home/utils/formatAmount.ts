import { COIN_TO_KRW } from '../constants'

export function formatAmount(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`
}

export function formatAmountNumber(amount: number): string {
  return amount.toLocaleString('ko-KR')
}

export function krwToCoin(amountKrw: number): number {
  return Math.floor(amountKrw / COIN_TO_KRW)
}

export function formatCoinUnit(coinAmount: number): string {
  return `${formatAmountNumber(coinAmount)} Coin`
}

export function formatCoinAmount(amountKrw: number): string {
  return formatCoinUnit(krwToCoin(amountKrw))
}
