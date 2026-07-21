/**
 * 홈 모바일 compact 밀도 — SEED 토큰 매핑.
 * base(iPhone) 기준; 전역 scale/zoom 금지.
 */
export const HOME_COMPACT = {
  layout: {
    sectionGap: 'x6',
    itemGap: 'x2',
    quickToSectionPt: 'x6',
    headerBottomPb: 'x2',
  },
  hero: {
    padding: 'x5',
    radius: 'r6',
  },
  quickAction: {
    height: 72,
    radius: 'r4',
    iconGap: 'x1',
    cardGap: 'x2',
    paddingBlock: 10,
    paddingInline: 4,
  },
  requiredAction: {
    minHeight: 84,
    radius: 'r5',
    paddingX: 16,
    paddingY: 14,
    leadingSize: 36,
    columnGap: 12,
  },
} as const
