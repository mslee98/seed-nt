import { Badge, Text, VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'
import { Callout } from 'seed-design/ui/callout'
import { List, ListDivider, ListItem } from 'seed-design/ui/list'
import { PageBanner } from 'seed-design/ui/page-banner'
import { ResultSection } from 'seed-design/ui/result-section'

import { formatAmount } from '../../home/utils/formatAmount'
import type { TradeDetailViewModel } from '../types'
import { copyToClipboard } from '../utils/copyToClipboard'
import { formatPaymentDeadline } from '../utils/formatPaymentDeadline'
import { TradeMotion } from './TradeMotion'

interface TradeRoomPanelProps {
  trade: TradeDetailViewModel
  onAccountCopied?: () => void
  onCopyFailed?: () => void
}

export function TradeRoomPanel({
  trade,
  onAccountCopied,
  onCopyFailed,
}: TradeRoomPanelProps) {
  const sideLabel = trade.side === 'BUY' ? '구매' : '판매'
  const isTerminal =
    trade.status === 'COMPLETED' || trade.status === 'CANCELLED' || trade.status === 'EXPIRED'

  const handleCopyAccount = async () => {
    if (!trade.sellerAccount) return
    const copied = await copyToClipboard(trade.sellerAccount.accountNumber)
    if (copied) {
      onAccountCopied?.()
    } else {
      onCopyFailed?.()
    }
  }

  if (trade.status === 'COMPLETED') {
    return (
      <VStack gap="x4" align="center" py="x2">
        <TradeMotion variant="completed" size={120} />
        <ResultSection
          title="거래가 완료됐어요"
          description={`${formatAmount(trade.amountKrw)} ${sideLabel} · ${trade.coinAmount} MS`}
        />
      </VStack>
    )
  }

  const paymentDeadlineLabel = trade.paymentDeadline
    ? formatPaymentDeadline(trade.paymentDeadline)
    : null

  return (
    <VStack gap="x5" width="full">
      <VStack gap="spacingY.betweenText">
        <Badge tone={isTerminal ? 'neutral' : 'warning'} variant="weak" size="medium">
          {isTerminal ? '종료' : '진행 중'}
        </Badge>
        <Text textStyle="t6Bold" color="fg.neutral" className="tabular-nums">
          {formatAmount(trade.amountKrw)} {sideLabel}
        </Text>
        <Text textStyle="t5Regular" color="fg.neutralMuted" className="tabular-nums">
          {trade.coinAmount} MS
        </Text>
      </VStack>

      {trade.status === 'PAYMENT_PENDING' && trade.role === 'BUYER' && trade.sellerAccount && (
        <VStack gap="x4">
          <PageBanner
            tone="informative"
            variant="weak"
            title="아래 계좌로 입금해 주세요"
            description="입금 후 「입금했어요」를 눌러주세요."
          />
          {paymentDeadlineLabel && (
            <Callout tone="warning" description={`${paymentDeadlineLabel}해 주세요.`} />
          )}
          <List width="full" aria-label="입금 계좌 정보">
            <ListItem title="은행" detail={trade.sellerAccount.bankName} />
            <ListDivider />
            <ListItem
              title="계좌번호"
              detail={trade.sellerAccount.accountNumberMasked}
              suffix={
                <ActionButton size="small" variant="neutralWeak" onClick={handleCopyAccount}>
                  복사
                </ActionButton>
              }
            />
            <ListDivider />
            <ListItem title="예금주" detail={trade.sellerAccount.holderName} />
          </List>
        </VStack>
      )}

      {trade.status === 'PAYMENT_PENDING' && trade.role === 'SELLER' && (
        <PageBanner
          tone="informative"
          variant="weak"
          title="구매자 입금을 기다리고 있어요"
          description="입금이 확인되면 알려드릴게요."
        />
      )}

      {trade.status === 'PAYMENT_REPORTED' && trade.role === 'BUYER' && (
        <PageBanner
          tone="informative"
          variant="weak"
          title="판매자 확인을 기다리고 있어요"
          description="입금 확인이 끝나면 코인이 들어와요."
        />
      )}

      {trade.status === 'PAYMENT_REPORTED' && trade.role === 'SELLER' && (
        <PageBanner
          tone="informative"
          variant="weak"
          title="구매자가 입금했다고 알려왔어요"
          description="계좌 입금 내역을 확인해 주세요."
        />
      )}
    </VStack>
  )
}
