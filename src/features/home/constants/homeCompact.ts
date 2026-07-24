/**
 * 홈 화면 공통 밀도 토큰 — SEED spacing/radius 매핑.
 * base(iPhone) 기준; 전역 scale/zoom 금지.
 */
export const HOME_COMPACT = {
  layout: {
    /** 섹션 간 (~20px) */
    sectionGap: 'x5',
    /** 섹션 제목 ↔ 카드 (~12px) */
    itemGap: 'x3',
    /** 잔액 ↔ 퀵액션 */
    balanceToPrimaryGap: 'x3',
    /** 구매·판매 ↔ 거래소·사용처 */
    primaryToSecondaryGap: 'x3',
    quickToSectionPt: 'x5',
    /** 헤더·설치 배너와 잔액 카드 사이 (~20px) */
    headerBottomPb: 'x5',
  },
  card: {
    /** 흰 카드·리스트·퀵액션 공통 */
    radius: 'r5',
    shadow: 's1',
  },
  hero: {
    padding: 'x6',
    /** 상단(라벨·금액·배지) ↔ 하단 메타 */
    blockGap: 'x5',
    labelGap: 'x2',
    amountToBadgeGap: 'x3',
    metaPt: 'x4',
    radius: 'r6',
    /** 3단 + 배지 체감 높이 */
    minHeight: 216,
  },
  quickAction: {
    /** 구매·판매·거래소·사용처 동일 높이 */
    height: 96,
    iconGap: 'x1',
    cardGap: 'x3',
    iconSize: 40,
    paddingBlock: 16,
    paddingInline: 16,
  },
  requiredAction: {
    minHeight: 88,
    paddingX: 16,
    paddingY: 16,
    leadingSize: 40,
    columnGap: 12,
  },
} as const
