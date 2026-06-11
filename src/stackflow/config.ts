import { defineConfig } from '@stackflow/config'

declare module '@stackflow/config' {
  interface Register {
    Home: {}
    Detail: {
      id: string
    }
    TradeConfirm: {
      side: string
      amountKrw: string
      splitMode?: string
    }
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
      name: 'TradeConfirm',
      route: '/trade/confirm',
    },
    {
      name: 'NotFound',
      route: '/404',
    },
  ],
  transitionDuration: 300,
})
