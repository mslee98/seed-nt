import LottieImport from 'lottie-react'
import type { LottieComponentProps } from 'lottie-react'
import { useEffect, useState, type ComponentType } from 'react'

import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const Lottie = (
  'default' in LottieImport ? LottieImport.default : LottieImport
) as ComponentType<LottieComponentProps>

interface LottiePlayerProps {
  src: string
  className?: string
  loop?: boolean
  autoplay?: boolean
  size?: number
}

export function LottiePlayer({
  src,
  className,
  loop = false,
  autoplay = true,
  size = 80,
}: LottiePlayerProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [animationData, setAnimationData] = useState<object | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(src)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setAnimationData(data)
      })
      .catch(() => {
        if (!cancelled) setAnimationData(null)
      })
    return () => {
      cancelled = true
    }
  }, [src])

  if (!animationData) return null

  const shouldLoop = prefersReducedMotion ? false : loop
  const shouldAutoplay = prefersReducedMotion ? false : autoplay

  return (
    <Lottie
      animationData={animationData}
      loop={shouldLoop}
      autoplay={shouldAutoplay}
      className={className}
      style={{ width: size, height: size }}
    />
  )
}
