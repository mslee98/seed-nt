import type { TransactionItem } from '../types'

export const MOCK_TRANSACTIONS: TransactionItem[] = [
  {
    id: 'trade-1',
    type: 'BUY',
    status: 'COMPLETED',
    amountKrw: 50_000,
    coinAmount: 50_000,
    completedAt: '2026-07-05T14:30:00.000Z',
  },
  {
    id: 'trade-2',
    type: 'SELL',
    status: 'COMPLETED',
    amountKrw: 120_000,
    coinAmount: 120_000,
    completedAt: '2026-07-03T09:15:00.000Z',
  },
  {
    id: 'trade-3',
    type: 'BUY',
    status: 'CANCELLED',
    amountKrw: 30_000,
    coinAmount: 30_000,
    completedAt: '2026-06-28T18:00:00.000Z',
  },
  {
    id: 'trade-active-1',
    type: 'BUY',
    status: 'PAYMENT_REPORTED',
    amountKrw: 100_000,
    coinAmount: 100_000,
    completedAt: '2026-07-06T11:20:00.000Z',
  },
]

export function getMockTransactionById(id: string): TransactionItem | undefined {
  return MOCK_TRANSACTIONS.find((item) => item.id === id)
}