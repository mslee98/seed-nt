import type { ActivityComponentType } from '@stackflow/react'
import { useActivityParams } from '@stackflow/react'
import {
  AppBar,
  AppBarBackButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
} from 'seed-design/ui/app-bar'
import { AppScreen, AppScreenContent } from 'seed-design/ui/app-screen'

import { ProfileScreen } from '../features/profile/components/ProfileScreen'
import { DiscoveryDetailScreen } from '../features/discovery/components/DiscoveryDetailScreen'
import { TradeDetailScreen } from '../features/trade/components/TradeDetailScreen'
import { TransactionsScreen } from '../features/transactions/components/TransactionsScreen'

const DetailActivity: ActivityComponentType<'Detail'> = () => {
  const { id } = useActivityParams<'Detail'>()

  if (id === 'transactions') {
    return (
      <AppScreen layerOffsetTop="safeArea">
        <AppScreenContent>
          <TransactionsScreen />
        </AppScreenContent>
      </AppScreen>
    )
  }

  if (id === 'profile') {
    return (
      <AppScreen layerOffsetTop="safeArea">
        <AppScreenContent>
          <ProfileScreen />
        </AppScreenContent>
      </AppScreen>
    )
  }

  if (id === 'store') {
    return (
      <AppScreen>
        <AppBar>
          <AppBarLeft>
            <AppBarBackButton />
          </AppBarLeft>
          <AppBarMain title="Brit 스토어" />
          <AppBarRight />
        </AppBar>
        <AppScreenContent>
          <DiscoveryDetailScreen variant="store" />
        </AppScreenContent>
      </AppScreen>
    )
  }

  if (id === 'community') {
    return (
      <AppScreen>
        <AppBar>
          <AppBarLeft>
            <AppBarBackButton />
          </AppBarLeft>
          <AppBarMain title="커뮤니티" />
          <AppBarRight />
        </AppBar>
        <AppScreenContent>
          <DiscoveryDetailScreen variant="community" />
        </AppScreenContent>
      </AppScreen>
    )
  }

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title="거래 상세" />
        <AppBarRight />
      </AppBar>

      <AppScreenContent>
        <TradeDetailScreen tradeId={id} />
      </AppScreenContent>
    </AppScreen>
  )
}

export default DetailActivity
