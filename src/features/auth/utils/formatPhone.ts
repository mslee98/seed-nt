export function formatPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}

export function extractPhoneDigits(value: string): string {
  return value.replace(/\D/g, '').slice(0, 11)
}

export function maskPhone(phone: string): string {
  const digits = extractPhoneDigits(phone)
  if (digits.length < 7) return phone
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}
