# PWA 구현 상세

## 6-1. Manifest

`vite.config.ts` VitePWA manifest 또는 `public/manifest.json` — 다음 항목 검토:

- `name`, `short_name`, `description`
- `start_url`, `scope`
- `display: standalone`
- `background_color`, `theme_color` (SEED `--seed-color-bg-layer-default` 기준)
- `icons` (192, 512, maskable)
- `screenshots`, `shortcuts`, `orientation`, `categories`

iOS meta 태그 (`index.html`):

```html
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="Brit" />
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
<meta name="theme-color" content="#ffffff" />
```

## 6-2. Service Worker

### Workbox vs 직접 작성

| | Workbox (vite-plugin-pwa) | 직접 작성 |
|---|---------------------------|-----------|
| 장점 | 검증된 전략, precache 자동, Vite 통합 | 의존성 없음, 완전 제어 |
| 단점 | 추상화, 설정 학습 | 버그·엣지케이스 직접 처리, 유지보수 부담 |

**권장**: 현재 프로젝트는 `vite-plugin-pwa` + Workbox 유지. runtimeCaching으로 API/이미지 전략 추가.

### 캐싱 전략

| 대상 | 전략 |
|------|------|
| 앱 Shell | precache |
| JS/CSS/font | stale-while-revalidate 또는 cache-first |
| 이미지 | cache-first + maxEntries + maxAgeSeconds |
| API GET | network-first 또는 stale-while-revalidate |
| API POST/PUT/PATCH/DELETE | 캐싱 금지 |
| 인증 API | 캐싱 금지 |
| 개인정보/민감 | 캐싱 금지 |
| navigation | navigateFallback: `/index.html` + offline.html |

### vite.config.ts runtimeCaching 예시

```typescript
workbox: {
  globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
  navigateFallback: '/index.html',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|webp)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 },
      },
    },
    {
      urlPattern: ({ url }) => url.pathname.startsWith('/api/') && url.searchParams.get('method') !== 'POST',
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-get',
        networkTimeoutSeconds: 5,
        expiration: { maxAgeSeconds: 5 * 60 },
      },
    },
  ],
},
```

인증·민감 API URL은 runtimeCaching에서 **제외**하거나 `NetworkOnly` 처리.

## 6-3. 오프라인 UX

- `OfflineBanner` — 상단/하단 네트워크 상태 표시
- 캐시된 읽기 데이터 표시 (민감 데이터 제외)
- 오프라인 불가 버튼 `disabled` + 안내
- draft 저장 가능 작업 → IndexedDB/sync queue
- 재접속 시 자동 동기화, 실패 시 재시도 UI
- `public/offline.html` navigation fallback

업무상 위험한 기능은 오프라인 비활성화가 더 적절.

## 6-4. Push Notification (Phase 5 — 무조건 구현 금지)

구현 전 확인:

- Android Chrome 지원 / iOS Safari 16.4+ standalone
- iOS 홈 화면 설치 필요 여부
- 사용자 명시적 액션 후 권한 요청
- 거부 시 재요청 정책 (스팸 방지)
- 서버 VAPID/Web Push 구성
- 사내망/폐쇄망 Push 가능 여부
- FCM 등 외부 서비스 사용 가능 여부

**권한 UX**: 앱 진입 직후 요청 금지. 알림 필요성을 이해한 화면/액션 이후.

**대안**: 앱 접속 시 polling, in-app 알림 센터.

## 6-5. 앱 업데이트 감지

`registerType: 'autoUpdate'` (현재) vs `'prompt'`:

| | autoUpdate | prompt |
|---|------------|--------|
| UX | 자동 갱신 | UpdateAvailableBanner로 사용자 선택 |
| 리스크 | 작업 중 새로고침 | 사용자가 구버전 유지 가능 |

**권장**: 금융/거래 앱 → `prompt` + `UpdateAvailableBanner`. 작업 중 draft 있으면 새로고침 전 경고.

```typescript
// useServiceWorkerUpdate.ts 흐름
// 1. SW updatefound → waiting worker 감지
// 2. 배너 표시
// 3. 사용자 확인 → skipWaiting + reload (draft 있으면 confirm)
```

## 6-6. 설치 UX

### Android
- `beforeinstallprompt` 캡처 → `pwaInstallService`
- 미루면 TTL 기간 다시 묻지 않기 (`installBannerStorage`)
- `appinstalled` 감지
- standalone 모드에서 설치 버튼 숨김

### iOS
- `beforeinstallprompt` 없음 → `IOSInstallGuide`
- Safari 공유 → 홈 화면에 추가 단계 안내
- standalone이면 숨김
- iOS Chrome/Edge는 Safari와 설치 흐름 다를 수 있음 → `detectInstallPlatform` 활용

## 6-7. 모바일 앱 UX

- `env(safe-area-inset-*)` — 하단 고정 버튼, `GlobalBottomNavigation`
- touch target 최소 44×44px
- pull-to-refresh 오작동 방지 (SEED `pull-to-refresh` 또는 overscroll-behavior)
- 키보드 표시 시 입력창 가림 방지
- standalone 모드 헤더/뒤로가기 UX
- `viewport-fit=cover` (notch 대응)

## manifest.json 예시 (참고)

```json
{
  "name": "Brit",
  "short_name": "Brit",
  "description": "개인 간 코인 거래",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#ffffff",
  "theme_color": "#ffffff",
  "categories": ["finance"],
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "/icons/icon-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

## 인증 만료 시 처리

| 상태 | 동작 |
|------|------|
| 온라인 + 토큰 만료 | 로그인 화면 리다이렉트, 캐시된 민감 데이터 삭제 |
| 오프라인 + 토큰 만료 | 오프라인 UI 표시, 재연결 후 재인증 유도, 민감 캐시 purge |

## 민감 정보 캐싱 방지

- SW runtimeCaching에서 `/api/auth/*`, PIN, 잔액 등 제외
- IndexedDB에 토큰·PIN·주민번호 저장 금지
- Cache API에 Authorization 헤더 포함 응답 저장 금지
