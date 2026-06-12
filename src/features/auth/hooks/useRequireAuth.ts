import { useFlow } from '@stackflow/react'
import { useCallback } from 'react'

import { isAuthenticated } from '../stores/authSession.store'

export function useRequireAuth() {
  const { push } = useFlow()

  return useCallback(
    (action: () => void) => {
      if (isAuthenticated()) {
        action()
        return
      }
      push('SignupIdentity', {})
    },
    [push],
  )
}
