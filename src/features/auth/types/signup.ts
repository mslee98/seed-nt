export interface CompleteSignupPayload {
  name: string
  rrnFront7: string
  mobileCarrier: string
  phone: string
  bankCode: string
  accountNumber: string
  accountHolderName: string
  transactionPin: string
  loginPassword: string
  nickname: string
}

export interface CompleteSignupResult {
  success: true
  userId: string
  nickname: string
  phoneE164: string
}

export interface PasskeyListItem {
  id: string
  friendlyName: string
  createdAt: string
  lastUsedAt?: string
}

export interface SessionListItem {
  id: string
  createdAt: string
  userAgent?: string
  isCurrent: boolean
}

export interface RecoverAccountPayload {
  phone: string
  octomoVerified: boolean
  accountNumberLast4: string
  name: string
  birthDate: string
  newLoginPassword: string
}

export interface RecoverAccountResult {
  success: true
  sensitiveActionsLockedUntil: string
}
