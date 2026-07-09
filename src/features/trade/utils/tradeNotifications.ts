/**
 * @deprecated 알림은 `src/features/notifications/`로 이전됐어요.
 * push 호출은 `adapters/pushChannel.ts`를 사용합니다.
 */
export {
  showPaymentReportedNotification,
  showSellerMatchedNotification,
  showTradeMatchedNotification,
} from '../../pwa/services/pushNotificationService'
