import { useEffect, useState } from 'react'

import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

interface ApngPlayerProps {
  src: string
  className?: string
  size?: number
  alt?: string
}

/**
 * APNG는 SW Cache API로 `<img src>`에 다시 주면 Chromium에서 첫 프레임만 보이는 경우가 있어,
 * fetch → blob URL로 재생합니다. (runtime CacheFirst 오프라인 캐시와 병행 가능)
 */
export function ApngPlayer({
  src,
  className,
  size = 80,
  alt = '',
}: ApngPlayerProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [objectUrl, setObjectUrl] = useState<string | null>(null)

  useEffect(() => {
    if (prefersReducedMotion) {
      setObjectUrl(null)
      return
    }

    let cancelled = false
    let createdUrl: string | null = null

    const load = async () => {
      try {
        const response = await fetch(src)
        if (!response.ok || cancelled) return

        const blob = await response.blob()
        if (cancelled) return

        const nextUrl = URL.createObjectURL(blob)
        if (cancelled) {
          URL.revokeObjectURL(nextUrl)
          return
        }

        createdUrl = nextUrl
        setObjectUrl(nextUrl)
      } catch {
        // 네트워크/캐시 실패 시 모션 자리만 비움 (텍스트 UI로 상태 전달)
      }
    }

    void load()

    return () => {
      cancelled = true
      if (createdUrl) URL.revokeObjectURL(createdUrl)
      setObjectUrl(null)
    }
  }, [src, prefersReducedMotion])

  if (prefersReducedMotion) return null

  if (!objectUrl) {
    return (
      <span
        aria-hidden
        className={className}
        style={{
          width: size,
          height: size,
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
    )
  }

  return (
    <img
      src={objectUrl}
      alt={alt}
      aria-hidden={alt === '' ? true : undefined}
      decoding="async"
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        flexShrink: 0,
      }}
    />
  )
}
