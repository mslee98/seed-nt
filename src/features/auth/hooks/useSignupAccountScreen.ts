/**
 * useSignupAccountScreen
 *
 * 책임: 금융기관·계좌번호 step·계좌 검증·PIN 진입
 * 비책임: InstitutionSelectPanel / 계좌 입력 UI
 */
import { useActivityParams, useFlow } from '@stackflow/react'
import { useState } from 'react'
import { useSnackbarAdapter } from 'seed-design/ui/snackbar'

import { verifyAccount } from '../api/auth.api'
import type { Institution } from '../data/institutions'
import { useSignupForm } from './useSignupForm'
import { updateSignupDraft } from '../stores/signupDraft.store'
import { showSnackbar } from '../../../shared/utils/showSnackbar'

export function useSignupAccountScreen() {
  const { step = 'bank' } = useActivityParams<'SignupAccount'>()
  const { push, replace, pop } = useFlow()
  const snackbar = useSnackbarAdapter()
  const { draft } = useSignupForm()
  const [isVerifying, setIsVerifying] = useState(false)

  const handleInstitutionSelect = (institution: Institution) => {
    updateSignupDraft({
      bankCode: institution.code,
      bankName: institution.name,
    })
    replace('SignupAccount', { step: 'accountNumber' })
  }

  const handleAccountNumberChange = (value: string) => {
    updateSignupDraft({ accountNumber: value.replace(/\D/g, '') })
  }

  const canSubmit = Boolean(draft.bankCode && draft.accountNumber.length >= 10)

  const handleVerify = async () => {
    if (!canSubmit || isVerifying) return
    setIsVerifying(true)
    try {
      const result = await verifyAccount({
        name: draft.name,
        bankCode: draft.bankCode,
        accountNumber: draft.accountNumber,
      })
      updateSignupDraft({ accountHolderName: result.holderName })
      showSnackbar(snackbar, '계좌를 확인했어요')
      push('SignupPin', { step: 'create' })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleBack = () => {
    if (step === 'accountNumber') {
      replace('SignupAccount', { step: 'bank' })
      return
    }
    pop()
  }

  const handleReselectBank = () => {
    replace('SignupAccount', { step: 'bank' })
  }

  return {
    step,
    draft,
    isVerifying,
    canSubmit,
    handleInstitutionSelect,
    handleAccountNumberChange,
    handleVerify,
    handleBack,
    handleReselectBank,
  }
}
