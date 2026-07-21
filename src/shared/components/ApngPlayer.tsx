import { useEffect, useState } from 'react'

interface ApngPlayerProps {
  src: string
  className?: string
  size?: number
  alt?: string
}

/**
 * APNG 재생 플레이어.
 *
 * Chromium: SW Cache API 응답을 `<img src>`에 직접 넣으면 첫 프레임만 보이는 경우가 있어
 * fetch → blob URL로 재생합니다. (runtime CacheFirst 오프라인 캐시와 병행 가능)
 *
 * prefers-reduced-motion (제품 결정 B — 의도적 예외):
 * OS 「동작 줄이기」/저전력 모드여도 APNG를 숨기지 않고 동일하게 재생합니다.
 * iOS에서 reduce 시 `null`이면 거래·가입 핵심 상태 그래픽이 빈 자리로 남아 문맥이 끊겼습니다.
 * APNG는 CSS로 루프만 끄기 어렵고, 정적 포스터 에셋이 준비되기 전엔 “미렌더”보다 “재생 유지”를 우선합니다.
 *
 * 접근성 리스크: 전정계 민감 사용자에게 루프 모션이 계속 노출될 수 있습니다.
 * 이후 A(정적 포스터) 또는 C(앱 내 모션 토글)로 되돌릴 때 reduce 분기를 복구하세요.
 *
 * @see .cursor/rules/mobile-motion.mdc
 * @see docs/pwa/trade-motion-diagnosis.md
 */
export function ApngPlayer({
  src,
  className,
  size = 80,
  alt = '',
}: ApngPlayerProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null)

  useEffect(() => {
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
  }, [src])

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
