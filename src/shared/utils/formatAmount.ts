import { AMOUNT_UNIT_KRW, COIN_TO_KRW } from '../constants/money'

export function formatAmount(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`
}

export function formatAmountNumber(amount: number): string {
  return amount.toLocaleString('ko-KR')
}

export function parseAmountInput(value: string): string {
  return value.replace(/[^\d]/g, '')
}

/** 숫자 문자열을 천 단위 콤마 표시로 변환 */
export function formatAmountInputDisplay(digits: string): string {
  if (!digits) return ''
  return formatAmountNumber(Number(digits))
}

/** 커서 앞(또는 전체)에 있는 숫자 개수 */
export function countDigitsInAmountInput(value: string, endIndex = value.length): number {
  return parseAmountInput(value.slice(0, endIndex)).length
}

/**
 * 포맷된 금액 문자열에서 N번째 숫자 뒤 캐럿 위치.
 * digitIndex === 0 → 맨 앞, digitIndex >= 총 자릿수 → 맨 뒤
 */
export function caretIndexFromDigitCount(formatted: string, digitIndex: number): number {
  if (digitIndex <= 0) return 0

  let seen = 0
  for (let i = 0; i < formatted.length; i += 1) {
    if (/\d/.test(formatted[i]!)) {
      seen += 1
      if (seen === digitIndex) return i + 1
    }
  }

  return formatted.length
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
