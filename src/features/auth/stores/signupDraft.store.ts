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
  accountHolderName: string
  /** 거래 PIN (평문 — 제출 직후 reset) */
  pin: string
  /** 로그인 비밀번호 (평문 — 제출 직후 clear) */
  loginPassword: string
  nickname: string
}

const initialDraft: SignupDraft = {
  name: '',
  rrnFront7: '',
  carrier: '',
  phone: '',
  bankCode: '',
  bankName: '',
  accountNumber: '',
  accountHolderName: '',
  pin: '',
  loginPassword: '',
  nickname: '',
}

type Listener = () => void

let draft: SignupDraft = { ...initialDraft }
const listeners = new Set<Listener>()

function notify() {
  listeners.forEach((listener) => notifyListener(listener))
}

function notifyListener(listener: Listener) {
  listener()
}

export function getSignupDraft(): SignupDraft {
  return draft
}

export function updateSignupDraft(patch: Partial<SignupDraft>) {
  draft = { ...draft, ...patch }
  notify()
}

export function clearSignupSecrets() {
  draft = { ...draft, pin: '', loginPassword: '' }
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
