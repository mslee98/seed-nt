import { Box, HStack, Text, VStack } from '@seed-design/react'

const STEPS = [
  { key: 'match', label: '매칭 완료' },
  { key: 'deposit', label: '입금 완료' },
  { key: 'confirm', label: '확인 대기' },
  { key: 'payout', label: '지급 완료' },
] as const

export type TradePaymentProgressStep = (typeof STEPS)[number]['key']

interface TradePaymentProgressStepsProps {
  currentStep: TradePaymentProgressStep
}

function getStepState(
  stepKey: TradePaymentProgressStep,
  currentStep: TradePaymentProgressStep,
): 'done' | 'current' | 'pending' {
  const stepIndex = STEPS.findIndex((step) => step.key === stepKey)
  const currentIndex = STEPS.findIndex((step) => step.key === currentStep)

  if (stepIndex < currentIndex) return 'done'
  if (stepIndex === currentIndex) return 'current'
  return 'pending'
}

export function TradePaymentProgressSteps({ currentStep }: TradePaymentProgressStepsProps) {
  return (
    <VStack gap="x2" width="full" aria-label="거래 진행 단계">
      {STEPS.map((step) => {
        const state = getStepState(step.key, currentStep)
        const isDone = state === 'done' || state === 'current'

        return (
          <HStack key={step.key} align="center" gap="x3" width="full">
            <Box
              flexShrink={0}
              width="8px"
              height="8px"
              borderRadius="full"
              bg={isDone ? 'bg.brandSolid' : 'bg.neutralWeak'}
            />
            <Text
              textStyle={state === 'current' ? 't4Medium' : 't4Regular'}
              color={state === 'pending' ? 'fg.neutralMuted' : 'fg.neutral'}
            >
              {step.label}
            </Text>
          </HStack>
        )
      })}
    </VStack>
  )
}
