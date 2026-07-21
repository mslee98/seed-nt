import { Box, HStack, Text, VStack } from '@seed-design/react'

const STEPS = [
  { key: 'match', label: '매칭' },
  { key: 'deposit', label: '입금' },
  { key: 'confirm', label: '확인' },
  { key: 'payout', label: '완료' },
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

/**
 * 수평 진행 Stepper — 매칭 · 입금 · 확인 · 완료
 */
export function TradePaymentProgressSteps({ currentStep }: TradePaymentProgressStepsProps) {
  return (
    <HStack
      width="full"
      justify="space-between"
      align="flex-start"
      gap="x1"
      aria-label="거래 진행 단계"
    >
      {STEPS.map((step, index) => {
        const state = getStepState(step.key, currentStep)
        const mark = state === 'done' ? '✓' : state === 'current' ? '●' : '○'
        const color =
          state === 'pending' ? 'fg.neutralMuted' : state === 'current' ? 'fg.informative' : 'fg.neutral'

        return (
          <HStack key={step.key} align="center" gap="x1" flexGrow={index < STEPS.length - 1 ? 1 : 0}>
            <VStack gap="x1" align="center" flexShrink={0}>
              <Text textStyle="t4Medium" color={color} aria-hidden>
                {mark}
              </Text>
              <Text textStyle="t3Medium" color={color}>
                {step.label}
              </Text>
            </VStack>
            {index < STEPS.length - 1 && (
              <Box flexGrow height="1px" bg="stroke.neutralWeak" style={{ marginTop: 10 }} />
            )}
          </HStack>
        )
      })}
    </HStack>
  )
}
