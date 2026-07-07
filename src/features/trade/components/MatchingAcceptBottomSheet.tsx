import { useRef, useState } from 'react'
import { useActivityZIndexBase } from '@seed-design/stackflow'
import { Portal, Text, VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from 'seed-design/ui/bottom-sheet'
import { List, ListDivider, ListItem } from 'seed-design/ui/list'

import { useLayoutOverlay } from '../../../app/layouts/useLayoutOverlay'
import { formatAmount, krwToCoin } from '../../home/utils/formatAmount'
import type { MatchingCandidate } from '../matching/types'

interface MatchingAcceptBottomSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  candidate: MatchingCandidate | null
  onConfirm: (candidateId: string) => void
}

export function MatchingAcceptBottomSheet({
  open,
  onOpenChange,
  candidate,
  onConfirm,
}: MatchingAcceptBottomSheetProps) {
  const portalContainerRef = useRef<HTMLElement | null>(
    typeof document !== 'undefined' ? document.getElementById('app-frame-portal') : null,
  )
  const layerIndex = useActivityZIndexBase({ activityOffset: 1 })
  const [loading, setLoading] = useState(false)

  useLayoutOverlay(open)

  if (!candidate) return null

  const handleConfirm = () => {
    setLoading(true)
    onConfirm(candidate.id)
    setLoading(false)
    onOpenChange(false)
  }

  return (
    <BottomSheetRoot open={open} onOpenChange={onOpenChange}>
      <Portal container={portalContainerRef}>
        <BottomSheetContent
          title={`${candidate.nickname}님과 거래할까요?`}
          layerIndex={layerIndex}
          showHandle
        >
          <BottomSheetBody>
            <VStack gap="x4" width="full">
              <List width="full" aria-label="매칭 후보 요약">
                <ListItem title="거래 금액" detail={formatAmount(candidate.amountKrw)} />
                <ListDivider />
                <ListItem title="코인 수량" detail={`${krwToCoin(candidate.amountKrw)} MS`} />
                <ListDivider />
                <ListItem title="거래 횟수" detail={`${candidate.tradeCount}회`} />
                <ListDivider />
                <ListItem title="평점" detail={`${candidate.rating.toFixed(1)}점`} />
              </List>
              <Text textStyle="t4Regular" color="fg.neutralSubtle">
                상대도 승인하면 거래가 시작돼요.
              </Text>
            </VStack>
          </BottomSheetBody>
          <BottomSheetFooter>
            <ActionButton
              size="large"
              variant="brandSolid"
              flexGrow
              loading={loading}
              onClick={handleConfirm}
            >
              이 상대에게 제안하기
            </ActionButton>
          </BottomSheetFooter>
        </BottomSheetContent>
      </Portal>
    </BottomSheetRoot>
  )
}
