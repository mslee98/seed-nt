/**
 * @file ui:bottom-navigation (project-local)
 * SEED registry에 bottom-navigation 스니펫이 없어 프로젝트에서 자체 구현합니다.
 **/

import { Icon, Text, VStack } from '@seed-design/react'
import type { ReactNode } from 'react'

export interface BottomNavigationItemProps {
  label: string
  icon: ReactNode
  active?: boolean
  onClick?: () => void
}

export function BottomNavigationItem({
  label,
  icon,
  active = false,
  onClick,
}: BottomNavigationItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-1 flex-col items-center justify-center gap-x0_5 border-none bg-transparent py-x2"
      aria-current={active ? 'page' : undefined}
    >
      <Icon
        svg={icon}
        size="x6"
        color={active ? 'fg.brand' : 'fg.neutralSubtle'}
      />
      <Text
        textStyle="t2Medium"
        color={active ? 'fg.brand' : 'fg.neutralSubtle'}
      >
        {label}
      </Text>
    </button>
  )
}

export interface BottomNavigationProps {
  children: ReactNode
}

export function BottomNavigation({ children }: BottomNavigationProps) {
  return (
    <nav
      className="flex h-[var(--app-bottom-navigation-height)] border-t border-stroke-neutral-weak bg-bg-layer-default shadow-[0_-4px_12px_rgba(0,0,0,0.04)]"
      aria-label="하단 탐색"
    >
      {children}
    </nav>
  )
}

export function BottomNavigationSafeArea() {
  return (
    <VStack
      className="shrink-0 bg-bg-layer-default"
      style={{ height: 'env(safe-area-inset-bottom, 0px)' }}
      aria-hidden
    />
  )
}
