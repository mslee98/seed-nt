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

/**
 * Activity 공통 레이아웃.
 * 하단 CTA는 AppScreen Layer 안 in-flow로 두어 스택 z-index에 가려지지 않게 하고,
 * keyboardAdaptive 시 `--keyboard-inset`으로 키패드 위에 올린다.
 */
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

          <VStack flexGrow style={{ minHeight: 0, overflow: 'auto' }}>
            {children}
          </VStack>

          {fixedBottom && (
            <BottomCTA behavior={bottomCTABehavior} variant="inline">
              {fixedBottom}
            </BottomCTA>
          )}
        </VStack>
      </AppScreenContent>
    </AppScreen>
  )
}
