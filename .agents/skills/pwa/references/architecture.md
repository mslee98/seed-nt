# PWA 권장 아키텍처

PWA 관련 코드는 비즈니스 로직과 분리합니다. 파일을 무조건 많이 만들지 말고, 역할이 작고 불명확한 파일은 만들지 않습니다.

## 권장 폴더 구조

프로젝트 구조에 맞게 단순화 가능.

```
src/
  app/
    providers/
    layouts/
  shared/
    api/
    config/
    constants/
    hooks/
    lib/
    storage/
    ui/
  features/
    pwa/                    # PWA 관심사 통합 (home/에서 이전 검토)
      components/
        InstallPrompt.tsx
        IOSInstallGuide.tsx
        UpdateAvailableBanner.tsx
        OfflineBanner.tsx
      hooks/
        usePWAInstall.ts
        useStandaloneMode.ts
        useNetworkStatus.ts
        useServiceWorkerUpdate.ts
      services/
        pwaInstallService.ts
        notificationService.ts
        syncQueueService.ts
        cachePolicyService.ts
      storage/
        indexedDBClient.ts
        syncQueueRepository.ts
      utils/
        platform.ts         # isIOS, isAndroid, isStandalone, getPWACapability 통합 가능
      types/
        pwa.types.ts
  activities/                 # Stackflow activity (현재 프로젝트)
public/
  icons/
  offline.html
```

현재 프로젝트: 설치 UX가 `src/features/home/`에 있음 → Phase 3에서 `features/pwa/`로 이전 검토.

## 관심사 분리

| 레이어 | 책임 |
|--------|------|
| components | UI만. hook 통해 상태·액션 사용 |
| hooks | React 상태·이펙트, service 호출 |
| services | 브라우저 API, SW, 알림, sync queue |
| storage | IndexedDB CRUD, 스키마, migration |
| utils | 플랫폼 감지, capability 판단 (컴포넌트 내 분기 금지) |

## 코드 작성 원칙 (토스 스타일)

### 가독성
- 함수명만 봐도 의도 표현
- 긍정 조건 위주, 중첩 if 최소화
- magic number/string → 상수
- 복잡한 boolean → 의미 있는 변수명
- 주석은 "왜"만

### 예측 가능성
- 함수 단일 책임, 동일 입력 → 동일 결과
- side effect 분리
- 브라우저 API → service/유틸 래핑
- iOS/Android 분기 → capability service

### 응집도
- PWA 설치 UX → `features/pwa/` 한곳
- SW 등록·업데이트 → 한 흐름
- IndexedDB / 캐시 / sync queue → 각각 책임 분리

### 결합도
- UI가 IndexedDB·SW 세부사항 직접 접근 금지
- 비즈니스 API ↔ PWA 캐싱 강결합 금지
- 브라우저 전용 기능 → fallback 필수

## TTL 캐시 패턴

```typescript
type CacheRecord<T> = {
  data: T;
  savedAt: number;
  ttlMs: number;
};

function isExpired(record: CacheRecord<unknown>) {
  return Date.now() - record.savedAt > record.ttlMs;
}
```

복잡한 캐시 시스템보다 데이터별 유효 기간을 명확히 관리.

## IndexedDB 기준

- localStorage에 복잡 데이터 저장 금지
- 스키마 정의, version migration, TTL 만료, 용량 초과 대응
- 인증 사용자 변경 시 데이터 격리/초기화
- 민감 정보 저장 금지
- 서버-로컬 충돌 처리 정책 정의
