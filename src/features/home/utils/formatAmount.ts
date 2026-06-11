export function formatAmount(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`
}

export function formatAmountNumber(amount: number): string {
  return amount.toLocaleString('ko-KR')
}

export function krwToCoin(amountKrw: number): number {
  return Math.floor(amountKrw / 1_000)
}
