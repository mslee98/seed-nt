/**
 * 복구 후 민감 기능 쿨다운.
 * 서버 `sensitive_actions_locked_until`을 미러링해 클라이언트에서 선제 차단.
 */
const STORAGE_KEY = 'brit:sensitive-locked-until'

export function setSensitiveLockUntil(iso: string | null) {
  if (typeof window === 'undefined') return
  if (!iso) {
    window.localStorage.removeItem(STORAGE_KEY)
    return
  }
  window.localStorage.setItem(STORAGE_KEY, iso)
}

export function getSensitiveLockUntil(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(STORAGE_KEY)
}

export function isSensitiveActionLocked(now = Date.now()): boolean {
  const until = getSensitiveLockUntil()
  if (!until) return false
  const t = Date.parse(until)
  if (Number.isNaN(t)) return false
  return t > now
}

export function assertSensitiveActionAllowed(): void {
  if (isSensitiveActionLocked()) {
    const until = getSensitiveLockUntil()
    throw new Error(`SENSITIVE_LOCKED:${until ?? ''}`)
  }
}
