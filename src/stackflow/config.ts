import { defineConfig } from '@stackflow/config'

import type { SignupAccountStep, SignupPinStep } from '../features/auth/constants'

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
    SignupComplete: {}
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
      name: 'SignupComplete',
      route: '/auth/signup/complete',
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
