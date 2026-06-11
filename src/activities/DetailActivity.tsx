import type { ActivityComponentType } from '@stackflow/react'
import { useActivityParams } from '@stackflow/react'
import { Text, VStack } from '@seed-design/react'
import {
  AppBar,
  AppBarBackButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
} from 'seed-design/ui/app-bar'
import { ScreenLayout } from '../app/layouts/ScreenLayout'
import { AppScreen, AppScreenContent } from 'seed-design/ui/app-screen'

const DetailActivity: ActivityComponentType<'Detail'> = () => {
  const { id } = useActivityParams<'Detail'>()

  return (
    <AppScreen>
      <ScreenLayout
        navigation={
          <AppBar>
            <AppBarLeft>
              <AppBarBackButton />
            </AppBarLeft>
            <AppBarMain>상세</AppBarMain>
            <AppBarRight />
          </AppBar>
        }
      >
        <AppScreenContent>
          <VStack
            minHeight="full"
            gap="spacingY.betweenText"
            bg="bg.layerDefault"
            px="spacingX.globalGutter"
            pb="spacingY.screenBottom"
            pt="spacingY.navToTitle"
          >
          <Text textStyle="screenTitle" color="fg.neutral">
            {id === 'write' ? '새 글 작성' : '게시글 상세'}
          </Text>
          <Text textStyle="articleBody" color="fg.neutral">
            {id === 'hot'
              ? '이번 주 우리 동네에서 가장 많은 관심을 받은 소식입니다. 동네 이웃들과 나누고 싶은 이야기를 남겨 보세요.'
              : id === 'search'
                ? '관심 있는 키워드나 카테고리를 검색해 원하는 정보를 빠르게 찾을 수 있습니다.'
                : id === 'profile'
                  ? '프로필 사진, 닉네임, 동네 인증 정보를 확인하고 관리할 수 있습니다.'
                  : id === 'write'
                    ? '제목과 내용을 입력하고 사진을 추가해 이웃에게 소식을 전해 보세요.'
                    : '뒤로가기나 스와이프로 이전 화면으로 돌아갈 수 있습니다. 주소창 URL도 함께 동기화됩니다.'}
          </Text>
          <Text textStyle="articleNote" color="fg.neutralMuted">
            게시글 ID:{' '}
            <Text as="span" textStyle="t4Medium" color="fg.brand">
              {id}
            </Text>
          </Text>
          <Text textStyle="t4Regular" color="fg.neutralSubtle">
            경로{' '}
            <Text as="span" textStyle="t4Medium" color="fg.informative">
              /detail/{id}
            </Text>
          </Text>
          </VStack>
        </AppScreenContent>
      </ScreenLayout>
    </AppScreen>
  )
}

export default DetailActivity
