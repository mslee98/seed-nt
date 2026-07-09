import { MOCK_SCENARIO } from '../../home/mocks/homeViewModel.mock'
import { hydrateTradeMockSession } from '../stores/tradeSession.store'
import {
  buildMockTradesFromFixture,
  fixtureToSplitGroup,
  getFixtureForScenario,
  getScenarioActiveTradeId,
} from './splitGroup.fixtures'

/**
 * DEV — scenarios.json + MOCK_SCENARIO 키로 trade session을 미리 채웁니다.
 * @see docs/fixtures/scenarios.json
 */
export function initTradeMockScenario(): void {
  if (!import.meta.env.DEV) return

  const fixture = getFixtureForScenario(MOCK_SCENARIO)
  if (!fixture) return

  hydrateTradeMockSession({
    splitGroup: fixtureToSplitGroup(fixture),
    trades: buildMockTradesFromFixture(fixture),
    activeTradeId: getScenarioActiveTradeId(MOCK_SCENARIO),
  })
}
