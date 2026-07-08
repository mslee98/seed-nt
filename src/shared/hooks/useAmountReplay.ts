import { useCallback, useState } from 'react'

interface UseAmountReplayResult {
  replayKey: number
  triggerReplay: () => void
}

export function useAmountReplay(initialKey = 0): UseAmountReplayResult {
  const [replayKey, setReplayKey] = useState(initialKey)

  const triggerReplay = useCallback(() => {
    setReplayKey((prev) => prev + 1)
  }, [])

  return { replayKey, triggerReplay }
}

