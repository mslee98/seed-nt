import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

import { detectDeviceContext, type DeviceContext } from '../services/detectDeviceContext'

const DeviceContextValue = createContext<DeviceContext | null>(null)

/** 앱 부트 시 기기 힌트 1회 수집. 보안 증거·OCTOMO 분기(PWA)에 쓰지 않는다. */
export function DeviceContextProvider({ children }: { children: ReactNode }) {
  const [device, setDevice] = useState<DeviceContext | null>(null)

  useEffect(() => {
    let cancelled = false

    void detectDeviceContext().then((ctx) => {
      if (!cancelled) setDevice(ctx)
    })

    return () => {
      cancelled = true
    }
  }, [])

  return <DeviceContextValue.Provider value={device}>{children}</DeviceContextValue.Provider>
}

export function useDeviceContextValue(): DeviceContext | null {
  return useContext(DeviceContextValue)
}
