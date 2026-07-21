import { Badge, Text, VStack } from '@seed-design/react'
import { List, ListItem } from 'seed-design/ui/list'

import { formatAmount, formatCoinUnit } from '../../../shared/utils/formatAmount'
import { getTradeStatusCopy } from '../../trade/copy'
import type { TradeStatus } from '../../trade/types'
import { useTransactionsViewModel } from '../hooks/useTransactionsViewModel'
import type { TransactionItem } from '../types'

const COMPLETED_STATUS_LABEL: Record<'COMPLETED' | 'CANCELLED' | 'EXPIRED', string> = {
  COMPLETED: '완료',
  CANCELLED: '취소',
  EXPIRED: '만료',
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
  })
}

function isTerminalStatus(
  status: TransactionItem['status'],
): status is 'COMPLETED' | 'CANCELLED' | 'EXPIRED' {
  return status === 'COMPLETED' || status === 'CANCELLED' || status === 'EXPIRED'
}

function getTransactionLabel(item: TransactionItem): { badge: string; title: string; detail: string } {
  const sideLabel = item.type === 'BUY' ? '구매' : '판매'

  if (isTerminalStatus(item.status)) {
    return {
      badge: COMPLETED_STATUS_LABEL[item.status],
      title: `${sideLabel} ${formatAmount(item.amountKrw)}`,
      detail: `${formatDate(item.completedAt)} · ${formatCoinUnit(item.coinAmount)}`,
    }
  }

  const copy = getTradeStatusCopy(item.status as TradeStatus)
  return {
    badge: copy.badge,
    title: copy.title,
    detail: `${formatAmount(item.amountKrw)} · ${formatCoinUnit(item.coinAmount)}`,
  }
}

function getBadgeTone(status: TransactionItem['status']): 'neutral' | 'warning' | 'positive' | 'critical' {
  if (status === 'COMPLETED') return 'positive'
  if (status === 'CANCELLED' || status === 'EXPIRED') return 'neutral'
  return 'warning'
}

export function TransactionsScreen() {
  const { items } = useTransactionsViewModel()

  if (items.length === 0) {
    return (
      <VStack
        flexGrow
        align="center"
        justify="center"
        gap="spacingY.betweenText"
        px="spacingX.globalGutter"
        pb="spacingY.screenBottom"
        style={{ paddingBottom: 'var(--app-content-bottom-padding)' }}
      >
        <Text textStyle="t5Bold" color="fg.neutral">
          아직 거래 내역이 없어요
        </Text>
        <Text textStyle="t4Regular" color="fg.neutralMuted" style={{ textAlign: 'center' }}>
          첫 거래를 시작하면 여기에 기록돼요.
        </Text>
      </VStack>
    )
  }

  return (
    <VStack
      px="spacingX.globalGutter"
      pt="x2"
      style={{ paddingBottom: 'var(--app-content-bottom-padding)' }}
    >
      <List>
        {items.map((item) => {
          const label = getTransactionLabel(item)
          return (
            <ListItem
              key={item.id}
              title={label.title}
              detail={label.detail}
              prefix={
                <Badge tone={getBadgeTone(item.status)} variant="weak" size="medium">
                  {label.badge}
                </Badge>
              }
            />
          )
        })}
      </List>
    </VStack>
  )
}
