export type CarrierCode = 'SKT' | 'KT' | 'LGU' | 'SKT_MVNO' | 'KT_MVNO' | 'LGU_MVNO'

export const CARRIERS: Array<{ code: CarrierCode; label: string }> = [
  { code: 'SKT', label: 'SKT' },
  { code: 'KT', label: 'KT' },
  { code: 'LGU', label: 'LG U+' },
  { code: 'SKT_MVNO', label: 'SKT 알뜰폰' },
  { code: 'KT_MVNO', label: 'KT 알뜰폰' },
  { code: 'LGU_MVNO', label: 'LG U+ 알뜰폰' },
]

export type SignupIdentityStep = 'name' | 'rrn' | 'carrier' | 'phone'
export type SignupAccountStep = 'bank' | 'accountNumber'
export type SignupPinStep = 'create' | 'confirm'

export const IDENTITY_STEPS: SignupIdentityStep[] = ['name', 'rrn', 'carrier', 'phone']

export const NEXT_IDENTITY_STEP: Partial<Record<SignupIdentityStep, SignupIdentityStep>> = {
  name: 'rrn',
  rrn: 'carrier',
  carrier: 'phone',
}

export const PREV_IDENTITY_STEP: Partial<Record<SignupIdentityStep, SignupIdentityStep>> = {
  rrn: 'name',
  carrier: 'rrn',
  phone: 'carrier',
}

export function getIdentityStepIndex(step: SignupIdentityStep): number {
  return IDENTITY_STEPS.indexOf(step)
}

export function isIdentityStepRevealed(
  activeStep: SignupIdentityStep,
  target: SignupIdentityStep,
): boolean {
  return getIdentityStepIndex(activeStep) >= getIdentityStepIndex(target)
}

export const IDENTITY_STEP_INDEX: Record<SignupIdentityStep, number> = {
  name: 1,
  rrn: 2,
  carrier: 3,
  phone: 4,
}

export const CTA_LABEL_BY_IDENTITY_STEP: Record<SignupIdentityStep, string> = {
  name: '주민등록번호 입력하기',
  rrn: '통신사 선택하기',
  carrier: '휴대폰 번호 입력하기',
  phone: '인증번호 받기',
}

export interface IdentityStepCopy {
  screenTitle: string
  screenSubtitle: string
  fieldLabel: string
  fieldDescription?: string
  placeholder?: string
}

export const IDENTITY_STEP_COPY: Record<SignupIdentityStep, IdentityStepCopy> = {
  name: {
    screenTitle: '이름',
    screenSubtitle: '이름을 써주세요.',
    fieldLabel: '이름',
    fieldDescription: '본인 확인에 사용할 실명을 입력해 주세요.',
    placeholder: '홍길동',
  },
  rrn: {
    screenTitle: '주민등록번호',
    screenSubtitle: '앞 7자리를 입력해 주세요.',
    fieldLabel: '주민등록번호(앞 7자리)',
    fieldDescription: '생년월일과 성별코드를 입력하세요.',
    placeholder: '000000-0',
  },
  carrier: {
    screenTitle: '통신사',
    screenSubtitle: '사용 중인 통신사를 선택해 주세요.',
    fieldLabel: '통신사',
    fieldDescription: '휴대폰 인증에 사용할 통신사예요.',
    placeholder: '통신사 선택',
  },
  phone: {
    screenTitle: '휴대폰 번호',
    screenSubtitle: '인증번호를 받을 번호를 입력해 주세요.',
    fieldLabel: '휴대폰 번호',
    fieldDescription: '본인 명의 번호만 등록할 수 있어요.',
    placeholder: '010-0000-0000',
  },
}
