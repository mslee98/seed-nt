/**
 * SignupSmsActivity — OCTOMO 기기인증 안내
 *
 * 책임: 문자 앱 자동 작성 안내·모바일 CTA / 데스크톱 QR
 * 비책임: OCTOMO API·폴링 (→ 추후), 계좌 등록 UI
 *
 * @see docs/domains/auth.md
 */
import type { ActivityComponentType } from '@stackflow/react'
import { Text, VStack } from '@seed-design/react'
import { QRCodeSVG } from 'qrcode.react'

import { ActivityScreenLayout } from '../../app/layouts/ActivityScreenLayout'
import { AccountIntroSheet } from '../../features/auth/components/AccountIntroSheet'
import { SignupProgressHeader } from '../../features/auth/components/SignupProgressBar'
import { useSignupOctomoVerify } from '../../features/auth/hooks/useSignupOctomoVerify'
import {
  OCTOMO_SMS_DISPLAY_PHONE,
  OCTOMO_SMS_MESSAGE,
} from '../../features/auth/utils/createOctomoSmsUrl'
import { TextLinkButton } from '../../shared/components/TextLinkButton'
import { BottomActionButton } from '../../shared/ui/BottomActionButton'

const OCTOMO_SAMPLE_SRC = '/octomo/octomo-sample.png'

const GUIDE_STEPS_MOBILE = [
  '하단 [인증 메시지 보내기]를 눌러 주세요',
  '메시지 작성 창에서, 인증 메시지가 자동으로 입력되어 있어요',
  '인증 메시지를 그대로 보내 주세요',
] as const

const GUIDE_STEPS_DESKTOP = [
  '아래 QR을 휴대폰 카메라로 스캔해 주세요',
  '메시지 작성 창에서, 인증 메시지가 자동으로 입력되어 있어요',
  '인증 메시지를 그대로 보내 주세요',
] as const

const SignupSmsActivity: ActivityComponentType<'SignupSms'> = () => {
  const {
    phone,
    isActive,
    showQr,
    smsHref,
    introSheetOpen,
    showContinueToAccount,
    isChecking,
    handleVerifySent,
    handleIntroSheetOpenChange,
    handleIntroConfirm,
    handleContinueToAccount,
  } = useSignupOctomoVerify()

  const fixedBottom = showContinueToAccount ? (
    <BottomActionButton
      size="large"
      variant="brandSolid"
      flexGrow
      onClick={handleContinueToAccount}
    >
      계좌 등록하기
    </BottomActionButton>
  ) : showQr ? undefined : (
    <a
      href={smsHref}
      className="flex w-full items-center justify-center rounded-r3 no-underline"
      style={{
        minHeight: 52,
        backgroundColor: 'var(--seed-color-bg-brand-solid)',
        color: 'var(--seed-color-fg-neutral-inverted)',
      }}
    >
      <Text textStyle="t5Bold" color="fg.neutralInverted">
        인증 메시지 보내기
      </Text>
    </a>
  )

  return (
    <>
      <ActivityScreenLayout
        title="기기인증 안내"
        progress={<SignupProgressHeader type="sms" />}
        bottomCTABehavior="fixed"
        fixedBottom={fixedBottom}
      >
        <VStack px="spacingX.globalGutter" py="x4" gap="x6" pb="x4">
          <VStack gap="spacingY.betweenText">
            <Text textStyle="screenTitle" color="fg.neutral">
              기기인증 안내
            </Text>
            <Text textStyle="t3Regular" color="fg.neutralMuted">
              {phone} 번호로 본인 확인을 진행해요.
            </Text>
          </VStack>

          <VStack gap="x3">
            {(showQr ? GUIDE_STEPS_DESKTOP : GUIDE_STEPS_MOBILE).map((step, index) => (
              <Text key={step} textStyle="t4Regular" color="fg.neutral">
                {index + 1}. {step}
              </Text>
            ))}
          </VStack>

          {showQr ? (
            <VStack gap="x4" align="center" py="x4">
              <Text textStyle="t4Regular" color="fg.neutralMuted" align="center">
                휴대폰 카메라로 QR을 스캔하면 문자 작성 화면으로 이동해요.
              </Text>
              <div className="rounded-r4 border border-solid border-stroke-neutral-weak bg-bg-layer-default p-x4">
                <QRCodeSVG value={smsHref} size={200} level="M" includeMargin />
              </div>
              <VStack gap="x1" align="center">
                <Text textStyle="t2Regular" color="fg.neutralMuted">
                  받는 번호 {OCTOMO_SMS_DISPLAY_PHONE}
                </Text>
                <Text textStyle="t2Regular" color="fg.neutralMuted">
                  보낼 내용 {OCTOMO_SMS_MESSAGE}
                </Text>
              </VStack>
            </VStack>
          ) : (
            <VStack gap="x3" align="center">
              <img
                src={OCTOMO_SAMPLE_SRC}
                alt="문자 앱에 인증 메시지가 자동으로 입력된 예시"
                width={280}
                height={320}
                className="max-w-full object-contain"
                style={{ maxHeight: 320 }}
              />
            </VStack>
          )}

          <Text textStyle="t2Regular" color="fg.neutralSubtle">
            · 이용 중인 통신 요금제에 따라 문자 메시지 발송 비용이 청구될 수 있어요.
          </Text>

          <VStack gap="x2" align="center">
            <TextLinkButton onClick={() => void handleVerifySent()} disabled={isChecking}>
              {isChecking ? '문자를 확인하고 있어요' : '문자 보냈어요'}
            </TextLinkButton>
            <Text textStyle="t1Regular" color="fg.neutralSubtle" align="center">
              인증 문자를 보낸 뒤 이 버튼을 눌러 주세요.
            </Text>
          </VStack>
        </VStack>
      </ActivityScreenLayout>

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
