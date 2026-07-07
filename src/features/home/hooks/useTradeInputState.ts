import { useMemo, useState } from 'react'

import { TRADE_LIMITS } from '../constants'
import { krwToCoin } from '../utils/formatAmount'
import { getSplitRecommendation } from '../utils/splitRecommendation'
import type { SplitMode, TradeSide } from '../types'

interface UseTradeInputStateOptions {
  coinBalance: number
}

export function useTradeInputState({ coinBalance }: UseTradeInputStateOptions) {
  const [side, setSide] = useState<TradeSide>('BUY')
  const [amountKrw, setAmountKrw] = useState<number | null>(null)
  const [amountInput, setAmountInput] = useState('')

  const splitMode: SplitMode = useMemo(() => {
    if (!amountKrw) return 'NONE'
    return getSplitRecommendation(amountKrw) ? 'AUTO' : 'NONE'
  }, [amountKrw])

  const amountError = useMemo(() => {
    if (amountKrw === null) return null

    if (amountKrw < TRADE_LIMITS.minAmount) {
      return `${TRADE_LIMITS.minAmount.toLocaleString('ko-KR')}원 이상부터 거래할 수 있어요`
    }

    if (amountKrw > TRADE_LIMITS.maxAmount) {
      return '한 번에 거래할 수 있는 금액을 넘었어요.'
    }

    if (side === 'SELL' && krwToCoin(amountKrw) > coinBalance) {
      return '보유한 코인보다 많이 판매할 수 없어요'
    }

    return null
  }, [amountKrw, side, coinBalance])

  const helperText = useMemo(() => {
    if (amountError) return undefined

    if (!amountKrw) {
      return side === 'BUY'
        ? '금액을 입력하면 예상 코인을 보여드릴게요'
        : '금액을 입력하면 판매할 코인을 보여드릴게요'
    }

    const coinAmount = krwToCoin(amountKrw)
    if (side === 'BUY') {
      return `예상 코인 ${coinAmount} MS`
    }
    return `판매할 코인 ${coinAmount} MS`
  }, [amountKrw, amountError, side])

  const isSubmitDisabled = !amountKrw || !!amountError

  const handleAmountInputChange = (value: string) => {
    const digitsOnly = value.replace(/[^\d]/g, '')
    setAmountInput(digitsOnly)

    if (!digitsOnly) {
      setAmountKrw(null)
      return
    }

    setAmountKrw(Number(digitsOnly))
  }

  const handleQuickAmountSelect = (amount: number) => {
    setAmountKrw(amount)
    setAmountInput(String(amount))
  }

  return {
    side,
    setSide,
    amountKrw,
    amountInput,
    splitMode,
    amountError,
    helperText,
    isSubmitDisabled,
    handleAmountInputChange,
    handleQuickAmountSelect,
  }
}
