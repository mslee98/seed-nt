import type { TradeSide } from '../../trade/types'

export interface HomeWallet {
  /** 총 보유 = availableCoin + escrowCoin */
  coinBalance: number
  estimatedKrwValue: number
  availableCoin: number
  escrowCoin: number
}

export interface PendingBalanceReplay {
  from: number
  to: number
}

/** 홈 시안 목업: 사용 가능 520,000 + 보류 30,000 = 총 550,000 */
const INITIAL_AVAILABLE = 520_000
const INITIAL_ESCROW = 30_000

const INITIAL_WALLET: HomeWallet = {
  coinBalance: INITIAL_AVAILABLE + INITIAL_ESCROW,
  estimatedKrwValue: INITIAL_AVAILABLE + INITIAL_ESCROW,
  availableCoin: INITIAL_AVAILABLE,
  escrowCoin: INITIAL_ESCROW,
}

type Listener = () => void

let wallet: HomeWallet = { ...INITIAL_WALLET }
let pendingBalanceReplay: PendingBalanceReplay | null = null
const listeners = new Set<Listener>()

function notify() {
  listeners.forEach((listener) => listener())
}

function syncTotals() {
  const coinBalance = wallet.availableCoin + wallet.escrowCoin
  wallet = {
    ...wallet,
    coinBalance,
    estimatedKrwValue: coinBalance,
  }
}

export function getHomeWallet(): HomeWallet {
  return wallet
}

export function subscribeHomeWallet(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** Home 재진입 시 breeze replay용. consume 후 null이 됩니다. */
export function consumePendingBalanceReplay(): PendingBalanceReplay | null {
  const pending = pendingBalanceReplay
  pendingBalanceReplay = null
  return pending
}

export function applyCompletedTrade(input: { side: TradeSide; coinAmount: number }) {
  const from = wallet.availableCoin
  const delta = input.side === 'BUY' ? input.coinAmount : -input.coinAmount
  const to = Math.max(0, from + delta)
  wallet = {
    ...wallet,
    availableCoin: to,
  }
  if (from !== to) {
    pendingBalanceReplay = { from, to }
  }
  syncTotals()
  notify()
}

/** 판매 등록 시 available → escrow 이동 (mock) */
export function lockEscrowCoin(coinAmount: number) {
  const lock = Math.min(wallet.availableCoin, Math.max(0, coinAmount))
  if (lock === 0) return
  wallet = {
    ...wallet,
    availableCoin: wallet.availableCoin - lock,
    escrowCoin: wallet.escrowCoin + lock,
  }
  syncTotals()
  notify()
}

/** 취소·만료 시 escrow → available 복원 (mock) */
export function releaseEscrowCoin(coinAmount: number) {
  const release = Math.min(wallet.escrowCoin, Math.max(0, coinAmount))
  if (release === 0) return
  wallet = {
    ...wallet,
    availableCoin: wallet.availableCoin + release,
    escrowCoin: wallet.escrowCoin - release,
  }
  syncTotals()
  notify()
}

export function resetHomeWallet() {
  wallet = { ...INITIAL_WALLET }
  pendingBalanceReplay = null
  notify()
}
