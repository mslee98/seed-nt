import { useDeviceContextValue } from '../providers/DeviceContextProvider'
import type { DeviceContext } from '../services/detectDeviceContext'

/** 상세 기기 힌트. DEV·UX 분기용. 보안 증거로 쓰지 않는다. */
export function useDeviceContext(): DeviceContext | null {
  return useDeviceContextValue()
}
