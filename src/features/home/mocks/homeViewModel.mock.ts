import { getHomeWallet } from '../stores/homeWallet.store'
import type { HomeViewModel } from '../types'

/** @see docs/fixtures/scenarios.json */
export type MockScenarioKey =
  | 'default'
  | 'activeTrade'
  | 'splitSell'
  | 'splitMatching'
  | 'splitBindingNotify'
  | 'splitDispute'

/** 개발용 시나리오 전환 — scenarios.json 키와 동일 */
export const MOCK_SCENARIO: MockScenarioKey = 'default'

const BASE_MOCK: Omit<HomeViewModel, 'user' | 'wallet'> & {
  user: Omit<HomeViewModel['user'], 'isVerified'>
} = {
  user: {
    id: 'user-1',
    nickname: 'Brit유저',
  },
  unreadNotificationCount: 2,
  recentTrades: [],
}

const ACTIVE_TRADE_MOCK: HomeViewModel['activeTrade'] = {
  id: 'trade-active-1',
  role: 'BUYER',
  status: 'PAYMENT_REPORTED',
  amountKrw: 100_000,
  coinAmount: 100_000,
  updatedAt: new Date().toISOString(),
}

export function createHomeViewModel(isVerified: boolean): HomeViewModel {
  const wallet = getHomeWallet()

  if (MOCK_SCENARIO === 'activeTrade') {
    return {
      ...BASE_MOCK,
      wallet,
      activeTrade: ACTIVE_TRADE_MOCK,
      user: { ...BASE_MOCK.user, isVerified },
    }
  }

  return {
    ...BASE_MOCK,
    wallet,
    user: { ...BASE_MOCK.user, isVerified },
  }
}

export async function fetchHomeViewModel(isVerified: boolean): Promise<HomeViewModel> {
  await new Promise((resolve) => window.setTimeout(resolve, 600))
  return createHomeViewModel(isVerified)
}
