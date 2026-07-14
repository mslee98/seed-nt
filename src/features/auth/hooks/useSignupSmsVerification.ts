/**
 * useSignupSmsVerification
 *
 * 책임: SMS 인증·타이머·계좌 intro 시트 상태
 * 비책임: 계좌 등록 화면 UI (→ SignupAccount)
 *
 * 인증 후 intro 시트를 닫아도 강제 재오픈하지 않음 (Consumer UX).
 */
import { useActivity, useActivityParams, useFlow } from '@stackflow/react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { sendSmsCode, verifySmsCode } from '../api/auth.api'
import { useSignupForm } from './useSignupForm'

const SMS_LENGTH = 6
const TIMER_SECONDS = 180

export function useSignupSmsVerification() {
  const { phone } = useActivityParams<'SignupSms'>()
  const { isActive } = useActivity()
  const { push } = useFlow()
  const { draft } = useSignupForm()
  const [code, setCode] = useState('')
  const [remaining, setRemaining] = useState(TIMER_SECONDS)
  const [isVerifying, setIsVerifying] = useState(false)
  const [introSheetOpen, setIntroSheetOpen] = useState(false)
  const [introDismissed, setIntroDismissed] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  const hasNavigatedRef = useRef(false)
  const isVerifyingRef = useRef(false)

  useEffect(() => {
    if (remaining <= 0) return
    const timer = window.setInterval(() => {
      setRemaining((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [remaining])

  useEffect(() => {
    if (!isActive) {
      setIntroSheetOpen(false)
    }
  }, [isActive])

  const navigateToAccount = useCallback(() => {
    if (hasNavigatedRef.current) return

    hasNavigatedRef.current = true
    setIntroSheetOpen(false)
    setIntroDismissed(false)
    push('SignupAccount', { step: 'bank' })
  }, [push])

  const handleVerify = useCallback(
    async (smsCode: string) => {
      if (isVerified || isVerifyingRef.current) return

      isVerifyingRef.current = true
      setIsVerifying(true)
      try {
        await verifySmsCode(draft.phone, smsCode)
        setIsVerified(true)
        setIntroDismissed(false)
        setIntroSheetOpen(true)
      } finally {
        isVerifyingRef.current = false
        setIsVerifying(false)
      }
    },
    [draft.phone, isVerified],
  )

  useEffect(() => {
    if (code.length !== SMS_LENGTH || isVerified) return
    void handleVerify(code)
  }, [code, handleVerify, isVerified])

  const handleResend = async () => {
    await sendSmsCode(draft.phone)
    hasNavigatedRef.current = false
    setIsVerified(false)
    setIntroSheetOpen(false)
    setIntroDismissed(false)
    setCode('')
    setRemaining(TIMER_SECONDS)
  }

  const handleIntroSheetOpenChange = (open: boolean) => {
    if (hasNavigatedRef.current) return
    setIntroSheetOpen(open)
    if (!open && isVerified) {
      setIntroDismissed(true)
    }
  }

  const handleDigit = (digit: string) => {
    setCode((prev) => (prev.length < SMS_LENGTH ? prev + digit : prev))
  }

  const handleBackspace = () => {
    setCode((prev) => prev.slice(0, -1))
  }

  const timerLabel = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`

  const showContinueToAccount = isVerified && introDismissed && !introSheetOpen

  return {
    phone,
    smsLength: SMS_LENGTH,
    code,
    isVerifying,
    introSheetOpen,
    isActive,
    timerLabel,
    showContinueToAccount,
    handleResend,
    handleIntroSheetOpenChange,
    handleIntroConfirm: navigateToAccount,
    handleIntroSkip: navigateToAccount,
    handleContinueToAccount: navigateToAccount,
    handleDigit,
    handleBackspace,
  }
}
