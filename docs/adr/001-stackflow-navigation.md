# ADR 001: Stackflow for client navigation

**Status:** Accepted  
**Date:** 2026-07-09

## Context

Brit은 모바일 웹/PWA 형태의 미니앱으로, 화면 전환·뒤로가기·URL 공유가 자연스러워야 합니다.  
Next.js App Router도 가능하지만, 팀은 **앱인토스/토스 스타일 Activity 스택**과 SEED Design의 Stackflow 통합을 우선합니다.

## Decision

**Stackflow** (`@stackflow/react`) + `historySyncPlugin`으로 네비게이션을 구현합니다.

- Activity = 화면 단위 (`src/activities/`)
- route·params 타입 = `src/stackflow/config.ts` (`Register`)
- Activity 내부: `useFlow()` / Activity 밖 크롬: `actions`

## Consequences

### Positive

- 모바일 네이티브 앱과 유사한 push/pop/replace mental model
- `@seed-design/stackflow` 테마 플러그인 연동
- URL ↔ Stack sync (`historySyncPlugin`)로 새로고침·딥링크 지원
- Activity 경계가 명확해 feature-sliced 구조와 잘 맞음

### Negative / Trade-offs

- Next.js SSR/SSG 생태계 미사용
- 팀원이 Stackflow 패턴 학습 필요 → [docs/stackflow/README.md](../stackflow/README.md)
- Activity가 비대해지기 쉬움 → `useXxxScreen` hook 패턴으로 완화

## Rules derived from this decision

1. 새 전체 화면 = Activity 추가 (config + stackflow.ts + activities/)
2. 같은 맥락 오버레이 = BottomSheet (Activity 유지)
3. Activity 200줄 초과 시 feature hook으로 orchestration 분리
4. params는 `Register`에 타입 정의 — URL과 store 이중 진실 방지

## References

- [Stackflow docs](https://stackflow.so/ko)
- [`src/stackflow/stackflow.ts`](../../src/stackflow/stackflow.ts)
- [`docs/stackflow/README.md`](../stackflow/README.md)
