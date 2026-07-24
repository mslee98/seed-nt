export interface PendingOctomoVerification {
  phone: string
  message: string
  startedAt: number
}

const STORAGE_KEY = 'brit:pending-octomo'
const MAX_AGE_MS = 10 * 60 * 1000

export function savePendingOctomo(data: PendingOctomoVerification): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // private mode / quota — ignore
  }
}

export function getPendingOctomo(): PendingOctomoVerification | null {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (!stored) return null

    const parsed = JSON.parse(stored) as PendingOctomoVerification
    if (!parsed?.phone || !parsed?.message || typeof parsed.startedAt !== 'number') {
      sessionStorage.removeItem(STORAGE_KEY)
      return null
    }

    if (Date.now() - parsed.startedAt > MAX_AGE_MS) {
      sessionStorage.removeItem(STORAGE_KEY)
      return null
    }

    return parsed
  } catch {
    sessionStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function clearPendingOctomo(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
