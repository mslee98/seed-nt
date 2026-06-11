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
    replace: true,
  },
  {
    id: 'transactions',
    label: '거래내역',
    icon: <IconReceiptLine />,
    match: (pathname: string) => pathname.startsWith('/detail/transactions'),
    activity: 'Detail' as const,
    params: { id: 'transactions' },
    replace: false,
  },
  {
    id: 'profile',
    label: '내정보',
    icon: <IconPersonCircleLine />,
    match: (pathname: string) => pathname.startsWith('/detail/profile'),
    activity: 'Detail' as const,
    params: { id: 'profile' },
    replace: false,
  },
]

export function GlobalBottomNavigation() {
  const { bottomNavVisible, pathname } = useLayout()

  if (!bottomNavVisible) return null

  return (
    <div className="sticky bottom-0 z-[80] shrink-0">
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
                if (tab.replace) {
                  actions.replace(tab.activity, tab.params)
                  return
                }
                actions.push(tab.activity, tab.params)
              }}
            />
          )
        })}
      </BottomNavigation>
      <BottomNavigationSafeArea />
    </div>
  )
}
