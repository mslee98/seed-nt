# 거래 모션 에셋 PWA 진단

## 결론

거래 플로우 모션(APNG/Lottie)은 **precache 대상에서 제외**합니다. APNG는 **runtime CacheFirst + 파일명 버저닝**, 재생은 **`ApngPlayer` fetch→blob URL**(Cache API→`<img src>` 직접 연결 시 Chromium 정지 프레임 이슈 회피). Lottie는 **`src/assets/lottie` 번들 import**로 제공합니다. 접근성 설정(`prefers-reduced-motion`)에서는 애니메이션을 줄이고 텍스트 UI로 상태를 전달합니다.

## precache 제외 이유

- `public/motion/` APNG 일부 1MB 이상 → Workbox precache 한도(1.5MB) 초과로 빌드 실패 가능
- 초기 설치·업데이트 시 불필요한 대용량 다운로드 방지

설정: [`vite.config.ts`](../../vite.config.ts) `globIgnores: ['**/motion/**', '**/apng/**', '**/lotties/**']`

## runtimeCaching 정책 (APNG)

| 경로 | handler | cacheName | maxEntries |
|------|---------|-----------|------------|
| `/motion/*.apng` | CacheFirst | `brit-motion-v2` | 24 |

- TTL: 30일
- `cacheableResponse.statuses: [200]`만 — opaque(`0`)·오류 응답 캐시 금지
- **에셋 교체 시 파일명 `vN` bump** (예: `moneybag-rotate.v2.apng`) — stale cache 방지
- 캐시 이름 `v2` bump: 과거 `brit-motion`에 오염된 항목이 있으면 무시
- 재생: [`ApngPlayer`](../../src/shared/components/ApngPlayer.tsx) blob URL (SW 캐시와 `<img>` 직접 연결 금지)
- Lottie: `src/assets/lottie/` import → runtime rule 없음 (JS chunk)

## Lottie 로딩

- 정적: `success.v1.json` — [`lottieRegistry.ts`](../../src/assets/lottie/lottieRegistry.ts)
- 동적 import: `money-winds-loop`, `check-blue-spot` (대용량)
- 시트/모달: `mountWhen={open}` 후 mount

## reduced-motion 처리

**제품 결정 B (일시적 예외)**: OS `prefers-reduced-motion`이어도 상태 그래픽(APNG/Lottie)은 숨기지 않고 풀 재생합니다.

- [`ApngPlayer`](../../src/shared/components/ApngPlayer.tsx): reduce여도 fetch→blob→`<img>` 재생 (이전: `null`)
- [`LottiePlayer`](../../src/shared/components/LottiePlayer.tsx): `loop`/`autoplay` prop 그대로 (이전: reduce 시 둘 다 off)
- 매칭 히어로: reduce용 빈 `Box` 제거 → 항상 `TradeMotion`
- 금액·탭 스케일 등 마이크로 인터랙션은 별도 — reduce 존중 유지
- 리스크: 전정계 민감 사용자에게 루프 모션 노출. 탈출 경로 A(정적 포스터) / C(앱 토글) — 플레이어 헤더 주석 참고

## 모션 배치 (현재)

- **매칭 독**: `moneybag-rotate.v1.apng` (48px)
- **입금 시트 완료/대기**: Lottie dynamic import 또는 APNG
- **정의**: [`motionAssets.ts`](../../src/features/trade/constants/motionAssets.ts)

## 남은 리스크

- 오프라인 최초 진입 시 APNG 미캐시 → 텍스트/Badge fallback
- 결정 B: reduce여도 APNG 루프가 계속됨 — 정적 포스터(A) 도입 전까지 a11y 리스크 잔존

## 다음 작업 제안

- 거래 재진입 시 active trade 복구 API 연동 (`/me/trades/active`)
- `paymentDeadline` 만료 시 `EXPIRED` 자동 전환 (서버 주도)
