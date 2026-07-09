import { Badge, Text, VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'
import { Callout } from 'seed-design/ui/callout'
import { ListHeader } from 'seed-design/ui/list-header'

import { SummaryListCard } from '../../../shared/ui/SummaryListCard'
import { formatAmount, formatCoinAmount } from '../../home/utils/formatAmount'
import { usePaymentCountdown } from '../hooks/usePaymentCountdown'
import type { TradeDetailViewModel } from '../types'
import { copyToClipboard } from '../utils/copyToClipboard'
import {
  getPaymentCountdownCopy,
  getPaymentFooterReportHint,
  getPaymentHeroDescription,
  getPaymentHeroTitle,
  getPaymentMemoCalloutDescription,
} from '../utils/paymentCopy'
import { formatPaymentMemo } from '../utils/paymentMemo'

interface TradePaymentBuyerPanelProps {
  trade: TradeDetailViewModel
  onAccountCopied?: () => void
  onMemoCopied?: () => void
  onCopyFailed?: () => void
}

export function TradePaymentBuyerPanel({
  trade,
  onAccountCopied,
  onMemoCopied,
  onCopyFailed,
}: TradePaymentBuyerPanelProps) {
  const sellerAccount = trade.sellerAccount
  if (!sellerAccount) return null

  const paymentMemo = formatPaymentMemo(trade.id, trade.splitLegIndex)
  const amountLabel = formatAmount(trade.amountKrw)
  const coinLabel = formatCoinAmount(trade.amountKrw)

  const countdown = usePaymentCountdown(trade.paymentDeadline)
  const countdownCopy = getPaymentCountdownCopy(
    countdown.tone,
    countdown.remainingLabel,
    countdown.deadlineLabel,
  )

  const splitLegLabel =
    trade.splitLegIndex && trade.splitTotalLegs
      ? `${trade.splitLegIndex}건 · ${amountLabel}`
      : null

  const handleCopyAccount = async () => {
    const copied = await copyToClipboard(sellerAccount.accountNumber)
    if (copied) {
      onAccountCopied?.()
    } else {
      onCopyFailed?.()
    }
  }

  const handleCopyMemo = async () => {
    const copied = await copyToClipboard(paymentMemo)
    if (copied) {
      onMemoCopied?.()
    } else {
      onCopyFailed?.()
    }
  }

  return (
    <VStack gap="x4" width="full">
      <VStack gap="x1" width="full">
        {splitLegLabel && (
          <Badge tone="warning" variant="weak" size="medium">
            {splitLegLabel}
          </Badge>
        )}
        <Text textStyle="t6Bold" color="fg.neutral" className="tabular-nums">
          {getPaymentHeroTitle(amountLabel)}
        </Text>
        <Text textStyle="t4Regular" color="fg.neutralSubtle">
          {getPaymentHeroDescription(coinLabel)}
        </Text>
      </VStack>

      {trade.paymentDeadline && (
        <Callout
          tone={countdown.tone}
          title={countdownCopy.title}
          description={countdownCopy.description}
        />
      )}

      <SummaryListCard>
        <ListHeader as="h3" variant="mediumWeak">
          입금 계좌
        </ListHeader>
        <VStack gap="x3" width="full" p="x4" pt="x0">
          <Text textStyle="t5Medium" color="fg.neutral">
            {sellerAccount.bankName}
          </Text>
          <Text textStyle="t6Bold" color="fg.neutral" className="tabular-nums">
            {sellerAccount.accountNumberMasked}
          </Text>
          <ActionButton size="medium" variant="neutralWeak" flexGrow onClick={handleCopyAccount}>
            계좌번호 복사
          </ActionButton>
          <Text textStyle="t4Regular" color="fg.neutralMuted">
            예금주 {sellerAccount.holderName}
          </Text>
        </VStack>
      </SummaryListCard>

      <SummaryListCard>
        <ListHeader as="h3" variant="mediumWeak">
          받는 분 메모
        </ListHeader>
        <VStack gap="x3" width="full" p="x4" pt="x0">
          <Text textStyle="t6Bold" color="fg.neutral" className="tabular-nums">
            {paymentMemo}
          </Text>
          <Callout tone="informative" description={getPaymentMemoCalloutDescription()} />
          <ActionButton size="medium" variant="neutralWeak" flexGrow onClick={handleCopyMemo}>
            메모 복사
          </ActionButton>
        </VStack>
      </SummaryListCard>

      <Text textStyle="t4Regular" color="fg.neutralSubtle">
        {getPaymentFooterReportHint()}
      </Text>
    </VStack>
  )
}
