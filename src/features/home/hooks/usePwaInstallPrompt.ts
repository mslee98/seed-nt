import { useCallback, useState, useSyncExternalStore } from 'react'

import { recordInstallPromptDismissed } from '../utils/installBannerStorage'
import {
  clearDeferredPrompt,
  getDeferredPrompt,
  getPwaInstallPromptSnapshot,
  initPwaInstallPromptListener,
  subscribePwaInstallPrompt,
} from '../utils/pwaInstallPromptStore'

initPwaInstallPromptListener()

export type { BeforeInstallPromptEvent } from '../utils/pwaInstallPromptStore'

/**
 * 카카오엔터 A2HS(useA2HS) 패턴:
 * - beforeinstallprompt → deferredPrompt 저장(리렌더)
 * - installApp → deferredPrompt.prompt()
 * - clearPrompt → deferredPrompt 초기화
 */
export function usePwaInstallPrompt() {
  const { deferredPrompt, isInstalled } = useSyncExternalStore(
    subscribePwaInstallPrompt,
    getPwaInstallPromptSnapshot,
    () => ({ deferredPrompt: null, isInstalled: false }),
  )
  const [isPrompting, setIsPrompting] = useState(false)

  const installApp = useCallback(async () => {
    const prompt = getDeferredPrompt()
    if (!prompt || isPrompting || isInstalled) return

    setIsPrompting(true)

    try {
      await prompt.prompt()
      const { outcome } = await prompt.userChoice
      clearDeferredPrompt()

      if (outcome === 'dismissed') {
        recordInstallPromptDismissed()
      }
    } catch {
      clearDeferredPrompt()
    } finally {
      setIsPrompting(false)
    }
  }, [isInstalled, isPrompting])

  const clearPrompt = useCallback(() => {
    clearDeferredPrompt()
  }, [])

  return {
    deferredPrompt,
    installApp,
    clearPrompt,
    isInstalled,
    isPrompting,
  }
}
