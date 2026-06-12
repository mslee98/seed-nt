import { useFlow } from '@stackflow/react'
import { IconBellLine } from '@karrotmarket/react-monochrome-icon'
import {
  Badge,
  Box,
  HStack,
  Icon,
  NotificationBadge,
  NotificationBadgePositioner,
  Text,
  VStack,
} from '@seed-design/react'

import LogoBrit from '../../../assets/logo-brit.svg?react'
import IconCoinDollarSyncFill from '../../../assets/icons/icon-coin-dollar-sync-fill.svg?react'
import type { HomeViewModel } from '../types'
import { formatAmount } from '../utils/formatAmount'
import { getTradeStatusCopy } from '../utils/tradeStatusCopy'
import { HomeInstallBanner } from './HomeInstallBanner'

interface HomeHeaderProps {
  activeTrade?: HomeViewModel['activeTrade']
  unreadNotificationCount?: number
}

function formatNotificationBadgeLabel(count: number): string {
  if (count > 9) return '9+'
  return String(count)
}

export function HomeHeader({ activeTrade, unreadNotificationCount = 0 }: HomeHeaderProps) {
  const { push } = useFlow()
  const hasUnreadNotification = unreadNotificationCount > 0
  const showCountBadge = unreadNotificationCount > 1

  return (
    <section className="home-header">
      <HomeInstallBanner />
      <VStack px="spacingX.globalGutter" pb="x10" gap="x5">
        <HStack justify="space-between" align="center" height="56px">
          <LogoBrit
            className="home-header__logo"
            aria-label="Brit"
            role="img"
          />

          <Box
            as="button"
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="40px"
            height="40px"
            borderRadius="r2"
            color="fg.neutralSubtle"
            aria-label={hasUnreadNotification ? '읽지 않은 알림 있음' : '알림'}
          >
            <HStack position="relative" align="flex-start">
              <Icon svg={<IconBellLine />} size="x6" />
              {hasUnreadNotification && (
                <NotificationBadgePositioner
                  size={showCountBadge ? 'large' : 'small'}
                  attach="icon"
                >
                  {showCountBadge ? (
                    <NotificationBadge size="large">
                      {formatNotificationBadgeLabel(unreadNotificationCount)}
                    </NotificationBadge>
                  ) : (
                    <NotificationBadge size="small" />
                  )}
                </NotificationBadgePositioner>
              )}
            </HStack>
          </Box>
        </HStack>

        <VStack gap="spacingY.betweenText">
          <HStack align="center" gap="x2">
            <IconCoinDollarSyncFill width={40} height={40} aria-hidden />
            <Text textStyle="screenTitle" color="fg.neutral">
              필요한 만큼{'\n'}쉽게 거래해요
            </Text>
          </HStack>
          <Text textStyle="t5Regular" color="fg.neutralMuted">
            비슷한 금액의 상대와 연결해드릴게요.
          </Text>
        </VStack>

        {activeTrade && (
          <Box
            as="button"
            display="flex"
            alignItems="center"
            gap="x2"
            width="full"
            px="x4"
            py="x3"
            borderWidth="1"
            borderColor="stroke.neutralWeak"
            borderRadius="r3"
            bg="bg.layerDefault"
            style={{ textAlign: 'left' }}
            onClick={() => push('Detail', { id: activeTrade.id })}
          >
            <Badge tone="warning" variant="weak" size="medium">
              {getTradeStatusCopy(activeTrade.status).badge}
            </Badge>
            <VStack gap="x0_5" flexGrow style={{ minWidth: 0 }}>
              <Text textStyle="t4Bold" color="fg.neutral">
                {getTradeStatusCopy(activeTrade.status).title}
              </Text>
              <Text textStyle="t3Regular" color="fg.neutralMuted" className="tabular-nums">
                {formatAmount(activeTrade.amountKrw)} · {activeTrade.coinAmount} MS
              </Text>
            </VStack>
          </Box>
        )}
      </VStack>
    </section>
  )
}
