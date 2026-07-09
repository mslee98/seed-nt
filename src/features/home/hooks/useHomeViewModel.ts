import { useCallback, useEffect, useState } from 'react'
import { useSyncExternalStore } from 'react'

import { useAuthStatus } from '../../auth/stores/authSession.store'
import { createHomeViewModel, fetchHomeViewModel } from '../mocks/homeViewModel.mock'
import { getHomeWallet, subscribeHomeWallet } from '../stores/homeWallet.store'
import type { HomeViewModel } from '../types'

export function useHomeViewModel(): HomeViewModel & {
  refresh: () => Promise<void>
} {
  const authStatus = useAuthStatus()
  const isVerified = authStatus === 'authenticated'
  const [data, setData] = useState(() => createHomeViewModel(isVerified))

  const wallet = useSyncExternalStore(subscribeHomeWallet, getHomeWallet, () => ({
    coinBalance: 2_000_000,
    estimatedKrwValue: 2_000_000,
  }))

  useEffect(() => {
    setData(createHomeViewModel(isVerified))
  }, [isVerified])

  const refresh = useCallback(async () => {
    const next = await fetchHomeViewModel(isVerified)
    setData(next)
  }, [isVerified])

  return { ...data, wallet, refresh }
}
