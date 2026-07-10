import { LOTTIE_ASSETS, loadLottieAsset } from '../../../assets/lottie/lottieRegistry'
import { LottiePlayer } from '../../../shared/components/LottiePlayer'
import { ApngPlayer } from '../../../shared/components/ApngPlayer'
import { MOTION_ASSETS, type MotionAssetKey } from '../constants/motionAssets'

interface TradeMotionProps {
  variant: MotionAssetKey
  className?: string
  loop?: boolean
  autoplay?: boolean
  size?: number
  mountWhen?: boolean
}

export function TradeMotion({
  variant,
  className,
  loop,
  autoplay = true,
  size = 80,
  mountWhen = true,
}: TradeMotionProps) {
  const asset = MOTION_ASSETS[variant]
  const shouldLoop = loop ?? asset.defaultLoop

  if (asset.type === 'lottie') {
    const { lottieKey } = asset

    if (lottieKey === 'success') {
      return (
        <LottiePlayer
          animationData={LOTTIE_ASSETS.success}
          mountWhen={mountWhen}
          className={className}
          loop={shouldLoop}
          autoplay={autoplay}
          size={size}
        />
      )
    }

    return (
      <LottiePlayer
        loadAnimation={() => loadLottieAsset(lottieKey)}
        mountWhen={mountWhen}
        className={className}
        loop={shouldLoop}
        autoplay={autoplay}
        size={size}
      />
    )
  }

  return <ApngPlayer src={asset.src} className={className} size={size} />
}
