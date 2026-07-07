export type AuthRequiredReason = 'trade' | 'transactions' | 'profile' | 'default'

export const AUTH_REQUIRED_COPY: Record<
  AuthRequiredReason,
  { title: string; description: string }
> = {
  trade: {
    title: '가입 후 거래할 수 있어요',
    description: '거래를 시작하려면 본인 확인이 필요해요.',
  },
  transactions: {
    title: '가입 후 이용할 수 있어요',
    description: '거래내역을 보려면 본인 확인이 필요해요.',
  },
  profile: {
    title: '가입 후 이용할 수 있어요',
    description: 'MY를 이용하려면 본인 확인이 필요해요.',
  },
  default: {
    title: '가입 후 이용할 수 있어요',
    description: '본인 확인이 필요해요.',
  },
}
