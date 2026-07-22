import { useSyncExternalStore } from 'react'

import {
  detectRuntimeEnvironment,
  type RuntimeEnvironment,
} from '../services/detectDeviceContext'

const subscribe = () => () => {}

function getSnapshot(): RuntimeEnvironment {
  return detectRuntimeEnvironment()
}

function getServerSnapshot(): RuntimeEnvironment {
  return 'desktop'
}

/** OS 기반 화면 분기용. 설치 가이드 플랫폼과 별개. */
export function useRuntimeEnvironment(): RuntimeEnvironment {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
