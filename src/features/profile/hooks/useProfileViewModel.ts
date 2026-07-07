import { useMemo } from 'react'

import { useAuthStatus } from '../../auth/stores/authSession.store'
import { getSignupDraft } from '../../auth/stores/signupDraft.store'
import { createAuthenticatedProfile, GUEST_PROFILE } from '../mocks/profile.mock'
import type { ProfileViewModel } from '../types'

export function useProfileViewModel(): ProfileViewModel {
  const authStatus = useAuthStatus()

  return useMemo(() => {
    if (authStatus !== 'authenticated') {
      return GUEST_PROFILE
    }

    const draft = getSignupDraft()
    return createAuthenticatedProfile(
      draft.name || 'Brit유저',
      draft.bankName || '등록된 계좌',
      draft.accountNumber || '0000',
    )
  }, [authStatus])
}
