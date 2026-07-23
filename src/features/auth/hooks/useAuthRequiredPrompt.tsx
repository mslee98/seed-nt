import { useCallback, useState, type ReactNode } from 'react'

import { AuthRequiredAlertDialog } from '../components/AuthRequiredAlertDialog'
import type { AuthRequiredReason } from '../constants/authRequiredCopy'
import { isAuthenticated } from '../stores/authSession.store'

interface UseAuthRequiredPromptOptions {
  onNavigateToSignup: () => void
  onNavigateToLogin?: () => void
  layerIndex?: number
}

export function useAuthRequiredPrompt({
  onNavigateToSignup,
  onNavigateToLogin,
  layerIndex,
}: UseAuthRequiredPromptOptions) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState<AuthRequiredReason>('default')

  const promptAuth = useCallback(
    (action: () => void, authReason: AuthRequiredReason = 'default') => {
      if (isAuthenticated()) {
        action()
        return
      }
      setReason(authReason)
      setOpen(true)
    },
    [],
  )

  const authRequiredDialog: ReactNode = (
    <AuthRequiredAlertDialog
      open={open}
      onOpenChange={setOpen}
      reason={reason}
      onSignUp={onNavigateToSignup}
      onLogin={onNavigateToLogin}
      layerIndex={layerIndex}
    />
  )

  return { promptAuth, authRequiredDialog, authRequiredOpen: open }
}
