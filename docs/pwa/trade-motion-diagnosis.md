# 거래 모션 에셋 PWA 진단

## 결론

거래 플로우 모션(APNG/Lottie)은 **precache 대상에서 제외**하고, **runtime cache**로 필요 시에만 저장합니다. 접근성 설정(`prefers-reduced-motion`)에서는 애니메이션을 줄이고 텍스트 UI로 상태를 전달합니다.

## precache 제외 이유

- `public/apng/` 일부 파일이 1MB 이상 → Workbox precache 한도(1.5MB) 초과로 빌드 실패 가능
- 초기 설치·업데이트 시 불필요한 대용량 다운로드 방지

설정: [`vite.config.ts`](../../vite.config.ts) `globIgnores: ['**/apng/**', '**/lotties/**']`

## runtimeCaching 정책

| 경로 | handler | cacheName | maxEntries |
|------|---------|-----------|------------|
| `/apng/*.png` | CacheFirst | `brit-apng` | 24 |
| `/lotties/*.json` | StaleWhileRevalidate | `brit-lottie` | 12 |

- TTL: 30일
- 최초 온라인 방문 후 재방문·오프라인에서 모션 재생 가능
- 미캐시 시: 독·완료 화면은 Badge/텍스트/`ResultSection`으로 fallback

## reduced-motion 처리

- [`ApngPlayer`](../../src/shared/components/ApngPlayer.tsx): `reduce` 시 렌더링 생략
- [`LottiePlayer`](../../src/shared/components/LottiePlayer.tsx): `autoplay=false`, `loop=false` (첫 프레임)

## 모션 배치 (현재)

- **독**: 매칭 중 `moneybag-rotate-apng.png` (48px)만
- **시트**: 진행 중 모션 없음, 완료 시 `Success.json`만

## 남은 리스크

- 오프라인 최초 진입 시 모션 미로드 → 텍스트만 표시
- APNG는 CSS로 정지 불가 → reduced-motion에서 이미지 대신 텍스트 의존

## 다음 작업 제안

- 거래 재진입 시 active trade 복구 API 연동 (`/me/trades/active`)
- `paymentDeadline` 만료 시 `EXPIRED` 자동 전환 (서버 주도)
