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

  const hasVerifiedRef = useRef(false)
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

  useEffect(() => {
    if (isActive && hasVerifiedRef.current && !hasNavigatedRef.current && !introSheetOpen) {
      setIntroSheetOpen(true)
    }
  }, [isActive, introSheetOpen])

  const handleVerify = useCallback(async (smsCode: string) => {
    if (hasVerifiedRef.current || isVerifyingRef.current) return

    isVerifyingRef.current = true
    setIsVerifying(true)
    try {
      await verifySmsCode(draft.phone, smsCode)
      hasVerifiedRef.current = true
      setIntroSheetOpen(true)
    } finally {
      isVerifyingRef.current = false
      setIsVerifying(false)
    }
  }, [draft.phone])

  useEffect(() => {
    if (code.length !== SMS_LENGTH || hasVerifiedRef.current) return
    void handleVerify(code)
  }, [code, handleVerify])

  const handleResend = async () => {
    await sendSmsCode(draft.phone)
    hasVerifiedRef.current = false
    hasNavigatedRef.current = false
    setIntroSheetOpen(false)
    setCode('')
    setRemaining(TIMER_SECONDS)
  }

  const handleIntroSheetOpenChange = (open: boolean) => {
    if (hasNavigatedRef.current) return
    setIntroSheetOpen(open)
  }

  const handleIntroConfirm = () => {
    if (hasNavigatedRef.current) return

    hasNavigatedRef.current = true
    setIntroSheetOpen(false)
    push('SignupAccount', { step: 'bank' })
  }

  const handleDigit = (digit: string) => {
    setCode((prev) => (prev.length < SMS_LENGTH ? prev + digit : prev))
  }

  const handleBackspace = () => {
    setCode((prev) => prev.slice(0, -1))
  }

  const timerLabel = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`

  return {
    phone,
    smsLength: SMS_LENGTH,
    code,
    isVerifying,
    introSheetOpen,
    isActive,
    timerLabel,
    handleResend,
    handleIntroSheetOpenChange,
    handleIntroConfirm,
    handleDigit,
    handleBackspace,
  }
}
