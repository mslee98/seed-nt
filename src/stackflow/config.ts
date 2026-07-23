import { defineConfig } from '@stackflow/config'

import type {
  AccountRecoveryStep,
  LoginMode,
  SignupAccountStep,
  SignupAuthStep,
  SignupPinStep,
} from '../features/auth/constants'

declare module '@stackflow/config' {
  interface Register {
    Home: {}
    Detail: {
      id: string
    }
    Trade: {
      tradeId?: string
      splitGroupId?: string
      focusLeg?: string
    }
    TradeCompose: {
      side: 'BUY' | 'SELL'
    }
    SignupIdentity: {}
    SignupSms: {
      phone: string
    }
    SignupAccount: {
      step?: SignupAccountStep
    }
    SignupPin: {
      step?: SignupPinStep
    }
    SignupAuth: {
      step?: SignupAuthStep
    }
    SignupComplete: {}
    Login: {
      mode?: LoginMode
    }
    SecuritySettings: {}
    AccountRecovery: {
      step?: AccountRecoveryStep
    }
    SmsSchemePoc: {}
    NotFound: {}
  }
}

export const config = defineConfig({
  activities: [
    {
      name: 'Home',
      route: '/',
    },
    {
      name: 'Detail',
      route: '/detail/:id',
    },
    {
      name: 'TradeCompose',
      route: '/trade/compose',
    },
    {
      name: 'Trade',
      route: '/trade',
    },
    {
      name: 'SignupIdentity',
      route: '/auth/signup/identity',
    },
    {
      name: 'SignupSms',
      route: '/auth/signup/sms',
    },
    {
      name: 'SignupAccount',
      route: '/auth/signup/account',
    },
    {
      name: 'SignupPin',
      route: '/auth/signup/pin',
    },
    {
      name: 'SignupAuth',
      route: '/auth/signup/auth',
    },
    {
      name: 'SignupComplete',
      route: '/auth/signup/complete',
    },
    {
      name: 'Login',
      route: '/auth/login',
    },
    {
      name: 'SecuritySettings',
      route: '/auth/security',
    },
    {
      name: 'AccountRecovery',
      route: '/auth/recovery',
    },
    {
      name: 'SmsSchemePoc',
      route: '/poc/sms',
    },
    {
      name: 'NotFound',
      route: '/404',
    },
  ],
  transitionDuration: 300,
})
