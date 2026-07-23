/**
 * useSignupAuthFlow
 *
 * 책임: 로그인 비번·닉네임·최종 가입·패스키 권장 스텝
 * 비책임: Edge 구현 (→ auth.api)
 */
import { useRef, useState, type MouseEvent } from 'react'
import { useActivityParams, useFlow } from '@stackflow/react'
import { useSnackbarAdapter } from 'seed-design/ui/snackbar'

import { SIGNUP_AUTH_COPY } from '../constants'
import {
  completeSignup,
  dismissPasskeyPrompt,
  markPasskeyRegistered,
  registerPasskeyForCurrentUser,
  signInAfterSignup,
} from '../api/auth.api'
import {
  clearSignupSecrets,
  getSignupDraft,
  updateSignupDraft,
} from '../stores/signupDraft.store'
import { setAuthStatus } from '../stores/authSession.store'
import { isValidLoginPassword, isValidNickname } from '../utils/signupAuthValidation'
import { showSnackbar } from '../../../shared/utils/showSnackbar'
import { ApiError } from '../../../shared/api/errors'

export function useSignupAuthFlow() {
  const { step = 'password' } = useActivityParams<'SignupAuth'>()
  const { push, replace, pop } = useFlow()
  const snackbar = useSnackbarAdapter()

  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [nickname, setNickname] = useState(getSignupDraft().nickname)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRegisteringPasskey, setIsRegisteringPasskey] = useState(false)
  const submittingRef = useRef(false)

  const copy = SIGNUP_AUTH_COPY[step]

  const canSubmitPassword =
    isValidLoginPassword(password) && password === passwordConfirm && password.length > 0

  const canSubmitNickname = isValidNickname(nickname)

  const handlePasswordNext = () => {
    if (!canSubmitPassword) {
      if (password !== passwordConfirm) {
        showSnackbar(snackbar, '비밀번호가 일치하지 않아요.')
      } else {
        showSnackbar(snackbar, '영문과 숫자를 포함해 8자 이상으로 만들어 주세요.')
      }
      return
    }
    updateSignupDraft({ loginPassword: password })
    replace('SignupAuth', { step: 'nickname' })
  }

  const handleNicknameSubmit = async () => {
    if (!canSubmitNickname || submittingRef.current) return

    submittingRef.current = true
    setIsSubmitting(true)
    updateSignupDraft({ nickname: nickname.trim() })

    try {
      const draft = getSignupDraft()
      const result = await completeSignup({
        name: draft.name,
        rrnFront7: draft.rrnFront7,
        mobileCarrier: draft.carrier || 'SKT',
        phone: draft.phone,
        bankCode: draft.bankCode,
        accountNumber: draft.accountNumber,
        accountHolderName: draft.accountHolderName || draft.name,
        transactionPin: draft.pin,
        loginPassword: draft.loginPassword || password,
        nickname: nickname.trim(),
      })

      await signInAfterSignup({
        phoneE164: result.phoneE164,
        loginPassword: draft.loginPassword || password,
      })
      setAuthStatus('authenticated')
      clearSignupSecrets()
      replace('SignupAuth', { step: 'passkey' })
    } catch (error) {
      submittingRef.current = false
      if (error instanceof ApiError && error.code === 'NICKNAME_TAKEN') {
        showSnackbar(snackbar, '이미 쓰는 이름이에요. 다른 이름을 적어 주세요.')
      } else if (error instanceof ApiError && error.code === 'PHONE_EXISTS') {
        showSnackbar(snackbar, '이미 가입된 휴대폰 번호예요.')
      } else {
        showSnackbar(snackbar, '계정을 만들지 못했어요. 잠시 후 다시 시도해 주세요.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRegisterPasskey = async () => {
    if (isRegisteringPasskey) return
    setIsRegisteringPasskey(true)
    try {
      await registerPasskeyForCurrentUser()
      await markPasskeyRegistered()
      push('SignupComplete', {})
    } catch {
      showSnackbar(snackbar, '패스키를 등록하지 못했어요. 나중에 설정에서 할 수 있어요.')
    } finally {
      setIsRegisteringPasskey(false)
    }
  }

  const handleSkipPasskey = async () => {
    try {
      await dismissPasskeyPrompt()
    } catch {
      // UX 메타 실패는 가입 완료를 막지 않음
    }
    push('SignupComplete', {})
  }

  const handleStepBack = (e: MouseEvent<HTMLButtonElement>) => {
    if (step === 'passkey') {
      e.preventDefault()
      void handleSkipPasskey()
      return
    }
    if (step === 'nickname') {
      e.preventDefault()
      replace('SignupAuth', { step: 'password' })
      return
    }
    pop()
  }

  return {
    step,
    copy,
    password,
    passwordConfirm,
    nickname,
    isSubmitting,
    isRegisteringPasskey,
    canSubmitPassword,
    canSubmitNickname,
    setPassword,
    setPasswordConfirm,
    setNickname,
    handlePasswordNext,
    handleNicknameSubmit,
    handleRegisterPasskey,
    handleSkipPasskey,
    handleStepBack,
  }
}
