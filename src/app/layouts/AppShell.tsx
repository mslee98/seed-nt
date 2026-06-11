import type { ReactNode } from 'react'

interface AppShellProps {
  children: ReactNode
  sidePanel?: ReactNode
}

export function AppShell({ children, sidePanel }: AppShellProps) {
  return (
    <div className="min-h-dvh bg-bg-layer-basement">
      <div className="mx-auto flex min-h-dvh w-full flex-row justify-center">
        {sidePanel && (
          <aside className="hidden shrink-0 lg:block lg:w-[var(--app-desktop-side-panel-width)] lg:min-w-[var(--app-desktop-side-panel-width)] lg:mr-[var(--app-desktop-side-panel-gap)]">
            {sidePanel}
          </aside>
        )}
        {children}
      </div>
    </div>
  )
}
