import successAnimation from './success.v1.json'

export type LottieAssetKey = 'success' | 'moneyWindsLoop' | 'checkBlueSpot'

export const LOTTIE_ASSETS = {
  success: successAnimation,
} as const

export async function loadLottieAsset(key: Exclude<LottieAssetKey, 'success'>): Promise<object> {
  switch (key) {
    case 'moneyWindsLoop':
      return (await import('./money-winds-loop.v1.json')).default
    case 'checkBlueSpot':
      return (await import('./check-blue-spot.v1.json')).default
  }
}
