import type { ReactNode } from 'react'

interface ScreenLayoutProps {
  navigation?: ReactNode
  fixedBottom?: ReactNode
  background?: 'default' | 'basement'
  children: ReactNode
}

export function ScreenLayout({
  navigation,
  fixedBottom,
  background = 'default',
  children,
}: ScreenLayoutProps) {
  const bgClass =
    background === 'basement' ? 'bg-bg-layer-basement' : 'bg-bg-layer-default'

  return (
    <div className={`flex min-h-full flex-col ${bgClass}`}>
      {navigation && (
        <header
          className="sticky top-0 z-[100] shrink-0 bg-bg-layer-default"
          style={{ height: 'var(--sticky-header-height)' }}
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
