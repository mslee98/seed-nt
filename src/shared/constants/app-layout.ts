export const APP_LAYOUT = {
  frame: { minWidth: 360, maxWidth: 616 },
  desktopSidePanel: { width: 360, gap: 16 },
  navigation: { height: 64 },
  bottomNavigation: { height: 64 },
  fixedBottom: { minHeight: 88 },
} as const

export const ACTIVITIES_WITH_BOTTOM_NAV = ['Home', 'Detail'] as const

export const DETAIL_TAB_IDS = ['transactions', 'profile'] as const

export const DETAIL_BOTTOM_NAV_IDS = ['transactions', 'profile', 'store', 'community'] as const

export const DETAIL_TAB_PATHS = DETAIL_TAB_IDS.map((id) => `/detail/${id}`) as readonly string[]

export const DETAIL_BOTTOM_NAV_PATHS = DETAIL_BOTTOM_NAV_IDS.map(
  (id) => `/detail/${id}`,
) as readonly string[]

/** Stack 외부 크롬(바텀 nav) Alert Dialog z-index */
export const CHROME_ALERT_DIALOG_LAYER_INDEX = 50