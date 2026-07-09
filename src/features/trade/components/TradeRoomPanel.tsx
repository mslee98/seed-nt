import { Badge, Text, VStack } from '@seed-design/react'
import { Callout } from 'seed-design/ui/callout'
import { PageBanner } from 'seed-design/ui/page-banner'
import { ResultSection } from 'seed-design/ui/result-section'

import { formatAmount, formatCoinAmount, formatCoinUnit } from '../../home/utils/formatAmount'
import type { TradeDetailViewModel } from '../types'
import { TradeMotion } from './TradeMotion'

interface TradeRoomPanelProps {
  trade: TradeDetailViewModel
  onAccountCopied?: () => void
  onCopyFailed?: () => void
  onMemoCopied?: () => void
}

export function TradeRoomPanel({ trade }: TradeRoomPanelProps) {
  const sideLabel = trade.side === 'BUY' ? '구매' : '판매'
  const isTerminal =
    trade.status === 'COMPLETED' || trade.status === 'CANCELLED' || trade.status === 'EXPIRED'

  const legLabel =
    trade.splitLegIndex && trade.splitTotalLegs
      ? `${trade.splitLegIndex}건 · ${formatAmount(trade.amountKrw)}`
      : formatAmount(trade.amountKrw)

  if (trade.status === 'COMPLETED') {
    return (
      <VStack gap="x4" align="center" py="x2">
        <TradeMotion variant="completed" size={120} />
        <ResultSection
          title="거래가 완료됐어요"
          description={`${formatCoinAmount(trade.amountKrw)} ${sideLabel}`}
        />
      </VStack>
    )
  }

  if (trade.status === 'DISPUTED') {
    return (
      <VStack gap="x4" width="full" align="center">
        <Badge tone="critical" variant="weak" size="medium">
          분쟁 검토 중
        </Badge>
        <Text textStyle="t6Bold" color="fg.neutral" className="tabular-nums">
          {legLabel}
        </Text>
        <TradeMotion variant="disputed" size={96} />
        <Callout
          tone="warning"
          description="입금 확인이 맞지 않아 검토 중이에요. 다른 leg 거래는 계속할 수 있어요."
        />
      </VStack>
    )
  }

  return (
    <VStack gap="x5" width="full">
      <VStack gap="spacingY.betweenText">
        <Badge tone={isTerminal ? 'neutral' : 'warning'} variant="weak" size="medium">
          {isTerminal ? '종료' : '진행 중'}
        </Badge>
        <Text textStyle="t6Bold" color="fg.neutral" className="tabular-nums">
          {legLabel} {sideLabel}
        </Text>
        <Text textStyle="t5Regular" color="fg.neutralMuted" className="tabular-nums">
          {formatCoinUnit(trade.coinAmount)}
        </Text>
      </VStack>

      {trade.status === 'PAYMENT_PENDING' && trade.role === 'BUYER' && (
        <PageBanner
          tone="informative"
          variant="weak"
          title="입금 계좌는 아래에서 확인할 수 있어요"
          description="입금하기를 눌러 계좌와 메모를 확인해 주세요."
        />
      )}

      {trade.status === 'PAYMENT_PENDING' && trade.role === 'SELLER' && (
        <VStack gap="x4" align="center" width="full">
          <TradeMotion variant="waitingPayment" size={96} />
          <PageBanner
            tone="informative"
            variant="weak"
            title="구매자 입금을 기다리고 있어요"
            description="입금이 확인되면 알려드릴게요."
          />
        </VStack>
      )}

      {trade.status === 'PAYMENT_REPORTED' && trade.role === 'BUYER' && (
        <VStack gap="x4" align="center" width="full">
          <TradeMotion variant="paymentTransfer" size={96} />
          <PageBanner
            tone="informative"
            variant="weak"
            title="판매자가 입금을 확인하고 있어요"
            description="확인이 끝나면 코인이 들어와요."
          />
        </VStack>
      )}

      {trade.status === 'PAYMENT_REPORTED' && trade.role === 'SELLER' && (
        <PageBanner
          tone="informative"
          variant="weak"
          title="구매자가 입금했다고 알려왔어요"
          description="계좌 입금 내역과 메모를 확인해 주세요."
        />
      )}
    </VStack>
  )
}
