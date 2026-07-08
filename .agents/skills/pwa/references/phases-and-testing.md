# PWA 단계별 로드맵 & 테스트

## 구현 Phase

### Phase 1 — PWA 기본 골격
- [ ] manifest 완성 (icons 192/512/maskable, screenshots)
- [ ] iOS meta 태그 (`index.html`)
- [ ] theme color, apple-touch-icon
- [ ] Service Worker 등록 확인
- [ ] Lighthouse PWA 기준 점검

### Phase 2 — 오프라인/캐싱
- [ ] 앱 Shell precache
- [ ] 정적 리소스 캐싱 (JS/CSS/font SWR)
- [ ] 이미지 cache-first + TTL
- [ ] API GET 정책 (민감 API 제외)
- [ ] `offline.html` fallback
- [ ] `useNetworkStatus` + `OfflineBanner`

### Phase 3 — 모바일 설치 UX
- [ ] Android `beforeinstallprompt` (`usePWAInstall`)
- [ ] iOS `IOSInstallGuide`
- [ ] `useStandaloneMode`
- [ ] `features/home/` → `features/pwa/` 통합
- [ ] 설치 후 UI 변경

### Phase 4 — 데이터 안정성
- [ ] IndexedDB 도입 (sync queue, draft)
- [ ] 오프라인 draft 저장
- [ ] 재접속 자동 동기화
- [ ] 충돌 처리 정책
- [ ] TTL 만료·사용자 변경 시 purge

### Phase 5 — 알림/백그라운드
- [ ] Push 호환성·서버 요구사항 문서화
- [ ] 권한 요청 UX
- [ ] iOS/Android fallback (polling)
- [ ] Background Sync → online 이벤트 대체 (iOS)

### Phase 6 — 품질 개선
- [ ] PWA feature 모듈화
- [ ] 중복·hook 정리
- [ ] Lighthouse 점수
- [ ] 접근성·번들 크기·초기 로딩

## 구현 대상 파일 (현재 프로젝트 기준)

| 파일 | Phase | 목적 |
|------|-------|------|
| `vite.config.ts` | 1-2 | manifest, workbox runtimeCaching |
| `index.html` | 1 | iOS meta, viewport-fit |
| `public/offline.html` | 2 | 오프라인 fallback |
| `public/icons/*` | 1 | PWA 아이콘 |
| `src/main.tsx` | 1 | SW 등록 (vite-plugin-pwa 자동) |
| `src/features/pwa/**` | 2-5 | PWA feature 모듈 (신규) |
| `src/features/home/hooks/usePwaInstallPrompt.ts` | 3 | → pwa로 이전 |
| `src/features/home/components/HomeInstallBanner.tsx` | 3 | → pwa로 이전 |
| `src/app/layouts/AppShell.tsx` | 2 | OfflineBanner, UpdateBanner |
| `src/app/layouts/ScreenLayout.tsx` | 6 | safe-area |

## 테스트 환경

- Android Chrome
- Android Samsung Internet
- iOS Safari
- iOS 홈 화면 PWA (standalone)
- iOS Chrome
- Desktop Chrome
- Network offline
- Slow 3G/4G
- 로그인 만료
- 새 버전 배포 직후
- 캐시 삭제 후 첫 접속
- 설치 전/후
- 권한 허용/거부/차단

## 테스트 결과 표

| 테스트 항목 | Android Chrome | iOS Safari | iOS Standalone | 결과 | 이슈 | 조치 |
|-------------|----------------|------------|----------------|------|------|------|
| manifest 유효 | | | | | | |
| SW 등록 | | | | | | |
| 오프라인 shell | | | | | | |
| offline fallback | | | | | | |
| Android 설치 | | N/A | N/A | | | |
| iOS 홈 화면 안내 | N/A | | | | | |
| standalone UI | | | | | | |
| safe-area | | | | | | |
| 업데이트 배너 | | | | | | |
| API 캐시 (GET) | | | | | | |
| 민감 API 미캐시 | | | | | | |
| draft 저장 | | | | | | |
| 재접속 sync | | | | | | |
| Lighthouse PWA | | | | | | |

## Lighthouse PWA 체크

- manifest 존재 및 유효
- Service Worker 등록
- HTTPS
- viewport meta
- theme-color
- apple-touch-icon (iOS)
- 오프라인 동작 (start_url 로드)
- maskable icon

## 최종 산출물 체크리스트

- [ ] PWA 진단 보고서
- [ ] Android/iOS 호환성 매트릭스
- [ ] 단계별 로드맵
- [ ] 권장 폴더 구조
- [ ] 구현 대상 파일 목록
- [ ] manifest 예시
- [ ] Service Worker 전략
- [ ] 설치/오프라인 UX 설계
- [ ] IndexedDB/TTL/cache 정책
- [ ] Push 가능성 검토
- [ ] 업데이트 감지 UX
- [ ] 테스트 체크리스트
- [ ] 코드 수정안
- [ ] 리팩토링 후 패턴 설명

## 답변 출력 순서 (에이전트 필수)

1. 결론
2. 현재 구조 진단
3. PWA 기능별 적용 가능성
4. Android/iOS 호환성 이슈
5. 권장 아키텍처
6. 단계별 구현 계획
7. 코드 수정안
8. 테스트 방법
9. 남은 리스크
10. 다음 작업 제안

## 금지 사항 (재확인)

- 브라우저 분기 컴포넌트 산재
- 모든 API 무조건 캐싱
- iOS 불가 → 가능한 척
- Android 전용 → 공통 포장
- 진입 직후 알림 권한
- PWA ↔ 비즈니스 로직 강결합
- 불필요한 파일·추상화
- "나중에 구현"만 — 최소 fallback 필수
- 호환성 검토 없이 코드 작성
