import type { TradeRecord } from '../types'

/** 입금·확인 시트를 열 가치가 있는 상태인지 (구매자 입금·판매자 확인·분쟁) */
export function shouldOpenPaymentSheet(
  trade: Pick<TradeRecord, 'status' | 'role'>,
): boolean {
  if (trade.status === 'PAYMENT_PENDING') return trade.role === 'BUYER'
  if (trade.status === 'PAYMENT_REPORTED') return trade.role === 'SELLER'
  if (trade.status === 'DISPUTED') return true
  return false
}

export function getPaymentSheetAutoOpenKey(trade: Pick<TradeRecord, 'id' | 'status' | 'role'>): string {
  return `${trade.id}:${trade.status}:${trade.role}`
}
