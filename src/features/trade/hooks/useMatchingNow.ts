import { useEffect, useState } from 'react'

/** 매칭 탐색/대기 타이머용 1초 틱 */
export function useMatchingNow(enabled = true): number {
  const [nowMs, setNowMs] = useState(() => Date.now())

  useEffect(() => {
    if (!enabled) return

    const tick = () => setNowMs(Date.now())
    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [enabled])

  return nowMs
}
