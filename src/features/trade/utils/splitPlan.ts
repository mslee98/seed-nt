import {
  getSplitRecommendation,
  SPLIT_POLICY,
} from '../../home/utils/splitRecommendation'
import { isManwonUnitAmount } from '../../../shared/utils/formatAmount'

export interface SplitPlan {
  totalAmountKrw: number
  unitAmountKrw: number
  legAmounts: number[]
  legCount: number
}

/** AUTO — 추천 unit 기준 (100만↑) */
export function buildSplitPlan(amountKrw: number): SplitPlan | null {
  const recommendation = getSplitRecommendation(amountKrw)
  if (!recommendation) {
    return null
  }

  return buildSplitPlanWithUnit(amountKrw, recommendation.unitAmount)
}

/** CUSTOM — 사용자가 지정한 한 거래당 최소(단위) 금액 */
export function buildSplitPlanWithUnit(
  amountKrw: number,
  unitAmountKrw: number,
): SplitPlan | null {
  if (!isManwonUnitAmount(amountKrw) || !isManwonUnitAmount(unitAmountKrw)) {
    return null
  }
  if (unitAmountKrw < SPLIT_POLICY.minSplitUnit) {
    return null
  }
  if (unitAmountKrw > amountKrw) {
    return null
  }

  const fullLegs = Math.floor(amountKrw / unitAmountKrw)
  const remainder = amountKrw % unitAmountKrw
  const legAmounts = Array.from({ length: fullLegs }, () => unitAmountKrw)
  if (remainder > 0) {
    legAmounts.push(remainder)
  }

  if (legAmounts.length < 2 || legAmounts.length > SPLIT_POLICY.maxSplitCount) {
    return null
  }

  return {
    totalAmountKrw: amountKrw,
    unitAmountKrw,
    legAmounts,
    legCount: legAmounts.length,
  }
}
