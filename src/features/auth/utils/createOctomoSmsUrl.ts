/** OCTOMO 문자 인증 PoC 상수. API 연동 시 응답값으로 교체한다. */
export const OCTOMO_SMS_PHONE = '16663538'
export const OCTOMO_SMS_DISPLAY_PHONE = '1666-3538'
export const OCTOMO_SMS_MESSAGE = 'BRIT-205364'

/** iOS·Android 공통 1차 성공안 (방식 A) */
export function createOctomoSmsHref(
  phone: string = OCTOMO_SMS_PHONE,
  message: string = OCTOMO_SMS_MESSAGE,
): string {
  return `sms:${phone}?body=${encodeURIComponent(message)}`
}
