export type InstallGuidePlatform =
  | 'ios'
  | 'android'
  | 'android-in-app'
  | 'desktop'
  | 'desktop-in-app'
  | 'other'

const IN_APP_BROWSER_PATTERN =
  /KAKAOTALK|Instagram|FBAV|FBAN|Line\/|NAVER\(|Snapchat|Twitter|GSA\/|; wv\)/i

export function isInAppBrowser(): boolean {
  return IN_APP_BROWSER_PATTERN.test(navigator.userAgent)
}

export function isIOS(): boolean {
  const ua = navigator.userAgent
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

export function needsManualInstallGuide(): boolean {
  const platform = detectInstallGuidePlatform()
  return (
    platform === 'ios' ||
    platform === 'android-in-app' ||
    platform === 'desktop-in-app' ||
    platform === 'other'
  )
}

export function detectInstallGuidePlatform(): InstallGuidePlatform {
  const ua = navigator.userAgent

  if (isIOS()) return 'ios'

  if (/Android/i.test(ua)) {
    return isInAppBrowser() ? 'android-in-app' : 'android'
  }

  if (window.matchMedia?.('(min-width: 1024px)').matches) {
    return isInAppBrowser() ? 'desktop-in-app' : 'desktop'
  }

  return 'other'
}

export function getInstallGuideDescription(platform: InstallGuidePlatform): string {
  switch (platform) {
    case 'ios':
      return 'Safari 하단 공유 버튼을 누른 뒤, ‘홈 화면에 추가’를 선택하면 앱처럼 바로 열 수 있어요.'
    case 'android':
      return 'Chrome에서 ‘앱 설치’ 버튼을 누르면 바로 설치할 수 있어요. 버튼이 보이지 않으면 아래 방법을 따라 주세요.'
    case 'android-in-app':
      return '앱 내 브라우저에서는 설치 팝업을 띄울 수 없어요. Chrome에서 열어 주세요.'
    case 'desktop':
      return 'Chrome·Edge 주소창의 설치 아이콘을 누르거나, ‘앱 설치’ 버튼으로 바로 설치할 수 있어요.'
    case 'desktop-in-app':
      return '앱 내 브라우저에서는 설치가 제한돼요. Chrome이나 Edge에서 이 페이지를 열어 주세요.'
    default:
      return '브라우저 메뉴에서 ‘홈 화면에 추가’ 또는 ‘앱 설치’를 선택해 주세요.'
  }
}

export function getInstallGuideSteps(platform: InstallGuidePlatform): string[] | null {
  switch (platform) {
    case 'ios':
      return [
        'Safari 하단 공유 버튼 탭',
        '‘홈 화면에 추가’ 선택',
        '추가 완료 후 홈 화면에서 실행',
      ]
    case 'android':
      return [
        'Chrome 우측 상단 ⋮ 메뉴 탭',
        '‘앱 설치’ 또는 ‘홈 화면에 추가’ 선택',
        '설치 완료 후 앱 아이콘에서 실행',
      ]
    case 'android-in-app':
      return [
        '우측 상단 ··· 또는 ⋮ 메뉴에서 ‘Chrome에서 열기’ 선택',
        'Chrome에서 ‘앱 설치’ 버튼 탭',
        '설치 완료 후 앱 아이콘에서 실행',
      ]
    case 'desktop':
      return [
        '주소창 오른쪽 설치 아이콘(⊕) 클릭',
        '‘설치’ 선택',
        '앱 목록 또는 바탕화면에서 실행',
      ]
    case 'desktop-in-app':
      return [
        '‘브라우저에서 열기’ 또는 URL 복사',
        'Chrome·Edge에서 이 페이지 접속',
        '주소창 설치 아이콘 또는 ‘앱 설치’ 버튼 사용',
      ]
    default:
      return null
  }
}
