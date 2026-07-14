import { useRef } from 'react'
import { useActivityZIndexBase } from '@seed-design/stackflow'
import { Box, HStack, Portal, Text, VStack } from '@seed-design/react'

import { BottomActionButton } from '../../../shared/ui/BottomActionButton'
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from 'seed-design/ui/bottom-sheet'
import { List, ListDivider, ListItem } from 'seed-design/ui/list'

import { useLayoutOverlay } from '../../../app/layouts/useLayoutOverlay'
import { LottiePlayer } from '../../../shared/components/LottiePlayer'
import { loadLottieAsset } from '../../../assets/lottie/lottieRegistry'

interface AccountIntroSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  /** intro만 스킵하고 계좌 등록으로 진행 */
  onSkip: () => void
}

const INTRO_ITEMS = [
  '본인 명의 계좌만 등록할 수 있어요',
  '거래 취소 시 환불 계좌로 사용돼요',
  '환전할 때 한 번 더 확인해요',
]

export function AccountIntroSheet({
  open,
  onOpenChange,
  onConfirm,
  onSkip,
}: AccountIntroSheetProps) {
  const portalContainerRef = useRef<HTMLElement | null>(
    typeof document !== 'undefined' ? document.getElementById('app-frame-portal') : null,
  )
  const layerIndex = useActivityZIndexBase({ activityOffset: 1 })

  useLayoutOverlay(open)

  return (
    <BottomSheetRoot open={open} onOpenChange={onOpenChange}>
      <Portal container={portalContainerRef}>
        <BottomSheetContent
          title="본인확인이 끝났어요"
          description="계좌 등록 전 아래 안내를 확인해 주세요."
          layerIndex={layerIndex}
          showHandle
        >
          <BottomSheetBody>
            <VStack gap="x4" align="center">
              <Box py="x2">
                <LottiePlayer
                  loadAnimation={() => loadLottieAsset('checkBlueSpot')}
                  mountWhen={open}
                />
              </Box>
              <VStack gap="x2" width="full">
                <Text textStyle="t4Regular" color="fg.neutralMuted">
                  등록하는 계좌는 아래와 같이 사용돼요.
                </Text>
                <List width="full" aria-label="계좌 등록 안내" role="list">
                  {INTRO_ITEMS.map((item, index) => (
                    <VStack key={item} gap="x0" width="full">
                      {index > 0 && <ListDivider />}
                      <ListItem title={item} aria-readonly />
                    </VStack>
                  ))}
                </List>
              </VStack>
            </VStack>
          </BottomSheetBody>
          <BottomSheetFooter>
            <HStack gap="x2" width="full">
              <BottomActionButton size="large" variant="neutralWeak" onClick={onSkip}>
                나중에
              </BottomActionButton>
              <BottomActionButton size="large" variant="brandSolid" flexGrow onClick={onConfirm}>
                확인했어요
              </BottomActionButton>
            </HStack>
          </BottomSheetFooter>
        </BottomSheetContent>
      </Portal>
    </BottomSheetRoot>
  )
}
