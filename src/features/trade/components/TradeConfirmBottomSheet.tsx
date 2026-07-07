import { Fragment, useRef, useState, type ReactNode } from 'react'
import { useActivityZIndexBase } from '@seed-design/stackflow'
import { Portal, Text, VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'
import { Callout } from 'seed-design/ui/callout'
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from 'seed-design/ui/bottom-sheet'
import { List, ListDivider, ListItem } from 'seed-design/ui/list'
import { ListHeader } from 'seed-design/ui/list-header'

import { useLayoutOverlay } from '../../../app/layouts/useLayoutOverlay'
import type { SplitMode, TradeSide } from '../../home/types'
import { formatAmount, formatAmountNumber, krwToCoin } from '../../home/utils/formatAmount'
import { buildSplitPlan } from '../utils/splitPlan'

interface TradeConfirmBottomSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  side: TradeSide
  amountKrw: number
  splitMode: SplitMode
  onConfirm: () => Promise<void>
}

function SummaryListCard({ children }: { children: ReactNode }) {
  return (
    <VStack
      width="full"
      bg="bg.layerDefault"
      borderWidth="1"
      borderColor="stroke.neutralWeak"
      borderRadius="r4"
    >
      {children}
    </VStack>
  )
}

export function TradeConfirmBottomSheet({
  open,
  onOpenChange,
  side,
  amountKrw,
  splitMode,
  onConfirm,
}: TradeConfirmBottomSheetProps) {
  const portalContainerRef = useRef<HTMLElement | null>(
    typeof document !== 'undefined' ? document.getElementById('app-frame-portal') : null,
  )
  const layerIndex = useActivityZIndexBase({ activityOffset: 1 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useLayoutOverlay(open)

  const coinAmount = krwToCoin(amountKrw)
  const splitPlan = splitMode === 'AUTO' ? buildSplitPlan(amountKrw) : null
  const sideLabel = side === 'BUY' ? '구매' : '판매'
  const title =
    side === 'BUY'
      ? `${formatAmount(amountKrw)} 구매할까요?`
      : `${formatAmount(amountKrw)} 판매 등록할까요?`

  const handleConfirm = async () => {
    setLoading(true)
    setError(null)
    try {
      await onConfirm()
      onOpenChange(false)
    } catch (err) {
      if (err instanceof Error && err.message === 'ACTIVE_TRADE_LIMIT') {
        setError('이미 진행 중인 거래가 있어요.')
      } else {
        setError('거래를 시작하지 못했어요. 다시 시도해 주세요.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <BottomSheetRoot open={open} onOpenChange={onOpenChange}>
      <Portal container={portalContainerRef}>
        <BottomSheetContent title={title} layerIndex={layerIndex} showHandle>
          <BottomSheetBody>
            <VStack gap="x4" width="full">
              <SummaryListCard>
                <List width="full" itemBorderRadius="r2" aria-label="거래 요약">
                  <ListItem title="거래 유형" detail={sideLabel} />
                  <ListDivider />
                  <ListItem title="거래 금액" detail={formatAmount(amountKrw)} />
                  <ListDivider />
                  <ListItem title="코인 수량" detail={`${coinAmount} MS`} />
                  <ListDivider />
                  <ListItem title="수수료" detail="없음" />
                  {splitPlan && splitPlan.legCount > 1 && (
                    <>
                      <ListDivider />
                      <ListItem
                        title="분할 매칭"
                        detail={`${formatAmountNumber(splitPlan.unitAmountKrw)}원 × ${splitPlan.legCount}건`}
                      />
                    </>
                  )}
                </List>
              </SummaryListCard>
              {splitPlan && splitPlan.legCount > 1 && (
                <VStack gap="x2" width="full">
                  <Text textStyle="t4Regular" color="fg.neutralSubtle">
                    {formatAmount(amountKrw)}을 {formatAmountNumber(splitPlan.unitAmountKrw)}원씩
                    {splitPlan.legCount}건으로 나눠 순서대로 매칭할게요.
                  </Text>
                  <SummaryListCard>
                    <ListHeader as="h3" variant="mediumWeak">
                      거래 순서
                    </ListHeader>
                    <List width="full" itemBorderRadius="r2" aria-label="분할 거래 순서">
                      {splitPlan.legAmounts.map((amount, i) => (
                        <Fragment key={i}>
                          {i > 0 && <ListDivider />}
                          <ListItem
                            highlighted={i === 0}
                            title={`${i + 1}번째`}
                            detail={`${formatAmount(amount)}${i === 0 ? ' · 이번에 시작' : ' · 이어서 진행'}`}
                          />
                        </Fragment>
                      ))}
                    </List>
                  </SummaryListCard>
                </VStack>
              )}
              {error && <Callout tone="critical" description={error} />}
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
              매칭 시작하기
            </ActionButton>
          </BottomSheetFooter>
        </BottomSheetContent>
      </Portal>
    </BottomSheetRoot>
  )
}
