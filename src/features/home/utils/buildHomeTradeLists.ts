import type { MatchingSession } from '../../trade/matching/types'
import type { SplitGroup, TradeRecord, TradeRole, TradeStatus } from '../../trade/types'
import { formatAmount, formatCoinUnit } from '../../../shared/utils/formatAmount'
import { getHomeActiveTradeCopy } from '../../trade/copy'
import { isTerminalStatus } from '../../trade/stores/tradeSession.store'

export type HomeTradeListKind = 'attention' | 'inProgress'

export type HomeAttentionAction = 'deposit' | 'confirm' | 'matching'

export type HomeMetaSecondaryTone = 'warning' | 'muted' | 'brand'

export interface HomeTradeListItem {
  id: string
  kind: HomeTradeListKind
  title: string
  /** 단일 문자열 폴백 (검색·접근성) */
  meta: string
  /** 유형 라벨 — 예: 구매 거래 */
  metaPrimary?: string
  /** 상태·기한 — 예: 8분 남음 */
  metaSecondary?: string
  metaSecondaryTone?: HomeMetaSecondaryTone
  detail?: string
  badge?: string
  attentionAction?: HomeAttentionAction
  tradeId?: string
  splitGroupId?: string
}

function isAttentionTrade(
  status: TradeStatus,
  role: TradeRole,
  matchingSession: MatchingSession | null,
  tradeId: string,
): boolean {
  if (role === 'BUYER' && status === 'PAYMENT_PENDING') return true
  if (role === 'SELLER' && status === 'PAYMENT_REPORTED') return true
  if (
    status === 'MATCHING' &&
    matchingSession?.suggestion != null &&
    matchingSession.tradeId === tradeId
  ) {
    return true
  }
  return false
}

function formatRemainingMinutes(deadline?: string): string | null {
  if (!deadline) return null
  const ms = new Date(deadline).getTime() - Date.now()
  if (Number.isNaN(ms)) return null
  if (ms <= 0) return '기한이 지났어요'
  const minutes = Math.max(1, Math.ceil(ms / 60_000))
  return `${minutes}분 남음`
}

function sideLabel(role: TradeRole): string {
  return role === 'BUYER' ? '구매 거래' : '판매 거래'
}

function joinMeta(primary: string, secondary?: string | null): string {
  return secondary ? `${primary} · ${secondary}` : primary
}

function buildAttentionCopy(trade: TradeRecord, matchingSession: MatchingSession | null) {
  const side = sideLabel(trade.role)
  const remaining = formatRemainingMinutes(trade.paymentDeadline)

  if (trade.role === 'BUYER' && trade.status === 'PAYMENT_PENDING') {
    return {
      title: `${formatAmount(trade.amountKrw)} 입금이 필요해요`,
      meta: joinMeta(side, remaining),
      metaPrimary: side,
      metaSecondary: remaining ?? undefined,
      metaSecondaryTone: remaining ? ('warning' as const) : undefined,
      detail: '입금하면 바로 다음 단계로 진행돼요',
      attentionAction: 'deposit' as const,
    }
  }

  if (trade.role === 'SELLER' && trade.status === 'PAYMENT_REPORTED') {
    return {
      title: `${formatAmount(trade.amountKrw)} 입금을 확인해 주세요`,
      meta: joinMeta(side, '구매자 입금 완료'),
      metaPrimary: side,
      metaSecondary: '구매자 입금 완료',
      metaSecondaryTone: 'muted' as const,
      detail: '확인 후 Coin 이전이 진행돼요',
      attentionAction: 'confirm' as const,
    }
  }

  const fallback = getHomeActiveTradeCopy({
    status: trade.status,
    role: trade.role,
    matchingSession:
      trade.status === 'MATCHING' && matchingSession?.tradeId === trade.id
        ? matchingSession
        : null,
  })

  return {
    title: fallback.title,
    meta: joinMeta(side, fallback.badge),
    metaPrimary: side,
    metaSecondary: fallback.badge,
    metaSecondaryTone: 'brand' as const,
    detail: fallback.description,
    attentionAction: 'matching' as const,
  }
}

