import { useEffect, useRef } from 'react'

import { useLayout } from '../../../app/layouts/LayoutContext'
import { setMatchingMode } from '../matching/matchingSession.store'
import { useActiveTrade } from './useActiveTrade'

function isHomePath(pathname: string): boolean {
  return pathname === '/'
}

export function useMatchingSurfaceSync() {
  const { pathname } = useLayout()
  const activeTrade = useActiveTrade()
  const prevIsHomeRef = useRef(isHomePath(pathname))

  useEffect(() => {
    const isHome = isHomePath(pathname)
    const prevIsHome = prevIsHomeRef.current
    prevIsHomeRef.current = isHome

    if (!activeTrade || activeTrade.status !== 'MATCHING') {
      return
    }

    if (prevIsHome === isHome) {
      return
    }

    if (isHome) {
      setMatchingMode('FLEXIBLE')
      return
    }

    setMatchingMode('EXACT')
  }, [pathname, activeTrade?.id, activeTrade?.status])
}
