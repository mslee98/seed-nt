/**
 * useSignupPinFlow
 *
 * 책임: 거래 PIN create/confirm + confirm 시 completeSignup
 */
import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { useActivityParams, useFlow } from '@stackflow/react'
import { useSnackbarAdapter } from 'seed-design/ui/snackbar'
import { showSnackbar } from '../../../shared/utils/showSnackbar'
import { ApiError } from '../../../shared/api/errors'

import { completeSignup, signInAfterSignup } from '../api/auth.api'
import { getSignupDraft, resetSignupDraft } from '../stores/signupDraft.store'
import {
  getSignupSecrets,
  resetSignupSecrets,
  setTransactionPin,
} from '../stores/signupSecrets.store'
import { setAuthStatus } from '../stores/authSession.store'

const PIN_LENGTH = 4

export function useSignupPinFlow() {
  const { step = 'create' } = useActivityParams<'SignupPin'>()
  const { replace, pop } = useFlow()
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
    setTransactionPin(pin)
    replace('SignupPin', { step: 'confirm' })
  }, [pin, step, replace])

  useEffect(() => {
    if (step !== 'confirm' || confirmPin.length < PIN_LENGTH || isSubmitting) return
    if (hasSubmittedRef.current) return

    const secrets = getSignupSecrets()
    if (confirmPin !== secrets.transactionPin) {
      showSnackbar(snackbar, '비밀번호가 일치하지 않아요. 다시 입력해 주세요.')
      setConfirmPin('')
      return
    }

    hasSubmittedRef.current = true
    setTransactionPin(confirmPin)

    const submit = async () => {
      setIsSubmitting(true)
      const draft = getSignupDraft()
      const loginPassword = secrets.loginPassword

      try {
        if (!loginPassword || !draft.nickname) {
          showSnackbar(snackbar, '로그인 정보가 없어요. 닉네임·비밀번호부터 다시 설정해 주세요.')
          hasSubmittedRef.current = false
          replace('SignupCredentials', { step: 'nickname' })
          return
        }

        const result = await completeSignup({
          name: draft.name,
          rrnFront7: draft.rrnFront7,
          mobileCarrier: draft.carrier || 'SKT',
          phone: draft.phone,
          bankCode: draft.bankCode,
          accountNumber: draft.accountNumber,
          accountHolderName: draft.accountHolderName || draft.name,
          transactionPin: confirmPin,
          loginPassword,
          nickname: draft.nickname,
        })

        await signInAfterSignup({
          phoneE164: result.phoneE164,
          loginPassword,
        })
        setAuthStatus('authenticated')
        resetSignupSecrets()
        resetSignupDraft()
        replace('SignupComplete', {})
      } catch (error) {
        hasSubmittedRef.current = false
        setConfirmPin('')
        if (error instanceof ApiError && error.code === 'NICKNAME_TAKEN') {
          showSnackbar(snackbar, '이미 쓰는 이름이에요. 다른 이름을 적어 주세요.')
          replace('SignupCredentials', { step: 'nickname' })
        } else if (error instanceof ApiError && error.code === 'PHONE_EXISTS') {
          showSnackbar(snackbar, '이미 가입된 휴대폰 번호예요.')
        } else {
          showSnackbar(snackbar, '계정을 만들지 못했어요. 잠시 후 다시 시도해 주세요.')
        }
      } finally {
        setIsSubmitting(false)
      }
    }
    void submit()
  }, [confirmPin, isSubmitting, replace, snackbar, step])

  const handleStepBack = (e: MouseEvent<HTMLButtonElement>) => {
    if (step === 'confirm') {
      e.preventDefault()
      setConfirmPin('')
      hasSubmittedRef.current = false
      hasAdvancedToConfirmRef.current = false
      setTransactionPin('')
      replace('SignupPin', { step: 'create' })
      return
    }
    e.preventDefault()
    pop()
  }

  const copy =
    step === 'create'
      ? {
          title: '거래하거나 환전할 때 쓸 비밀번호를 정해 주세요',
          description: '숫자 4자리예요. 로그인 비밀번호와는 달라요.',
        }
      : {
          title: '한 번 더 입력해 주세요',
          description: '방금 입력한 거래 비밀번호와 같은지 확인할게요.',
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
