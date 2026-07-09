import { useCallback, useState } from 'react'

interface UseAmountReplayResult {
  replayKey: number
  triggerReplay: () => void
}

/**
 * 금액 애니메이션 강제 재생용 replayKey를 관리합니다.
 *
 * @example
 * ```tsx
 * const { replayKey, triggerReplay } = useAmountReplay()
 * await refresh()
 * triggerReplay()
 * ```
 */
export function useAmountReplay(initialKey = 0): UseAmountReplayResult {
  const [replayKey, setReplayKey] = useState(initialKey)

  const triggerReplay = useCallback(() => {
    setReplayKey((prev) => prev + 1)
  }, [])

  return { replayKey, triggerReplay }
}

