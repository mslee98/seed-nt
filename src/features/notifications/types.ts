/** 서버 SSE/WebSocket·pendingNotifications와 1:1 대응하는 MVP 이벤트 */
export type NotificationEventType =
  | 'MATCHING_SUGGESTION'
  | 'PROPOSAL_RECEIVED'
  | 'TRADE_BOUND'
  | 'PAYMENT_REPORTED'
  | 'PAYMENT_REPORTED_ACK'
  | 'TRADE_COMPLETED'
  | 'TRADE_EXPIRED'
  | 'DISPUTE_OPENED'
  | 'DISPUTE_RESOLVED'

export type NotificationChannel = 'snackbar' | 'attention' | 'banner' | 'pending' | 'push'

export type NotificationPriority = 'low' | 'normal' | 'high'

export interface NotificationPayload {
  id: string
  type: NotificationEventType
  tradeId?: string
  splitGroupId?: string
  focusLeg?: number
  amountKrw?: number
  message: string
  title?: string
  priority: NotificationPriority
  createdAt: string
}

export interface DispatchContext {
  currentActivity: string | null
  pathname: string
  tradeId?: string | null
  splitGroupId?: string | null
  tradeRole?: 'BUYER' | 'SELLER' | null
  isActivityActive: boolean
  isDocumentVisible: boolean
}

export interface ChannelDispatchResult {
  snackbar?: { message: string; variant?: 'positive' | 'critical' | 'default' }
  attention?: { tradeId: string; type: NotificationEventType }
  banner?: NotificationPayload
  pending?: NotificationPayload
  push?: NotificationPayload
}

export interface AttentionState {
  tradeId: string
  type: NotificationEventType
  message: string
}
