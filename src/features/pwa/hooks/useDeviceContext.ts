import { useEffect, useState } from 'react'

import { detectDeviceContext, type DeviceContext } from '../services/detectDeviceContext'

/** 상세 기기 힌트. DEV 검증·고급 분기용. 보안 증거로 쓰지 않는다. */
export function useDeviceContext(): DeviceContext | null {
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

  return device
}
