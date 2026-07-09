import { useSyncExternalStore } from 'react'

import {
  clearAttention,
  consumePending,
  getAttentionState,
  getPendingNotifications,
  subscribeNotifications,
} from '../notification.store'
import type { AttentionState, NotificationPayload } from '../types'

export function usePendingNotifications(): readonly NotificationPayload[] {
  return useSyncExternalStore(subscribeNotifications, getPendingNotifications, () => [])
}

export function useNotificationAttention(): AttentionState | null {
  return useSyncExternalStore(subscribeNotifications, getAttentionState, () => null)
}

export function useNotificationActions() {
  return {
    consumePending,
    clearAttention,
  }
}

export { clearAttention, consumePending }
