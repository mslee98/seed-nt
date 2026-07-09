# Folder Structure Conventions

Brit `src/` 폴더 구조와 import 규칙입니다.

## Top-level

```text
src/
  activities/     # Stackflow Activity — 화면 진입·조립
  app/            # AppShell, layouts, providers, global styles
  features/       # 도메인 모듈
  shared/         # cross-feature
  stackflow/      # config + Stack bootstrap
  icons/ assets/  # 정적 리소스
```

## Feature module

```text
features/{domain}/
  components/     # *.tsx — domain UI only
  hooks/          # useXxxScreen, useXxxViewModel
  stores/         # client state (external store pattern OK)
  api/            # fetch/API wrappers
  utils/          # pure helpers
  mocks/          # dev/mock data only
  types.ts
  constants.ts
```

### Naming

| Kind | Pattern | Example |
|------|---------|---------|
| Screen hook | `use{Domain}Screen` | `useHomeScreen` |
| ViewModel | `use{Domain}ViewModel` | `useHomeViewModel` |
| Store | `{domain}{Entity}.store.ts` | `tradeSession.store.ts` |
| Component | PascalCase, domain prefix if ambiguous | `HomeBalanceCard` |

## Import direction

```text
shared  ←  features  ←  activities  ←  app
```

| Allowed | Avoid |
|---------|-------|
| `activities` → `features/home/hooks` | `features/auth` → `features/trade/stores` (직접 mutate) |
| `features/trade` → `shared/ui` | `shared` → `features/*` |
| `features/*` → `shared/*` | Activity 300줄+ with business logic |

**현재 예외 (documented):** `trade` → `home/stores/homeWallet.store` — wallet 분리 예정.

## Activity rules

1. File: `src/activities/{Name}Activity.tsx` or `activities/auth/`
2. Export default `ActivityComponentType<'RegisterName'>`
3. Orchestration → `features/{domain}/hooks/use{Name}Screen.ts`
4. Register name must match `src/stackflow/config.ts`

## Shared vs feature

| shared | feature |
|--------|---------|
| `AnimatedAmount`, `useAmountReplay` | `HomeBalanceCard` |
| `usePrefersReducedMotion` | `useHomeViewModel` |
| `showSnackbar` | `tradeSession.store` |

**2개 이상** feature에서 쓰이면 `shared/`로 승격 검토.

## Mocks

- `features/*/mocks/` only
- Activity/컴포넌트에 DEV 전용 테스트 버튼 남기지 않음

## SEED snippets

- `seed-design/ui/*`, `seed-design/breeze/*` — CLI 스니펫
- 커스텀 확장 시 upstream 덮어쓰기 주의 → `shared/` 래핑 권장

## Docs co-location

- 도메인 정책: `docs/domains/{domain}.md`
- Stackflow: `docs/stackflow/README.md`
- ADR: `docs/adr/`

코드 변경 시 해당 docs 동기화.
