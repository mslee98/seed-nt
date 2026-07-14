/**
 * SignupIdentityActivity
 *
 * 책임: 본인확인 화면 JSX 조립
 * 비책임: step·API·네비 (→ useSignupIdentityScreen)
 */
import type { ActivityComponentType } from '@stackflow/react'
import { BottomActionButton } from '../../shared/ui/BottomActionButton'

import { ActivityScreenLayout } from '../../app/layouts/ActivityScreenLayout'
import {
  getIdentityCtaLabel,
  SignupProgressiveForm,
} from '../../features/auth/components/SignupProgressiveForm'
import { SignupExitAlertDialog } from '../../features/auth/components/SignupExitAlertDialog'
import { SignupProgressHeader } from '../../features/auth/components/SignupProgressBar'
import { SIGNUP_IDENTITY_FORM_ID } from '../../features/auth/constants'
import { useSignupIdentityScreen } from '../../features/auth/hooks/useSignupIdentityScreen'

const SignupIdentityActivity: ActivityComponentType<'SignupIdentity'> = () => {
  const screen = useSignupIdentityScreen()

  return (
    <>
      <ActivityScreenLayout
        title="가입하기"
        onBack={screen.handleBack}
        progress={<SignupProgressHeader type="identity" step={screen.activeStep} />}
        fixedBottom={
          screen.showBottomCta ? (
            <BottomActionButton
              type="submit"
              form={SIGNUP_IDENTITY_FORM_ID}
              size="large"
              variant="brandSolid"
              disabled={!screen.canGoNext}
              loading={screen.isSubmitting}
            >
              {getIdentityCtaLabel(screen.activeStep)}
            </BottomActionButton>
          ) : undefined
        }
      >
        <SignupProgressiveForm
          activeStep={screen.activeStep}
          name={screen.draft.name}
          rrnFront7={screen.draft.rrnFront7}
          carrier={screen.draft.carrier}
          phone={screen.draft.phone}
          onNameChange={screen.setName}
          onRrnChange={screen.setRrnFront7}
          onCarrierSelect={screen.handleCarrierSelect}
          onPhoneChange={screen.setPhone}
          onSubmit={() => void screen.goNext()}
          canSubmit={screen.canGoNext}
        />
      </ActivityScreenLayout>

      <SignupExitAlertDialog
        open={screen.exitDialogOpen}
        onOpenChange={screen.setExitDialogOpen}
        onConfirmExit={screen.handleConfirmExit}
      />
    </>
  )
}

export default SignupIdentityActivity
