import { SnackbarProvider } from 'seed-design/ui/snackbar'

import { AppShell } from './app/layouts/AppShell'
import { DesktopSidePanel } from './app/layouts/DesktopSidePanel'
import { GlobalBottomNavigation } from './app/layouts/GlobalBottomNavigation'
import { LayoutProvider } from './app/layouts/LayoutContext'
import { MobileFrame } from './app/layouts/MobileFrame'
import { NotificationBootstrap } from './features/notifications/components/NotificationBootstrap'
import { useTradePushNavigation } from './features/pwa/hooks/useTradePushNavigation'
import { GlobalActiveTradeBanner } from './features/trade/components/GlobalActiveTradeBanner'
import { detectTheme } from './shared/utils/detectTheme'
import { Stack } from './stackflow/stackflow'


function TradePushNavigation() {
  useTradePushNavigation()
  return null
}

export default function App() {
  return (
    <SnackbarProvider>
      <NotificationBootstrap />
      <AppShell sidePanel={<DesktopSidePanel />}>
        <LayoutProvider>
          <TradePushNavigation />
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

