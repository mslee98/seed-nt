import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

interface ApngPlayerProps {
  src: string
  className?: string
  size?: number
  alt?: string
}

export function ApngPlayer({
  src,
  className,
  size = 80,
  alt = '',
}: ApngPlayerProps) {
  const prefersReducedMotion = usePrefersReducedMotion()

  if (prefersReducedMotion) return null

  return (
    <img
      src={src}
      alt={alt}
      aria-hidden={alt === '' ? true : undefined}
      loading="lazy"
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
