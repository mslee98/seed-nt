import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { useActivityParams, useFlow } from '@stackflow/react'
import { useSnackbarAdapter } from 'seed-design/ui/snackbar'
import { showSnackbar } from '../../../shared/utils/showSnackbar'

import { registerPin } from '../api/auth.api'
import { getSignupDraft, updateSignupDraft } from '../stores/signupDraft.store'

const PIN_LENGTH = 4

export function useSignupPinFlow() {
  const { step = 'create' } = useActivityParams<'SignupPin'>()
  const { push, replace } = useFlow()
  const snackbar = useSnackbarAdapter()
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const hasAdvancedToConfirmRef = useRef(false)
  const hasSubmittedRef = useRef(false)

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
      hasSubmittedRef.current = false
      return
    }

    if (hasAdvancedToConfirmRef.current) return

    hasAdvancedToConfirmRef.current = true
    updateSignupDraft({ pin })
    replace('SignupPin', { step: 'confirm' })
  }, [pin, step, replace])

  useEffect(() => {
    if (step !== 'confirm' || confirmPin.length < PIN_LENGTH || isSubmitting) return
    if (hasSubmittedRef.current) return

    if (confirmPin !== getSignupDraft().pin) {
      showSnackbar(snackbar, '비밀번호가 일치하지 않아요. 다시 입력해 주세요.')
      setConfirmPin('')
      return
    }

    hasSubmittedRef.current = true

    const submit = async () => {
      setIsSubmitting(true)
      try {
        await registerPin(confirmPin)
        updateSignupDraft({ pin: confirmPin })
        push('SignupComplete', {})
      } catch {
        hasSubmittedRef.current = false
      } finally {
        setIsSubmitting(false)
      }
    }
    void submit()
  }, [confirmPin, isSubmitting, push, snackbar, step])

  const handleStepBack = (e: MouseEvent<HTMLButtonElement>) => {
    if (step === 'confirm') {
      e.preventDefault()
      setConfirmPin('')
      hasSubmittedRef.current = false
      hasAdvancedToConfirmRef.current = false
      updateSignupDraft({ pin: '' })
      replace('SignupPin', { step: 'create' })
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
    step,
    pinLength: PIN_LENGTH,
    currentValue,
    isSubmitting,
    copy,
    handleDigit,
    handleBackspace,
    handleStepBack,
  }
}
