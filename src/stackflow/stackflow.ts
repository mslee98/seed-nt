import { seedPlugin } from '@seed-design/stackflow'
import type { SeedPluginOptions } from '@seed-design/stackflow'
import { historySyncPlugin } from '@stackflow/plugin-history-sync'
import { webRendererPlugin } from '@stackflow/plugin-renderer-web'
import { stackflow } from '@stackflow/react'

import DetailActivity from '../activities/DetailActivity'
import HomeActivity from '../activities/HomeActivity'
import NotFoundActivity from '../activities/NotFoundActivity'
import TradeConfirmActivity from '../activities/TradeConfirmActivity'
import { config } from './config'

function detectTheme(): SeedPluginOptions['theme'] {
  if (typeof navigator === 'undefined') return 'cupertino'
  return /android/i.test(navigator.userAgent) ? 'android' : 'cupertino'
}

export const { Stack, actions } = stackflow({
  config,
  components: {
    Home: HomeActivity,
    Detail: DetailActivity,
    TradeConfirm: TradeConfirmActivity,
    NotFound: NotFoundActivity,
  },
  plugins: [
    webRendererPlugin(),
    seedPlugin(({ initialContext }) => ({
      theme: initialContext?.theme ?? detectTheme(),
    })),
    historySyncPlugin({
      config,
      fallbackActivity: () => 'NotFound',
    }),
  ],
})
