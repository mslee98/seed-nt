# Typography Conventions

Brit UI 타이포그래피는 [SEED Design](https://seed-design.io) 토큰을 따릅니다.  
**밀도·역할은 Toss에 맞추고**, 스케일/weight는 SEED만 사용합니다 (토스 TDS px·SemiBold 직접 도입 금지).

## Font

### 스택

[`src/app/styles/typography.css`](../../src/app/styles/typography.css)의 `--font-sans` / `--app-font-family`:

- **iOS:** `-apple-system`, `Apple SD Gothic Neo` 우선 → 네이티브 UI에 가깝게
- **그 외:** `Pretendard Variable` fallback → 한글·숫자 안정 표현
- `Noto Sans KR`은 최후 fallback (메인 금지)

Pretendard는 [`src/main.tsx`](../../src/main.tsx)에서 `pretendardvariable-dynamic-subset.css`로 로드합니다 (woff2, `font-display: swap`).

### 전역 톤

- `body`: `letter-spacing: var(--app-typo-body-tracking)` (`-0.01em`)
- 화면 H1 자간 보강: `className="typo-title-tight"` (`-0.02em`)
- AppBar 타이틀: Toss 탑바 근사 → SEED `t5Medium` ([`typography.css`](../../src/app/styles/typography.css) 오버라이드)
- iOS/Android 글자 크기: [`vite.config.ts`](../../vite.config.ts) `seedDesignPlugin({ fontScaling: true })`

## 색상 (Toss) × 타이포 (SEED)

- **타이포**: JSX는 SEED `textStyle` **직접** 사용 (`textStyle="t7Bold"`)
- **역할 참조**: [`SEED_TYPO_ROLES`](../../src/shared/constants/typography.ts) — 홈 preset·새 화면에서 어떤 토큰을 쓸지 조회
- **텍스트 색**: SEED `color="fg.*"` API 유지, 값은 [`toss-theme.css`](../../src/app/styles/toss-theme.css)에서 Toss grey로 오버라이드
  - `fg.neutral` → grey800 `#333d4b` (기본 본문·제목, 순수 `#000` 사용 금지)
  - `fg.neutralMuted` → grey700 / `fg.neutralSubtle` → grey600
  - 상수 참조: [`TOSS_FG`](../../src/shared/constants/toss-colors.ts)

## 기본 원칙

1. **`<Text textStyle="t7Bold" color="fg.*">`** — SEED 토큰 직접
2. **`screenTitle`은 가입·온보딩 히어로만** — 탭/목록 H1은 `t7Bold`
3. **DS 컴포넌트** — `ListItem`, `TextField`, `ResultSection`, `ActionButton` 등은 내부 타이포 유지. AppBar만 Toss 밀도 오버라이드
4. **숫자** — 금액·카운트에 `tabular-nums`

### Toss → SEED 매칭

| Toss | SEED `textStyle` | `SEED_TYPO_ROLES` |
|------|------------------|-------------------|
| 탑 네비 15 SemiBold | `t5Medium` | `navTitle` |
| 리스트 헤더 20 Bold | `t7Bold` | `pageTitle` |
| 헤더 보조 13 Regular | `t3Regular` | `pageDesc` |
| SemiBold(600) | Medium(500) | — |

```tsx
import { SEED_TYPO_ROLES } from '../../shared/constants/typography'

// 화면: SEED textStyle 직접
<Text textStyle="t7Bold" color="fg.neutral">거래내역</Text>
<Text textStyle="t3Regular" color="fg.neutralMuted">설명</Text>

// preset: 역할 카탈로그 참조
sectionTitle: SEED_TYPO_ROLES.pageTitle // 't7Bold'
```

## 계층표

| 역할 | textStyle / variant | color 예시 | 사용처 |
|------|---------------------|------------|--------|
| 탑 네비 | AppBar → `t5Medium` | `fg.neutral` | Stack `ActivityScreenLayout` |
| 화면 H1 | `t7Bold` | `fg.neutral` | 프로필, 거래내역, 탐색, 거래 화면 |
| H1 히어로 | `screenTitle` | `fg.neutral` | 가입·인증·기관 선택 |
| 부제 | `t3Regular` | `fg.neutralMuted` | H1 아래 설명 |
| 섹션 헤더 | `t7Bold` | `fg.neutral` | 홈 리스트, WhileYouWait, 매칭 피드 |
| 섹션 보조 | `t3Regular` | `fg.neutralMuted` | 섹션 헤더 아래 |
| 행·카드 타이틀 | `t5Bold` | `fg.neutral` | 홈 task, Push/Install 카드 |
| 히어로 금액 | `AnimatedAmount variant="hero"` | `fg.neutral` | 홈 거래 금액 입력 |
| 홈 월렛 잔액 | `variant="balance"` (~44px / 750) | inverted 100% | 라벨 `t3Regular` muted, 단위 `t5Medium`, 메타 `t3`+`t5Bold` |
| 문맥 금액 | `t6Bold` | `fg.neutral` | 거래 상세, 입금, 매칭 카드 |
| 본문·메타 | `t4Regular` / `t4Medium` | `fg.neutralSubtle` / `Muted` | 도움말, 상세 라벨 |
| 캡션 | `t3Regular` | `fg.neutralMuted` | 메타, 배너 보조 |
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
- [ ] 탭/목록 H1이 `t7Bold`인가? (`screenTitle`은 히어로만)
- [ ] 섹션 헤더가 `t7Bold`, 보조가 `t3Regular`인가?
- [ ] 히어로 금액은 `variant="hero"`, 문맥 금액은 `t6Bold`/inline인가?
- [ ] raw `fontSize`/`font-weight` CSS가 없는가? (AppBar·amount 예외 제외)
- [ ] 금액에 `tabular-nums`가 적용되는가?

## 참고

- SEED: `.cursor/rules/seed-design.mdc`, `.agents/skills/seed-design/references/foundation.md`
- UX 카피(해요체): `.cursor/rules/consumer-ux.mdc`
