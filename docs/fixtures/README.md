# API Fixtures

MSW·백엔드 stub·통합 테스트용 JSON fixture입니다.

스펙: [docs/domains/api-spec.md](../domains/api-spec.md)  
시나리오: [docs/porcess/trade-scenarios.md](../porcess/trade-scenarios.md)  
예외·분쟁: [docs/porcess/trade-disputes.md](../porcess/trade-disputes.md)  
종합: [docs/architecture/trade-platform-summary.md](../architecture/trade-platform-summary.md)

## 디렉터리

| 경로 | 설명 |
|------|------|
| `users.json` | 사용자·세션 |
| `wallets.json` | 지갑 (available / escrow) |
| `home-*.json` | `GET /v1/me/home` 응답 |
| `profile-*.json` | `GET /v1/me/profile` |
| `scenarios.json` | DEV 시나리오 (`splitDispute` 등) |
| `trades/` | 거래·split-group 상태별 |
| `disputes/` | 분쟁·채팅 메시지 |
| `trade-orders/` | split-preview 등 |
| `matching/` | 매칭 세션·후보·알림 payload |
| `auth/` | 가입 API 응답 |

## 시나리오 사용 예

```json
// scenarios.json → activeTrade
// 1. GET /v1/me/home → home-active-trade.json
// 2. GET /v1/trades/trade-active-1 → trades/trade-payment-reported.json
```

## 프론트 mock 대응

| Fixture | 프론트 |
|---------|--------|
| `home-active-trade.json` | `homeViewModel.mock.ts` MOCK_SCENARIO |
| `trades/history.json` | `transactions.mock.ts` |
| `profile-authenticated.json` | `profile.mock.ts` |
| `wallets.json` | `homeWallet.store.ts` |
| `matching/candidates-100000.json` | `matchingSession.mock.ts` |
| `auth/*.json` | `auth.api.ts` |

## 환율

현재 fixture는 프론트 코드 기준 **`coinAmount = amountKrw`** (1:1)입니다.  
정책 변경 시 [api-spec.md](../domains/api-spec.md) §11과 함께 일괄 수정하세요.
