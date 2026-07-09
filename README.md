# Brit

KRW ↔ 내부 코인 P2P 거래를 지원하는 React 미니앱 프로토타입입니다.  
모바일 웹/PWA 형태로 동작하며, [Stackflow](https://stackflow.so/ko) 기반 화면 전환과 [SEED Design](https://seed-design.io/) UI를 사용합니다.

## 기술 스택

| 구분 | 기술 |
|------|------|
| 빌드 | Vite 6, TypeScript |
| UI | React 19, SEED Design (`@seed-design/react`, `seed-design/ui/*`) |
| 네비게이션 | Stackflow (`@stackflow/react`, history sync) |
| 모션 | Motion (`motion/react`), breeze `AnimateNumber` |
| PWA | vite-plugin-pwa, Workbox |

## 시작하기

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc + vite build
npm run lint     # eslint
```

## 프로젝트 구조

```text
src/
  activities/     # Stackflow Activity (화면 진입점, 조립 위주)
  app/            # AppShell, Provider, global layout
  features/       # 도메인별 UI·hook·store (auth, home, trade, pwa)
  shared/         # feature 간 공용 UI·hook·utils
  stackflow/      # 라우트 config, Stack bootstrap
docs/
  architecture/   # 전체 아키텍처
  stackflow/      # Stackflow 팀 가이드 (필독)
  domains/        # auth, trade, api-spec 도메인 요약
  fixtures/       # API mock JSON (MSW·stub용)
  conventions/    # 폴더·주석 규칙
  adr/            # Architecture Decision Records
```

## 신규 합류자 읽을 순서

1. [docs/architecture/overview.md](docs/architecture/overview.md) — 레이어·의존 규칙
2. [docs/architecture/trade-platform-summary.md](docs/architecture/trade-platform-summary.md) — **거래·플랫폼 설계 종합**
3. [docs/stackflow/README.md](docs/stackflow/README.md) — Activity, `useFlow`, `actions`
4. [docs/domains/trade.md](docs/domains/trade.md) / [docs/domains/auth.md](docs/domains/auth.md) / [docs/domains/merchant.md](docs/domains/merchant.md)
5. [docs/domains/api-spec.md](docs/domains/api-spec.md) — 백엔드 API req/res·fixture
6. [CONTRIBUTING.md](CONTRIBUTING.md) — PR·커밋·리뷰 규칙
7. `.cursor/rules/` — Consumer UX, PWA, SEED Design (에이전트·로컬 룰)

## Activity 추가 (요약)

1. `src/stackflow/config.ts` — `Register` 타입 + `route` 등록
2. `src/activities/MyActivity.tsx` — 화면 컴포넌트
3. `src/stackflow/stackflow.ts` — `components`에 매핑

상세: [docs/stackflow/README.md#새-activity-추가](docs/stackflow/README.md)

## 협업

- 기본 브랜치: `dev`
- PR 전 `npm run lint` 실행
- PR 템플릿: [.github/pull_request_template.md](.github/pull_request_template.md)
- AI/에이전트 작업: [AGENTS.md](AGENTS.md)
