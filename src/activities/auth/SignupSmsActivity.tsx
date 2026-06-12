import type { ActivityComponentType } from '@stackflow/react'
import { useActivity, useActivityParams, useFlow } from '@stackflow/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Text, VStack } from '@seed-design/react'

import { sendSmsCode, verifySmsCode } from '../../features/auth/api/auth.api'
import { AccountIntroSheet } from '../../features/auth/components/AccountIntroSheet'
import { AuthActivityLayout } from '../../features/auth/components/AuthActivityLayout'
import { NumericKeypad } from '../../features/auth/components/NumericKeypad'
import { PinInput } from '../../features/auth/components/PinInput'
import { useSignupForm } from '../../features/auth/hooks/useSignupForm'

const SMS_LENGTH = 6
const TIMER_SECONDS = 180

const SignupSmsActivity: ActivityComponentType<'SignupSms'> = () => {
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

  const timerLabel = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`

  return (
    <>
      <AuthActivityLayout title="휴대폰 인증">
        <VStack px="spacingX.globalGutter" py="x4" gap="x6">
          <VStack gap="spacingY.betweenText">
            <Text textStyle="t6Bold" color="fg.neutral">
              인증번호를 입력해 주세요
            </Text>
            <Text textStyle="t5Regular" color="fg.neutralMuted">
              {phone}로 보낸 6자리 숫자예요.
            </Text>
          </VStack>

          <PinInput length={SMS_LENGTH} value={code} />

          <VStack gap="x2" align="center">
            <Text textStyle="t4Regular" color="fg.neutralMuted" className="tabular-nums">
              {timerLabel}
            </Text>
            <button
              type="button"
              onClick={() => void handleResend()}
              className="cursor-pointer border-none bg-transparent text-fg-brand"
              style={{ fontSize: 'var(--seed-font-size-t4)' }}
            >
              인증번호 다시 받기
            </button>
          </VStack>

          <NumericKeypad
            onDigit={(digit) =>
              setCode((prev) => (prev.length < SMS_LENGTH ? prev + digit : prev))
            }
            onBackspace={() => setCode((prev) => prev.slice(0, -1))}
            disabled={isVerifying}
          />
        </VStack>
      </AuthActivityLayout>

      {isActive && (
        <AccountIntroSheet
          open={introSheetOpen}
          onOpenChange={handleIntroSheetOpenChange}
          onConfirm={handleIntroConfirm}
        />
      )}
    </>
  )
}

export default SignupSmsActivity
