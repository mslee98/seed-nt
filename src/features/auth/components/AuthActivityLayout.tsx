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

interface AuthActivityLayoutProps {
  title?: string
  onBack?: (e: MouseEvent<HTMLButtonElement>) => void
  fixedBottom?: ReactNode
  appScreenProps?: AppScreenProps
  showAppBar?: boolean
  children: ReactNode
}

export function AuthActivityLayout({
  title = '',
  onBack,
  fixedBottom,
  appScreenProps,
  showAppBar = true,
  children,
}: AuthActivityLayoutProps) {
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
        <VStack minHeight="full" justify="space-between">
          <VStack flexGrow style={{ minHeight: 0 }}>
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
