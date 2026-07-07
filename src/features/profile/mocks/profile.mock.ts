import type { ProfileViewModel } from '../types'

export const GUEST_PROFILE: ProfileViewModel = {
  nickname: 'Brit유저',
  isVerified: false,
  bankName: '',
  accountNumberMasked: '',
  coinBalance: 0,
  estimatedKrwValue: 0,
}

export function createAuthenticatedProfile(
  nickname: string,
  bankName: string,
  accountNumber: string,
): ProfileViewModel {
  const masked =
    accountNumber.length >= 4
      ? `${accountNumber.slice(0, 4)}****${accountNumber.slice(-2)}`
      : accountNumber

  return {
    nickname,
    isVerified: true,
    bankName,
    accountNumberMasked: masked,
    coinBalance: 2_000_000,
    estimatedKrwValue: 2_000_000,
  }
}