function buildInProgressCopy(trade: TradeRecord) {
  const sideBadge = trade.role === 'BUYER' ? '구매' : '판매'

  if (trade.role === 'BUYER' && trade.status === 'PAYMENT_REPORTED') {
    return {
      title: `받을 예정 ${formatCoinUnit(trade.coinAmount)}`,
      meta: '판매자 확인 대기',
      badge: sideBadge,
    }
  }

  if (trade.status === 'MATCHING') {
    return {
      title: `${formatAmount(trade.amountKrw)} ${trade.role === 'BUYER' ? '구매' : '판매'} 매칭 중`,
      meta: trade.role === 'BUYER' ? '판매자를 찾고 있어요' : '구매자를 찾고 있어요',
      badge: sideBadge,
    }
  }

  if (trade.role === 'SELLER' && trade.status === 'PAYMENT_PENDING') {
    return {
      title: `${formatAmount(trade.amountKrw)} 입금 대기`,
      meta: '구매자 입금을 기다리고 있어요',
      badge: sideBadge,
    }
  }

  return {
    title: `${formatAmount(trade.amountKrw)} 거래 진행 중`,
    meta: sideLabel(trade.role),
    badge: sideBadge,
  }
}

function buildSplitInProgressItem(splitGroup: SplitGroup): HomeTradeListItem {
  const sideLabelText = splitGroup.side === 'BUY' ? '구매' : '판매'
  return {
    id: `split-${splitGroup.id}`,
    kind: 'inProgress',
    title: `${formatAmount(splitGroup.totalAmountKrw)} ${sideLabelText} 진행 중`,
    meta: `${splitGroup.completedLegs}/${splitGroup.totalLegs}건 완료`,
    badge: `${sideLabelText} ${splitGroup.totalLegs}건`,
    splitGroupId: splitGroup.id,
  }
}

/**
 * 홈 「지금 필요한 활동」/「진행 중인 거래」리스트 파생.
 * 한 거래는 attention XOR inProgress — 동시에 양쪽에 넣지 않습니다.
 */
export function buildHomeTradeLists(input: {
  activeTrade: TradeRecord | null
  splitGroup: SplitGroup | null
  matchingSession: MatchingSession | null
  fallbackActiveTrade?: {
    id: string
    role: TradeRole
    status: TradeStatus
    amountKrw: number
    coinAmount: number
  }
}): { attentionItems: HomeTradeListItem[]; inProgressItems: HomeTradeListItem[] } {
  const attentionItems: HomeTradeListItem[] = []
  const inProgressItems: HomeTradeListItem[] = []

  if (input.splitGroup) {
    inProgressItems.push(buildSplitInProgressItem(input.splitGroup))
  }

  const trade =
    input.activeTrade && !isTerminalStatus(input.activeTrade.status)
      ? input.activeTrade
      : input.fallbackActiveTrade && !isTerminalStatus(input.fallbackActiveTrade.status)
        ? ({
            ...input.fallbackActiveTrade,
            side: input.fallbackActiveTrade.role === 'BUYER' ? 'BUY' : 'SELL',
            version: 0,
            matchingStartedAt: '',
            updatedAt: '',
          } satisfies TradeRecord)
        : null

  if (!trade || trade.splitGroupId) {
    return { attentionItems, inProgressItems }
  }

  const needsAttention = isAttentionTrade(
    trade.status,
    trade.role,
    input.matchingSession,
    trade.id,
  )

  if (needsAttention) {
    const copy = buildAttentionCopy(trade, input.matchingSession)
    attentionItems.push({
      id: trade.id,
      kind: 'attention',
      title: copy.title,
      meta: copy.meta,
      metaPrimary: copy.metaPrimary,
      metaSecondary: copy.metaSecondary,
      metaSecondaryTone: copy.metaSecondaryTone,
      detail: copy.detail,
      attentionAction: copy.attentionAction,
      tradeId: trade.id,
    })
  } else {
    const copy = buildInProgressCopy(trade)
    inProgressItems.push({
      id: trade.id,
      kind: 'inProgress',
      title: copy.title,
      meta: copy.meta,
      badge: copy.badge,
      tradeId: trade.id,
    })
  }

  return { attentionItems, inProgressItems }
}
