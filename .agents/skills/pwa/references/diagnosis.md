# PWA 진단 보고서

코드 수정 전 반드시 작성합니다.

## 1. 현재 PWA 준비 상태

| 항목 | 점검 방법 |
|------|-----------|
| Manifest 존재 여부 | `vite.config.ts` VitePWA manifest, `public/manifest.json` |
| Service Worker 존재 여부 | `vite-plugin-pwa`, `dev-dist/sw.js`, 등록 코드 |
| HTTPS 전제 충족 | 배포 환경, localhost 개발 예외 |
| 앱 설치 가능 여부 | Lighthouse, Chrome DevTools Application |
| 오프라인 대응 | navigateFallback, OfflineBanner, fallback 페이지 |
| 모바일 UX 대응 | safe-area, theme-color, apple-touch-icon, touch target |
| Push Notification 가능성 | 서버 VAPID, iOS 16.4+ standalone, 사내망 제약 |
| iOS 대응 상태 | 홈 화면 추가 안내, standalone meta, Push 제한 |
| Android 대응 상태 | beforeinstallprompt, Background Sync |

## 2. 프로젝트 분석 체크리스트

- [ ] 프로젝트 구조 (src/features, activities, stackflow)
- [ ] 라우팅 방식 (Stackflow activity 기반)
- [ ] 인증 처리 (`authSession.store`, `useRequireAuth`)
- [ ] API 요청 구조 (`auth.api.ts` 등)
- [ ] 전역 상태 (Zustand store 등)
- [ ] 캐싱/데이터 패칭 라이브러리 (React Query 등 유무)
- [ ] 빌드 도구 (Vite 8)
- [ ] 배포 환경
- [ ] HTTPS
- [ ] 모바일 반응형 (`MobileFrame`, `ScreenLayout`)
- [ ] 코드 일관성 문제
- [ ] PWA 충돌 가능 코드
- [ ] 오프라인 불가 기능 (결제, 실시간 거래 확정 등)
- [ ] 오프라인 draft 가능 기능 (회원가입 draft, 거래 입력 등)
- [ ] Android/iOS 동일 가능 기능
- [ ] Android만 가능 / iOS 제한 기능
- [ ] iOS 별도 안내 UX 필요 기능

## 3. 현재 코드 구조 문제 점검

- 같은 역할 코드가 여러 위치에 흩어져 있는가? (예: PWA 설치 UX가 `features/home/`에 분산)
- API 요청 방식이 일관적인가?
- 상태 관리가 과도하게 복잡한가?
- custom hook 책임이 불명확한가?
- 컴포넌트가 과다한 책임을 가지는가?
- 파일이 과도하게 쪼개졌거나 반대로 거대한가?
- 네이밍만으로 역할을 알 수 있는가?
- PWA 코드가 비즈니스 로직과 섞일 위험이 있는가?

## 4. 진단 보고서 출력 형식

```markdown
## 1. 현재 PWA 준비 상태
Manifest: ...
Service Worker: ...
HTTPS: ...
...

## 2. 현재 코드 구조 문제
- ...

## 3. PWA 도입 시 충돌·리스크
- ...
```
