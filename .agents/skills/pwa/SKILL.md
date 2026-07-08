---
name: pwa
description: PWA 도입·구현 통합 가이드. manifest, Service Worker, 오프라인 UX, 설치 UX, IndexedDB/sync queue, Push Notification 검토, Android/iOS 호환성, Lighthouse PWA 기준, 토스 스타일 아키텍처까지 커버. PWA 관련 질문·구현·진단·리팩토링이면 이 스킬을 사용한다. 사용자가 "PWA", "오프라인", "앱 설치", "Service Worker", "manifest", "홈 화면 추가" 등을 언급하면 반드시 이 스킬을 로드한다.
user-invocable: true
argument-hint: "[질문 또는 Phase]"
---

# PWA

React/Vite/TypeScript 기반 프론트엔드에 PWA를 단계적으로 도입할 때 사용하는 통합 가이드입니다.

## 동작 방식

### 1단계: 프로젝트 상태 파악 (코드 수정 전 필수)

다음 항목을 분석합니다.

- 프로젝트 구조, 라우팅(Stackflow 등), 인증 처리, API 요청 구조
- 전역 상태 관리, 데이터 패칭/캐싱 라이브러리
- 빌드 도구(Vite), 배포 환경, HTTPS
- 모바일 반응형, safe-area, standalone 대응
- `vite.config.ts`의 `VitePWA` 설정, `manifest`, Workbox 전략
- 기존 PWA 코드 위치 (`src/features/home/` 설치 UX 등)
- 오프라인에서 동작하면 안 되는 기능 vs draft 저장 가능한 기능

→ `references/diagnosis.md` 형식으로 진단 보고서 작성

### 2단계: 호환성 검토

기능 구현 전 `references/compatibility.md` 매트릭스와 호환성 판단 템플릿으로 Android Chrome / iOS Safari / iOS standalone 여부를 확인합니다.

최종 판단: 바로 구현 | 조건부 구현 | fallback 포함 | Android만 | iOS 안내 UX만 | 현재 제외 | 네이티브 필요

### 3단계: 아키텍처 설계

`references/architecture.md` — PWA 관심사를 `src/features/pwa/`에 분리. 프로젝트 구조에 맞게 단순화 가능.

### 4단계: 단계별 구현

`references/phases-and-testing.md` Phase 1~6 순서 준수. 한 번에 전체 구현 금지.

### 5단계: 구현 상세 적용

`references/implementation.md` — manifest, SW, 오프라인 UX, IndexedDB/TTL, Push, 업데이트, 설치 UX

## 참조 파일

| 상황 | 참조 |
|------|------|
| 진단·현재 상태 점검 | `references/diagnosis.md` |
| 폴더 구조·코드 원칙 | `references/architecture.md` |
| Android/iOS 기능 매트릭스 | `references/compatibility.md` |
| manifest/SW/오프라인/Push 등 | `references/implementation.md` |
| Phase·테스트·산출물 형식 | `references/phases-and-testing.md` |

## 코드 수정 워크플로

1. 현재 구조 분석
2. 변경 대상 파일 목록 + 수정 이유
3. 최소 변경 1차 구현
4. 동작 확인 방법
5. Android/iOS 호환성 재검토
6. 테스트 체크리스트 제공
