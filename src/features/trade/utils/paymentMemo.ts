/** 입금 메모 — trade-payment-ux.md §3 */
export function formatPaymentMemo(tradeId: string, legIndex?: number): string {
  const shortId = tradeId.length > 8 ? tradeId.slice(-6) : tradeId
  if (legIndex !== undefined) {
    return `BRIT-${shortId}-${legIndex}`
  }
  return `BRIT-${shortId}`
}
