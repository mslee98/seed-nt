import { IconChevronRightLine } from '@karrotmarket/react-monochrome-icon'
import { Badge, Icon } from '@seed-design/react'
import { List, ListButtonItem } from 'seed-design/ui/list'

import { useLayout } from '../../../app/layouts/LayoutContext'
import { formatAmount } from '../../home/utils/formatAmount'
import { actions } from '../../../stackflow/stackflow'
import { useActiveSplitGroup } from '../hooks/useActiveSplitGroup'
import { useActiveTrade } from '../hooks/useActiveTrade'
import { isTerminalStatus } from '../stores/tradeSession.store'
import { getTradeUiPhase } from '../utils/getTradeUiPhase'
import { formatSplitLegSuffix } from '../utils/splitProgressCopy'
export function GlobalActiveTradeBanner() {
  const { pathname } = useLayout()
  const activeTrade = useActiveTrade()
  const splitGroup = useActiveSplitGroup()

  if (pathname === '/' || !activeTrade || isTerminalStatus(activeTrade.status)) {
    return null
  }

  const phase = getTradeUiPhase(activeTrade.status)

  if (phase === 'idle') {
    return null
  }

  const handleNavigateHome = () => {
    actions.replace('Home', {}, { animate: false })
  }

  const handleContinueTrade = () => {
    actions.replace('Home', {}, { animate: false })
    window.dispatchEvent(
      new CustomEvent('brit:open-trade-payment', {
        detail: { tradeId: activeTrade.id },
      }),
    )
  }

  const legSuffix =
    splitGroup && activeTrade.splitLegIndex
      ? formatSplitLegSuffix(activeTrade.splitLegIndex, splitGroup.totalLegs)
      : ''

  if (phase === 'matching_order') {
    return (
      <div className="global-active-trade-banner">
        <List>
          <ListButtonItem
            title={`${formatAmount(activeTrade.amountKrw)} · 정확한 금액으로 매칭 중${legSuffix}`}
            prefix={
              <Badge tone="warning" variant="weak" size="medium">
                매칭 중
              </Badge>
            }
            suffix={<Icon svg={<IconChevronRightLine />} size="x5" color="fg.neutralSubtle" />}
            onClick={handleNavigateHome}
          />
        </List>
      </div>
    )
  }

  const title =
    activeTrade.status === 'PAYMENT_REPORTED'
      ? '입금 확인이 필요해요'
      : `${formatAmount(activeTrade.amountKrw)} · 거래 이어하기${legSuffix}`
  const detail =
    activeTrade.status === 'PAYMENT_REPORTED'
      ? '구매자 입금 여부를 확인해 주세요.'
      : undefined

  return (
    <div className="global-active-trade-banner">
      <List>
        <ListButtonItem
          title={title}
          detail={detail}
          prefix={
            <Badge tone="warning" variant="weak" size="medium">
              진행 중
            </Badge>
          }
          suffix={<Icon svg={<IconChevronRightLine />} size="x5" color="fg.neutralSubtle" />}
          onClick={handleContinueTrade}
        />
      </List>
    </div>
  )
}
