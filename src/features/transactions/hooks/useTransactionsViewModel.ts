import { useCallback, useEffect, useState } from 'react'

import { MOCK_TRANSACTIONS } from '../mocks/transactions.mock'
import type { TransactionsViewModel } from '../types'

async function fetchTransactions(): Promise<TransactionsViewModel> {
  await new Promise((resolve) => window.setTimeout(resolve, 400))
  return { items: MOCK_TRANSACTIONS }
}

export function useTransactionsViewModel(): TransactionsViewModel & { refresh: () => Promise<void> } {
  const [data, setData] = useState<TransactionsViewModel>({ items: MOCK_TRANSACTIONS })

  useEffect(() => {
    void fetchTransactions().then(setData)
  }, [])

  const refresh = useCallback(async () => {
    const next = await fetchTransactions()
    setData(next)
  }, [])

  return { ...data, refresh }
}
