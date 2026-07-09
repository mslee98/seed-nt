import { useSnackbarAdapter } from 'seed-design/ui/snackbar'
import { useEffect } from 'react'

import { showSnackbar } from '../../../shared/utils/showSnackbar'
import {
  initMockNotificationSource,
  setMockNotificationEmitHandler,
} from '../adapters/mockNotificationSource'

let bootstrapCount = 0

/** SnackbarProvider 하위에서 1회 마운트 — mock 알림 소스 연결 */
export function NotificationBootstrap() {
  const snackbar = useSnackbarAdapter()

  useEffect(() => {
    bootstrapCount += 1
    initMockNotificationSource()

    setMockNotificationEmitHandler((result) => {
      if (result.snackbar) {
        showSnackbar(snackbar, result.snackbar.message, result.snackbar.variant ?? 'positive')
      }
    })

    return () => {
      bootstrapCount -= 1
      if (bootstrapCount === 0) {
        setMockNotificationEmitHandler(null)
      }
    }
  }, [snackbar])

  return null
}
