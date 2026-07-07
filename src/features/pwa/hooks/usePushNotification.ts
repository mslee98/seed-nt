import { useCallback, useSyncExternalStore } from 'react'

import type { PushEligibility } from '../constants/pushNotificationCopy'
import {
  getPushEligibility,
  requestPushPermission,
  subscribePushNotification,
} from '../services/pushNotificationService'

export function usePushNotification() {
  const eligibility = useSyncExternalStore(
    subscribePushNotification,
    getPushEligibility,
    (): PushEligibility => 'default',
  )

  const requestPermission = useCallback(async () => {
    return requestPushPermission()
  }, [])

  return {
    eligibility,
    canShowWhileYouWait: eligibility === 'ready',
    requestPermission,
  }
}
