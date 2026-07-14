import { useEffect, useMemo, useState } from 'react'

import { useAmountReplay } from '../../../shared/hooks/useAmountReplay'
import { TRADE_LIMITS } from '../constants'
import {
  formatAmountInputDisplay,
  formatAmountNumber,
  formatCoinUnit,
  isManwonUnitAmount,
  krwToCoin,
  parseAmountInput,
} from '../../../shared/utils/formatAmount'
import { getSplitRecommendation } from '../utils/splitRecommendation'
import type { SplitMode, TradeSide } from '../../trade/types'

interface UseTradeInputStateOptions {
  coinBalance: number
}

function getAmountError(
  amountKrw: number | null,
  side: TradeSide,
  coinBalance: number,
): string | null {
  if (amountKrw === null) return null

  if (!isManwonUnitAmount(amountKrw)) {
    return '10,000원 단위로 입력해 주세요'
  }

  if (amountKrw < TRADE_LIMITS.minAmount) {
    return `${formatAmountNumber(TRADE_LIMITS.minAmount)}원 이상부터 거래할 수 있어요`
  }

  if (amountKrw > TRADE_LIMITS.maxAmount) {
    return '한 번에 거래할 수 있는 금액을 넘었어요.'
  }

  if (side === 'SELL' && krwToCoin(amountKrw) > coinBalance) {
    return '보유한 코인보다 많이 판매할 수 없어요'
  }

  return null
}

/**
 * 홈 거래 입력 상태.
 * 라이브 천 단위 콤마 + 검증 실패 시 경고·CTA 비활성만 (값은 자르지 않음).
 * SELL + 100만 원 이상일 때만 `splitSellEnabled` 토글을 노출합니다 (기본 켜짐).
 */
export function useTradeInputState({ coinBalance }: UseTradeInputStateOptions) {
  const [side, setSide] = useState<TradeSide>('BUY')
  const [amountKrw, setAmountKrw] = useState<number | null>(null)
  const [amountInput, setAmountInput] = useState('')
  const [amountStartKrw, setAmountStartKrw] = useState(0)
  const [splitSellEnabled, setSplitSellEnabled] = useState(true)
  const { replayKey: amountReplayKey, triggerReplay: triggerAmountReplay } = useAmountReplay()

  const splitRecommendation = useMemo(
    () => (amountKrw ? getSplitRecommendation(amountKrw) : null),
    [amountKrw],
  )

  const showSplitSellToggle = side === 'SELL' && splitRecommendation !== null

  const splitMode: SplitMode = useMemo(() => {
    if (!showSplitSellToggle) return 'NONE'
    return splitSellEnabled ? 'AUTO' : 'NONE'
  }, [showSplitSellToggle, splitSellEnabled])

  useEffect(() => {
    if (!showSplitSellToggle) {
      setSplitSellEnabled(true)
    }
  }, [showSplitSellToggle])

  const amountError = useMemo(
    () => getAmountError(amountKrw, side, coinBalance),
    [amountKrw, side, coinBalance],
  )

  const helperText = useMemo(() => {
    if (amountError) return undefined

    if (!amountKrw) {
      return side === 'BUY'
        ? '10,000원 단위로 입력하면 예상 코인을 보여드릴게요'
        : '10,000원 단위로 입력하면 판매할 코인을 보여드릴게요'
    }

    const coinAmount = krwToCoin(amountKrw)
    if (side === 'BUY') {
      return `예상 코인 ${formatCoinUnit(coinAmount)}`
    }
    return `판매할 코인 ${formatCoinUnit(coinAmount)}`
  }, [amountKrw, amountError, side])

  const isSubmitDisabled = !amountKrw || !!amountError

  const handleAmountInputChange = (value: string) => {
    const digitsOnly = parseAmountInput(value)
    setAmountInput(formatAmountInputDisplay(digitsOnly))

    if (!digitsOnly) {
      setAmountKrw(null)
      return
    }

    setAmountKrw(Number(digitsOnly))
  }

  const handleQuickAmountSelect = (amount: number) => {
    const current = amountKrw ?? 0
    const next = current + amount
    setAmountStartKrw(current)
    setAmountKrw(next)
    setAmountInput(formatAmountNumber(next))
    triggerAmountReplay()
  }

  return {
    side,
    setSide,
    amountKrw,
    amountInput,
    amountStartKrw,
    amountReplayKey,
    splitMode,
    splitSellEnabled,
    setSplitSellEnabled,
    showSplitSellToggle,
    splitRecommendation,
    amountError,
    helperText,
    isSubmitDisabled,
    handleAmountInputChange,
    handleQuickAmountSelect,
  }
}
