import { Badge, Text, VStack } from '@seed-design/react'
import { PageBanner } from 'seed-design/ui/page-banner'

import { formatAmount } from '../../home/utils/formatAmount'
import { getTradeStatusCopy } from '../../home/utils/tradeStatusCopy'
import type { TradeStatus } from '../../home/types'
import { getMockTransactionById } from '../../transactions/mocks/transactions.mock'

interface TradeDetailScreenProps {
  tradeId: string
}

export function TradeDetailScreen({ tradeId }: TradeDetailScreenProps) {
  const trade = getMockTransactionById(tradeId)

  if (!trade) {
    return (
      <VStack
        px="spacingX.globalGutter"
        pt="spacingY.navToTitle"
        pb="spacingY.screenBottom"
        gap="spacingY.betweenText"
      >
        <Text textStyle="screenTitle" color="fg.neutral">
          거래를 찾을 수 없어요
        </Text>
        <Text textStyle="t5Regular" color="fg.neutralMuted">
          거래 ID: {tradeId}
        </Text>
      </VStack>
    )
  }

  const sideLabel = trade.type === 'BUY' ? '구매' : '판매'
  const isTerminal =
    trade.status === 'COMPLETED' || trade.status === 'CANCELLED' || trade.status === 'EXPIRED'
  const statusCopy = isTerminal
    ? { badge: trade.status === 'COMPLETED' ? '완료' : '종료', title: `${sideLabel} 거래`, description: '' }
    : getTradeStatusCopy(trade.status as TradeStatus)

  return (
    <VStack
      px="spacingX.globalGutter"
      pt="spacingY.navToTitle"
      pb="spacingY.screenBottom"
      gap="x6"
    >
      <VStack gap="spacingY.betweenText">
        <Badge tone={isTerminal ? 'neutral' : 'warning'} variant="weak" size="medium">
          {statusCopy.badge}
        </Badge>
        <Text textStyle="screenTitle" color="fg.neutral" className="tabular-nums">
          {formatAmount(trade.amountKrw)} {sideLabel}
        </Text>
        <Text textStyle="t5Regular" color="fg.neutralMuted" className="tabular-nums">
          {trade.coinAmount} MS
        </Text>
      </VStack>

      {!isTerminal && statusCopy.description && (
        <PageBanner
          tone="informative"
          variant="weak"
          title={statusCopy.title}
          description={statusCopy.description}
        />
      )}

      <VStack gap="x2">
        <Text textStyle="t4Regular" color="fg.neutralSubtle">
          거래 ID
        </Text>
        <Text textStyle="t4Medium" color="fg.neutral">
          {trade.id}
        </Text>
      </VStack>
    </VStack>
  )
}
