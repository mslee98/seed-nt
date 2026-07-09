export function maskRrn(rrnFront7: string): string {
  const digits = rrnFront7.replace(/\D/g, '')
  if (digits.length < 7) return rrnFront7
  return `${digits.slice(0, 6)}-${digits[6]}******`
}
