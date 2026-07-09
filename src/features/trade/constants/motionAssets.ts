export type MotionAssetKey =
  | 'matching'
  | 'completed'
  | 'waitingConfirm'
  | 'paymentTransfer'
  | 'waitingPayment'
  | 'disputed'

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
  waitingConfirm: {
    type: 'apng',
    src: '/apng/moneybag-loop-400-apng.png',
    defaultLoop: true,
  },
  paymentTransfer: {
    type: 'lottie',
    src: '/lotties/money-winds-loop.json',
    defaultLoop: true,
  },
  waitingPayment: {
    type: 'apng',
    src: '/apng/flying-coin-won-slow-apng.png',
    defaultLoop: true,
  },
  disputed: {
    type: 'apng',
    src: '/apng/money-protect-confetti-apng.png',
    defaultLoop: true,
  },
}
