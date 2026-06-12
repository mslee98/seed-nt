import { seedPlugin } from '@seed-design/stackflow'
import type { SeedPluginOptions } from '@seed-design/stackflow'
import { historySyncPlugin } from '@stackflow/plugin-history-sync'
import { basicRendererPlugin } from '@stackflow/plugin-renderer-basic'
import { stackflow } from '@stackflow/react'

import SignupAccountActivity from '../activities/auth/SignupAccountActivity'
import SignupCompleteActivity from '../activities/auth/SignupCompleteActivity'
import SignupIdentityActivity from '../activities/auth/SignupIdentityActivity'
import SignupPinActivity from '../activities/auth/SignupPinActivity'
import SignupSmsActivity from '../activities/auth/SignupSmsActivity'
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
    SignupIdentity: SignupIdentityActivity,
    SignupSms: SignupSmsActivity,
    SignupAccount: SignupAccountActivity,
    SignupPin: SignupPinActivity,
    SignupComplete: SignupCompleteActivity,
    NotFound: NotFoundActivity,
  },
  plugins: [
    basicRendererPlugin(),
    seedPlugin(({ initialContext }) => ({
      theme: initialContext?.theme ?? detectTheme(),
    })),
    historySyncPlugin({
      config,
      fallbackActivity: () => 'NotFound',
    }),
  ],
})
