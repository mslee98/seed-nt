import type { HomeViewModel } from '../types'

/** 'default' | 'activeTrade' — 개발용 시나리오 전환 */
const MOCK_SCENARIO: 'default' | 'activeTrade' = 'default'

const BASE_MOCK: HomeViewModel = {
  user: {
    id: 'user-1',
    nickname: '누비유저',
    isVerified: true,
  },
  wallet: {
    coinBalance: 120,
    estimatedKrwValue: 120_000,
  },
  recentTrades: [],
}

const ACTIVE_TRADE_MOCK: HomeViewModel['activeTrade'] = {
  id: 'trade-active-1',
  role: 'BUYER',
  status: 'PAYMENT_REPORTED',
  amountKrw: 100_000,
  coinAmount: 100,
  updatedAt: new Date().toISOString(),
}

export function useHomeViewModel(): HomeViewModel {
  if (MOCK_SCENARIO === 'activeTrade') {
    return {
      ...BASE_MOCK,
      activeTrade: ACTIVE_TRADE_MOCK,
    }
  }

  return BASE_MOCK
}
