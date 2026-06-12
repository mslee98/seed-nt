import type { ActivityComponentType } from '@stackflow/react'
import { useActivityParams, useFlow } from '@stackflow/react'
import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Text, VStack } from '@seed-design/react'
import { useSnackbarAdapter } from 'seed-design/ui/snackbar'

import { registerPin } from '../../features/auth/api/auth.api'
import { AuthActivityLayout } from '../../features/auth/components/AuthActivityLayout'
import { NumericKeypad } from '../../features/auth/components/NumericKeypad'
import { PinInput } from '../../features/auth/components/PinInput'
import { updateSignupDraft } from '../../features/auth/stores/signupDraft.store'
import { showAuthSnackbar } from '../../features/auth/utils/showAuthSnackbar'

const PIN_LENGTH = 4

const SignupPinActivity: ActivityComponentType<'SignupPin'> = () => {
  const { step = 'create' } = useActivityParams<'SignupPin'>()
  const { push, pop } = useFlow()
  const snackbar = useSnackbarAdapter()
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const hasAdvancedToConfirmRef = useRef(false)

  const currentValue = step === 'create' ? pin : confirmPin
  const setCurrentValue = step === 'create' ? setPin : setConfirmPin

  const handleDigit = (digit: string) => {
    if (isSubmitting) return
    setCurrentValue((prev) => (prev.length < PIN_LENGTH ? prev + digit : prev))
  }

  const handleBackspace = () => {
    if (isSubmitting) return
    setCurrentValue((prev) => prev.slice(0, -1))
  }

  useEffect(() => {
    if (step !== 'create') return

    if (pin.length < PIN_LENGTH) {
      hasAdvancedToConfirmRef.current = false
      return
    }

    if (hasAdvancedToConfirmRef.current) return

    hasAdvancedToConfirmRef.current = true
    push('SignupPin', { step: 'confirm' })
  }, [pin, step, push])

  useEffect(() => {
    if (step !== 'confirm' || confirmPin.length < PIN_LENGTH) return

    if (confirmPin !== pin) {
      showAuthSnackbar(snackbar, '비밀번호가 서로 달라요', 'critical')
      setConfirmPin('')
      return
    }

    const submit = async () => {
      setIsSubmitting(true)
      try {
        await registerPin(confirmPin)
        updateSignupDraft({ pin: confirmPin })
        push('SignupComplete', {})
      } finally {
        setIsSubmitting(false)
      }
    }
    void submit()
  }, [confirmPin, pin, step, push, snackbar])

  const handleStepBack = (e: MouseEvent<HTMLButtonElement>) => {
    if (step === 'confirm') {
      e.preventDefault()
      setConfirmPin('')
      pop()
    }
  }

  const copy =
    step === 'create'
      ? {
          title: '환전 비밀번호를 정해 주세요',
          description: '거래하거나 계좌를 바꿀 때 확인해요.',
        }
      : {
          title: '한 번 더 입력해 주세요',
          description: '방금 입력한 비밀번호와 같은지 확인할게요.',
        }

  return (
    <AuthActivityLayout title="비밀번호 설정" onBack={handleStepBack}>
      <VStack px="spacingX.globalGutter" py="x4" gap="x6" flexGrow>
        <VStack gap="spacingY.betweenText">
          <Text textStyle="t6Bold" color="fg.neutral">
            {copy.title}
          </Text>
          <Text textStyle="t5Regular" color="fg.neutralMuted">
            {copy.description}
          </Text>
        </VStack>

        <PinInput length={PIN_LENGTH} value={currentValue} />

        <VStack flexGrow justify="flex-end">
          <NumericKeypad
            onDigit={handleDigit}
            onBackspace={handleBackspace}
            disabled={isSubmitting}
          />
        </VStack>
      </VStack>
    </AuthActivityLayout>
  )
}

export default SignupPinActivity
