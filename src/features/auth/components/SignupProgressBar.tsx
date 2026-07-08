import { Box, Text, VStack } from '@seed-design/react'

import {
  getSignupProgressLabel,
  getSignupProgressStep,
  getSignupProgressStepName,
  SIGNUP_PROGRESS_TOTAL,
  type SignupProgressInput,
} from '../utils/signupProgress'

interface SignupProgressBarProps {
  currentStep: number
}

export function SignupProgressBar({ currentStep }: SignupProgressBarProps) {
  const clampedStep = Math.min(Math.max(currentStep, 1), SIGNUP_PROGRESS_TOTAL)
  const label = getSignupProgressLabel(clampedStep)
  const stepName = getSignupProgressStepName(clampedStep)
  const percent = Math.round((clampedStep / SIGNUP_PROGRESS_TOTAL) * 100)

  return (
    <VStack gap="x2" width="full" aria-label={`가입 진행 ${label}: ${stepName}`}>
      <Box
        width="full"
        height="4px"
        borderRadius="full"
        bg="bg.brandWeak"
        style={{ overflow: 'hidden' }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-valuetext={`${stepName} (${label})`}
      >
        <Box
          height="full"
          borderRadius="full"
          bg="bg.brandSolid"
          style={{ width: `${percent}%`, transition: 'width 0.2s ease' }}
        />
      </Box>

      <Text textStyle="t4Regular" color="fg.neutralSubtle" className="tabular-nums">
        {label} · {stepName}
      </Text>
    </VStack>
  )
}

export function SignupProgressHeader(input: SignupProgressInput) {
  return <SignupProgressBar currentStep={getSignupProgressStep(input)} />
}
