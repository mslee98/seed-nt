export const APP_LAYOUT = {
  frame: { minWidth: 360, maxWidth: 616 },
  desktopSidePanel: { width: 360, gap: 16 },
  navigation: { height: 64 },
  bottomNavigation: { height: 64 },
  fixedBottom: { minHeight: 88 },
} as const

export const ACTIVITIES_WITH_BOTTOM_NAV = ['Home'] as const
