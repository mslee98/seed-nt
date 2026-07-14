export type PushEligibility =
  | 'unsupported'
  | 'default'
  | 'denied'
  | 'ready'

export const PUSH_SUBSCRIPTION_STORAGE_KEY = 'nt-push-subscription-ready'

export const WHILE_YOU_WAIT_COPY = {
  title: '매칭되면 알림을 보내드릴게요',
  description:
    '그동안 Brit 스토어나 커뮤니티를 구경해보시는 건 어때요?',
} as const

export const PUSH_ENABLE_COPY = {
  title: '더 좋은 상대가 나타나면 알려드릴게요',
  description: '알림을 켜두면 바로 확인할 수 있어요.',
  cta: '알림 설정',
  denied: '알림이 꺼져 있어요. 기기 설정에서 Brit 알림을 켜주세요.',
} as const
