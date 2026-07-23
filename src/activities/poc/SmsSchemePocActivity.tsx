/**
 * SmsSchemePocActivity
 *
 * 책임: Android/iOS를 구분해 방식 A(·보조 URI) 재검증 — 모바일은 버튼, 데스크톱은 QR
 * 비책임: OCTOMO API, 인증 세션, 회원가입 연동
 *
 * @see docs/stackflow/README.md
 */
import type { ActivityComponentType } from '@stackflow/react'
import { Text, VStack } from '@seed-design/react'
import { QRCodeSVG } from 'qrcode.react'
import { useSnackbarAdapter } from 'seed-design/ui/snackbar'

import { ActivityScreenLayout } from '../../app/layouts/ActivityScreenLayout'
import { useIsDesktopViewport } from '../../app/layouts/useIsDesktopViewport'
import { useDeviceContext } from '../../features/pwa/hooks/useDeviceContext'
import { useRuntimeEnvironment } from '../../features/pwa/hooks/useRuntimeEnvironment'
import type { RuntimeEnvironment } from '../../features/pwa/services/detectDeviceContext'
import { showSnackbar } from '../../shared/utils/showSnackbar'

const OCTOMO_PHONE = '16663538'
const DISPLAY_PHONE = '1666-3538'
const MESSAGE = 'BRIT-205364'
const ENCODED_BODY = encodeURIComponent(MESSAGE)

/** 1차 성공안 — iOS·Android 공통 재확인 대상 */
const SCHEME_A = `sms:${OCTOMO_PHONE}?body=${ENCODED_BODY}`
/** iOS 보조 재확인 (이전 PoC에서 성공) */
const SCHEME_B = `sms:${OCTOMO_PHONE}&body=${ENCODED_BODY}`
/** Android 보조 재확인 */
const SCHEME_C = `smsto:${OCTOMO_PHONE}?body=${ENCODED_BODY}`

type SmsCase = {
  id: string
  title: string
  description: string
  href: string
  primary?: boolean
}

type OsSection = {
  os: 'ios' | 'android'
  title: string
  subtitle: string
  cases: SmsCase[]
}

const OS_SECTIONS: OsSection[] = [
  {
    os: 'ios',
    title: 'iOS 재확인',
    subtitle: 'iPhone Safari / Chrome / 설치 PWA에서 각각 기록해 주세요.',
    cases: [
      {
        id: 'ios-a',
        title: 'iOS · 방식 A (?body)',
        description: '1차 성공안. Android와 동일한 URI로 한 번 더 확인해요.',
        href: SCHEME_A,
        primary: true,
      },
      {
        id: 'ios-b',
        title: 'iOS · 방식 B (&body)',
        description: '이전 PoC에서 성공했던 보조 형태예요.',
        href: SCHEME_B,
      },
    ],
  },
  {
    os: 'android',
    title: 'Android 재확인',
    subtitle: 'Android Chrome / Samsung Internet / 설치 PWA에서 각각 기록해 주세요.',
    cases: [
      {
        id: 'android-a',
        title: 'Android · 방식 A (?body)',
        description: '1차 성공안. iOS와 동일한 URI로 한 번 더 확인해요.',
        href: SCHEME_A,
        primary: true,
      },
      {
        id: 'android-c',
        title: 'Android · 방식 C (smsto)',
        description: 'Android 문자 앱 보조 형태예요.',
        href: SCHEME_C,
      },
    ],
  },
]

function runtimeLabel(runtime: RuntimeEnvironment): string {
  if (runtime === 'ios') return 'iOS'
  if (runtime === 'android') return 'Android'
  return '데스크톱'
}

