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

interface ActivityScreenLayoutProps {
  title?: string
  onBack?: (e: MouseEvent<HTMLButtonElement>) => void
  fixedBottom?: ReactNode
  progress?: ReactNode
  appScreenProps?: AppScreenProps
  showAppBar?: boolean
  children: ReactNode
}

export function ActivityScreenLayout({
  title = '',
  onBack,
  fixedBottom,
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
            <VStack
              px="spacingX.globalGutter"
              py="x4"
              pb="safeArea"
              shrink={0}
              bg="bg.neutralWeak"
            >
              {fixedBottom}
            </VStack>
          )}
        </VStack>
      </AppScreenContent>
    </AppScreen>
  )
}
