import type { ReactNode } from 'react'

interface MobileFrameProps {
  children: ReactNode
  shadow?: boolean
}

export function MobileFrame({ children, shadow = true }: MobileFrameProps) {
  return (
    <main
      id="frameMain"
      className={[
        'relative flex min-h-dvh w-full min-w-[var(--app-frame-min-width)] max-w-[var(--app-frame-max-width)] flex-col overflow-hidden bg-bg-layer-default',
        shadow ? 'shadow-[0_0_8px_rgba(0,0,0,0.16)]' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </main>
  )
}
