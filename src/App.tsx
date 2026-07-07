import { SnackbarProvider } from 'seed-design/ui/snackbar'

import { AppShell } from './app/layouts/AppShell'
import { DesktopSidePanel } from './app/layouts/DesktopSidePanel'
import { GlobalBottomNavigation } from './app/layouts/GlobalBottomNavigation'
import { LayoutProvider } from './app/layouts/LayoutContext'
import { MobileFrame } from './app/layouts/MobileFrame'
import { GlobalActiveTradeBanner } from './features/trade/components/GlobalActiveTradeBanner'
import { useMatchingSurfaceSync } from './features/trade/hooks/useMatchingSurfaceSync'
import { detectTheme } from './shared/utils/detectTheme'
import { Stack } from './stackflow/stackflow'

function MatchingSurfaceSync() {
  useMatchingSurfaceSync()
  return null
}

export default function App() {
  return (
    <SnackbarProvider>
      <AppShell sidePanel={<DesktopSidePanel />}>
        <LayoutProvider>
          <MatchingSurfaceSync />
          <MobileFrame>
            <div className="flex min-h-0 flex-1 flex-col">
              <GlobalActiveTradeBanner />
              <Stack initialContext={{ theme: detectTheme() }} />
            </div>
            <GlobalBottomNavigation />
            <div id="app-frame-portal" />
          </MobileFrame>
        </LayoutProvider>
      </AppShell>
    </SnackbarProvider>
  )
}
