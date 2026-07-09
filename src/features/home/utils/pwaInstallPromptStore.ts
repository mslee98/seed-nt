export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

let deferredPrompt: BeforeInstallPromptEvent | null = null
let installed = false
let initialized = false

let cachedDeferredPrompt: BeforeInstallPromptEvent | null = null
let cachedIsInstalled = false
let cachedSnapshot = { deferredPrompt: null as BeforeInstallPromptEvent | null, isInstalled: false }

const listeners = new Set<() => void>()

function emitChange() {
  listeners.forEach((listener) => listener())
}

export function isStandaloneDisplay(): boolean {
  if (typeof window === 'undefined') return false

  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

export function initPwaInstallPromptListener() {
  if (typeof window === 'undefined' || initialized) return
  initialized = true

  installed = isStandaloneDisplay()

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    deferredPrompt = event as BeforeInstallPromptEvent
    emitChange()
  })

  window.addEventListener('appinstalled', () => {
    installed = true
    deferredPrompt = null
    emitChange()
  })
}

export function subscribePwaInstallPrompt(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getPwaInstallPromptSnapshot() {
  const nextIsInstalled = installed || isStandaloneDisplay()

  if (deferredPrompt !== cachedDeferredPrompt || nextIsInstalled !== cachedIsInstalled) {
    cachedDeferredPrompt = deferredPrompt
    cachedIsInstalled = nextIsInstalled
    cachedSnapshot = { deferredPrompt, isInstalled: nextIsInstalled }
  }

  return cachedSnapshot
}

export function getDeferredPrompt() {
  return deferredPrompt
}

export function clearDeferredPrompt() {
  deferredPrompt = null
  emitChange()
}
