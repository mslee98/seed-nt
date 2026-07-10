# Typography Conventions

Brit UI 타이포그래피는 [SEED Design](https://seed-design.io) 토큰을 따릅니다.  
px·Tailwind `text-*` 직접 지정은 예외적으로만 사용합니다.

## Font

### 스택

[`src/app/styles/typography.css`](../../src/app/styles/typography.css)의 `--font-sans` / `--app-font-family`:

- **iOS:** `-apple-system`, `Apple SD Gothic Neo` 우선 → 네이티브 UI에 가깝게
- **그 외:** `Pretendard Variable` fallback → 한글·숫자 안정 표현
- `Noto Sans KR`은 최후 fallback (메인 금지)

Pretendard는 [`src/main.tsx`](../../src/main.tsx)에서 `pretendardvariable-dynamic-subset.css`로 로드합니다 (woff2, `font-display: swap`).

### 전역 톤

- `body`: `letter-spacing: var(--app-typo-body-tracking)` (`-0.01em`)
- 화면 H1 자간 보강: `className="typo-title-tight"` (`-0.02em`, SEED `screenTitle` 크기 유지)
- iOS/Android 글자 크기: [`vite.config.ts`](../../vite.config.ts) `seedDesignPlugin({ fontScaling: true })`

## 기본 원칙

1. **`<Text textStyle="…" color="fg.*">`** — 역할 색상 + 스케일/시맨틱 토큰
2. **시맨틱 우선** — 화면 제목 등 역할이 정해진 경우 `screenTitle` 등 시맨틱 스타일 사용
3. **DS 컴포넌트 위임** — `AppBar`, `ListItem`, `TextField`, `ResultSection`, `ActionButton` 등은 내부 타이포 유지
4. **숫자** — 금액·카운트에 `tabular-nums` (또는 `className="tabular-nums"`)

## 계층표

| 역할 | textStyle / variant | color 예시 | 사용처 |
|------|---------------------|------------|--------|
| 화면 H1 | `screenTitle` (+ `typo-title-tight` 선택) | `fg.neutral` | 홈 헤더, 탭 화면, 가입 폼 |
| 부제 | `t5Regular` | `fg.neutralMuted` | H1 아래 설명 (`spacingY.betweenText`) |
| 히어로 금액 | `AnimatedAmount variant="hero"` | `fg.neutral` | 홈 거래 금액 입력 |
| 문맥 금액 | `t6Bold` / `AnimatedAmount` inline | `fg.neutral` | 거래 상세, 입금, 매칭 카드 |
| 카드/섹션 소제목 | `t4Bold` | `fg.neutral` | "거래할 금액", WhileYouWait 섹션 |
| 본문·메타 | `t4Regular` / `t4Medium` | `fg.neutralSubtle` / `fg.neutralMuted` | 도움말, 상세 라벨 |
| 3차 캡션 | `t3Regular` | `fg.neutralMuted` | 진행 중 거래 메타 |
| 에러 | `t4Regular` | `fg.critical` | 입력 검증 메시지 |
| 링크 | `t4Medium` | `fg.brand` | `TextLinkButton` |

### 간격

- 화면 상단 H1 블록: `pt="spacingY.navToTitle"` + `gap="spacingY.betweenText"`
- AppBar가 있는 Stack 화면: AppBar `title`과 본문 H1 역할 분리

## AnimatedAmount

breeze `AnimateNumber`는 `variant` 또는 `numberTextStyle`을 타이포 소스로 사용합니다.

```tsx
// 히어로 (홈 입력): 32px / 750 / tabular-nums — CSS `.amount-hero`
<AnimatedAmount value={amountKrw} variant="hero" suffix="원" replayKey={replayKey} />

// 인라인 (잔액 등): SEED t5Bold preset
<AnimatedAmount value={balance} numberTextStyle="t5Bold" replayKey={replayKey} />
```

- **금지:** 소비처에서 `fontSize`/`fontWeight` px 하드코딩
- preset: [`src/shared/constants/typography.ts`](../../src/shared/constants/typography.ts)
- `hero` fallback은 SEED `textStyle` 대신 `.amount-hero` class (크기 덮어쓰기 방지)
- `prefers-reduced-motion` fallback도 animated 경로와 동일 variant 사용

### AmountHeroField (홈 입력)

[AmountHeroField](../../src/shared/ui/AmountHeroField.tsx) — TextField 셸 고정. focus 시 hero inherit input, blur 시 .amount-hero static 표시. **칩 replay 직후에만** breeze AnimatedAmount. suffix 원은 TextField만 사용.

`input-host` wrapper가 SEED `TextFieldInput` `:first-child` 패딩을 대신하므로, 좌측 여백은 `amount-hero-field.css`의 `__input-host` `padding-left`(`--seed-dimension-x4`)로 input·blur overlay를 함께 맞춥니다. SEED 업그레이드 시 `compat`로 회귀 확인하세요.

## Empty / Result

인라인 empty state는 SEED `ResultSection` `medium`과 맞춥니다.

- 제목: `t5Bold`
- 설명: `t4Regular` + `fg.neutralMuted`

전면 완료 화면은 `ResultSection` 컴포넌트 사용 (`large` → `t8Bold`).

## PR 체크

- [ ] `--font-sans` 순서 유지 (system → Pretendard Variable)
- [ ] 새 화면 H1이 `screenTitle`인가?
- [ ] 히어로 금액은 `variant="hero"`, 문맥 금액은 `t6Bold`/inline인가?
- [ ] raw `fontSize`/`font-weight` CSS가 없는가?
- [ ] 금액에 `tabular-nums`가 적용되는가?

## 참고

- SEED: `.cursor/rules/seed-design.mdc`, `.agents/skills/seed-design/references/foundation.md`
- UX 카피(해요체): `.cursor/rules/consumer-ux.mdc`
