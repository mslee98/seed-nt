import { useState } from 'react'
import { Box, Text, VStack } from '@seed-design/react'
import { Callout } from 'seed-design/ui/callout'
import { List, ListDivider, ListItem } from 'seed-design/ui/list'
import { ListHeader } from 'seed-design/ui/list-header'
import { ActionButton } from 'seed-design/ui/action-button'

import { TextLinkButton } from '../../../shared/components/TextLinkButton'
import { SummaryListCard } from '../../../shared/ui/SummaryListCard'
import { formatAmount, formatCoinAmount, formatCoinUnit } from '../../../shared/utils/formatAmount'
import {
  getPaymentReportedBuyerAssetProtection,
  getPaymentReportedBuyerCancelHint,
  getPaymentReportedBuyerNextSteps,
  getPaymentReportedBuyerOutcome,
  getPaymentReportedBuyerTitle,
} from '../copy'
import { usePaymentCountdown } from '../hooks/usePaymentCountdown'
import type { TradeDetailViewModel } from '../types'
import { TradeMotion } from './TradeMotion'
import { TradePaymentProgressSteps } from './TradePaymentProgressSteps'

const HERO_MOTION_SIZE = 64

interface TradePaymentBuyerWaitingPanelProps {
  trade: TradeDetailViewModel
  motionMountWhen?: boolean
  /** @deprecated 상단 중복 제거 — 전체 레이아웃만 사용 */
  embedded?: boolean
  onAccountCopied?: () => void
  onCopyFailed?: () => void
  onContactSupport?: () => void
  onOpenDispute?: () => void
}

export function TradePaymentBuyerWaitingPanel({
  trade,
  motionMountWhen = true,
  onContactSupport,
  onOpenDispute,
}: TradePaymentBuyerWaitingPanelProps) {
  const amountLabel = formatAmount(trade.amountKrw)
  const coinLabel = formatCoinAmount(trade.amountKrw)
  const coinUnitLabel = formatCoinUnit(trade.coinAmount)
  const nextSteps = getPaymentReportedBuyerNextSteps()
  const countdown = usePaymentCountdown(trade.sellerConfirmDeadline)
  const [showTimeline, setShowTimeline] = useState(false)
  const [showDepositInfo, setShowDepositInfo] = useState(false)
  const sellerAccount = trade.sellerAccount
  const deadlineExpired = Boolean(trade.sellerConfirmDeadline) && countdown.isExpired

  return (
    <VStack gap="x5" width="full">
      <TradePaymentProgressSteps currentStep="confirm" />

      <VStack gap="x3" width="full" align="center">
        <Box aria-hidden="true">
          <TradeMotion
            variant="paymentTransfer"
            size={HERO_MOTION_SIZE}
            mountWhen={motionMountWhen}
          />
        </Box>
        <Text textStyle="t7Bold" color="fg.neutral" style={{ textAlign: 'center' }}>
          {getPaymentReportedBuyerTitle()}
        </Text>
        {trade.sellerConfirmDeadline && (
          <Text textStyle="t5Bold" color="fg.informative" className="tabular-nums">
            {countdown.isExpired ? '확인 시간이 지났어요' : `${countdown.remainingLabel} 남음`}
          </Text>
        )}
        <Text
          textStyle="t4Regular"
          color="fg.neutralSubtle"
          style={{ textAlign: 'center', whiteSpace: 'pre-line' }}
        >
          {getPaymentReportedBuyerOutcome(coinLabel)}
        </Text>
      </VStack>

      <Callout
        tone="informative"
        description={getPaymentReportedBuyerAssetProtection(coinUnitLabel)}
      />

      <SummaryListCard>
        <ListHeader as="h3" variant="mediumWeak">
          거래 요약
        </ListHeader>
        <List width="full" itemBorderRadius="r2" aria-label="거래 요약">
          <ListItem title="구매 Coin" detail={coinUnitLabel} />
          <ListDivider />
          <ListItem title="입금 금액" detail={amountLabel} />
          <ListDivider />
          <ListItem title="수수료" detail="없어요" />
        </List>
      </SummaryListCard>

      <VStack gap="x2" width="full" align="flex-start">
        <Text textStyle="t5Bold" color="fg.neutral">
          다음 처리
        </Text>
        {nextSteps.map((step) => (
          <Text key={step} textStyle="t4Regular" color="fg.neutralMuted">
            {`· ${step}`}
          </Text>
        ))}
      </VStack>

      <VStack gap="x2" width="full" align="flex-start">
        <TextLinkButton onClick={() => setShowTimeline((prev) => !prev)}>
          {showTimeline ? '진행 내역 접기' : '진행 내역 보기'}
        </TextLinkButton>
        {showTimeline && (
          <SummaryListCard>
            <List width="full" aria-label="진행 내역">
              <ListItem title="매칭 완료" detail="완료" />
              <ListDivider />
              <ListItem title="입금 완료" detail="완료" />
              <ListDivider />
              <ListItem title="확인 대기" detail="진행 중" />
              <ListDivider />
              <ListItem title="지급 완료" detail="대기" />
            </List>
          </SummaryListCard>
        )}

        <TextLinkButton onClick={() => setShowDepositInfo((prev) => !prev)}>
          {showDepositInfo ? '입금 정보 접기' : '입금 정보 보기'}
        </TextLinkButton>
        {showDepositInfo && sellerAccount && (
          <SummaryListCard>
            <List width="full" aria-label="입금 정보">
              <ListItem title="은행" detail={sellerAccount.bankName} />
              <ListDivider />
              <ListItem title="계좌" detail={sellerAccount.accountNumberMasked} />
              <ListDivider />
              <ListItem title="예금주" detail={sellerAccount.holderName} />
              <ListDivider />
              <ListItem title="거래 상대" detail={trade.counterpartyNickname} />
            </List>
          </SummaryListCard>
        )}
      </VStack>

      <Text textStyle="t3Regular" color="fg.neutralMuted">
        {getPaymentReportedBuyerCancelHint()}
      </Text>

      {deadlineExpired && (
        <VStack gap="x2" width="full">
          {onContactSupport && (
            <ActionButton size="large" variant="neutralWeak" onClick={onContactSupport}>
              판매자에게 다시 알림
            </ActionButton>
          )}
          {onOpenDispute && (
            <ActionButton size="large" variant="neutralOutline" onClick={onOpenDispute}>
              입금 문제 신고
            </ActionButton>
          )}
        </VStack>
      )}
    </VStack>
  )
}
