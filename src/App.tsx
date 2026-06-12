import type { SeedPluginOptions } from '@seed-design/stackflow'
import { SnackbarProvider } from 'seed-design/ui/snackbar'

import { AppShell } from './app/layouts/AppShell'
import { DesktopSidePanel } from './app/layouts/DesktopSidePanel'
import { GlobalBottomNavigation } from './app/layouts/GlobalBottomNavigation'
import { LayoutProvider } from './app/layouts/LayoutContext'
import { MobileFrame } from './app/layouts/MobileFrame'
import { Stack } from './stackflow/stackflow'

function detectTheme(): SeedPluginOptions['theme'] {
  if (typeof navigator === 'undefined') return 'cupertino'
  return /android/i.test(navigator.userAgent) ? 'android' : 'cupertino'
}

export default function App() {
  return (
    <SnackbarProvider>
      <AppShell sidePanel={<DesktopSidePanel />}>
        <LayoutProvider>
          <MobileFrame>
            <div className="flex min-h-0 flex-1 flex-col">
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
