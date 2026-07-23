/**
 * useBanks
 *
 * 책임: 가입 은행 목록 로딩·재시도
 * 비책임: 선택 draft / 계좌 검증
 */
import { useCallback, useEffect, useState } from 'react'

import { fetchActiveBanks } from '../api/banks.api'
import type { Institution } from '../data/institutions'

export function useBanks() {
  const [banks, setBanks] = useState<Institution[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const next = await fetchActiveBanks()
      setBanks(next)
    } catch (err) {
      setBanks([])
      setError(err instanceof Error ? err.message : '은행 목록을 불러오지 못했어요')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return {
    banks,
    isLoading,
    error,
    reload: load,
  }
}
