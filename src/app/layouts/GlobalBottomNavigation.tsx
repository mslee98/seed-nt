import {
  IconHouseLine,
  IconPersonCircleLine,
  IconReceiptLine,
} from '@karrotmarket/react-monochrome-icon'

import {
  BottomNavigation,
  BottomNavigationItem,
  BottomNavigationSafeArea,
} from 'seed-design/ui/bottom-navigation'

import { isAuthenticated } from '../../features/auth/stores/authSession.store'
import { actions } from '../../stackflow/stackflow'
import { useLayout } from './LayoutContext'

const TABS = [
  {
    id: 'home',
    label: '홈',
    icon: <IconHouseLine />,
    match: (pathname: string) => pathname === '/',
    activity: 'Home' as const,
    params: {},
  },
  {
    id: 'transactions',
    label: '거래내역',
    icon: <IconReceiptLine />,
    match: (pathname: string) => pathname.startsWith('/detail/transactions'),
    activity: 'Detail' as const,
    params: { id: 'transactions' },
  },
  {
    id: 'profile',
    label: 'MY',
    icon: <IconPersonCircleLine />,
    match: (pathname: string) => pathname.startsWith('/detail/profile'),
    activity: 'Detail' as const,
    params: { id: 'profile' },
  },
]

export function GlobalBottomNavigation() {
  const { bottomNavVisible, overlayOpen, pathname } = useLayout()

  if (!bottomNavVisible || overlayOpen) return null

  return (
    <div
      className="sticky bottom-0 shrink-0"
      style={{ zIndex: 'var(--app-chrome-z-index)' }}
    >
      <BottomNavigation>
        {TABS.map((tab) => {
          const active = tab.match(pathname)
          return (
            <BottomNavigationItem
              key={tab.id}
              label={tab.label}
              icon={tab.icon}
              active={active}
              onClick={() => {
                if (active) return
                if (tab.id !== 'home' && !isAuthenticated()) {
                  actions.push('SignupIdentity', {})
                  return
                }
                actions.replace(tab.activity, tab.params, { animate: false })
              }}
            />
          )
        })}
      </BottomNavigation>
      <BottomNavigationSafeArea />
    </div>
  )
}
