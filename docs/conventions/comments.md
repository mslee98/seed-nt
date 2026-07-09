# Comment Conventions

Brit은 **모든 줄에 주석**을 달지 않습니다.  
협업·온보딩에 도움이 되는 **고가치 주석**만 유지합니다.

## 원칙

| 코드 주석 | 문서 (`docs/`) |
|-----------|----------------|
| 왜(why) 이 정책인지 | 무엇(what) 전체 흐름 |
| 비자명한 side effect | 도메인 상태 머신 |
| public API 계약 | UX 카피·체크리스트 |

## 쓸 곳

1. **Activity / screen hook 파일 헤더** — 책임·비책임·`@see` docs 링크
2. **Store export** — 상태 전이 규칙 (예: COMPLETED일 때만 wallet 반영)
3. **UX 정책** — “매칭 중 replay skip — consumer-ux 핵심 모션 1곳”
4. **Public shared API** — JSDoc + `@example` (`AnimatedAmount`, `useAmountReplay`)

## 쓰지 않을 곳

- `const x = 1` 등 자명한 코드
- JSX prop 나열 설명
- 타입/함수명으로 이미 드러나는 동작
- UX 카피 전문 (→ `constants` 또는 docs)

## 파일 헤더 템플릿

### Activity

```tsx
/**
 * HomeActivity
 *
 * 책임: 홈 화면 JSX 조립
 * 비책임: 매칭·결제 로직 (→ useHomeScreen, features/trade)
 *
 * @see docs/stackflow/README.md
 * @see docs/domains/trade.md
 */
```

### Screen hook

```tsx
/**
 * useHomeScreen — Home Activity orchestration.
 *
 * PTR·잔액 replay·거래 시트·매칭 콜백을 한곳에서 조합합니다.
 */
```

### Store (export 함수)

```tsx
/** 거래 COMPLETED 시에만 wallet 잔액을 갱신합니다. */
export function applyCompletedTrade(...) { ... }
```

## JSDoc (shared public API)

```tsx
/**
 * 금액 표시 + breeze AnimateNumber 래퍼.
 *
 * @example
 * <AnimatedAmount value={balance} suffix="원" replayKey={key} />
 */
export function AnimatedAmount(props: AnimatedAmountProps) { ... }
```

## `@see` 링크

- Stackflow: `docs/stackflow/README.md`
- Domain: `docs/domains/trade.md`, `auth.md`
- ADR: `docs/adr/001-stackflow-navigation.md`

## PR 리뷰

- 새 Activity에 헤더 + screen hook 분리 여부
- “왜” 없는 장황한 주석은 제거 요청
- 정책 변경 시 docs 우선 갱신
