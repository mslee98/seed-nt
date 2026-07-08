export function formatRrnInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 7)
  if (digits.length === 0) return ''
  if (digits.length <= 6) {
    return digits.length === 6 ? `${digits}-` : digits
  }
  return `${digits.slice(0, 6)}-${digits.slice(6)}`
}

export function extractRrnDigits(value: string): string {
  return value.replace(/\D/g, '').slice(0, 7)
}
