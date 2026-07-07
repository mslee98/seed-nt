import { LottiePlayer } from '../../../shared/components/LottiePlayer'
import { ApngPlayer } from '../../../shared/components/ApngPlayer'
import { MOTION_ASSETS, type MotionAssetKey } from '../constants/motionAssets'

interface TradeMotionProps {
  variant: MotionAssetKey
  className?: string
  loop?: boolean
  autoplay?: boolean
  size?: number
}

export function TradeMotion({
  variant,
  className,
  loop,
  autoplay = true,
  size = 80,
}: TradeMotionProps) {
  const asset = MOTION_ASSETS[variant]
  const shouldLoop = loop ?? asset.defaultLoop

  if (asset.type === 'lottie') {
    return (
      <LottiePlayer
        src={asset.src}
        className={className}
        loop={shouldLoop}
        autoplay={autoplay}
        size={size}
      />
    )
  }

  return <ApngPlayer src={asset.src} className={className} size={size} />
}
