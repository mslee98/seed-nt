import { getSplitRecommendation } from '../../home/utils/splitRecommendation'

export interface SplitPlan {
  totalAmountKrw: number
  unitAmountKrw: number
  legAmounts: number[]
  legCount: number
}

export function buildSplitPlan(amountKrw: number): SplitPlan | null {
  const recommendation = getSplitRecommendation(amountKrw)
  if (!recommendation) {
    return null
  }

  const legAmounts = Array.from({ length: recommendation.count }, () => recommendation.unitAmount)

  return {
    totalAmountKrw: amountKrw,
    unitAmountKrw: recommendation.unitAmount,
    legAmounts,
    legCount: recommendation.count,
  }
}
