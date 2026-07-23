import { checkOctomoMessage } from '../api/octomo.api'

export const OCTOMO_SMS_POLL_DELAYS_MS = [2_000, 4_000, 8_000, 15_000, 30_000] as const
export const OCTOMO_QR_POLL_DELAYS_MS = [10_000, 15_000, 25_000, 40_000] as const

export interface StartOctomoPollingOptions {
  mobileNum: string
  text: string
  delaysMs: readonly number[]
  onVerified: () => void
  onTimeout: () => void
  onError?: (error: unknown) => void
  onCheckStart?: () => void
  onWaiting?: () => void
}

/**
 * 적응형 폴링. hidden이면 조회하지 않고, visible 복귀 시 1.5초 후 재개.
 * exists:true 또는 delays 소진 시 stop.
 */
export function startOctomoPolling({
  mobileNum,
  text,
  delaysMs,
  onVerified,
  onTimeout,
  onError,
  onCheckStart,
  onWaiting,
}: StartOctomoPollingOptions): () => void {
  let stopped = false
  let inFlight = false
  let delayIndex = 0
  let timerId: number | undefined

  const clearTimer = () => {
    if (timerId !== undefined) {
      window.clearTimeout(timerId)
      timerId = undefined
    }
  }

  const stop = () => {
    stopped = true
    clearTimer()
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  }

  const scheduleNext = (delayMs?: number) => {
    if (stopped || inFlight) return

    if (delayMs === undefined && delayIndex >= delaysMs.length) {
      stop()
      onTimeout()
      return
    }

    const nextDelay = delayMs ?? delaysMs[delayIndex++]
    clearTimer()

    timerId = window.setTimeout(() => {
      timerId = undefined
      void check()
    }, nextDelay)
  }

  const check = async () => {
    if (stopped || inFlight) return

    if (document.visibilityState !== 'visible') {
      return
    }

    inFlight = true
    onCheckStart?.()

    try {
      const result = await checkOctomoMessage({
        mobileNum,
        text,
        withinMinutes: 5,
      })

      if (result.exists) {
        stop()
        onVerified()
        return
      }

      onWaiting?.()
    } catch (error) {
      onError?.(error)
    } finally {
      inFlight = false
    }

    if (!stopped) {
      scheduleNext()
    }
  }

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      clearTimer()
      return
    }

    if (
      document.visibilityState === 'visible' &&
      !stopped &&
      !inFlight &&
      timerId === undefined
    ) {
      scheduleNext(1_500)
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)
  scheduleNext()

  return stop
}
