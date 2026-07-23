import { useFlow } from '@stackflow/react'
import { useCallback } from 'react'

import type { AuthRequiredReason } from '../constants/authRequiredCopy'
import { useAuthRequiredPrompt } from './useAuthRequiredPrompt'

export function useRequireAuth(reason: AuthRequiredReason = 'trade') {
  const { push } = useFlow()
  const { promptAuth, authRequiredDialog } = useAuthRequiredPrompt({
    onNavigateToLogin: () => push('Login', {}),
  })

  const requireAuth = useCallback(
    (action: () => void) => {
      promptAuth(action, reason)
    },
    [promptAuth, reason],
  )

  return { requireAuth, authRequiredDialog }
}
