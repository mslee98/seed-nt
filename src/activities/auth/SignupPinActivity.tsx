import type { ActivityComponentType } from '@stackflow/react'
import { Text, VStack } from '@seed-design/react'

import { ActivityScreenLayout } from '../../app/layouts/ActivityScreenLayout'
import { NumericKeypad } from '../../features/auth/components/NumericKeypad'
import { SignupProgressHeader } from '../../features/auth/components/SignupProgressBar'
import { PinField } from 'seed-design/ui/pin-field'
import { useSignupPinFlow } from '../../features/auth/hooks/useSignupPinFlow'

const SignupPinActivity: ActivityComponentType<'SignupPin'> = () => {
  const {
    step,
    pinLength,
    currentValue,
    isSubmitting,
    copy,
    handleDigit,
    handleBackspace,
    handleStepBack,
  } = useSignupPinFlow()

  return (
    <ActivityScreenLayout
      title="비밀번호 설정"
      onBack={handleStepBack}
      progress={<SignupProgressHeader type="pin" step={step} />}
    >
      <VStack px="spacingX.globalGutter" py="x4" gap="x6" flexGrow>
        <VStack gap="spacingY.betweenText">
          <Text textStyle="screenTitle" color="fg.neutral">
            {copy.title}
          </Text>
          <Text textStyle="t5Regular" color="fg.neutralMuted">
            {copy.description}
          </Text>
        </VStack>

        <PinField length={pinLength} value={currentValue} aria-label="환전 비밀번호" />

        <VStack flexGrow justify="flex-end">
          <NumericKeypad
            onDigit={handleDigit}
            onBackspace={handleBackspace}
            disabled={isSubmitting}
          />
        </VStack>
      </VStack>
    </ActivityScreenLayout>
  )
}

export default SignupPinActivity
