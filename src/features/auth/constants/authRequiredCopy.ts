export type AuthRequiredReason = 'trade' | 'transactions' | 'profile' | 'default'

export const AUTH_REQUIRED_COPY: Record<
  AuthRequiredReason,
  { title: string; description: string }
> = {
  trade: {
    title: '로그인 후 거래할 수 있어요',
    description: '거래를 시작하려면 로그인이 필요해요.',
  },
  transactions: {
    title: '로그인 후 이용할 수 있어요',
    description: '거래내역을 보려면 로그인이 필요해요.',
  },
  profile: {
    title: '로그인 후 이용할 수 있어요',
    description: 'MY를 이용하려면 로그인이 필요해요.',
  },
  default: {
    title: '로그인 후 이용할 수 있어요',
    description: '이 기능을 쓰려면 로그인이 필요해요.',
  },
}
