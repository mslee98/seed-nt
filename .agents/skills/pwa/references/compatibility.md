# Android/iOS 호환성 매트릭스

기능 구현 전 반드시 이 표와 호환성 판단 템플릿을 작성합니다.

## 기능별 적용 가능성

| 기능 | Android Chrome | iOS Safari | 적용 가능 | 제약 | 권장 구현 | fallback |
|------|----------------|------------|-----------|------|-----------|----------|
| 앱 설치 | beforeinstallprompt | 수동 "홈 화면에 추가" | 조건부 | iOS 자동 프롬프트 없음 | Android: 이벤트 캡처 / iOS: IOSInstallGuide | 브라우저 북마크 |
| 홈 화면 아이콘 | manifest icons | apple-touch-icon | 가능 | iOS는 meta/link 별도 | manifest this + manifest | - |
| standalone 실행 | display:standalone | display:standalone + meta | 가능 | iOS 주소창/탭바 UX 차이 | isStandalone() 감지 | browser 모드 UI |
| splash screen | manifest bg/theme | apple-mobile-web-app-* meta | 가능 | iOS 자동 생성 | manifest + meta 태그 | - |
| Service Worker | 지원 | 지원(홈 화면 추가 후 Push 등 일부) | 가능 | iOS SW 제한적 | vite-plugin-pwa/Workbox | SW 없이 동작 |
| 정적 리소스 캐싱 | 지원 | 지원 | 가능 | 캐시 용량 | precache + SWR | network only |
| API GET 캐싱 | 지원 | 지원 | 조건부 | 민감 API 캐싱 금지 | network-first/SWR | 오프라인 배너 |
| API POST/PUT/DELETE | 지원 | 지원 | 제한적 | 캐싱 금지 | sync queue | 재접속 sync |
| 오프라인 fallback | navigation fallback | 지원 | 지원 | SPA 라우팅 | navigateFallback | offline.html |
| IndexedDB | 지원 | 지원 | 가능 | private mode 제한 | idb wrapper | memory draft |
| Background Sync | 지원 | 미지원 | Android만 | iOS 없음 | sync queue + online 이벤트 | 재접속 시 수동 sync |
| Push Notification | 지원 | iOS 16.4+ standalone | 조건부 | iOS는 홈 화면 필수, VAPID 서버 | Phase 5 검토 | in-app polling |
| Notification Badge | 지원 | 제한적 | 조건부 | iOS 버전별 | Badging API | 앱 내 뱃지 |
| Periodic Background Sync | Chromium | 미지원 | 제외/조건부 | - | 현재 제외 | foreground refresh |
| Web Share API | 지원 | 지원 | 가능 | 파일 공유 차이 | navigator.share 래퍼 | 클립보드 복사 |
| File API | 지원 | 제한적 | 조건부 | iOS input[type=file] | feature detect | 안내 |
| Camera/File Upload | 지원 | 지원 | 가능 | capture 속성 | input accept/capture | - |
| Geolocation | 지원 | HTTPS+권한 | 가능 | 권한 UX | 명시적 액션 후 요청 | 수동 입력 |
| Clipboard | 지원 | gesture 필요 | 가능 | iOS async 제한 | user gesture 내 copy | - |
| 권한 요청 | Notification 등 | 더 엄격 | 조건부 | 진입 직후 요청 금지 | 컨텍스트 후 요청 | 설정 안내 |
| Safe Area | env(safe-area-inset-*) | 필수 | 가능 | notch/home indicator | CSS padding | - |
| Pull to refresh | 기본 동작 | overscroll | 조건부 | SPA 오작동 | SEED pull-to-refresh | prevent overscroll |
| 앱 업데이트 감지 | SW update | SW update | 가능 | skipWaiting 정책 | UpdateAvailableBanner | autoUpdate vs prompt |

## 호환성 판단 템플릿 (기능별 필수)

```markdown
기능명:
목적:
Android Chrome:
iOS Safari:
iOS 홈 화면 설치 후:
제약사항:
보안/권한 이슈:
업무상 필요한가:
대체 UX:
최종 판단: [바로 구현 | 조건부 | fallback 포함 | Android만 | iOS 안내만 | 제외 | 네이티브 필요]
```

## iOS vs Android 핵심 차이

| 영역 | Android | iOS |
|------|---------|-----|
| 설치 | beforeinstallprompt | Safari 공유 → 홈 화면에 추가 안내 |
| Push | Chrome installed PWA | 16.4+ standalone, 서버 VAPID |
| Background Sync | 가능 | 불가 → online 이벤트 + queue |
| 설치 프롬프트 | 커스텀 가능 | IOSInstallGuide 컴포넌트 |
| standalone 감지 | display-mode: standalone | 동일 + navigator.standalone (legacy) |

## 오프라인 기능 분류 (프로젝트별 정의 필요)

**오프라인 불가 (비활성화 권장)**: 인증 API, 거래 확정, 실시간 잔액 갱신, PIN 검증

**draft 저장 가능**: 회원가입 진행 (`signupDraft.store`), 거래 금액 입력, 폼 임시 저장

**캐시 표시 가능**: 정적 UI shell, 이전에 조회한 공개 콘텐츠 (민감 데이터 제외)
