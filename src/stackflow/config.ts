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
      name: 'NotFound',
      route: '/404',
    },
  ],
  transitionDuration: 300,
})
