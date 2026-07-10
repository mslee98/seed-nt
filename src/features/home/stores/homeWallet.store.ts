import type { TradeSide } from '../types'

export interface HomeWallet {
  coinBalance: number
  estimatedKrwValue: number
}

export interface PendingBalanceReplay {
  from: number
  to: number
}

const INITIAL_WALLET: HomeWallet = {
  coinBalance: 2_000_000,
  estimatedKrwValue: 2_000_000,
}

type Listener = () => void

let wallet: HomeWallet = { ...INITIAL_WALLET }
let pendingBalanceReplay: PendingBalanceReplay | null = null
const listeners = new Set<Listener>()

function notify() {
  listeners.forEach((listener) => listener())
}

function syncKrwValue() {
  wallet = { ...wallet, estimatedKrwValue: wallet.coinBalance }
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
  const from = wallet.coinBalance
  const delta = input.side === 'BUY' ? input.coinAmount : -input.coinAmount
  const to = Math.max(0, from + delta)
  wallet = {
    ...wallet,
    coinBalance: to,
  }
  if (from !== to) {
    pendingBalanceReplay = { from, to }
  }
  syncKrwValue()
  notify()
}

export function resetHomeWallet() {
  wallet = { ...INITIAL_WALLET }
  pendingBalanceReplay = null
  notify()
}
