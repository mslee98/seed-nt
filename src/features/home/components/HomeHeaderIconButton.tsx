import type { ReactNode } from 'react'

interface HomeHeaderIconButtonProps {
  label: string
  onClick?: () => void
  children: ReactNode
}

export function HomeHeaderIconButton({ label, onClick, children }: HomeHeaderIconButtonProps) {
  return (
    <button type="button" className="home-header-icon-button" aria-label={label} onClick={onClick}>
      {children}
    </button>
  )
}
