import { useSyncExternalStore } from 'react'

export type AuthStatus = 'guest' | 'authenticated'

const STORAGE_KEY = 'nt-auth-session'

type Listener = () => void

let status: AuthStatus = 'guest'
const listeners = new Set<Listener>()

function readStoredStatus(): AuthStatus {
  if (typeof window === 'undefined') return 'guest'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'authenticated' ? 'authenticated' : 'guest'
}

function persistStatus(next: AuthStatus) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, next)
}

function notify() {
  listeners.forEach((listener) => listener())
}

status = readStoredStatus()

export function getAuthStatus(): AuthStatus {
  return status
}

export function isAuthenticated(): boolean {
  return status === 'authenticated'
}

export function setAuthStatus(next: AuthStatus) {
  status = next
  persistStatus(next)
  notify()
}

export function subscribeAuthStatus(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useAuthStatus(): AuthStatus {
  return useSyncExternalStore(subscribeAuthStatus, getAuthStatus, () => 'guest')
}
