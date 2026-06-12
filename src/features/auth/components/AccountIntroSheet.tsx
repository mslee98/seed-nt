import { useRef } from 'react'
import { useActivityZIndexBase } from '@seed-design/stackflow'
import { Box, Portal, VStack } from '@seed-design/react'

import { ActionButton } from 'seed-design/ui/action-button'
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from 'seed-design/ui/bottom-sheet'
import { List, ListItem } from 'seed-design/ui/list'

import { useLayoutOverlay } from '../../../app/layouts/useLayoutOverlay'
import { LottiePlayer } from './LottiePlayer'

interface AccountIntroSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

const INTRO_ITEMS = [
  '본인 명의 계좌만 등록할 수 있어요',
  '거래 취소 시 환불 계좌로 사용돼요',
  '환전할 때 한 번 더 확인해요',
]

export function AccountIntroSheet({ open, onOpenChange, onConfirm }: AccountIntroSheetProps) {
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
          description="원활한 거래를 위해 계좌 정보를 등록해 주세요. 입금 확인, 환전, 환불에 사용할 계좌예요."
          layerIndex={layerIndex}
          showHandle
        >
          <BottomSheetBody>
            <VStack gap="x4" align="center">
              <Box py="x2">
                <LottiePlayer src="/lotties/check-blue-spot.json" />
              </Box>
              <List width="full">
                {INTRO_ITEMS.map((item) => (
                  <ListItem key={item} title={item} />
                ))}
              </List>
            </VStack>
          </BottomSheetBody>
          <BottomSheetFooter>
            <ActionButton
              size="large"
              variant="brandSolid"
              flexGrow
              onClick={() => {
                onConfirm()
              }}
            >
              계좌 등록하기
            </ActionButton>
          </BottomSheetFooter>
        </BottomSheetContent>
      </Portal>
    </BottomSheetRoot>
  )
}
