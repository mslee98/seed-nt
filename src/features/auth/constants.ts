export const SIGNUP_IDENTITY_FORM_ID = 'signup-identity-form'

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
export type SignupAuthStep = 'password' | 'nickname' | 'passkey'
export type AccountRecoveryStep = 'phone' | 'verify' | 'password' | 'done'
export type LoginMode = 'passkey' | 'password'

export const NICKNAME_MIN_LENGTH = 2
export const NICKNAME_MAX_LENGTH = 12
/** 한글·영문·숫자·밑줄 */
export const NICKNAME_PATTERN = /^[가-힣a-zA-Z0-9_]{2,12}$/

export const LOGIN_PASSWORD_MIN_LENGTH = 8

export const SIGNUP_AUTH_COPY = {
  password: {
    title: '로그인 비밀번호를 만들어 주세요',
    description: '패스키를 사용할 수 없는 환경에서 휴대폰 번호와 함께 사용해요.',
  },
  nickname: {
    title: '거래할 때 보일 이름을 정해 주세요',
    description: '실명 대신 상대에게 보여 주는 이름이에요. 나중에 바꿀 수 있어요.',
  },
  passkey: {
    title: '다음부터 더 간편하게 로그인해 보세요',
    description:
      '패스키를 등록하면 비밀번호 없이 얼굴, 지문 또는 기기 잠금으로 로그인할 수 있어요.',
  },
} as const

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
  phone: '기기인증하기',
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
    placeholder: '000000',
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
    screenSubtitle: '본인 명의 휴대폰 번호를 입력해 주세요.',
    fieldLabel: '휴대폰 번호',
    fieldDescription: '기기인증에 사용할 번호예요.',
    placeholder: '010-0000-0000',
  },
}
