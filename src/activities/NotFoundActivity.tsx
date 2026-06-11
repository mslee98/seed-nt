import type { ActivityComponentType } from '@stackflow/react'
import { useFlow } from '@stackflow/react'
import { Text, VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'
import {
  AppBar,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
} from 'seed-design/ui/app-bar'
import { ScreenLayout } from '../app/layouts/ScreenLayout'
import { AppScreen, AppScreenContent } from 'seed-design/ui/app-screen'

const NotFoundActivity: ActivityComponentType<'NotFound'> = () => {
  const { replace } = useFlow()

  return (
    <AppScreen>
      <ScreenLayout
        navigation={
          <AppBar>
            <AppBarLeft />
            <AppBarMain>404</AppBarMain>
            <AppBarRight />
          </AppBar>
        }
      >
        <AppScreenContent>
          <VStack
            minHeight="full"
            align="center"
            justify="center"
            gap="spacingY.componentDefault"
            px="spacingX.globalGutter"
          >
            <Text textStyle="screenTitle" color="fg.neutral">
              페이지를 찾을 수 없습니다
            </Text>
            <ActionButton onClick={() => replace('Home', {})}>
              홈으로 돌아가기
            </ActionButton>
          </VStack>
        </AppScreenContent>
      </ScreenLayout>
    </AppScreen>
  )
}

export default NotFoundActivity
