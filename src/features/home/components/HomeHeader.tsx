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

import { PressableScale } from '../../../shared/ui/PressableScale'

import LogoBrit from '../../../assets/logo-brit.svg?react'
import IconCoinDollarSyncFill from '../../../assets/icons/icon-coin-dollar-sync-fill.svg?react'
import type { HomeViewModel } from '../types'
import type { SplitGroup } from '../../trade/types'
import { formatAmount } from '../../../shared/utils/formatAmount'
import { getHomeActiveTradeCopy } from '../../trade/copy'
import { HomeInstallBanner } from '../../pwa/components/HomeInstallBanner'

interface HomeActiveTradeCopy {
  badge: string
  title: string
  description: string
}

interface HomeHeaderProps {
  activeTrade?: HomeViewModel['activeTrade']
  activeTradeCopy?: HomeActiveTradeCopy | null
  activeSplitGroup?: SplitGroup | null
  unreadNotificationCount?: number
  needsAttention?: boolean
  onActiveTradeClick?: () => void
  compact?: boolean
}

function formatNotificationBadgeLabel(count: number): string {
  if (count > 9) return '9+'
  return String(count)
}

export function HomeHeader({
  activeTrade,
  activeTradeCopy,
  activeSplitGroup,
  unreadNotificationCount = 0,
  needsAttention = false,
  onActiveTradeClick,
  compact = false,
}: HomeHeaderProps) {
  const hasUnreadNotification = unreadNotificationCount > 0
  const showCountBadge = unreadNotificationCount > 1

  return (
    <section className="home-header">
      <HomeInstallBanner />
      <VStack px="spacingX.globalGutter" pb={compact ? 'x4' : 'x10'} gap={compact ? 'x0' : 'x5'}>
        <HStack justify="space-between" align="center" height="56px">
          <LogoBrit
            className="home-header__logo"
            aria-label="Brit"
            role="img"
          />

          <PressableScale
            aria-label={hasUnreadNotification ? '읽지 않은 알림 있음' : '알림'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              padding: 0,
              border: 'none',
              background: 'transparent',
              borderRadius: 'var(--seed-radius-r2)',
              color: 'var(--seed-color-fg-neutral-subtle)',
              cursor: 'pointer',
            }}
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
          </PressableScale>
        </HStack>

        {!compact && (
          <VStack gap="spacingY.betweenText">
            <HStack align="center" gap="x2">
              <IconCoinDollarSyncFill width={40} height={40} aria-hidden />
              <Text textStyle="screenTitle" color="fg.neutral" className="typo-title-tight">
                필요한 만큼{'\n'}쉽게 거래해요
              </Text>
            </HStack>
            <Text textStyle="t5Regular" color="fg.neutralMuted">
              비슷한 금액의 상대와 연결해드릴게요.
            </Text>
          </VStack>
        )}

        {activeSplitGroup && (
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
            onClick={() => onActiveTradeClick?.()}
          >
            <Badge tone="warning" variant="weak" size="medium">
              진행 중
            </Badge>
            <VStack gap="x0_5" flexGrow style={{ minWidth: 0 }}>
              <Text textStyle="t4Bold" color="fg.neutral" className="tabular-nums">
                {formatAmount(activeSplitGroup.totalAmountKrw)}{' '}
                {activeSplitGroup.side === 'BUY' ? '구매' : '판매'} 중
              </Text>
              <Text textStyle="t3Regular" color="fg.neutralMuted" className="tabular-nums">
                {activeSplitGroup.completedLegs}/{activeSplitGroup.totalLegs}건 완료
              </Text>
            </VStack>
          </Box>
        )}

        {!activeSplitGroup && activeTrade && (
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
            className={needsAttention ? 'home-header__active-trade--attention' : undefined}
            style={{ textAlign: 'left' }}
            onClick={() => onActiveTradeClick?.()}
          >
            {(() => {
              const copy =
                activeTradeCopy ??
                getHomeActiveTradeCopy({
                  status: activeTrade.status,
                  role: activeTrade.role,
                })
              const badgeTone = needsAttention ? 'critical' : 'warning'
              return (
                <>
                  <Badge tone={badgeTone} variant="weak" size="medium">
                    {copy.badge}
                  </Badge>
                  <VStack gap="x0_5" flexGrow style={{ minWidth: 0 }}>
                    <Text textStyle="t4Bold" color="fg.neutral">
                      {copy.title}
                    </Text>
                    <Text textStyle="t3Regular" color="fg.neutralMuted" className="tabular-nums">
                      {copy.description}
                    </Text>
                  </VStack>
                </>
              )
            })()}
          </Box>
        )}
      </VStack>
    </section>
  )
}
