import { useEffect, type ReactNode } from 'react'

import {
  enableVirtualKeyboardOverlayIfSupported,
  KeyboardInsetContext,
  useKeyboardInsetProviderValue,
} from '../../shared/hooks/useKeyboardInset'

interface KeyboardInsetProviderProps {
  children: ReactNode
}

/** 앱 전역 `--keyboard-inset` 갱신 */
export function KeyboardInsetProvider({ children }: KeyboardInsetProviderProps) {
  const inset = useKeyboardInsetProviderValue()

  useEffect(() => {
    enableVirtualKeyboardOverlayIfSupported()
  }, [])

  return (
    <KeyboardInsetContext.Provider value={inset}>{children}</KeyboardInsetContext.Provider>
  )
}
