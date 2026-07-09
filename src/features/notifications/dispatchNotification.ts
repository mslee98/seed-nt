import {
  clearAttention,
  enqueuePending,
  setAttention,
} from './notification.store'
import type {
  ChannelDispatchResult,
  DispatchContext,
  NotificationEventType,
  NotificationPayload,
} from './types'

function isOnTradeScreen(context: DispatchContext): boolean {
  return context.currentActivity === 'Trade'
}

function isOnHomeScreen(context: DispatchContext): boolean {
  return context.currentActivity === 'Home'
}

function isSameTradeContext(context: DispatchContext, tradeId?: string): boolean {
  if (!tradeId || !context.tradeId) return false
  return context.tradeId === tradeId
}

function shouldSkipBanner(context: DispatchContext, payload: NotificationPayload): boolean {
  if (!isOnTradeScreen(context)) return false
  if (!payload.tradeId) return true
  return isSameTradeContext(context, payload.tradeId)
}

export function dispatchNotification(
  payload: NotificationPayload,
  context: DispatchContext,
): ChannelDispatchResult {
  const result: ChannelDispatchResult = {}

  if (!context.isDocumentVisible) {
    result.push = payload
    return result
  }

  switch (payload.type) {
    case 'MATCHING_SUGGESTION': {
      if (isOnHomeScreen(context) && context.isActivityActive) {
        result.snackbar = { message: payload.message }
        result.attention = { tradeId: payload.tradeId!, type: payload.type }
        setAttention({
          tradeId: payload.tradeId!,
          type: payload.type,
          message: payload.message,
        })
      } else if (!isOnTradeScreen(context)) {
        result.pending = payload
        enqueuePending(payload)
        result.banner = payload
      } else if (isOnTradeScreen(context) && !isSameTradeContext(context, payload.tradeId)) {
        result.pending = payload
        enqueuePending(payload)
      }
      break
    }

    case 'TRADE_BOUND': {
      if (shouldSkipBanner(context, payload)) {
        if (context.isActivityActive) {
          result.snackbar = { message: payload.message }
        }
        break
      }
      if (isOnHomeScreen(context) && context.isActivityActive) {
        result.snackbar = { message: payload.message }
        if (payload.tradeId) {
          result.attention = { tradeId: payload.tradeId, type: payload.type }
          setAttention({ tradeId: payload.tradeId, type: payload.type, message: payload.message })
        }
      } else if (!isOnTradeScreen(context) || !isSameTradeContext(context, payload.tradeId)) {
        result.pending = payload
        enqueuePending(payload)
        result.banner = payload
      }
      break
    }

    case 'PAYMENT_REPORTED': {
      // mock 단일 사용자: 구매자 세션에서는 push만 (판매자 알림 시뮬레이션)
      if (context.tradeRole === 'BUYER') {
        result.push = payload
        break
      }
      if (shouldSkipBanner(context, payload)) {
        if (context.isActivityActive) {
          result.snackbar = { message: payload.message }
        }
        break
      }
      if (isOnHomeScreen(context) && context.isActivityActive) {
        result.snackbar = { message: payload.message }
        if (payload.tradeId) {
          result.attention = { tradeId: payload.tradeId, type: payload.type }
          setAttention({ tradeId: payload.tradeId, type: payload.type, message: payload.message })
        }
      } else if (!isOnTradeScreen(context) || !isSameTradeContext(context, payload.tradeId)) {
        result.pending = payload
        enqueuePending(payload)
        result.banner = payload
      }
      break
    }

    case 'PAYMENT_REPORTED_ACK': {
      if (isOnTradeScreen(context) && context.isActivityActive) {
        result.snackbar = { message: payload.message }
      } else if (isOnHomeScreen(context) && context.isActivityActive) {
        result.snackbar = { message: payload.message }
        if (payload.tradeId) {
          setAttention({ tradeId: payload.tradeId, type: payload.type, message: payload.message })
        }
      } else {
        result.pending = payload
        enqueuePending(payload)
      }
      break
    }

    case 'TRADE_COMPLETED': {
      if (context.isActivityActive && (isOnHomeScreen(context) || isOnTradeScreen(context))) {
        result.snackbar = { message: payload.message }
      } else {
        result.pending = payload
        enqueuePending(payload)
        result.banner = payload
      }
      if (payload.tradeId) {
        clearAttention(payload.tradeId)
      }
      break
    }

    case 'DISPUTE_OPENED':
    case 'DISPUTE_RESOLVED':
    case 'TRADE_EXPIRED':
    case 'PROPOSAL_RECEIVED': {
      if (shouldSkipBanner(context, payload) && context.isActivityActive) {
        result.snackbar = { message: payload.message }
        break
      }
      result.pending = payload
      enqueuePending(payload)
      if (!shouldSkipBanner(context, payload)) {
        result.banner = payload
      }
      break
    }

    default:
      break
  }

  return result
}

export function createNotificationId(type: NotificationEventType, tradeId?: string): string {
  return `${type}:${tradeId ?? 'global'}:${Date.now()}`
}
