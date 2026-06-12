import { useAuthStatus } from '../../auth/stores/authSession.store'
import type { HomeViewModel } from '../types'

/** 'default' | 'activeTrade' — 개발용 시나리오 전환 */
const MOCK_SCENARIO: 'default' | 'activeTrade' = 'default'

const BASE_MOCK: Omit<HomeViewModel, 'user'> & {
  user: Omit<HomeViewModel['user'], 'isVerified'>
} = {
  user: {
    id: 'user-1',
    nickname: 'Brit유저',
  },
  wallet: {
    coinBalance: 120,
    estimatedKrwValue: 120_000,
  },
  unreadNotificationCount: 2,
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
  const authStatus = useAuthStatus()
  const isVerified = authStatus === 'authenticated'

  if (MOCK_SCENARIO === 'activeTrade') {
    return {
      ...BASE_MOCK,
      activeTrade: ACTIVE_TRADE_MOCK,
      user: { ...BASE_MOCK.user, isVerified },
    }
  }

  return {
    ...BASE_MOCK,
    user: { ...BASE_MOCK.user, isVerified },
  }
}
