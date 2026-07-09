import { useRef } from 'react'
import { useActivityZIndexBase } from '@seed-design/stackflow'
import { Portal, Text, VStack } from '@seed-design/react'
import { useLoading } from 'react-simplikit'
import { ActionButton } from 'seed-design/ui/action-button'
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from 'seed-design/ui/bottom-sheet'
import { List, ListDivider, ListItem } from 'seed-design/ui/list'

import { useLayoutOverlay } from '../../../app/layouts/useLayoutOverlay'
import { formatAmount, formatCoinAmount } from '../../home/utils/formatAmount'
import type { MatchingCandidate } from '../matching/types'
import { MatchingCandidateTagGroup } from './MatchingCandidateTagGroup'

interface MatchingAcceptBottomSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  candidate: MatchingCandidate | null
  onConfirm: (candidateId: string) => void | Promise<void>
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
  const layerIndex = useActivityZIndexBase({ activityOffset: 2 })
  const [loading, startLoading] = useLoading()

  useLayoutOverlay(open)

  if (!candidate) return null

  const handleConfirm = () => {
    void startLoading(Promise.resolve(onConfirm(candidate.id)))
  }

  return (
    <BottomSheetRoot open={open} onOpenChange={onOpenChange}>
      <Portal container={portalContainerRef}>
        <BottomSheetContent
          title={`${candidate.nickname}님과 거래할까요?`}
          layerIndex={layerIndex}
          showHandle
          aria-describedby={undefined}
        >
          <BottomSheetBody>
            <VStack gap="x4" width="full">
              <MatchingCandidateTagGroup candidate={candidate} />
              <List width="full" aria-label="매칭 후보 요약">
                <ListItem title="거래 금액" detail={formatAmount(candidate.amountKrw)} />
                <ListDivider />
                <ListItem title="코인 수량" detail={formatCoinAmount(candidate.amountKrw)} />
                <ListDivider />
                <ListItem title="거래 횟수" detail={`${candidate.tradeCount}회`} />
                <ListDivider />
                <ListItem title="평점" detail={candidate.rating.toFixed(1)} />
              </List>
              <Text textStyle="t4Regular" color="fg.neutralSubtle">
                상대도 승인하면 거래가 시작돼요.
              </Text>
            </VStack>
          </BottomSheetBody>
          <BottomSheetFooter>
            <VStack gap="x2" width="full">
              <ActionButton
                size="large"
                variant="brandSolid"
                flexGrow
                loading={loading}
                disabled={loading}
                onClick={handleConfirm}
              >
                이 상대에게 제안하기
              </ActionButton>
              <ActionButton
                size="large"
                variant="neutralWeak"
                flexGrow
                disabled={loading}
                onClick={() => onOpenChange(false)}
              >
                다른 상대 보기
              </ActionButton>
            </VStack>
          </BottomSheetFooter>
        </BottomSheetContent>
      </Portal>
    </BottomSheetRoot>
  )
}
