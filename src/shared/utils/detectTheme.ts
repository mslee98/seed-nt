import type { SeedPluginOptions } from '@seed-design/stackflow'

export function detectTheme(): SeedPluginOptions['theme'] {
  if (typeof navigator === 'undefined') return 'cupertino'
  return /android/i.test(navigator.userAgent) ? 'android' : 'cupertino'
}
