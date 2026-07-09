const STORAGE_KEY = 'nt-home-install-banner'

const DISMISS_MS = 7 * 24 * 60 * 60 * 1000
const PROMPT_DISMISS_MS = 24 * 60 * 60 * 1000

interface InstallBannerStorage {
  dismissedAt?: number
  promptDismissedAt?: number
}

function readStorage(): InstallBannerStorage {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as InstallBannerStorage
  } catch {
    return {}
  }
}

function writeStorage(data: InstallBannerStorage) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function isWithinWindow(timestamp: number | undefined, windowMs: number): boolean {
  if (!timestamp) return false
  return Date.now() - timestamp < windowMs
}

export function shouldShowInstallBanner(): boolean {
  const data = readStorage()
  if (isWithinWindow(data.dismissedAt, DISMISS_MS)) return false
  if (isWithinWindow(data.promptDismissedAt, PROMPT_DISMISS_MS)) return false
  return true
}

export function dismissInstallBanner() {
  const data = readStorage()
  writeStorage({ ...data, dismissedAt: Date.now() })
}

export function recordInstallPromptDismissed() {
  const data = readStorage()
  writeStorage({ ...data, promptDismissedAt: Date.now() })
}
