import { SnackbarProvider } from 'seed-design/ui/snackbar'

import { AppShell } from './app/layouts/AppShell'
import { DesktopSidePanel } from './app/layouts/DesktopSidePanel'
import { GlobalBottomNavigation } from './app/layouts/GlobalBottomNavigation'
import { LayoutProvider } from './app/layouts/LayoutContext'
import { MobileFrame } from './app/layouts/MobileFrame'
import { KeyboardInsetProvider } from './app/providers/KeyboardInsetProvider'
import { NotificationBootstrap } from './features/notifications/components/NotificationBootstrap'
import { DeviceContextDevFab } from './features/pwa/components/DeviceContextDevFab'
import { useTradePushNavigation } from './features/pwa/hooks/useTradePushNavigation'
import { DeviceContextProvider } from './features/pwa/providers/DeviceContextProvider'
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
      <KeyboardInsetProvider>
        <DeviceContextProvider>
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
                <DeviceContextDevFab />
                <div id="app-frame-portal" />
              </MobileFrame>
            </LayoutProvider>
          </AppShell>
        </DeviceContextProvider>
      </KeyboardInsetProvider>
    </SnackbarProvider>
  )
}

