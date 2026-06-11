import { createContext, useContext, useSyncExternalStore, type ReactNode } from 'react'

import { ACTIVITIES_WITH_BOTTOM_NAV } from '../../shared/constants/app-layout'
import { config } from '../../stackflow/config'

function matchRoute(route: string, pathname: string): boolean {
  if (route === '/') return pathname === '/'
  if (route === '/404') return pathname === '/404'

  const pattern = route.replace(/:([^/]+)/g, '[^/]+')
  return new RegExp(`^${pattern}$`).test(pathname)
}

function getActivityFromPathname(pathname: string): string | null {
  for (const activity of config.activities) {
    if (matchRoute(activity.route, pathname)) return activity.name
  }
  return null
}

function isBottomNavVisible(pathname: string): boolean {
  const activity = getActivityFromPathname(pathname)
  if (!activity) return false
  return (ACTIVITIES_WITH_BOTTOM_NAV as readonly string[]).includes(activity)
}

function subscribePathname(onStoreChange: () => void) {
  window.addEventListener('popstate', onStoreChange)

  const originalPushState = history.pushState.bind(history)
  const originalReplaceState = history.replaceState.bind(history)

  history.pushState = (...args) => {
    originalPushState(...args)
    onStoreChange()
  }
  history.replaceState = (...args) => {
    originalReplaceState(...args)
    onStoreChange()
  }

  return () => {
    window.removeEventListener('popstate', onStoreChange)
    history.pushState = originalPushState
    history.replaceState = originalReplaceState
  }
}

function getPathnameSnapshot() {
  return window.location.pathname
}

interface LayoutContextValue {
  bottomNavVisible: boolean
  pathname: string
}

const LayoutContext = createContext<LayoutContextValue>({
  bottomNavVisible: false,
  pathname: '/',
})

export function LayoutProvider({ children }: { children: ReactNode }) {
  const pathname = useSyncExternalStore(
    subscribePathname,
    getPathnameSnapshot,
    () => '/',
  )
  const bottomNavVisible = isBottomNavVisible(pathname)

  return (
    <LayoutContext.Provider value={{ bottomNavVisible, pathname }}>
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayout() {
  return useContext(LayoutContext)
}

export { getActivityFromPathname, isBottomNavVisible }
