import { Text } from '@seed-design/react'
import type { MouseEvent, ReactNode } from 'react'

interface TextLinkButtonProps {
  children: ReactNode
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
}

export function TextLinkButton({ children, onClick, disabled }: TextLinkButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="text-link-button"
    >
      <Text textStyle="t4Medium" color={disabled ? 'fg.neutralSubtle' : 'fg.brand'}>
        {children}
      </Text>
    </button>
  )
}
