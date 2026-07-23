import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { useActivityParams, useFlow } from '@stackflow/react'
import { useSnackbarAdapter } from 'seed-design/ui/snackbar'
import { showSnackbar } from '../../../shared/utils/showSnackbar'

import { getSignupDraft, updateSignupDraft } from '../stores/signupDraft.store'

const PIN_LENGTH = 4

export function useSignupPinFlow() {
  const { step = 'create' } = useActivityParams<'SignupPin'>()
  const { push, replace } = useFlow()
  const snackbar = useSnackbarAdapter()
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const hasAdvancedToConfirmRef = useRef(false)
  const hasAdvancedToAuthRef = useRef(false)

  const currentValue = step === 'create' ? pin : confirmPin
  const setCurrentValue = step === 'create' ? setPin : setConfirmPin

  const handleDigit = (digit: string) => {
    setCurrentValue((prev) => (prev.length < PIN_LENGTH ? prev + digit : prev))
  }

  const handleBackspace = () => {
    setCurrentValue((prev) => prev.slice(0, -1))
  }

  useEffect(() => {
    if (step !== 'create') return

    if (pin.length < PIN_LENGTH) {
      hasAdvancedToConfirmRef.current = false
      hasAdvancedToAuthRef.current = false
      return
    }

    if (hasAdvancedToConfirmRef.current) return

    hasAdvancedToConfirmRef.current = true
    updateSignupDraft({ pin })
    replace('SignupPin', { step: 'confirm' })
  }, [pin, step, replace])

  useEffect(() => {
    if (step !== 'confirm' || confirmPin.length < PIN_LENGTH) return
    if (hasAdvancedToAuthRef.current) return

    if (confirmPin !== getSignupDraft().pin) {
      showSnackbar(snackbar, '비밀번호가 일치하지 않아요. 다시 입력해 주세요.')
      setConfirmPin('')
      return
    }

    hasAdvancedToAuthRef.current = true
    updateSignupDraft({ pin: confirmPin })
    push('SignupAuth', { step: 'password' })
  }, [confirmPin, push, snackbar, step])

  const handleStepBack = (e: MouseEvent<HTMLButtonElement>) => {
    if (step === 'confirm') {
      e.preventDefault()
      setConfirmPin('')
      hasAdvancedToAuthRef.current = false
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
    isSubmitting: false,
    copy,
    handleDigit,
    handleBackspace,
    handleStepBack,
  }
}
