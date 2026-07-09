import type { PushEligibility } from '../constants/pushNotificationCopy'
import { PUSH_SUBSCRIPTION_STORAGE_KEY } from '../constants/pushNotificationCopy'

type Listener = () => void

const listeners = new Set<Listener>()

function notify() {
  listeners.forEach((listener) => listener())
}

function isNotificationApiAvailable(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window
}

function readMockSubscriptionReady(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(PUSH_SUBSCRIPTION_STORAGE_KEY) === 'true'
}

function persistMockSubscriptionReady(ready: boolean) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(PUSH_SUBSCRIPTION_STORAGE_KEY, ready ? 'true' : 'false')
}

export function resolvePushEligibility(): PushEligibility {
  if (!isNotificationApiAvailable()) {
    return readMockSubscriptionReady() ? 'ready' : 'unsupported'
  }

  if (readMockSubscriptionReady() && Notification.permission === 'granted') {
    return 'ready'
  }

  if (Notification.permission === 'granted') {
    return 'ready'
  }

  if (Notification.permission === 'denied') {
    return 'denied'
  }

  return 'default'
}

export function getPushEligibility(): PushEligibility {
  return resolvePushEligibility()
}

export function canShowWhileYouWait(): boolean {
  return getPushEligibility() === 'ready'
}

export function subscribePushNotification(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export async function requestPushPermission(): Promise<PushEligibility> {
  if (!isNotificationApiAvailable()) {
    persistMockSubscriptionReady(true)
    notify()
    return 'ready'
  }

  const permission = await Notification.requestPermission()
  if (permission === 'granted') {
    persistMockSubscriptionReady(true)
    notify()
    return 'ready'
  }

  if (permission === 'denied') {
    notify()
    return 'denied'
  }

  notify()
  return 'default'
}

export const TRADE_PUSH_OPEN_EVENT = 'brit:open-trade-payment'

function dispatchTradePushOpen(tradeId: string) {
  window.focus()
  window.dispatchEvent(new CustomEvent(TRADE_PUSH_OPEN_EVENT, { detail: { tradeId } }))
}

function showBrowserNotification(
  title: string,
  options: { body: string; tag: string; tradeId: string },
) {
  if (!isNotificationApiAvailable() || Notification.permission !== 'granted') {
    return
  }

  try {
    const notification = new Notification(title, {
      body: options.body,
      tag: options.tag,
    })
    notification.onclick = () => {
      dispatchTradePushOpen(options.tradeId)
      notification.close()
    }
  } catch {
    // iOS PWA 등 환경별 제한 — in-app 폴백으로 처리
  }
}

/** mock: 매칭 완료 push — 구매자 입금 유도 (실서비스에서는 SW + 서버 push) */
export function showTradeMatchedNotification(tradeId: string, amountLabel: string) {
  showBrowserNotification('매칭됐어요', {
    body: `${amountLabel} 거래를 이어서 진행해 주세요.`,
    tag: `trade-matched-${tradeId}`,
    tradeId,
  })
}

/** mock: 매칭 완료 push — 판매자 입금 대기 */
export function showSellerMatchedNotification(tradeId: string, amountLabel: string) {
  showBrowserNotification('구매자를 찾았어요', {
    body: `${amountLabel} · 구매자 입금을 기다려 주세요.`,
    tag: `trade-seller-matched-${tradeId}`,
    tradeId,
  })
}

/** mock: 입금 신고 push — 판매자 확인 유도 */
export function showPaymentReportedNotification(
  tradeId: string,
  amountLabel: string,
  reporterLabel = '구매자',
) {
  showBrowserNotification('입금 확인이 필요해요', {
    body: `${reporterLabel}님이 ${amountLabel} 입금했다고 했어요.`,
    tag: `trade-reported-${tradeId}`,
    tradeId,
  })
}
