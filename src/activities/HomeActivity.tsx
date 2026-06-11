import { useActivityZIndexBase } from '@seed-design/stackflow'
import type { ActivityComponentType } from '@stackflow/react'
import { useFlow } from '@stackflow/react'
import {
  IconBellLine,
  IconChevronRightLine,
  IconHorizline3VerticalLine,
  IconMagnifyingglassLine,
  IconPersonCircleLine,
} from '@karrotmarket/react-monochrome-icon'
import { HStack, Icon, ResponsivePair, Skeleton, Text, VStack } from '@seed-design/react'
import { useState } from 'react'
import { ActionButton } from 'seed-design/ui/action-button'
import {
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogRoot,
  AlertDialogTitle,
} from 'seed-design/ui/alert-dialog'
import {
  AppBar,
  AppBarIconButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
} from 'seed-design/ui/app-bar'
import { ScreenLayout } from '../app/layouts/ScreenLayout'
import { AppScreen, AppScreenContent } from 'seed-design/ui/app-screen'
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from 'seed-design/ui/bottom-sheet'
import { List, ListButtonItem, ListDivider } from 'seed-design/ui/list'
import { ListHeader } from 'seed-design/ui/list-header'
import { PageBanner, PageBannerButton } from 'seed-design/ui/page-banner'
import { ProgressCircle } from 'seed-design/ui/progress-circle'
import { Snackbar, SnackbarProvider, useSnackbarAdapter } from 'seed-design/ui/snackbar'

const AnimationDemo = () => {
  const snackbar = useSnackbarAdapter()
  const [loading, setLoading] = useState(false)

  const handleLoadingClick = () => {
    setLoading(true)
    window.setTimeout(() => setLoading(false), 2000)
  }

  return (
    <VStack
      px="spacingX.globalGutter"
      py="x4"
      gap="spacingY.componentDefault"
      bg="bg.layerDefault"
    >
      <Text textStyle="t4Regular" color="fg.neutralMuted">
        shimmer · spin · enter/exit · pressed 색상 전환
      </Text>

      <HStack gap="x3" align="center">
        <Skeleton radius="full" width="x12" height="x12" />
        <VStack gap="x2" grow>
          <Skeleton radius="8" height="x4" width="full" />
          <Skeleton radius="8" height="x4" width="x20" />
        </VStack>
      </HStack>

      <HStack gap="x6" align="center" justify="center" py="x2">
        <VStack gap="x1" align="center">
          <ProgressCircle size="24" />
          <Text textStyle="t3Regular" color="fg.neutralSubtle">
            로딩
          </Text>
        </VStack>
        <VStack gap="x1" align="center">
          <ProgressCircle size="40" value={65} />
          <Text textStyle="t3Regular" color="fg.neutralSubtle">
            65%
          </Text>
        </VStack>
      </HStack>

      <VStack gap="x2">
        <ActionButton loading={loading} onClick={handleLoadingClick}>
          로딩 버튼
        </ActionButton>
        <ActionButton
          variant="neutralWeak"
          onClick={() =>
            snackbar.create({
              render: () => (
                <Snackbar
                  variant="positive"
                  message="저장되었습니다"
                  actionLabel="확인"
                />
              ),
            })
          }
        >
          스낵바 (enter/exit)
        </ActionButton>
      </VStack>
    </VStack>
  )
}

