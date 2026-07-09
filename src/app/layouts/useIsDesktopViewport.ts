import { useSyncExternalStore } from 'react'

const DESKTOP_MEDIA_QUERY = '(min-width: 1024px)'

function subscribeDesktopViewport(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY)
  mediaQuery.addEventListener('change', onStoreChange)
  return () => mediaQuery.removeEventListener('change', onStoreChange)
}

function getDesktopViewportSnapshot() {
  return window.matchMedia(DESKTOP_MEDIA_QUERY).matches
}

export function useIsDesktopViewport() {
  return useSyncExternalStore(
    subscribeDesktopViewport,
    getDesktopViewportSnapshot,
    () => false,
  )
}