function SmsCaseCard({
  testCase,
  showQr,
  showButton,
}: {
  testCase: SmsCase
  showQr: boolean
  showButton: boolean
}) {
  return (
    <div
      className="rounded-r4 border border-solid border-stroke-neutral-weak bg-bg-layer-default p-x4"
      style={
        testCase.primary
          ? { borderColor: 'var(--seed-color-stroke-brand-weak)' }
          : undefined
      }
    >
      <VStack gap="x4">
        <VStack gap="x1">
          <Text textStyle="t5Bold" color="fg.neutral">
            {testCase.title}
            {testCase.primary ? ' · 권장' : ''}
          </Text>
          <Text textStyle="t3Regular" color="fg.neutralMuted">
            {testCase.description}
          </Text>
        </VStack>

        <div className="flex flex-wrap items-center gap-x5">
          {showQr ? (
            <div className="rounded-r3 border border-solid border-stroke-neutral-weak bg-bg-layer-default p-x3">
              <QRCodeSVG value={testCase.href} size={144} level="M" includeMargin />
            </div>
          ) : null}

          <VStack gap="x2" style={{ flex: 1, minWidth: 200 }}>
            {showButton ? (
              <a
                href={testCase.href}
                className="block rounded-r3 bg-fg-neutral px-x4 py-x3 text-center no-underline"
              >
                <Text textStyle="t4Bold" color="fg.neutralInverted">
                  문자 앱 열기
                </Text>
              </a>
            ) : (
              <Text textStyle="t3Regular" color="fg.neutralMuted">
                데스크톱에서는 QR을 휴대폰 카메라로 스캔해 주세요.
              </Text>
            )}
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
  )
}

const SmsSchemePocActivity: ActivityComponentType<'SmsSchemePoc'> = () => {
  const snackbar = useSnackbarAdapter()
  const isDesktopViewport = useIsDesktopViewport()
  const runtime = useRuntimeEnvironment()
  const device = useDeviceContext()

  const showQr = isDesktopViewport || runtime === 'desktop'
  const showButton = !showQr

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(MESSAGE)
      showSnackbar(snackbar, `인증문자를 복사했어요: ${MESSAGE}`)
    } catch {
      showSnackbar(snackbar, `복사에 실패했어요. 직접 입력해 주세요: ${MESSAGE}`)
    }
  }

  return (
    <ActivityScreenLayout title="문자 앱 재확인">
      <VStack px="spacingX.globalGutter" py="x4" gap="x6" pb="x16">
        <VStack gap="spacingY.betweenText">
          <Text textStyle="t4Regular" color="fg.neutralMuted">
            BRIT 회원가입 PoC · 2차 확인
          </Text>
          <Text textStyle="screenTitle" color="fg.neutral">
            Android / iOS 구분 재확인
          </Text>
          <Text textStyle="t3Regular" color="fg.neutralMuted">
            같은 방식 A라도 OS별로 결과를 따로 기록해요. 모바일은 버튼, 데스크톱은 QR만 보여요.
          </Text>
        </VStack>

        <div className="rounded-r4 border border-solid border-stroke-neutral-weak bg-bg-neutral-weak p-x4">
          <VStack gap="x3">
            <VStack gap="x1">
              <Text textStyle="t2Regular" color="fg.neutralMuted">
                감지된 환경
              </Text>
              <Text textStyle="t5Bold" color="fg.neutral">
                {runtimeLabel(runtime)}
                {device?.isPwaStandalone ? ' · PWA' : ''}
                {showQr ? ' · QR 모드' : ' · 버튼 모드'}
              </Text>
              {device ? (
                <Text textStyle="t2Regular" color="fg.neutralSubtle">
                  {device.osFamily} / {device.browserFamily} / {device.category}
                </Text>
              ) : null}
            </VStack>
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

        {OS_SECTIONS.map((section) => {
          const isCurrentOs =
            (section.os === 'ios' && runtime === 'ios') ||
            (section.os === 'android' && runtime === 'android')

          return (
            <VStack key={section.os} gap="x3">
              <VStack gap="x1">
                <Text textStyle="t6Bold" color={isCurrentOs ? 'fg.brand' : 'fg.neutral'}>
                  {section.title}
                  {isCurrentOs ? ' · 현재 기기' : ''}
                </Text>
                <Text textStyle="t3Regular" color="fg.neutralMuted">
                  {section.subtitle}
                </Text>
              </VStack>

              {section.cases.map((testCase) => (
                <SmsCaseCard
                  key={testCase.id}
                  testCase={testCase}
                  showQr={showQr}
                  showButton={showButton}
                />
              ))}
            </VStack>
          )
        })}
      </VStack>
    </ActivityScreenLayout>
  )
}

export default SmsSchemePocActivity
