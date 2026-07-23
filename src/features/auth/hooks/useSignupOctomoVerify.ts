/**
 * useSignupOctomoVerify
 *
 * 책임: OCTOMO 기기인증 안내·문자 앱/QR·verify-octomo 확인 후 계좌 intro
 * 비책임: OCTOMO API 키·Edge Function 구현
 */
import { useActivity, useActivityParams, useFlow } from '@stackflow/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSnackbarAdapter } from 'seed-design/ui/snackbar'

import { useIsDesktopViewport } from '../../../app/layouts/useIsDesktopViewport'
import { showSnackbar } from '../../../shared/utils/showSnackbar'
import { useRuntimeEnvironment } from '../../pwa/hooks/useRuntimeEnvironment'
import { verifyOctomo } from '../api/octomo.api'
import { OCTOMO_SMS_MESSAGE, createOctomoSmsHref } from '../utils/createOctomoSmsUrl'
import { useSignupForm } from './useSignupForm'

export function useSignupOctomoVerify() {
  const { phone: phoneParam } = useActivityParams<'SignupSms'>()
  const { isActive } = useActivity()
  const { push } = useFlow()
  const snackbar = useSnackbarAdapter()
  const { draft } = useSignupForm()
  const isDesktopViewport = useIsDesktopViewport()
  const runtime = useRuntimeEnvironment()

  const [introSheetOpen, setIntroSheetOpen] = useState(false)
  const [introDismissed, setIntroDismissed] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const hasNavigatedRef = useRef(false)

  const phone = draft.phone || phoneParam.replace(/\D/g, '')
  const showQr = isDesktopViewport || runtime === 'desktop'
  const smsHref = createOctomoSmsHref()
  const verificationMessage = OCTOMO_SMS_MESSAGE

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

  const handleVerifySent = async () => {
    if (isChecking || hasNavigatedRef.current) return

    setIsChecking(true)
    try {
      const result = await verifyOctomo({
        phone,
        message: verificationMessage,
      })

      if (!result.verified) {
        showSnackbar(snackbar, result.message || '아직 문자가 확인되지 않았어요', 'default')
        return
      }

      showSnackbar(snackbar, '휴대폰 번호가 확인됐어요')
      setIsVerified(true)
      setIntroDismissed(false)
      setIntroSheetOpen(true)
    } catch {
      showSnackbar(snackbar, '문자 확인에 실패했어요. 다시 시도해 주세요', 'critical')
    } finally {
      setIsChecking(false)
    }
  }

  const handleIntroSheetOpenChange = (open: boolean) => {
    if (hasNavigatedRef.current) return
    setIntroSheetOpen(open)
    if (!open && isVerified) {
      setIntroDismissed(true)
    }
  }

  const showContinueToAccount = isVerified && introDismissed && !introSheetOpen

  return {
    phone: phoneParam,
    isActive,
    showQr,
    smsHref,
    verificationMessage,
    isChecking,
    introSheetOpen,
    showContinueToAccount,
    handleVerifySent,
    handleIntroSheetOpenChange,
    handleIntroConfirm: navigateToAccount,
    handleContinueToAccount: navigateToAccount,
  }
}
