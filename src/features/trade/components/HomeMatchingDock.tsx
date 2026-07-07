import { useState } from 'react'
import { IconChevronRightLine } from '@karrotmarket/react-monochrome-icon'
import { Badge, Box, HStack, Icon, Text, VStack } from '@seed-design/react'
import { List, ListButtonItem } from 'seed-design/ui/list'

import { TextLinkButton } from '../../../shared/components/TextLinkButton'
import { formatAmount } from '../../home/utils/formatAmount'
import { showTradeMatchedNotification } from '../../pwa/services/pushNotificationService'
import type { TradeRecord } from '../types'
import { getTradeUiPhase } from '../utils/getTradeUiPhase'
import { getMatchedDockCopy, getMatchingCopy } from '../utils/matchingCopy'
import { TradeCancelAlertDialog } from './TradeCancelAlertDialog'

interface HomeMatchingDockProps {
  trade: TradeRecord
  onContinueTrade: () => void
  onCancel?: () => void
  /** 홈 피드가 보일 때 독을 취소 액션만 표시 */
  compact?: boolean
  splitContext?: { legIndex: number; totalLegs: number }
}

export function HomeMatchingDock({
  trade,
  onContinueTrade,
  onCancel,
  compact = false,
  splitContext,
}: HomeMatchingDockProps) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const phase = getTradeUiPhase(trade.status)

  if (phase === 'idle') {
    return null
  }

  const matchingCopy = getMatchingCopy(trade)
  const matchedCopy = getMatchedDockCopy(trade)

  const continueTitle = (() => {
    if (trade.status === 'PAYMENT_REPORTED') return '입금 확인이 필요해요'
    return matchedCopy.matchedTitle
  })()

  const continueDetail = (() => {
    if (trade.status === 'PAYMENT_REPORTED') return '구매자 입금 여부를 확인해 주세요.'
    return `${formatAmount(trade.amountKrw)} · ${trade.coinAmount} MS`
  })()

  const handleConfirmCancel = () => {
    onCancel?.()
  }

  return (
    <>
      <Box
        className={`home-matching-dock${phase === 'matching_order' ? ' home-matching-dock--order' : ''}`}
        pt="x3"
        pb="x3"
        borderTopWidth="1"
        borderColor="stroke.neutralWeak"
        bg="bg.layerDefault"
        boxShadow="s3"
      >
        {phase === 'matching_order' && (
          <HStack
            gap="x3"
            align="center"
            justify="space-between"
            px="spacingX.globalGutter"
          >
            {compact ? (
              <HStack gap="x2" align="center" flexGrow style={{ minWidth: 0 }}>
                <Badge tone="warning" variant="weak" size="medium">
                  매칭 중
                </Badge>
                <Text textStyle="t4Regular" color="fg.neutralMuted" className="tabular-nums">
                  {formatAmount(trade.amountKrw)}
                </Text>
              </HStack>
            ) : (
              <VStack gap="x1" flexGrow style={{ minWidth: 0 }}>
                <Badge tone="warning" variant="weak" size="medium">
                  매칭 중
                </Badge>
                <Text textStyle="t5Bold" color="fg.neutral">
                  {matchingCopy.title}
                </Text>
              </VStack>
            )}
            {onCancel && (
              <TextLinkButton onClick={() => setCancelDialogOpen(true)}>취소</TextLinkButton>
            )}
          </HStack>
        )}

        {phase === 'trade_in_progress' && (
          <List>
            <ListButtonItem
              title={continueTitle}
              detail={continueDetail}
              suffix={<Icon svg={<IconChevronRightLine />} size="x5" color="fg.neutralSubtle" />}
              onClick={onContinueTrade}
            />
          </List>
        )}
      </Box>

      {onCancel && (
        <TradeCancelAlertDialog
          open={cancelDialogOpen}
          onOpenChange={setCancelDialogOpen}
          variant="matching"
          splitContext={splitContext}
          onConfirm={handleConfirmCancel}
        />
      )}
    </>
  )
}

/** 매칭 완료 시 push 알림 (ready 사용자) */
export function notifyTradeMatchedIfReady(trade: TradeRecord) {
  if (trade.status !== 'PAYMENT_PENDING') return
  showTradeMatchedNotification(trade.id, formatAmount(trade.amountKrw))
}
