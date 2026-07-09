export const SPLIT_POLICY = {
  thresholdAmount: 1_000_000,
  recommendedUnit: 500_000,
  minSplitUnit: 100_000,
  maxSplitCount: 10,
} as const

export interface SplitRecommendation {
  unitAmount: number
  count: number
}

export function getSplitRecommendation(amount: number): SplitRecommendation | null {
  if (amount < SPLIT_POLICY.thresholdAmount) {
    return null
  }

  const count = Math.ceil(amount / SPLIT_POLICY.recommendedUnit)

  return {
    unitAmount: SPLIT_POLICY.recommendedUnit,
    count,
  }
}
