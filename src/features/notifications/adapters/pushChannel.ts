import { formatAmount } from '../../../shared/utils/formatAmount'
import {
  showPaymentReportedNotification,
  showSellerMatchedNotification,
  showTradeMatchedNotification,
} from '../../pwa/services/pushNotificationService'
import type { NotificationPayload } from '../types'

/** 브라우저 push — 백그라운드·권한 ready 시에만 */
export function deliverPushNotification(payload: NotificationPayload) {
  if (!payload.tradeId) return

  const amountLabel = payload.amountKrw ? formatAmount(payload.amountKrw) : ''

  switch (payload.type) {
    case 'TRADE_BOUND':
      if (payload.title?.includes('구매자')) {
        showSellerMatchedNotification(payload.tradeId, amountLabel)
      } else {
        showTradeMatchedNotification(payload.tradeId, amountLabel)
      }
      break
    case 'PAYMENT_REPORTED':
      showPaymentReportedNotification(payload.tradeId, amountLabel)
      break
    default:
      break
  }
}
