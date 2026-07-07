export type MotionAssetKey = 'matching' | 'completed'

export interface MotionAsset {
  type: 'lottie' | 'apng'
  src: string
  defaultLoop: boolean
}

export const MOTION_ASSETS: Record<MotionAssetKey, MotionAsset> = {
  matching: {
    type: 'apng',
    src: '/apng/moneybag-rotate-apng.png',
    defaultLoop: true,
  },
  completed: {
    type: 'lottie',
    src: '/lotties/Success.json',
    defaultLoop: false,
  },
}
