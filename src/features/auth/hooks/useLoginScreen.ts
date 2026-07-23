/**
 * useLoginScreen
 *
 * 책임: 패스키 우선 / 휴대폰+비밀번호 로그인
 */
import { useState } from 'react'
import { useActivityParams, useFlow } from '@stackflow/react'
import { useSnackbarAdapter } from 'seed-design/ui/snackbar'

import { loginWithPasskey, loginWithPassword } from '../api/auth.api'
import { setAuthStatus } from '../stores/authSession.store'
import { formatPhoneInput } from '../utils/formatPhone'
import { showSnackbar } from '../../../shared/utils/showSnackbar'

export function useLoginScreen() {
  const { mode = 'passkey' } = useActivityParams<'Login'>()
  const { replace, push, pop } = useFlow()
  const snackbar = useSnackbarAdapter()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePasskeyLogin = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      await loginWithPasskey()
      setAuthStatus('authenticated')
      replace('Home', {})
    } catch {
      showSnackbar(snackbar, '패스키로 로그인하지 못했어요. 비밀번호로 시도해 보세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePasswordLogin = async () => {
    if (isSubmitting || !phone || !password) return
    setIsSubmitting(true)
    try {
      await loginWithPassword({ phone: formatPhoneInput(phone), password })
      setAuthStatus('authenticated')
      replace('Home', {})
    } catch {
      showSnackbar(snackbar, '휴대폰 번호 또는 비밀번호를 확인해 주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const goPasswordMode = () => replace('Login', { mode: 'password' })
  const goPasskeyMode = () => replace('Login', { mode: 'passkey' })
  const goRecovery = () => push('AccountRecovery', { step: 'phone' })
  const goSignup = () => push('SignupIdentity', {})

  return {
    mode,
    phone,
    password,
    isSubmitting,
    setPhone,
    setPassword,
    handlePasskeyLogin,
    handlePasswordLogin,
    goPasswordMode,
    goPasskeyMode,
    goRecovery,
    goSignup,
    pop,
  }
}
