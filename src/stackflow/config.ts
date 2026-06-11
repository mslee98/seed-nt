import { defineConfig } from '@stackflow/config'

declare module '@stackflow/config' {
  interface Register {
    Home: {}
    Detail: {
      id: string
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
      name: 'NotFound',
      route: '/404',
    },
  ],
  transitionDuration: 300,
})
