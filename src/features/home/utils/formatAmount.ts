import { AMOUNT_UNIT_KRW, COIN_TO_KRW } from '../constants'

export function formatAmount(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`
}

export function formatAmountNumber(amount: number): string {
  return amount.toLocaleString('ko-KR')
}

export function parseAmountInput(value: string): string {
  return value.replace(/[^\d]/g, '')
}

export function formatAmountInputDisplay(digits: string): string {
  if (!digits) return ''
  return formatAmountNumber(Number(digits))
}

export function isManwonUnitAmount(amountKrw: number): boolean {
  return amountKrw > 0 && amountKrw % AMOUNT_UNIT_KRW === 0
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
