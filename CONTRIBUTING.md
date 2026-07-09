# Contributing

Brit 프로젝트에 기여해 주셔서 감사합니다. 아래 규칙을 따라 주세요.

## 브랜치

- 기본 통합 브랜치: `dev`
- 기능/수정: `dev`에서 분기 — 예) `feat/home-balance`, `fix/signup-pin`
- `main`은 릴리스/스냅샷용 (팀 정책에 따름)

## 커밋 메시지

Conventional Commits 스타일을 따릅니다.

```
feat(scope): 한 줄 요약 (why 중심)

fix(auth): PIN confirm 불일치 시 재입력 유도
docs(stackflow): Activity 추가 레시피 작성
chore(pwa): dev SW 산출물 갱신
```

- `feat` — 새 기능
- `fix` — 버그 수정
- `docs` — 문서만
- `chore` — 빌드·에셋·설정
- `refactor` — 동작 변경 없는 구조 개선

## Pull Request

1. PR 대상: `dev`
2. `npm run lint` 통과
3. [.github/pull_request_template.md](.github/pull_request_template.md) 체크리스트 작성
4. 스크린/UI 변경 시 before/after 또는 동작 설명 포함

## 코드 구조 규칙

| 레이어 | 역할 |
|--------|------|
| `activities/` | Stackflow 화면 조립. **200줄 넘기면** `features/*/hooks/useXxxScreen`으로 분리 |
| `features/{domain}/` | 도메인 UI, ViewModel hook, store, api |
| `shared/` | 2개 이상 feature에서 쓰는 코드 |
| `app/` | Shell, global layout, Provider |

- Activity에서 API/store 직접 호출보다 feature hook 경유
- mock은 `features/*/mocks/`에만
- 상세: [docs/conventions/folder-structure.md](docs/conventions/folder-structure.md)

## 주석

- **의도·경계·UX 정책**만 코드 주석
- API/팀 공유 내용은 `docs/`에
- 상세: [docs/conventions/comments.md](docs/conventions/comments.md)

## Consumer UX (출시 전 필수)

[앱인토스 Consumer UX](https://developers-apps-in-toss.toss.im/design/consumer-ux-guide.md) 및 `.cursor/rules/consumer-ux.mdc` 기준:

- 홈/앱 **진입 직후** 전면 바텀시트·권한 요청 금지
- AlertDialog 왼쪽 버튼: **`닫기`** (`취소` 금지)
- UI 카피: **해요체**, 능동형·긍정형
- `prefers-reduced-motion` fallback 유지

## SEED Design

- 컴포넌트: `seed-design/ui/*`, breeze: `seed-design/breeze/*`
- 색상: 역할 토큰 `--seed-color-fg-*`, `--seed-color-bg-*` 우선
- CLI/마이그레이션: `.cursor/rules/seed-design.mdc`, `.agents/skills/seed-design/`

## 리뷰 관점

- Activity가 얇은가?
- feature 경계가 깨지지 않았는가?
- 다크패턴·과한 모션 중복은 없는가?
- 문서/타입(`Register`)과 route가 일치하는가?
