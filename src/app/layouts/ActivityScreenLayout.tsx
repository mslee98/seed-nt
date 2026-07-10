import type { MouseEvent, ReactNode } from 'react'
import { VStack } from '@seed-design/react'
import {
  AppBar,
  AppBarBackButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
} from 'seed-design/ui/app-bar'
import { AppScreen, AppScreenContent, type AppScreenProps } from 'seed-design/ui/app-screen'

import { APP_LAYOUT } from '../../shared/constants/app-layout'
import { BottomCTA, type BottomCTABehavior } from '../../shared/ui/BottomCTA'

interface ActivityScreenLayoutProps {
  title?: string
  onBack?: (e: MouseEvent<HTMLButtonElement>) => void
  fixedBottom?: ReactNode
  /** @default keyboardAdaptive — 입력 화면은 키보드 위로, 없으면 inset 0과 동일 */
  bottomCTABehavior?: BottomCTABehavior
  progress?: ReactNode
  appScreenProps?: AppScreenProps
  showAppBar?: boolean
  children: ReactNode
}

export function ActivityScreenLayout({
  title = '',
  onBack,
  fixedBottom,
  bottomCTABehavior = 'keyboardAdaptive',
  progress,
  appScreenProps,
  showAppBar = true,
  children,
}: ActivityScreenLayoutProps) {
  const scrollPaddingBottom = fixedBottom
    ? `calc(${APP_LAYOUT.fixedBottom.minHeight}px + var(--keyboard-inset, 0px) + env(safe-area-inset-bottom, 0px) + var(--seed-dimension-x4, 16px))`
    : undefined

  return (
    <AppScreen {...appScreenProps}>
      {showAppBar && (
        <AppBar>
          <AppBarLeft>
            <AppBarBackButton onClick={onBack} />
          </AppBarLeft>
          <AppBarMain title={title} />
          <AppBarRight />
        </AppBar>
      )}

      <AppScreenContent>
        <VStack minHeight="full">
          {progress && (
            <VStack px="spacingX.globalGutter" pt="x2" pb="x3" shrink={0}>
              {progress}
            </VStack>
          )}

          <VStack
            flexGrow
            style={{
              minHeight: 0,
              overflow: 'auto',
              paddingBottom: scrollPaddingBottom,
            }}
          >
            {children}
          </VStack>
        </VStack>
      </AppScreenContent>

      {fixedBottom && (
        <BottomCTA behavior={bottomCTABehavior} variant="fixed">
          {fixedBottom}
        </BottomCTA>
      )}
    </AppScreen>
  )
}
