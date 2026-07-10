import { createContext, useContext, useEffect, useState } from 'react'

export const KEYBOARD_INSET_CSS_VAR = '--keyboard-inset'

export function measureKeyboardInset(): number {
  if (typeof window === 'undefined') return 0

  const viewport = window.visualViewport
  if (!viewport) return 0

  return Math.max(0, Math.round(window.innerHeight - viewport.height - viewport.offsetTop))
}

function applyKeyboardInset(inset: number) {
  document.documentElement.style.setProperty(KEYBOARD_INSET_CSS_VAR, `${inset}px`)
}

function useKeyboardInsetState(): number {
  const [inset, setInset] = useState(0)

  useEffect(() => {
    let frameId = 0

    const update = () => {
      cancelAnimationFrame(frameId)
      frameId = requestAnimationFrame(() => {
        const next = measureKeyboardInset()
        setInset(next)
        applyKeyboardInset(next)
      })
    }

    update()

    const viewport = window.visualViewport
    viewport?.addEventListener('resize', update)
    viewport?.addEventListener('scroll', update)
    window.addEventListener('resize', update)

    return () => {
      cancelAnimationFrame(frameId)
      viewport?.removeEventListener('resize', update)
      viewport?.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return inset
}

const KeyboardInsetContext = createContext(0)

/** Android Chromium — 지원 시에만 overlaysContent (optional) */
export function enableVirtualKeyboardOverlayIfSupported() {
  if (typeof navigator === 'undefined') return

  const virtualKeyboard = (
    navigator as Navigator & { virtualKeyboard?: { overlaysContent: boolean } }
  ).virtualKeyboard

  if (!virtualKeyboard) return

  try {
    virtualKeyboard.overlaysContent = true
  } catch {
    // 미지원·정책 제한 환경은 VisualViewport fallback
  }
}

export function useKeyboardInsetProviderValue(): number {
  return useKeyboardInsetState()
}

/** Provider 하위에서 inset(px) 구독 — hiddenWhenKeyboard 등 */
export function useKeyboardInset(): number {
  return useContext(KeyboardInsetContext)
}

export { KeyboardInsetContext }
