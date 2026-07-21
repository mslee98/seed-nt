import { IconBellLine } from '@karrotmarket/react-monochrome-icon'
import {
  HStack,
  Icon,
  NotificationBadge,
  NotificationBadgePositioner,
  VStack,
} from '@seed-design/react'

import { PressableScale } from '../../../shared/ui/PressableScale'
import LogoBrit from '../../../assets/icons/brand/logo-brit.svg?react'
import { HomeInstallBanner } from '../../pwa/components/HomeInstallBanner'
import { HOME_COMPACT } from '../constants/homeCompact'

interface HomeHeaderProps {
  unreadNotificationCount?: number
}

function formatNotificationBadgeLabel(count: number): string {
  if (count > 9) return '9+'
  return String(count)
}

/** 홈 헤더 — 로고 + 알림 (layerDefault 면, home-header CSS 배경 비의존) */
export function HomeHeader({ unreadNotificationCount = 0 }: HomeHeaderProps) {
  const hasUnreadNotification = unreadNotificationCount > 0
  const showCountBadge = unreadNotificationCount > 1

  return (
    <VStack bg="bg.layerDefault" width="full">
      <HomeInstallBanner />
      <VStack px="spacingX.globalGutter" pb={HOME_COMPACT.layout.headerBottomPb}>
        <HStack justify="space-between" align="center" height="56px">
          <LogoBrit className="home-header__logo" aria-label="Brit" role="img" />

          <PressableScale
            aria-label={hasUnreadNotification ? '읽지 않은 알림 있음' : '알림'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
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
      </VStack>
    </VStack>
  )
}
