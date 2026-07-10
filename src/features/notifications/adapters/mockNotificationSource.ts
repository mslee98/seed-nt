import { getActivityFromPathname } from '../../../app/layouts/LayoutContext'
import { formatAmount } from '../../home/utils/formatAmount'
import { getMatchingSession, subscribeMatchingSession } from '../../trade/matching/matchingSession.store'
import {
  getActiveTrade,
  getTradeSessionVersion,
  getTradesById,
  subscribeTradeSession,
} from '../../trade/stores/tradeSession.store'
import type { TradeRecord } from '../../trade/types'
import { createNotificationId, dispatchNotification } from '../dispatchNotification'
import { deliverPushNotification } from './pushChannel'
import type { NotificationPayload } from '../types'

type EmitHandler = (result: ReturnType<typeof dispatchNotification>) => void

let emitHandler: EmitHandler | null = null
let initialized = false

const prevTradeStatusById = new Map<string, TradeRecord['status']>()
let lastSuggestionCandidateId: string | null = null

function getDispatchContext() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/'
  const activeTrade = getActiveTrade()

  return {
    currentActivity: getActivityFromPathname(pathname),
    pathname,
    tradeId: activeTrade?.id ?? null,
    splitGroupId: activeTrade?.splitGroupId ?? null,
    tradeRole: activeTrade?.role ?? null,
    isActivityActive: true,
    isDocumentVisible: typeof document !== 'undefined' ? document.visibilityState === 'visible' : true,
  }
}

function emit(payload: NotificationPayload) {
  const result = dispatchNotification(payload, getDispatchContext())
  if (result.push) {
    deliverPushNotification(result.push)
  }
  if (payload.type === 'TRADE_BOUND' || payload.type === 'PAYMENT_REPORTED') {
    deliverPushNotification(payload)
  }
  emitHandler?.(result)
}

function handleTradeStatusChange(trade: TradeRecord, prevStatus?: TradeRecord['status']) {
  const amountLabel = formatAmount(trade.amountKrw)

  if (prevStatus === 'MATCHING' && trade.status === 'PAYMENT_PENDING') {
    const message =
      trade.role === 'BUYER'
        ? '매칭이 완료됐어요. 입금을 이어해 주세요.'
        : '구매자를 찾았어요. 입금을 기다려 주세요.'

    emit({
      id: createNotificationId('TRADE_BOUND', trade.id),
      type: 'TRADE_BOUND',
      tradeId: trade.id,
      splitGroupId: trade.splitGroupId,
      focusLeg: trade.splitLegIndex,
      amountKrw: trade.amountKrw,
      title: trade.role === 'BUYER' ? '매칭됐어요' : '구매자를 찾았어요',
      message,
      priority: 'high',
      createdAt: new Date().toISOString(),
    })
  }

  if (prevStatus === 'PAYMENT_PENDING' && trade.status === 'PAYMENT_REPORTED') {
    emit({
      id: createNotificationId('PAYMENT_REPORTED_ACK', trade.id),
      type: 'PAYMENT_REPORTED_ACK',
      tradeId: trade.id,
      amountKrw: trade.amountKrw,
      message: '입금했어요를 눌렀어요. 판매자가 확인하고 있어요.',
      priority: 'normal',
      createdAt: new Date().toISOString(),
    })

    emit({
      id: createNotificationId('PAYMENT_REPORTED', trade.id),
      type: 'PAYMENT_REPORTED',
      tradeId: trade.id,
      amountKrw: trade.amountKrw,
      message: '구매자가 입금했다고 알려왔어요. 확인해 주세요.',
      priority: 'high',
      createdAt: new Date().toISOString(),
    })
  }

  if (prevStatus !== 'COMPLETED' && trade.status === 'COMPLETED') {
    emit({
      id: createNotificationId('TRADE_COMPLETED', trade.id),
      type: 'TRADE_COMPLETED',
      tradeId: trade.id,
      amountKrw: trade.amountKrw,
      message: `${amountLabel} 거래가 완료됐어요.`,
      priority: 'normal',
      createdAt: new Date().toISOString(),
    })
  }

  if (prevStatus !== 'DISPUTED' && trade.status === 'DISPUTED') {
    emit({
      id: createNotificationId('DISPUTE_OPENED', trade.id),
      type: 'DISPUTE_OPENED',
      tradeId: trade.id,
      amountKrw: trade.amountKrw,
      message: '입금 확인이 맞지 않아 분쟁 검토를 시작했어요.',
      priority: 'high',
      createdAt: new Date().toISOString(),
    })
  }
}

function syncTradeNotifications() {
  void getTradeSessionVersion()
  const trades = getTradesById()

  for (const trade of trades.values()) {
    const prevStatus = prevTradeStatusById.get(trade.id)
    if (prevStatus !== trade.status) {
      handleTradeStatusChange(trade, prevStatus)
      prevTradeStatusById.set(trade.id, trade.status)
    }
  }

  const activeTrade = getActiveTrade()
  if (activeTrade && !trades.has(activeTrade.id)) {
    const prevStatus = prevTradeStatusById.get(activeTrade.id)
    if (prevStatus !== activeTrade.status) {
      handleTradeStatusChange(activeTrade, prevStatus)
      prevTradeStatusById.set(activeTrade.id, activeTrade.status)
    }
  }
}

function syncMatchingSuggestion() {
  const session = getMatchingSession()
  const suggestionId = session?.suggestion?.candidateId ?? null
  if (!suggestionId || suggestionId === lastSuggestionCandidateId) return

  lastSuggestionCandidateId = suggestionId
  const tradeId = session?.tradeId
  if (!tradeId) return

  emit({
    id: createNotificationId('MATCHING_SUGGESTION', tradeId),
    type: 'MATCHING_SUGGESTION',
    tradeId,
    amountKrw: session?.requestedAmountKrw,
    message: '확인이 필요한 상대가 있어요. 거래 화면에서 확인해 주세요.',
    priority: 'high',
    createdAt: new Date().toISOString(),
  })
}

export function setMockNotificationEmitHandler(handler: EmitHandler | null) {
  emitHandler = handler
}

export function initMockNotificationSource() {
  if (initialized) return
  initialized = true

  const activeTrade = getActiveTrade()
  if (activeTrade) {
    prevTradeStatusById.set(activeTrade.id, activeTrade.status)
  }
  for (const trade of getTradesById().values()) {
    prevTradeStatusById.set(trade.id, trade.status)
  }

  subscribeTradeSession(() => {
    syncTradeNotifications()
  })

  subscribeMatchingSession(() => {
    syncMatchingSuggestion()
    const session = getMatchingSession()
    if (!session?.suggestion) {
      lastSuggestionCandidateId = null
    }
  })
}
