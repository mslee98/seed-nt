import type { ActivityComponentType } from '@stackflow/react'
import { Text, VStack } from '@seed-design/react'

import { ActivityScreenLayout } from '../../app/layouts/ActivityScreenLayout'
import { AccountIntroSheet } from '../../features/auth/components/AccountIntroSheet'
import { SignupProgressHeader } from '../../features/auth/components/SignupProgressBar'
import { NumericKeypad } from '../../features/auth/components/NumericKeypad'
import { PinField } from 'seed-design/ui/pin-field'
import { useSignupSmsVerification } from '../../features/auth/hooks/useSignupSmsVerification'
import { TextLinkButton } from '../../shared/components/TextLinkButton'
import { BottomActionButton } from '../../shared/ui/BottomActionButton'

const SignupSmsActivity: ActivityComponentType<'SignupSms'> = () => {
  const {
    phone,
    smsLength,
    code,
    isVerifying,
    introSheetOpen,
    isActive,
    timerLabel,
    showContinueToAccount,
    handleResend,
    handleIntroSheetOpenChange,
    handleIntroConfirm,
    handleIntroSkip,
    handleContinueToAccount,
    handleDigit,
    handleBackspace,
  } = useSignupSmsVerification()

  return (
    <>
      <ActivityScreenLayout
        title="휴대폰 인증"
        progress={<SignupProgressHeader type="sms" />}
        bottomCTABehavior="fixed"
        fixedBottom={
          showContinueToAccount ? (
            <BottomActionButton
              size="large"
              variant="brandSolid"
              flexGrow
              onClick={handleContinueToAccount}
            >
              계좌 등록하기
            </BottomActionButton>
          ) : undefined
        }
      >
        <VStack px="spacingX.globalGutter" py="x4" gap="x6">
          <VStack gap="spacingY.betweenText">
            <Text textStyle="screenTitle" color="fg.neutral">
              인증번호를 입력해 주세요
            </Text>
            <Text textStyle="t5Regular" color="fg.neutralMuted">
              {phone}로 보낸 6자리 숫자예요.
            </Text>
          </VStack>

          <PinField length={smsLength} value={code} aria-label="인증번호" />

          <VStack gap="x2" align="center">
            <Text textStyle="t4Regular" color="fg.neutralMuted" className="tabular-nums">
              {timerLabel}
            </Text>
            <TextLinkButton onClick={() => void handleResend()}>
              인증번호 다시 받기
            </TextLinkButton>
          </VStack>

          <NumericKeypad
            onDigit={handleDigit}
            onBackspace={handleBackspace}
            disabled={isVerifying}
          />
        </VStack>
      </ActivityScreenLayout>

      {isActive && (
        <AccountIntroSheet
          open={introSheetOpen}
          onOpenChange={handleIntroSheetOpenChange}
          onConfirm={handleIntroConfirm}
          onSkip={handleIntroSkip}
        />
      )}
    </>
  )
}

export default SignupSmsActivity
