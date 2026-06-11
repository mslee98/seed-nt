import type { TradeStatus } from '../types'

interface TradeStatusCopy {
  badge: string
  title: string
  description: string
}

export const TRADE_STATUS_COPY: Partial<Record<TradeStatus, TradeStatusCopy>> = {
  PAYMENT_PENDING: {
    badge: '진행 중',
    title: '입금 확인을 기다리고 있어요',
    description: '판매자가 입금을 확인하면 코인이 들어와요.',
  },
  PAYMENT_REPORTED: {
    badge: '진행 중',
    title: '입금 확인을 기다리고 있어요',
    description: '판매자가 입금을 확인하면 코인이 들어와요.',
  },
  MATCHING: {
    badge: '진행 중',
    title: '구매자를 찾고 있어요',
    description: '비슷한 금액의 거래가 들어오면 알려드릴게요.',
  },
}

export function getTradeStatusCopy(status: TradeStatus): TradeStatusCopy {
  return (
    TRADE_STATUS_COPY[status] ?? {
      badge: '진행 중',
      title: '거래가 진행 중이에요',
      description: '거래를 이어서 완료해 주세요.',
    }
  )
}
