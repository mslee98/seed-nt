/**
 * Split group helpers for trade session.
 */
import type { CreateTradeOrderInput, CreateTradeOrderResult, SplitGroup, SplitLeg } from '../types'
import type { SplitPlan } from '../utils/splitPlan'
import {
  activeSplitGroup,
  createTradeRecord,
  generateTradeId,
  notify,
  setActiveSplitGroup,
  setActiveTrade,
  tradesById,
} from './tradeSession.state'

export function markSplitLegStatus(tradeId: string, status: SplitLeg['status']) {
  if (!activeSplitGroup) return

  setActiveSplitGroup({
    ...activeSplitGroup,
    legs: activeSplitGroup.legs.map((leg) =>
      leg.tradeId === tradeId ? { ...leg, status } : leg,
    ),
  })
}

export function advanceSplitAfterLegComplete(completedTradeId: string) {
  if (!activeSplitGroup) return

  markSplitLegStatus(completedTradeId, 'COMPLETED')
  const nextGroup: SplitGroup = {
    ...activeSplitGroup!,
    completedLegs: activeSplitGroup!.completedLegs + 1,
  }
  setActiveSplitGroup(nextGroup)

  const allDone = nextGroup.completedLegs >= nextGroup.totalLegs
  if (allDone) {
    setActiveSplitGroup(null)
    setActiveTrade(null)
    notify()
    return
  }

  const nextActive = nextGroup.legs.find(
    (leg) => leg.status === 'ACTIVE' && leg.tradeId !== completedTradeId,
  )
  if (nextActive) {
    const trade = tradesById.get(nextActive.tradeId)
    if (trade && trade.status === 'MATCHING') {
      setActiveTrade(trade)
    }
  }

  notify()
}

export function clearSplitGroup() {
  setActiveSplitGroup(null)
}

export function isSplitGroupInProgress(): boolean {
  return (
    activeSplitGroup !== null && activeSplitGroup.completedLegs < activeSplitGroup.totalLegs
  )
}

export function getSplitGroupById(id: string): SplitGroup | null {
  if (activeSplitGroup?.id === id) return activeSplitGroup
  return null
}

export async function createSplitTradeOrder(
  input: CreateTradeOrderInput,
  plan: SplitPlan,
): Promise<CreateTradeOrderResult> {
  const now = new Date().toISOString()
  const splitId = `split-${Date.now()}`
  const legs: SplitLeg[] = plan.legAmounts.map((amountKrw, index) => ({
    index: index + 1,
    tradeId: generateTradeId(),
    amountKrw,
    status: 'ACTIVE',
  }))

  setActiveSplitGroup({
    id: splitId,
    side: input.side,
    totalAmountKrw: plan.totalAmountKrw,
    unitAmountKrw: plan.unitAmountKrw,
    totalLegs: plan.legCount,
    completedLegs: 0,
    legs,
    createdAt: now,
  })

  const createdTrades = legs.map((leg) => {
    const trade = createTradeRecord({
      id: leg.tradeId,
      side: input.side,
      amountKrw: leg.amountKrw,
      now,
      splitGroupId: splitId,
      splitLegIndex: leg.index,
      splitTotalLegs: plan.legCount,
    })
    tradesById.set(trade.id, trade)
    return trade
  })

  const firstTrade = createdTrades[0]
  setActiveTrade(firstTrade)
  notify()

  return { trade: firstTrade, splitGroupId: splitId }
}
