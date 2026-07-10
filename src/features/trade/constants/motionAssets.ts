import type { LottieAssetKey } from '../../../assets/lottie/lottieRegistry'

export type MotionAssetKey =
  | 'matching'
  | 'completed'
  | 'waitingConfirm'
  | 'paymentTransfer'
  | 'waitingPayment'
  | 'disputed'

export type ApngMotionAsset = {
  type: 'apng'
  src: string
  defaultLoop: boolean
}

export type LottieMotionAsset = {
  type: 'lottie'
  lottieKey: LottieAssetKey
  defaultLoop: boolean
}

export type MotionAsset = ApngMotionAsset | LottieMotionAsset

export const MOTION_ASSETS: Record<MotionAssetKey, MotionAsset> = {
  matching: {
    type: 'apng',
    src: '/motion/moneybag-rotate.v1.apng',
    defaultLoop: true,
  },
  completed: {
    type: 'lottie',
    lottieKey: 'success',
    defaultLoop: false,
  },
  waitingConfirm: {
    type: 'apng',
    src: '/motion/moneybag-loop.v1.apng',
    defaultLoop: true,
  },
  paymentTransfer: {
    type: 'lottie',
    lottieKey: 'moneyWindsLoop',
    defaultLoop: true,
  },
  waitingPayment: {
    type: 'apng',
    src: '/motion/flying-coin-won.v1.apng',
    defaultLoop: true,
  },
  disputed: {
    type: 'apng',
    src: '/motion/money-protect.v1.apng',
    defaultLoop: true,
  },
}
