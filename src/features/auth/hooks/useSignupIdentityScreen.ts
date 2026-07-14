/**
 * useSignupIdentityScreen
 *
 * 책임: 본인확인 step 머신·SMS 전송·가입 이탈 dialog
 * 비책임: 폼 필드 UI (→ SignupProgressiveForm)
 */
import { useFlow } from '@stackflow/react'
import { useState, type MouseEvent } from 'react'
import { useSnackbarAdapter } from 'seed-design/ui/snackbar'

import { sendSmsCode } from '../api/auth.api'
import type { CarrierCode, SignupIdentityStep } from '../constants'
import { NEXT_IDENTITY_STEP, PREV_IDENTITY_STEP } from '../constants'
import { canProceedIdentityStep, useSignupForm } from './useSignupForm'
import { resetSignupDraft } from '../stores/signupDraft.store'
import { formatPhoneInput } from '../utils/formatPhone'
import { showSnackbar } from '../../../shared/utils/showSnackbar'

export function useSignupIdentityScreen() {
  const { push, pop } = useFlow()
  const snackbar = useSnackbarAdapter()
  const { draft, setName, setRrnFront7, setCarrier, setPhone } = useSignupForm()
  const [activeStep, setActiveStep] = useState<SignupIdentityStep>('name')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [exitDialogOpen, setExitDialogOpen] = useState(false)

  const canGoNext = canProceedIdentityStep(activeStep, draft)
  const showBottomCta = activeStep !== 'carrier'

  const advanceStep = () => {
    const next = NEXT_IDENTITY_STEP[activeStep]
    if (next) {
      setActiveStep(next)
    }
  }

  const handleBack = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const prev = PREV_IDENTITY_STEP[activeStep]
    if (prev) {
      setActiveStep(prev)
      return
    }
    setExitDialogOpen(true)
  }

  const handleConfirmExit = () => {
    resetSignupDraft()
    pop()
  }

  const handleCarrierSelect = (carrier: CarrierCode) => {
    setCarrier(carrier)
    setActiveStep('phone')
  }

  const goNext = async () => {
    if (!canGoNext) return

    if (activeStep === 'phone') {
      setIsSubmitting(true)
      try {
        await sendSmsCode(draft.phone)
        showSnackbar(snackbar, '인증번호를 전송했어요')
        push('SignupSms', { phone: formatPhoneInput(draft.phone) })
      } finally {
        setIsSubmitting(false)
      }
      return
    }

    advanceStep()
  }

  return {
    draft,
    activeStep,
    isSubmitting,
    exitDialogOpen,
    canGoNext,
    showBottomCta,
    setName,
    setRrnFront7,
    setPhone,
    setExitDialogOpen,
    handleBack,
    handleConfirmExit,
    handleCarrierSelect,
    goNext,
  }
}
