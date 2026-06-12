import { useEffect } from 'react'

import { useLayout } from './LayoutContext'

export function useLayoutOverlay(isOpen: boolean) {
  const { registerOverlay } = useLayout()

  useEffect(() => {
    if (!isOpen) return
    return registerOverlay()
  }, [isOpen, registerOverlay])
}
