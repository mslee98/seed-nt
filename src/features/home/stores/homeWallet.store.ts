import type { TradeSide } from '../types'

export interface HomeWallet {
  coinBalance: number
  estimatedKrwValue: number
}

const INITIAL_WALLET: HomeWallet = {
  coinBalance: 2_000_000,
  estimatedKrwValue: 2_000_000,
}

type Listener = () => void

let wallet: HomeWallet = { ...INITIAL_WALLET }
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

export function applyCompletedTrade(input: { side: TradeSide; coinAmount: number }) {
  const delta = input.side === 'BUY' ? input.coinAmount : -input.coinAmount
  wallet = {
    ...wallet,
    coinBalance: Math.max(0, wallet.coinBalance + delta),
  }
  syncKrwValue()
  notify()
}

export function resetHomeWallet() {
  wallet = { ...INITIAL_WALLET }
  notify()
}
