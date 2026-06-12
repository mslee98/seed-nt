import LottieImport from 'lottie-react'
import type { LottieComponentProps } from 'lottie-react'
import { useEffect, useState, type ComponentType } from 'react'

const Lottie = (
  'default' in LottieImport ? LottieImport.default : LottieImport
) as ComponentType<LottieComponentProps>

interface LottiePlayerProps {
  src: string
  className?: string
  loop?: boolean
  autoplay?: boolean
}

export function LottiePlayer({
  src,
  className,
  loop = false,
  autoplay = true,
}: LottiePlayerProps) {
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

  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      autoplay={autoplay}
      className={className}
      style={{ width: 80, height: 80 }}
    />
  )
}
