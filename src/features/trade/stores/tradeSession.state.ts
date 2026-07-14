/**
 * tradeSession 내부 상태 — actions/split/store가 공유.
 * UI는 tradeSession.store 공개 API만 사용.
 */
import { krwToCoin } from '../../../shared/utils/formatAmount'
import type {
  CreateTradeOrderInput,
  SplitGroup,
  TradeAction,
  TradeDetailViewModel,
  TradeRecord,
  TradeRole,
} from '../types'

type Listener = () => void

export const listeners = new Set<Listener>()
export let activeTrade: TradeRecord | null = null
export let activeSplitGroup: SplitGroup | null = null
export const tradesById = new Map<string, TradeRecord>()
export const tradeDetailCache = new Map<string, { version: number; detail: TradeDetailViewModel }>()
export let sessionVersion = 0
export let onMatchedCallback: ((tradeId: string) => void) | null = null
export let onTradeCompletedCallback:
  | ((input: { side: TradeRecord['side']; coinAmount: number }) => void)
  | null = null

export function setOnMatchedCallback(callback: ((tradeId: string) => void) | null) {
  onMatchedCallback = callback
}

export function setOnTradeCompletedCallback(
  callback: ((input: { side: TradeRecord['side']; coinAmount: number }) => void) | null,
) {
  onTradeCompletedCallback = callback
}

let tradeIdSeq = 0

export const MOCK_SELLER_ACCOUNT = {
  bankName: '카카오뱅크',
  accountNumber: '3333012345673',
  accountNumberMasked: '3333-**-******3',
  holderName: '김브릿',
}

export type TradeSessionDevHooks = {
  onPaymentReported?: (
    tradeId: string,
    version: number,
    confirmPayment: (tradeId: string, version: number) => Promise<unknown>,
  ) => void
  clearSimulation?: (tradeId?: string) => void
}

export let devHooks: TradeSessionDevHooks = {}

export function setTradeSessionDevHooks(hooks: TradeSessionDevHooks) {
  devHooks = hooks
}

export function generateTradeId(): string {
  tradeIdSeq += 1
  return `trade-${Date.now()}-${tradeIdSeq}`
}

export function roleFromSide(side: CreateTradeOrderInput['side']): TradeRole {
  return side === 'BUY' ? 'BUYER' : 'SELLER'
}

export function addMinutes(iso: string, minutes: number): string {
  return new Date(new Date(iso).getTime() + minutes * 60_000).toISOString()
}

export function getActionsForTrade(trade: TradeRecord): TradeAction[] {
  if (trade.status === 'MATCHING') {
    return ['CANCEL']
  }
  if (trade.status === 'PAYMENT_PENDING') {
    return trade.role === 'BUYER' ? ['REPORT_PAYMENT', 'CANCEL'] : ['CANCEL']
  }
  if (trade.status === 'PAYMENT_REPORTED') {
    return trade.role === 'SELLER' ? ['CONFIRM_PAYMENT', 'DENY_PAYMENT'] : []
  }
  if (trade.status === 'DISPUTED') {
    return []
  }
  if (trade.status === 'COMPLETED' || trade.status === 'CANCELLED' || trade.status === 'EXPIRED') {
    return []
  }
  return ['CONTINUE']
}

export function buildTradeDetailViewModel(trade: TradeRecord): TradeDetailViewModel {
  return {
    ...trade,
    actions: getActionsForTrade(trade),
    counterpartyNickname: trade.role === 'BUYER' ? '판매자' : '구매자',
    sellerAccount:
      trade.role === 'BUYER' && trade.status !== 'MATCHING' ? MOCK_SELLER_ACCOUNT : undefined,
  }
}

export function invalidateTradeDetailCache(tradeId?: string) {
  if (tradeId) {
    tradeDetailCache.delete(tradeId)
    return
  }
  tradeDetailCache.clear()
}

export function setTradeRecord(trade: TradeRecord) {
  tradesById.set(trade.id, trade)
  invalidateTradeDetailCache(trade.id)
  if (activeTrade?.id === trade.id || !activeTrade) {
    activeTrade = trade
  }
}

export function setActiveTrade(trade: TradeRecord | null) {
  activeTrade = trade
}

export function setActiveSplitGroup(group: SplitGroup | null) {
  activeSplitGroup = group
}

export function notify() {
  sessionVersion += 1
  listeners.forEach((listener) => listener())
}

export function createTradeRecord(input: {
  id: string
  side: CreateTradeOrderInput['side']
  amountKrw: number
  now: string
  splitGroupId?: string
  splitLegIndex?: number
  splitTotalLegs?: number
}): TradeRecord {
  return {
    id: input.id,
    side: input.side,
    role: roleFromSide(input.side),
    status: 'MATCHING',
    amountKrw: input.amountKrw,
    coinAmount: krwToCoin(input.amountKrw),
    version: 1,
    matchingStartedAt: input.now,
    updatedAt: input.now,
    splitGroupId: input.splitGroupId,
    splitLegIndex: input.splitLegIndex,
    splitTotalLegs: input.splitTotalLegs,
  }
}

export function emitTradeCompleted(input: {
  side: TradeRecord['side']
  coinAmount: number
}) {
  onTradeCompletedCallback?.(input)
}

export function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

export function isTerminalStatus(status: TradeRecord['status']): boolean {
  return status === 'COMPLETED' || status === 'CANCELLED' || status === 'EXPIRED'
}

export function getTradeOrThrow(tradeId: string): TradeRecord {
  const trade = tradesById.get(tradeId) ?? (activeTrade?.id === tradeId ? activeTrade : null)
  if (!trade) {
    throw new Error('TRADE_NOT_FOUND')
  }
  activeTrade = trade
  return trade
}

export function assertTrade(
  tradeId: string,
  version: number,
  expectedStatus: TradeRecord['status'],
) {
  const trade = getTradeOrThrow(tradeId)
  if (trade.version !== version) {
    throw new Error('TRADE_STATE_CONFLICT')
  }
  if (trade.status === expectedStatus) {
    return
  }
  if (expectedStatus === 'PAYMENT_PENDING' && trade.status === 'PAYMENT_REPORTED') {
    return
  }
  if (expectedStatus === 'PAYMENT_REPORTED' && trade.status === 'COMPLETED') {
    return
  }
  throw new Error('TRADE_STATE_CONFLICT')
}
