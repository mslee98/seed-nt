import { useSyncExternalStore } from 'react'

import type { CarrierCode } from '../constants'

export interface SignupDraft {
  name: string
  rrnFront7: string
  carrier: CarrierCode | ''
  phone: string
  bankCode: string
  bankName: string
  accountNumber: string
  pin: string
}

const initialDraft: SignupDraft = {
  name: '',
  rrnFront7: '',
  carrier: '',
  phone: '',
  bankCode: '',
  bankName: '',
  accountNumber: '',
  pin: '',
}

type Listener = () => void

let draft: SignupDraft = { ...initialDraft }
const listeners = new Set<Listener>()

function notify() {
  listeners.forEach((listener) => listener())
}

export function getSignupDraft(): SignupDraft {
  return draft
}

export function updateSignupDraft(patch: Partial<SignupDraft>) {
  draft = { ...draft, ...patch }
  notify()
}

export function resetSignupDraft() {
  draft = { ...initialDraft }
  notify()
}

export function subscribeSignupDraft(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useSignupDraft(): SignupDraft {
  return useSyncExternalStore(subscribeSignupDraft, getSignupDraft, () => initialDraft)
}
