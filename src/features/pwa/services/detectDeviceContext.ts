import { isIOS } from './detectInstallPlatform'

/**
 * OS 기반 런타임 환경. 설치 가이드용 InstallGuidePlatform과 분리한다.
 * (InstallGuidePlatform은 in-app·뷰포트 너비까지 섞음)
 */
export type RuntimeEnvironment = 'ios' | 'android' | 'desktop'

export type DeviceCategory = 'MOBILE' | 'TABLET' | 'DESKTOP' | 'UNKNOWN'

export type OsFamily =
  | 'IOS'
  | 'ANDROID'
  | 'WINDOWS'
  | 'MACOS'
  | 'LINUX'
  | 'CHROME_OS'
  | 'UNKNOWN'

export type DeviceContext = {
  category: DeviceCategory
  osFamily: OsFamily
  browserFamily: string
  manufacturer: string | null
  model: string | null
  platformVersion: string | null
  isPwaStandalone: boolean
  webAuthnSupported: boolean
  platformAuthenticatorAvailable: boolean
  confidence: 'HIGH' | 'MEDIUM' | 'LOW'
  runtimeEnvironment: RuntimeEnvironment
}

type NavigatorWithUAData = Navigator & {
  userAgentData?: {
    mobile: boolean
    platform: string
    brands: Array<{ brand: string; version: string }>
    getHighEntropyValues?: (hints: string[]) => Promise<{
      model?: string
      platform?: string
      platformVersion?: string
    }>
  }
  standalone?: boolean
}

export function detectRuntimeEnvironment(): RuntimeEnvironment {
  if (isIOS()) return 'ios'
  if (/Android/i.test(navigator.userAgent)) return 'android'
  return 'desktop'
}

export function toRuntimeEnvironment(osFamily: OsFamily): RuntimeEnvironment {
  if (osFamily === 'IOS') return 'ios'
  if (osFamily === 'ANDROID') return 'android'
  return 'desktop'
}

/**
 * Client Hints 우선, 미지원 브라우저는 UA로 보완.
 * UA/Client Hints는 위조 가능 — 보안·인증 증거로 쓰지 않는다.
 */
export async function detectDeviceContext(): Promise<DeviceContext> {
  const nav = navigator as NavigatorWithUAData
  const ua = navigator.userAgent

  const isPwaStandalone =
    window.matchMedia('(display-mode: standalone)').matches || nav.standalone === true

  const webAuthnSupported = typeof window.PublicKeyCredential !== 'undefined'

  const platformAuthenticatorAvailable =
    webAuthnSupported &&
    typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function'
      ? await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().catch(() => false)
      : false

  let model: string | null = null
  let platformVersion: string | null = null

  if (nav.userAgentData?.getHighEntropyValues) {
    const highEntropy = await nav.userAgentData
      .getHighEntropyValues(['model', 'platform', 'platformVersion'])
      .catch(() => null)

    model = highEntropy?.model || null
    platformVersion = highEntropy?.platformVersion || null
  }

  const ios = isIOS()
  const isAndroid = /Android/i.test(ua)

  let osFamily: OsFamily = 'UNKNOWN'
  if (ios) osFamily = 'IOS'
  else if (isAndroid) osFamily = 'ANDROID'
  else if (/Windows/i.test(ua)) osFamily = 'WINDOWS'
  else if (/CrOS/i.test(ua)) osFamily = 'CHROME_OS'
  else if (/Macintosh|Mac OS X/i.test(ua)) osFamily = 'MACOS'
  else if (/Linux/i.test(ua)) osFamily = 'LINUX'

  const isTablet =
    /iPad|Tablet/i.test(ua) ||
    (isAndroid && !/Mobile/i.test(ua)) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

  const isMobile = nav.userAgentData?.mobile ?? /Mobi|iPhone|Android/i.test(ua)

  let category: DeviceCategory = 'DESKTOP'
  if (isTablet) category = 'TABLET'
  else if (isMobile) category = 'MOBILE'

  let browserFamily = 'UNKNOWN'
  if (/SamsungBrowser/i.test(ua)) browserFamily = 'SAMSUNG_INTERNET'
  else if (/Edg\//i.test(ua)) browserFamily = 'EDGE'
  else if (/CriOS|Chrome/i.test(ua)) browserFamily = 'CHROME'
  else if (/FxiOS|Firefox/i.test(ua)) browserFamily = 'FIREFOX'
  else if (/Safari/i.test(ua)) browserFamily = 'SAFARI'

  let manufacturer: string | null = null
  if (ios) {
    manufacturer = 'APPLE'
  } else if (
    isAndroid &&
    (/SamsungBrowser/i.test(ua) || /^SM-/i.test(model ?? '') || /SAMSUNG/i.test(ua))
  ) {
    manufacturer = 'SAMSUNG'
  }

  return {
    category,
    osFamily,
    browserFamily,
    manufacturer,
    model,
    platformVersion,
    isPwaStandalone,
    webAuthnSupported,
    platformAuthenticatorAvailable,
    confidence: nav.userAgentData || ios || isAndroid ? 'MEDIUM' : 'LOW',
    runtimeEnvironment: toRuntimeEnvironment(osFamily),
  }
}
