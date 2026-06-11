import type { ReactNode } from 'react'

interface ScreenLayoutProps {
  navigation?: ReactNode
  fixedBottom?: ReactNode
  background?: 'default' | 'basement' | 'neutral'
  navigationBackground?: 'default' | 'neutral'
  navigationCompact?: boolean
  children: ReactNode
}

export function ScreenLayout({
  navigation,
  fixedBottom,
  background = 'neutral',
  navigationBackground = 'default',
  navigationCompact = false,
  children,
}: ScreenLayoutProps) {
  const bgClass =
    background === 'basement'
      ? 'bg-bg-layer-basement'
      : background === 'neutral'
        ? 'bg-bg-neutral-weak'
        : 'bg-bg-layer-default'

  const navigationBgClass =
    navigationBackground === 'neutral' ? 'bg-bg-neutral-weak' : 'bg-bg-layer-default'

  const headerHeight = navigationCompact
    ? 'var(--sticky-header-height-compact)'
    : 'var(--sticky-header-height)'

  return (
    <div className={`flex min-h-full flex-col ${bgClass}`}>
      {navigation && (
        <header
          className={`sticky top-0 z-[100] shrink-0 ${navigationBgClass}`}
          style={{ height: headerHeight }}
        >
          {navigation}
        </header>
      )}

      <main className="min-h-0 flex-1">
        {children}
      </main>

      {fixedBottom && (
        <footer
          className="sticky bottom-0 z-[90] shrink-0 bg-bg-layer-default"
          style={{ minHeight: 'var(--app-fixed-bottom-min-height)' }}
        >
          {fixedBottom}
        </footer>
      )}
    </div>
  )
}
