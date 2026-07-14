import { Badge, Box, Text, VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'
import { List, ListDivider, ListItem } from 'seed-design/ui/list'
import { ListHeader } from 'seed-design/ui/list-header'

import { PAYMENT_WAITING_LOTTIE_SIZE } from '../../../shared/constants/motion'
import { SummaryListCard } from '../../../shared/ui/SummaryListCard'
import { formatAmount, formatCoinAmount, formatCoinUnit } from '../../../shared/utils/formatAmount'
import {
  getPaymentReportedBuyerBadge,
  getPaymentReportedBuyerDelayHint,
  getPaymentReportedBuyerDescription,
  getPaymentReportedBuyerOutcome,
  getPaymentReportedBuyerReassuranceLines,
  getPaymentReportedBuyerStatusLine,
  getPaymentReportedBuyerTitle,
} from '../copy'
import type { TradeDetailViewModel } from '../types'
import { copyToClipboard } from '../utils/copyToClipboard'
import { TradeMotion } from './TradeMotion'
import { TradePaymentProgressSteps } from './TradePaymentProgressSteps'

interface TradePaymentBuyerWaitingPanelProps {
  trade: TradeDetailViewModel
  motionMountWhen?: boolean
  /** TradeRoomPanel 안에 넣을 때 상단 요약은 부모가 담당 */
  embedded?: boolean
  onAccountCopied?: () => void
  onCopyFailed?: () => void
}

export function TradePaymentBuyerWaitingPanel({
  trade,
  motionMountWhen = true,
  embedded = false,
  onAccountCopied,
  onCopyFailed,
}: TradePaymentBuyerWaitingPanelProps) {
  const sideLabel = trade.side === 'BUY' ? '구매' : '판매'
  const amountLabel = formatAmount(trade.amountKrw)
  const coinLabel = formatCoinAmount(trade.amountKrw)
  const legLabel =
    trade.splitLegIndex && trade.splitTotalLegs
      ? `${trade.splitLegIndex}건 · ${amountLabel}`
      : amountLabel
  const reassuranceLines = getPaymentReportedBuyerReassuranceLines()
  const sellerAccount = trade.sellerAccount

  const handleCopyAccount = async () => {
    if (!sellerAccount) return
    const copied = await copyToClipboard(sellerAccount.accountNumber)
    if (copied) {
      onAccountCopied?.()
    } else {
      onCopyFailed?.()
    }
  }

  return (
    <VStack gap="x5" width="full">
      {!embedded && (
        <VStack gap="spacingY.betweenText" width="full">
          <Badge tone="warning" variant="weak" size="medium">
            {getPaymentReportedBuyerBadge()}
          </Badge>
          <Text textStyle="t6Bold" color="fg.neutral" className="tabular-nums">
            {legLabel} {sideLabel}
          </Text>
          <Text textStyle="t5Regular" color="fg.neutralMuted" className="tabular-nums">
            {formatCoinUnit(trade.coinAmount)}
          </Text>
        </VStack>
      )}

      <SummaryListCard>
        <VStack gap="x4" width="full" p="x5" align="center">
          <Box display="flex" justifyContent="center" width="full">
            <TradeMotion
              variant="paymentTransfer"
              size={PAYMENT_WAITING_LOTTIE_SIZE}
              mountWhen={motionMountWhen}
            />
          </Box>
          <VStack gap="x2" width="full" align="center">
            <Text textStyle="t5Bold" color="fg.neutral" className="text-center">
              {getPaymentReportedBuyerTitle()}
            </Text>
            <Text textStyle="t4Regular" color="fg.neutralMuted" className="text-center">
              {getPaymentReportedBuyerDescription()}
            </Text>
            <Text textStyle="t4Regular" color="fg.neutralSubtle" className="text-center">
              {getPaymentReportedBuyerOutcome(coinLabel)}
            </Text>
          </VStack>
        </VStack>
      </SummaryListCard>

      <TradePaymentProgressSteps currentStep="confirm" />

      <SummaryListCard>
        <ListHeader as="h3" variant="mediumWeak">
          거래 정보
        </ListHeader>
        <List width="full" itemBorderRadius="r2" aria-label="거래 정보">
          <ListItem title="입금 금액" detail={amountLabel} />
          <ListDivider />
          <ListItem title="지급 예정" detail={coinLabel} />
          <ListDivider />
          <ListItem title="확인 상태" detail={getPaymentReportedBuyerStatusLine()} />
          <ListDivider />
          <ListItem title="거래 상대" detail={trade.counterpartyNickname} />
          {sellerAccount && (
            <>
              <ListDivider />
              <ListItem title="입금 계좌" detail={sellerAccount.accountNumberMasked} />
            </>
          )}
        </List>
      </SummaryListCard>

      <VStack gap="x1" width="full">
        {reassuranceLines.map((line) => (
          <Text key={line} textStyle="t4Regular" color="fg.neutralMuted">
            {line}
          </Text>
        ))}
        <Text textStyle="t4Regular" color="fg.neutralSubtle">
          {getPaymentReportedBuyerDelayHint()}
        </Text>
      </VStack>

      {sellerAccount && !embedded && onAccountCopied && (
        <ActionButton size="medium" variant="neutralWeak" flexGrow onClick={handleCopyAccount}>
          계좌번호 복사
        </ActionButton>
      )}
    </VStack>
  )
}
