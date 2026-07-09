import { formatAmountNumber } from '../../home/utils/formatAmount'

export function formatAmountDelta(
  requestedAmountKrw: number,
  candidateAmountKrw: number,
): string | null {
  const delta = requestedAmountKrw - candidateAmountKrw
  if (delta === 0) return null
  if (delta > 0) {
    return `내 요청보다 ${formatAmountNumber(delta)}원 낮아요`
  }
  return `내 요청보다 ${formatAmountNumber(-delta)}원 높아요`
}
