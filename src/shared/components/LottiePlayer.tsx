import LottieImport from 'lottie-react'
import type { LottieComponentProps } from 'lottie-react'
import { useEffect, useState, type ComponentType } from 'react'

import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const Lottie = (
  'default' in LottieImport ? LottieImport.default : LottieImport
) as ComponentType<LottieComponentProps>

const DEFAULT_RENDERER_SETTINGS: LottieComponentProps['rendererSettings'] = {
  preserveAspectRatio: 'xMidYMid meet',
  progressiveLoad: true,
}

interface LottiePlayerProps {
  animationData?: object
  loadAnimation?: () => Promise<object>
  mountWhen?: boolean
  className?: string
  loop?: boolean
  autoplay?: boolean
  size?: number
}

export function LottiePlayer({
  animationData: animationDataProp,
  loadAnimation,
  mountWhen = true,
  className,
  loop = false,
  autoplay = true,
  size = 80,
}: LottiePlayerProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [loadedAnimationData, setLoadedAnimationData] = useState<object | null>(
    animationDataProp ?? null,
  )

  useEffect(() => {
    if (!mountWhen || animationDataProp) {
      setLoadedAnimationData(animationDataProp ?? null)
      return
    }

    if (!loadAnimation) {
      setLoadedAnimationData(null)
      return
    }

    let cancelled = false
    void loadAnimation()
      .then((data) => {
        if (!cancelled) setLoadedAnimationData(data)
      })
      .catch(() => {
        if (!cancelled) setLoadedAnimationData(null)
      })

    return () => {
      cancelled = true
    }
  }, [animationDataProp, loadAnimation, mountWhen])

  if (!mountWhen || !loadedAnimationData) return null

  const shouldLoop = prefersReducedMotion ? false : loop
  const shouldAutoplay = prefersReducedMotion ? false : autoplay

  return (
    <Lottie
      animationData={loadedAnimationData}
      loop={shouldLoop}
      autoplay={shouldAutoplay}
      className={className}
      style={{ width: size, height: size }}
      rendererSettings={DEFAULT_RENDERER_SETTINGS}
    />
  )
}
