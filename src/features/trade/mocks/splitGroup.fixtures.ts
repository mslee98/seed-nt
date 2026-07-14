import scenarios from '../../../../docs/fixtures/scenarios.json'
import splitGroupAllMatching from '../../../../docs/fixtures/trades/split-group-all-matching.json'
import splitGroupBindingPending from '../../../../docs/fixtures/trades/split-group-binding-pending.json'
import splitGroupDisputed from '../../../../docs/fixtures/trades/split-group-disputed.json'
import splitGroupInProgress from '../../../../docs/fixtures/trades/split-group-in-progress.json'
import type { TradeSide } from '../types'
import type { MockScenarioKey } from '../../home/mocks/homeViewModel.mock'
import type { SplitGroup, TradeRecord } from '../types'
import type { SplitDashboardViewModel } from '../types/splitDashboard'
import { mapSplitGroupToDashboard } from '../utils/mapSplitDashboard'

type SplitFixture =
  | typeof splitGroupInProgress
  | typeof splitGroupAllMatching
  | typeof splitGroupDisputed
  | typeof splitGroupBindingPending

function resolveLegStoreStatus(fixtureStatus: string): SplitGroup['legs'][number]['status'] {
  if (fixtureStatus === 'COMPLETED') return 'COMPLETED'
  return 'ACTIVE'
}

function resolveTradeStatus(fixtureStatus: string): TradeRecord['status'] {
  switch (fixtureStatus) {
    case 'COMPLETED':
      return 'COMPLETED'
    case 'PAYMENT_REPORTED':
      return 'PAYMENT_REPORTED'
    case 'PAYMENT_PENDING':
      return 'PAYMENT_PENDING'
    case 'DISPUTED':
      return 'DISPUTED'
    default:
      return 'MATCHING'
  }
}

/** fixture → store SplitGroup (mock 전용) */
export function fixtureToSplitGroup(fixture: SplitFixture): SplitGroup {
  return {
    id: fixture.id,
    side: fixture.side as TradeSide,
    totalAmountKrw: fixture.totalAmountKrw,
    unitAmountKrw: fixture.unitAmountKrw,
    totalLegs: fixture.totalLegs,
    completedLegs: fixture.completedLegs,
    createdAt: fixture.createdAt,
    legs: fixture.legs.map((leg) => ({
      index: leg.index,
      tradeId: leg.tradeId ?? `mock-leg-${fixture.id}-${leg.index}`,
      amountKrw: leg.amountKrw,
      status: resolveLegStoreStatus(leg.status),
    })),
  }
}

export function buildMockTradesFromFixture(fixture: SplitFixture): Map<string, TradeRecord> {
  const splitGroup = fixtureToSplitGroup(fixture)
  const now = new Date().toISOString()
  const trades = new Map<string, TradeRecord>()

  for (const leg of splitGroup.legs) {
    const fixtureLeg = fixture.legs.find((item) => item.index === leg.index)
    trades.set(leg.tradeId, {
      id: leg.tradeId,
      side: splitGroup.side,
      role: splitGroup.side === 'BUY' ? 'BUYER' : 'SELLER',
      status: resolveTradeStatus(fixtureLeg?.status ?? 'MATCHING'),
      amountKrw: leg.amountKrw,
      coinAmount: leg.amountKrw,
      version: 1,
      matchingStartedAt: now,
      updatedAt: now,
      splitGroupId: splitGroup.id,
      splitLegIndex: leg.index,
      splitTotalLegs: splitGroup.totalLegs,
    })
  }

  return trades
}

export function getFixtureForScenario(scenario: MockScenarioKey): SplitFixture | null {
  switch (scenario) {
    case 'splitSell':
      return splitGroupInProgress
    case 'splitMatching':
      return splitGroupAllMatching
    case 'splitDispute':
      return splitGroupDisputed
    case 'splitBindingNotify':
      return splitGroupBindingPending
    default:
      return null
  }
}

export function getFixtureDashboardByScenario(
  scenario: MockScenarioKey,
): SplitDashboardViewModel | null {
  const fixture = getFixtureForScenario(scenario)
  if (!fixture) return null
  return mapSplitGroupToDashboard(fixtureToSplitGroup(fixture), buildMockTradesFromFixture(fixture))
}

export function getFixtureSplitGroupId(scenario: MockScenarioKey): string | null {
  return getFixtureForScenario(scenario)?.id ?? null
}

export function getScenarioActiveTradeId(scenario: MockScenarioKey): string | null {
  const meta = scenarios[scenario as keyof typeof scenarios]
  return meta?.activeTradeId ?? null
}
