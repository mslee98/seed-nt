import { actions } from './stackflow'

/**
 * 스택을 루트 Home으로 정리합니다.
 * `replace('Home')`만 하면 depth가 남고 AppScreen Layer z-index가
 * GlobalBottomNavigation(chrome z=3)을 가릴 수 있습니다.
 *
 * @see SignupCompleteActivity — 동일 패턴
 */
export function navigateToRootHome(
  activityCount: number,
  options?: { animate?: boolean },
) {
  const popCount = Math.max(0, activityCount - 1)
  if (popCount > 0) {
    actions.pop(popCount, { animate: false })
  }
  actions.replace('Home', {}, { animate: options?.animate ?? true })
}
