# Merchant Domain (Phase 2 — C2B)

사용자가 **외부 업체 사이트**에서 Brit MS로 충전할 때의 도메인·연동 요약입니다.  
C2C P2P(원화 입금)와 **별도** 상태 머신을 사용합니다.

**종합 정리:** [docs/architecture/trade-platform-summary.md](../architecture/trade-platform-summary.md)  
**API 상세 (초안):** [api-spec.md](./api-spec.md) §6 (추가 예정)

---

## 1. C2C vs C2B

| | C2C (Phase 1) | C2B (Phase 2) |
|---|---------------|---------------|
| 상대 | 다른 사용자 | **등록 업체** |
| 결제 | 원화 계좌 + MS | **MS만** |
| 매칭 | 필요 | **없음** |
| UI | Trade Activity 위젯 | **embed iframe** |
| 입금 확인 | 판매자 수동 | **불필요** (원장) |

---

## 2. 업체 사이트 — 최소 연동

### 사용자가 보는 것

```text
[ Brit으로 충전하기 ]
```

(금액·상품은 업체 UI에 이미 존재)

### 업체가 구현하는 것

| 레이어 | 역할 |
|--------|------|
| 프론트 | 버튼 → 업체 API → `widgetUrl` → iframe 또는 새 창 |
| 업체 서버 | `POST /v1/merchant/payments/intents` |
| 업체 서버 | webhook 수신 후 **자사 충전 처리** |

```text
[충전하기] 클릭
  → POST /shop/api/brit-intent
  → { widgetUrl }
  → iframe
  → postMessage / webhook
  → 업체 "충전 완료"
```

**브라우저에 Brit API 키 노출 금지.**

---

## 3. Brit embed (iframe) UX

```text
○○게임샵 충전
50,000 MS

내 Brit 잔액: 120,000 MS
(수수료 표시 — 정책 확정 후)

[ PIN ]
[ 보내기 ]
```

- consumer-ux: **사용자가 충전 클릭 후**에만 iframe
- 닫기 / 나중에 제공
- 완료 시 `postMessage` + webhook

**잔액 조회:** MVP는 **iframe 안에서만**. 업체가 임의로 사용자 잔액 API 호출 **불가**.

---

## 4. 도메인 엔티티

```text
Merchant                 merchantCode, webhookUrl, allowedOrigins
MerchantPaymentIntent    amountMs, externalOrderId, status, expiresAt
MerchantPayment          user debit → merchant credit (ledger)
```

**상태 (Intent):**

```text
CREATED → USER_AUTHORIZED → COMPLETED
                       ↘ CANCELLED / EXPIRED
```

---

## 5. 업체 API (초안)

### Intent 생성

```http
POST /v1/merchant/payments/intents
Authorization: Bearer {merchant_api_key}

{
  "merchantCode": "GAME_SHOP_A",
  "chargeAmountMs": 50000,
  "externalOrderId": "shop-order-991",
  "returnUrl": "https://shop.com/charge/callback",
  "metadata": { "productName": "5000원 충전" }
}
```

**Response**

```json
{
  "intentId": "mpi_xxx",
  "widgetUrl": "https://brit.app/embed/pay?intent=mpi_xxx",
  "chargeAmountMs": 50000,
  "expiresAt": "...",
  "expiresInSec": 600
}
```

### 상태 조회

```http
GET /v1/merchant/payments/intents/{intentId}
```

### Webhook (Brit → 업체)

```json
{
  "event": "MERCHANT_PAYMENT_COMPLETED",
  "intentId": "mpi_xxx",
  "externalOrderId": "shop-order-991",
  "chargeAmountMs": 50000,
  "userId": "user-1",
  "completedAt": "..."
}
```

`HMAC-SHA256` 서명 + timestamp.

### iframe 완료 (Brit → 업체 페이지)

```javascript
window.parent.postMessage({
  type: 'BRIT_PAYMENT_SUCCESS',
  intentId: 'mpi_xxx',
  externalOrderId: 'shop-order-991',
}, 'https://shop.com');
```

---

## 6. 수익·커미션 (정책 보류)

아래는 **설계 초안**이며 요율·부담 주체·환불 시 fee 처리는 **추후 확정**.

### Merchant 설정 (예정)

```text
commissionBps     // 100 = 1.00%
minFeeMs / maxFeeMs
feePayer          USER | MERCHANT
settlementCycle   DAILY | WEEKLY
```

### 원장 (사용자 부담 예시)

```text
chargeAmountMs = 50_000    // 업체에 들어갈 순수 충전
feeMs = 500
debitTotalMs = 50_500      // 사용자 차감
merchantCreditMs = 50_000
platformRevenueMs = 500
```

Intent 생성 시 서버가 계산·고정 → iframe·webhook에 동일 값.

---

## 7. 보안

- API 키: **업체 서버만**
- Intent **1회성·만료** (예: 10분)
- 금액 서버 고정 (클라이언트 변경 불가)
- `externalOrderId` **멱등**
- 차감 전 **PIN** 필수
- `frame-ancestors` / `allowedOrigins` 화이트리스트
- 업체에 opaque `userId`만 (전화번호 기본 비공개)

---

## 8. Brit 코드 배치 (예정)

```text
features/merchant/     embed UI, intent client (사용자)
src/activities/        MerchantPayEmbedActivity 또는 /embed route
```

C2C `features/trade/`와 **store·Activity 분리** 권장.

---

## 9. 구현 단계

| 단계 | 범위 |
|------|------|
| **B1** | Intent + iframe + PIN + ledger + webhook |
| **B2** | sandbox merchant, intent 조회 |
| **B3** | 커미션·정산 리포트 (정책 확정 후) |
| **B4** | 환불·역전송 API |

---

## 10. 미결정 (보류)

1. 수수료 **사용자 vs 업체** 부담  
2. 기본 `commissionBps`  
3. iframe **수수료 항상 표시** 여부  
4. 환불 시 fee 환불 여부  
5. iframe vs **redirect** (앱인토스/WebView)

---

## 관련 문서

- [trade-payment-ux.md](../porcess/trade-payment-ux.md) — C2C 입금 (대조용)
- [trade-scenarios.md](../porcess/trade-scenarios.md) — C2C E2E
