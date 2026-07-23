/**
 * SmsSchemePocActivity
 *
 * 책임: sms:/smsto: URI·QR로 문자 앱 자동 작성 가능 범위만 검증
 * 비책임: OCTOMO API, 인증 세션, 회원가입 연동
 *
 * @see docs/stackflow/README.md
 */
import type { ActivityComponentType } from '@stackflow/react'
import { Text, VStack } from '@seed-design/react'
import { QRCodeSVG } from 'qrcode.react'
import { useSnackbarAdapter } from 'seed-design/ui/snackbar'

import { ActivityScreenLayout } from '../../app/layouts/ActivityScreenLayout'
import { showSnackbar } from '../../shared/utils/showSnackbar'

const OCTOMO_PHONE = '16663538'
const DISPLAY_PHONE = '1666-3538'
const MESSAGE = 'BRIT-205364'

type SmsTestCase = {
  id: string
  title: string
  description: string
  href: string
}

const SMS_TEST_CASES: SmsTestCase[] = [
  {
    id: 'sms-question-body',
    title: '방식 A · ?body',
    description: 'Android 및 일부 브라우저에서 사용되는 형태',
    href: `sms:${OCTOMO_PHONE}?body=${encodeURIComponent(MESSAGE)}`,
  },
  {
    id: 'sms-ampersand-body',
    title: '방식 B · &body',
    description: '일부 iOS Safari 환경에서 알려진 비표준 형태',
    href: `sms:${OCTOMO_PHONE}&body=${encodeURIComponent(MESSAGE)}`,
  },
  {
    id: 'smsto-question-body',
    title: '방식 C · smsto',
    description: 'Android 문자 앱 연결 검증용',
    href: `smsto:${OCTOMO_PHONE}?body=${encodeURIComponent(MESSAGE)}`,
  },
  {
    id: 'sms-recipient-only',
    title: '방식 D · 수신번호만',
    description: 'iOS 공식 지원 범위에 가까운 안전한 대체 방식',
    href: `sms:${OCTOMO_PHONE}`,
  },
]

const SmsSchemePocActivity: ActivityComponentType<'SmsSchemePoc'> = () => {
  const snackbar = useSnackbarAdapter()

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(MESSAGE)
      showSnackbar(snackbar, `인증문자를 복사했어요: ${MESSAGE}`)
    } catch {
      showSnackbar(snackbar, `복사에 실패했어요. 직접 입력해 주세요: ${MESSAGE}`)
    }
  }

  return (
    <ActivityScreenLayout title="문자 앱 연결 테스트">
      <VStack px="spacingX.globalGutter" py="x4" gap="x6" pb="x16">
        <VStack gap="spacingY.betweenText">
          <Text textStyle="t4Regular" color="fg.neutralMuted">
            BRIT 회원가입 PoC
          </Text>
          <Text textStyle="screenTitle" color="fg.neutral">
            문자 앱 연결 테스트
          </Text>
          <Text textStyle="t3Regular" color="fg.neutralMuted">
            각 방식을 실행하고 수신번호와 본문이 어디까지 입력되는지 확인해 주세요. OCTOMO·인증
            API는 포함하지 않아요.
          </Text>
        </VStack>

        <div className="rounded-r4 border border-solid border-stroke-neutral-weak bg-bg-neutral-weak p-x4">
          <VStack gap="x3">
            <VStack gap="x1">
              <Text textStyle="t2Regular" color="fg.neutralMuted">
                받는 번호
              </Text>
              <Text textStyle="t5Bold" color="fg.neutral">
                {DISPLAY_PHONE}
              </Text>
            </VStack>
            <VStack gap="x1">
              <Text textStyle="t2Regular" color="fg.neutralMuted">
                보낼 내용
              </Text>
              <Text textStyle="t5Bold" color="fg.neutral">
                {MESSAGE}
              </Text>
            </VStack>
            <button
              type="button"
              onClick={() => void copyMessage()}
              className="w-full cursor-pointer rounded-r3 border border-solid border-stroke-neutral-weak bg-bg-layer-default px-x4 py-x3 text-center"
            >
              <Text textStyle="t4Bold" color="fg.neutral">
                인증문자 복사
              </Text>
            </button>
          </VStack>
        </div>

        <VStack gap="x4">
          {SMS_TEST_CASES.map((testCase) => (
            <div
              key={testCase.id}
              className="rounded-r4 border border-solid border-stroke-neutral-weak bg-bg-layer-default p-x4"
            >
              <VStack gap="x4">
                <VStack gap="x1">
                  <Text textStyle="t5Bold" color="fg.neutral">
                    {testCase.title}
                  </Text>
                  <Text textStyle="t3Regular" color="fg.neutralMuted">
                    {testCase.description}
                  </Text>
                </VStack>

                <div className="flex flex-wrap items-center gap-x5">
                  <div className="rounded-r3 border border-solid border-stroke-neutral-weak bg-bg-layer-default p-x3">
                    <QRCodeSVG value={testCase.href} size={144} level="M" includeMargin />
                  </div>

                  <VStack gap="x2" style={{ flex: 1, minWidth: 200 }}>
                    <a
                      href={testCase.href}
                      className="block rounded-r3 bg-fg-neutral px-x4 py-x3 text-center no-underline"
                    >
                      <Text textStyle="t4Bold" color="fg.neutralInverted">
                        문자 앱 열기
                      </Text>
                    </a>
                    <Text
                      textStyle="t1Regular"
                      color="fg.neutralSubtle"
                      style={{ overflowWrap: 'anywhere' }}
                    >
                      {testCase.href}
                    </Text>
                  </VStack>
                </div>
              </VStack>
            </div>
          ))}
        </VStack>
      </VStack>
    </ActivityScreenLayout>
  )
}

export default SmsSchemePocActivity
