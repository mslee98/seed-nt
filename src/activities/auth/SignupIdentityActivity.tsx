import type { ActivityComponentType } from '@stackflow/react'
import { useFlow } from '@stackflow/react'
import { useState, type MouseEvent } from 'react'
import { useSnackbarAdapter } from 'seed-design/ui/snackbar'
import { showSnackbar } from '../../shared/utils/showSnackbar'
import { ActionButton } from 'seed-design/ui/action-button'

import { sendSmsCode } from '../../features/auth/api/auth.api'
import { ActivityScreenLayout } from '../../app/layouts/ActivityScreenLayout'
import {
  getIdentityCtaLabel,
  SignupProgressiveForm,
} from '../../features/auth/components/SignupProgressiveForm'
import { SignupExitAlertDialog } from '../../features/auth/components/SignupExitAlertDialog'
import { SignupProgressHeader } from '../../features/auth/components/SignupProgressBar'
import type { CarrierCode, SignupIdentityStep } from '../../features/auth/constants'
import {
  NEXT_IDENTITY_STEP,
  PREV_IDENTITY_STEP,
  SIGNUP_IDENTITY_FORM_ID,
} from '../../features/auth/constants'
import { canProceedIdentityStep, useSignupForm } from '../../features/auth/hooks/useSignupForm'
import { resetSignupDraft } from '../../features/auth/stores/signupDraft.store'
import { formatPhoneInput } from '../../features/auth/utils/formatPhone'

const SignupIdentityActivity: ActivityComponentType<'SignupIdentity'> = () => {
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
        showSnackbar(snackbar, '인증번호가 전송되었어요')
        push('SignupSms', { phone: formatPhoneInput(draft.phone) })
      } finally {
        setIsSubmitting(false)
      }
      return
    }

    advanceStep()
  }

  return (
    <>
      <ActivityScreenLayout
        title="가입하기"
        onBack={handleBack}
        progress={<SignupProgressHeader type="identity" step={activeStep} />}
        fixedBottom={
          showBottomCta ? (
            <ActionButton
              type="submit"
              form={SIGNUP_IDENTITY_FORM_ID}
              size="large"
              variant="brandSolid"
              disabled={!canGoNext}
              loading={isSubmitting}
            >
              {getIdentityCtaLabel(activeStep)}
            </ActionButton>
          ) : undefined
        }
      >
        <SignupProgressiveForm
          activeStep={activeStep}
          name={draft.name}
          rrnFront7={draft.rrnFront7}
          carrier={draft.carrier}
          phone={draft.phone}
          onNameChange={setName}
          onRrnChange={setRrnFront7}
          onCarrierSelect={handleCarrierSelect}
          onPhoneChange={setPhone}
          onSubmit={() => void goNext()}
          canSubmit={canGoNext}
        />
      </ActivityScreenLayout>

      <SignupExitAlertDialog
        open={exitDialogOpen}
        onOpenChange={setExitDialogOpen}
        onConfirmExit={handleConfirmExit}
      />
    </>
  )
}

export default SignupIdentityActivity
