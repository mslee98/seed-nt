/**
 * UI draft용 숫자 휴대폰 ↔ E.164 표시 헬퍼.
 * Auth/DB 저장용 정규화의 source of truth는 signup Edge Function.
 */
export function digitsOnlyPhone(phone: string): string {
  return phone.replace(/\D/g, '')
}

/** 한국 휴대폰 010… → +82… (클라이언트 로그인 호출용) */
export function toKoreaE164(phone: string): string {
  const digits = digitsOnlyPhone(phone)
  if (digits.startsWith('82')) return `+${digits}`
  if (digits.startsWith('0')) return `+82${digits.slice(1)}`
  return `+82${digits}`
}
