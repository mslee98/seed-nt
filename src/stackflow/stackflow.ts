import { seedPlugin } from '@seed-design/stackflow'
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
import TradeActivity from '../activities/TradeActivity'
import TradeConfirmActivity from '../activities/TradeConfirmActivity'
import { detectTheme } from '../shared/utils/detectTheme'
import { config } from './config'

// Navigation: Activity 내부는 useFlow(), Stack 외부 크롬(GlobalBottomNavigation, SignupComplete stack pop)은 actions.
export const { Stack, actions } = stackflow({
  config,
  components: {
    Home: HomeActivity,
    Detail: DetailActivity,
    TradeConfirm: TradeConfirmActivity,
    Trade: TradeActivity,
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
