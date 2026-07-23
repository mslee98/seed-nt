/**
 * useSignupIdentityScreen
 *
 * 책임: 본인확인 step 머신·가입 이탈 dialog·OCTOMO 안내 진입
 * 비책임: 폼 필드 UI (→ SignupProgressiveForm), OCTOMO 문자 URI
 */
import { useFlow } from '@stackflow/react'
import { useState, type MouseEvent } from 'react'

import type { ActivityAppBarLeftAction } from '../../../app/layouts/ActivityScreenLayout'
import type { CarrierCode, SignupIdentityStep } from '../constants'
import { NEXT_IDENTITY_STEP, PREV_IDENTITY_STEP } from '../constants'
import { resetSignupDraft } from '../stores/signupDraft.store'
import { resetSignupSecrets } from '../stores/signupSecrets.store'
import { formatPhoneInput } from '../utils/formatPhone'
import { canProceedIdentityStep, useSignupForm } from './useSignupForm'

export function useSignupIdentityScreen() {
  const { push, pop } = useFlow()
  const { draft, setName, setRrnFront7, setCarrier, setPhone } = useSignupForm()
  const [activeStep, setActiveStep] = useState<SignupIdentityStep>('name')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [exitDialogOpen, setExitDialogOpen] = useState(false)

  const canGoNext = canProceedIdentityStep(activeStep, draft)
  const showBottomCta = activeStep !== 'carrier'
  /** 첫 step은 플로우 종료(Close), 이후는 History Back */
  const leftAction: ActivityAppBarLeftAction = PREV_IDENTITY_STEP[activeStep] ? 'back' : 'close'

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
    resetSignupSecrets()
    pop()
  }

  const handleCarrierSelect = (carrier: CarrierCode) => {
    setCarrier(carrier)
    setActiveStep('phone')
  }

  const goNext = async () => {
    if (!canGoNext || isSubmitting) return

    if (activeStep === 'phone') {
      setIsSubmitting(true)
      try {
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
    leftAction,
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
