import { Fragment, useRef, useState } from 'react'
import { useActivityZIndexBase } from '@seed-design/stackflow'
import { Portal, Text, VStack } from '@seed-design/react'
import { useLoading } from 'react-simplikit'
import { BottomActionButton } from '../../../shared/ui/BottomActionButton'
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
import { SummaryListCard } from '../../../shared/ui/SummaryListCard'
import { BottomSheetBottomCTA } from '../../../shared/ui/BottomSheetBottomCTA'
import type { SplitMode, TradeSide } from '../../home/types'
import { formatAmount, formatAmountNumber, formatCoinUnit, krwToCoin } from '../../home/utils/formatAmount'
import { buildSplitPlan } from '../utils/splitPlan'

interface TradeConfirmBottomSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  side: TradeSide
  amountKrw: number
  splitMode: SplitMode
  onConfirm: () => Promise<void>
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
  const [loading, startLoading] = useLoading()
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
    setError(null)
    try {
      await startLoading(onConfirm())
      onOpenChange(false)
    } catch (err) {
      if (err instanceof Error && err.message === 'ACTIVE_TRADE_LIMIT') {
        setError('이미 진행 중인 거래가 있어요.')
      } else {
        setError('거래를 시작하지 못했어요. 다시 시도해 주세요.')
      }
    }
  }

  const showSplitDetails = splitPlan && splitPlan.legCount > 1

  return (
    <BottomSheetRoot open={open} onOpenChange={onOpenChange}>
      <Portal container={portalContainerRef}>
        <BottomSheetContent
          title={title}
          layerIndex={layerIndex}
          showHandle
          aria-describedby={undefined}
        >
          <BottomSheetBody>
            <VStack gap="x4" width="full">
              <SummaryListCard>
                <List width="full" itemBorderRadius="r2" aria-label="거래 요약">
                  <ListItem title="거래 유형" detail={sideLabel} />
                  <ListDivider />
                  <ListItem title="거래 금액" detail={formatAmount(amountKrw)} />
                  <ListDivider />
                  <ListItem title="코인 수량" detail={formatCoinUnit(coinAmount)} />
                  <ListDivider />
                  <ListItem title="수수료" detail="없음" />
                  {showSplitDetails && (
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

              {showSplitDetails ? (
                <VStack gap="x2" width="full">
                  <Text textStyle="t4Regular" color="fg.neutralSubtle">
                    {formatAmount(amountKrw)}을 {formatAmountNumber(splitPlan.unitAmountKrw)}원씩
                    {splitPlan.legCount}건으로 나눠 동시에 매칭할게요.
                  </Text>
                  <SummaryListCard>
                    <ListHeader as="h3" variant="mediumWeak">
                      거래 순서
                    </ListHeader>
                    <List width="full" itemBorderRadius="r2" aria-label="분할 거래 순서">
                      {splitPlan.legAmounts.map((amount, i) => (
                        <Fragment key={i}>
                          {i > 0 && <ListDivider />}
                          <ListItem title={`${i + 1}번째`} detail={formatAmount(amount)} />
                        </Fragment>
                      ))}
                    </List>
                  </SummaryListCard>
                </VStack>
              ) : side === 'SELL' ? (
                <Text textStyle="t4Regular" color="fg.neutralSubtle">
                  한 건으로 등록하고 매칭을 시작할게요.
                </Text>
              ) : null}

              {error && <Callout tone="critical" description={error} />}
            </VStack>
          </BottomSheetBody>
          <BottomSheetFooter>
            <BottomSheetBottomCTA behavior="fixed">
              <BottomActionButton
                size="large"
                variant="brandSolid"
                flexGrow
                loading={loading}
                onClick={handleConfirm}
              >
                매칭 시작하기
              </BottomActionButton>
            </BottomSheetBottomCTA>
          </BottomSheetFooter>
        </BottomSheetContent>
      </Portal>
    </BottomSheetRoot>
  )
}
