import { useMemo, useState } from 'react'

import { COIN_TO_KRW } from '../../../shared/constants/money'
import { useAmountReplay } from '../../../shared/hooks/useAmountReplay'
import {
  formatAmount,
  formatAmountInputDisplay,
  formatAmountNumber,
  formatCoinUnit,
  isManwonUnitAmount,
  krwToCoin,
  parseAmountInput,
} from '../../../shared/utils/formatAmount'
import { SPLIT_POLICY } from '../../home/utils/splitRecommendation'
import { TRADE_LIMITS } from '../constants/tradeCompose'
import type { SplitMode, TradeSide } from '../types'
import { buildSplitPlanWithUnit } from '../utils/splitPlan'

export type SellMethod = 'once' | 'split'

interface UseTradeInputStateOptions {
  coinBalance: number
  /** Activity params에서 온 초기 side */
  initialSide?: TradeSide
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

function getMinUnitError(
  minUnitKrw: number | null,
  amountKrw: number | null,
): string | null {
  if (minUnitKrw === null) return null

  if (!isManwonUnitAmount(minUnitKrw)) {
    return '10,000원 단위로 입력해 주세요'
  }

  if (minUnitKrw < SPLIT_POLICY.minSplitUnit) {
    return `${formatAmountNumber(SPLIT_POLICY.minSplitUnit)}원 이상부터 나눌 수 있어요`
  }

  if (amountKrw !== null && minUnitKrw > amountKrw) {
    return '총 판매 금액보다 클 수 없어요'
  }

  if (amountKrw !== null && !buildSplitPlanWithUnit(amountKrw, minUnitKrw)) {
    return '이 금액으로는 나눠 판매하기 어려워요'
  }

  return null
}

/**
 * 거래 금액 입력 상태.
 * SELL은 한번에/나누어 방식 + 나누어일 때 최소 단위 금액을 다룹니다.
 */
export function useTradeInputState({
  coinBalance,
  initialSide = 'BUY',
}: UseTradeInputStateOptions) {
  const [side, setSide] = useState<TradeSide>(initialSide)
  const [amountKrw, setAmountKrw] = useState<number | null>(null)
  const [amountInput, setAmountInput] = useState('')
  const [amountStartKrw, setAmountStartKrw] = useState(0)
  const [sellMethod, setSellMethod] = useState<SellMethod>('once')
  const [minUnitKrw, setMinUnitKrw] = useState<number | null>(null)
  const [minUnitInput, setMinUnitInput] = useState('')
  const { replayKey: amountReplayKey, triggerReplay: triggerAmountReplay } = useAmountReplay()

  const availableKrw = coinBalance * COIN_TO_KRW

  const amountError = useMemo(
    () => getAmountError(amountKrw, side, coinBalance),
    [amountKrw, side, coinBalance],
  )

  const minUnitError = useMemo(() => {
    if (side !== 'SELL' || sellMethod !== 'split') return null
    return getMinUnitError(minUnitKrw, amountKrw)
  }, [side, sellMethod, minUnitKrw, amountKrw])

  const helperText = useMemo(() => {
    if (amountError) return undefined

    if (side === 'SELL') {
      return `사용가능 금액 ${formatAmount(availableKrw)}`
    }

    if (!amountKrw) {
      return '10,000원 단위로 입력하면 예상 코인을 보여드릴게요'
    }

    return `예상 코인 ${formatCoinUnit(krwToCoin(amountKrw))}`
  }, [amountKrw, amountError, side, availableKrw])

  const splitMode: SplitMode =
    side === 'SELL' && sellMethod === 'split' ? 'CUSTOM' : 'NONE'

  const isSubmitDisabled =
    !amountKrw ||
    !!amountError ||
    (splitMode === 'CUSTOM' && (!minUnitKrw || !!minUnitError))

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

  const handleSellMethodChange = (value: string) => {
    const next = value === 'split' ? 'split' : 'once'
    setSellMethod(next)
    if (next === 'split' && minUnitKrw === null) {
      const preset = SPLIT_POLICY.recommendedUnit
      setMinUnitKrw(preset)
      setMinUnitInput(formatAmountNumber(preset))
    }
  }

  const handleMinUnitInputChange = (value: string) => {
    const digitsOnly = parseAmountInput(value)
    setMinUnitInput(formatAmountInputDisplay(digitsOnly))

    if (!digitsOnly) {
      setMinUnitKrw(null)
      return
    }

    setMinUnitKrw(Number(digitsOnly))
  }

  const handleSideChange = (next: TradeSide) => {
    setSide(next)
    if (next === 'BUY') {
      setSellMethod('once')
    }
  }

  return {
    side,
    setSide: handleSideChange,
    amountKrw,
    amountInput,
    amountStartKrw,
    amountReplayKey,
    sellMethod,
    minUnitKrw,
    minUnitInput,
    minUnitError,
    splitMode,
    unitAmountKrw: splitMode === 'CUSTOM' ? minUnitKrw ?? undefined : undefined,
    amountError,
    helperText,
    isSubmitDisabled,
    handleAmountInputChange,
    handleQuickAmountSelect,
    handleSellMethodChange,
    handleMinUnitInputChange,
  }
}
