export type TapScaleVariant = 'icon' | 'cta' | 'chip' | 'segment'

/** 탭 scale 프리셋 — variant별 체감에 맞게 분리 */
export const TAP_SCALE: Record<TapScaleVariant, number> = {
  icon: 0.94,
  cta: 0.98,
  chip: 0.96,
  segment: 0.97,
}

export const tapSpringTransition = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 25,
}

/** SegmentedControlItem용 CSS `:active` scale (motion 미적용 구간) */
export const TAP_SCALE_SEGMENT_CLASS = 'tap-scale-segment'
