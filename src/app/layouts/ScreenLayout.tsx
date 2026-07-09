import type { ReactNode } from 'react'

interface ScreenLayoutProps {
  background?: 'default' | 'basement' | 'neutral'
  children: ReactNode
}

export function ScreenLayout({
  background = 'neutral',
  children,
}: ScreenLayoutProps) {
  const bgClass =
    background === 'basement'
      ? 'bg-bg-layer-basement'
      : background === 'neutral'
        ? 'bg-bg-neutral-weak'
        : 'bg-bg-layer-default'

  return <div className={`flex min-h-full flex-col ${bgClass}`}>{children}</div>
}
