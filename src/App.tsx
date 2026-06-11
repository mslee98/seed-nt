import type { SeedPluginOptions } from '@seed-design/stackflow'

import { Stack } from './stackflow/stackflow'

function detectTheme(): SeedPluginOptions['theme'] {
  if (typeof navigator === 'undefined') return 'cupertino'
  return /android/i.test(navigator.userAgent) ? 'android' : 'cupertino'
}

export default function App() {
  return <Stack initialContext={{ theme: detectTheme() }} />
}