const HomeActivity: ActivityComponentType<'Home'> = () => {
  const { push } = useFlow()
  const layerIndex = useActivityZIndexBase({ activityOffset: 1 })
  const [sheetOpen, setSheetOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <SnackbarProvider>
      <AppScreen>
        <ScreenLayout
          background="basement"
          navigation={
            <AppBar>
              <AppBarLeft />
              <AppBarMain title="내 근처" />
              <AppBarRight>
                <AppBarIconButton aria-label="알림">
                  <IconBellLine />
                </AppBarIconButton>
              </AppBarRight>
            </AppBar>
          }
        >
          <AppScreenContent>
            <VStack
              minHeight="full"
              bg="bg.layerBasement"
              gap="spacingY.componentDefault"
              pb="spacingY.screenBottom"
            >
            <PageBanner
              tone="informative"
              variant="weak"
              title="이번 주 인기 소식"
              description="우리 동네에서 가장 많이 본 이야기를 확인해 보세요."
              suffix={
                <PageBannerButton onClick={() => push('Detail', { id: 'hot' })}>
                  보러 가기
                </PageBannerButton>
              }
            />

            <VStack bg="bg.layerDefault">
              <ListHeader as="h2" variant="mediumWeak">
                애니메이션
              </ListHeader>
              <AnimationDemo />
            </VStack>

            <VStack bg="bg.layerDefault">
              <ListHeader as="h2" variant="mediumWeak">
                바로가기
              </ListHeader>
              <List width="full">
                <ListButtonItem
                  prefix={<Icon svg={<IconMagnifyingglassLine />} />}
                  title="검색"
                  detail="눌러서 pressed inset 확인"
                  suffix={<Icon svg={<IconChevronRightLine />} size="x4_5" />}
                  onClick={() => push('Detail', { id: 'search' })}
                />
                <ListDivider />
                <ListButtonItem
                  prefix={<Icon svg={<IconPersonCircleLine />} />}
                  title="프로필"
                  detail="내 정보와 활동 내역"
                  suffix={<Icon svg={<IconChevronRightLine />} size="x4_5" />}
                  onClick={() => push('Detail', { id: 'profile' })}
                />
              </List>
            </VStack>

            <VStack bg="bg.layerDefault">
              <ListHeader as="h2" variant="mediumWeak">
                더보기
              </ListHeader>
              <List width="full">
                <ListButtonItem
                  prefix={<Icon svg={<IconHorizline3VerticalLine />} />}
                  title="바텀시트"
                  detail="슬라이드 업 애니메이션"
                  suffix={<Icon svg={<IconChevronRightLine />} size="x4_5" />}
                  onClick={() => setSheetOpen(true)}
                />
                <ListDivider />
                <ListButtonItem
                  prefix={<Icon svg={<IconHorizline3VerticalLine />} />}
                  title="알림창"
                  detail="페이드 인/아웃 다이얼로그"
                  suffix={<Icon svg={<IconChevronRightLine />} size="x4_5" />}
                  onClick={() => setDialogOpen(true)}
                />
              </List>
            </VStack>

            <VStack px="spacingX.globalGutter">
              <ActionButton size="large" onClick={() => push('Detail', { id: 'write' })}>
                글쓰기
              </ActionButton>
            </VStack>
            </VStack>
          </AppScreenContent>
        </ScreenLayout>
      </AppScreen>

      <BottomSheetRoot open={sheetOpen} onOpenChange={setSheetOpen}>
        <BottomSheetContent
          title="필터"
          description="보고 싶은 소식 유형을 선택해 주세요."
          showHandle
          layerIndex={layerIndex}
        >
          <BottomSheetBody>
            <VStack gap="spacingY.betweenText">
              <Text textStyle="t4Regular" color="fg.neutralMuted">
                중고거래, 동네생활, 알바 등 관심 카테고리를 골라볼 수 있어요.
              </Text>
              <Text textStyle="t4Regular" color="fg.neutralSubtle">
                아래로 드래그하면 닫힙니다.
              </Text>
            </VStack>
          </BottomSheetBody>
          <BottomSheetFooter>
            <ActionButton onClick={() => setSheetOpen(false)}>확인</ActionButton>
          </BottomSheetFooter>
        </BottomSheetContent>
      </BottomSheetRoot>

      <AlertDialogRoot open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent layerIndex={layerIndex}>
          <AlertDialogHeader>
            <AlertDialogTitle>알림을 켤까요?</AlertDialogTitle>
            <AlertDialogDescription>
              새 댓글과 채팅 메시지를 놓치지 않도록 알림을 받을 수 있어요.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <VStack gap="spacingY.betweenText">
              <ResponsivePair gap="x2">
                <AlertDialogAction asChild>
                  <ActionButton>확인</ActionButton>
                </AlertDialogAction>
                <ActionButton variant="neutralWeak" onClick={() => setDialogOpen(false)}>
                  취소
                </ActionButton>
              </ResponsivePair>
            </VStack>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogRoot>
    </SnackbarProvider>
  )
}

export default HomeActivity
