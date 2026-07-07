import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { useActivityParams, useFlow } from '@stackflow/react'

import { registerPin } from '../api/auth.api'
import { updateSignupDraft } from '../stores/signupDraft.store'

const PIN_LENGTH = 4

export function useSignupPinFlow() {
  const { step = 'create' } = useActivityParams<'SignupPin'>()
  const { push, pop } = useFlow()
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
  }, [confirmPin, step, push])

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

  return {
    pinLength: PIN_LENGTH,
    currentValue,
    isSubmitting,
    copy,
    handleDigit,
    handleBackspace,
    handleStepBack,
  }
}
