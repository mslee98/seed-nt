import type { SignupAccountStep, SignupIdentityStep, SignupPinStep } from '../constants'
import { getIdentityStepIndex } from '../constants'

export const SIGNUP_PROGRESS_TOTAL = 9

export type SignupProgressInput =
  | { type: 'identity'; step: SignupIdentityStep }
  | { type: 'sms' }
  | { type: 'account'; step: SignupAccountStep }
  | { type: 'pin'; step: SignupPinStep }

const SIGNUP_STEP_LABELS = [
  '이름',
  '주민등록번호',
  '통신사',
  '휴대폰 번호',
  '인증번호',
  '계좌 선택',
  '계좌번호',
  '환전 비밀번호',
  '비밀번호 확인',
] as const

export function getSignupProgressStep(input: SignupProgressInput): number {
  switch (input.type) {
    case 'identity':
      return getIdentityStepIndex(input.step) + 1
    case 'sms':
      return 5
    case 'account':
      return input.step === 'bank' ? 6 : 7
    case 'pin':
      return input.step === 'create' ? 8 : 9
    default:
      return 1
  }
}

export function getSignupProgressLabel(currentStep: number): string {
  const clamped = Math.min(Math.max(currentStep, 1), SIGNUP_PROGRESS_TOTAL)
  return `${clamped} / ${SIGNUP_PROGRESS_TOTAL}`
}

export function getSignupProgressStepName(currentStep: number): string {
  const index = Math.min(Math.max(currentStep, 1), SIGNUP_PROGRESS_TOTAL) - 1
  return SIGNUP_STEP_LABELS[index] ?? ''
}
