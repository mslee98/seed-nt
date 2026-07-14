import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { TextField, TextFieldInput } from 'seed-design/ui/text-field'

import {
  caretIndexFromDigitCount,
  countDigitsInAmountInput,
} from '../utils/formatAmount'
import { AnimatedAmount } from './AnimatedAmount'

interface AmountHeroFieldProps {
  value: string
  onValueChange: (value: string) => void
  amountKrw: number | null
  startValue?: number
  replayKey?: string | number
  label?: string
  placeholder?: string
  description?: string
  errorMessage?: string
  invalid?: boolean
}

/**
 * hero 타이포 금액 입력.
 * 평소는 input만 보이고 라이브 콤마는 부모 포맷 + 커서 복원.
 * 퀵 금액 칩 replay 중에만 breeze 오버레이를 잠깐 올린다.
 */
export function AmountHeroField({
  value,
  onValueChange,
  amountKrw,
  startValue = 0,
  replayKey,
  label = '금액',
  placeholder = '금액 입력',
  description,
  errorMessage,
  invalid = false,
}: AmountHeroFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const pendingDigitIndexRef = useRef<number | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [showBreeze, setShowBreeze] = useState(false)

  const showBreezeOverlay = showBreeze && amountKrw !== null && !isFocused

  // replayKey만 구독 — onBlur를 deps에 넣으면 칩 이후 포커스가 계속 풀림
  useEffect(() => {
    if (replayKey === undefined || Number(replayKey) <= 0) return

    setShowBreeze(true)
    setIsFocused(false)
    inputRef.current?.blur()
  }, [replayKey])

  useLayoutEffect(() => {
    const digitIndex = pendingDigitIndexRef.current
    const input = inputRef.current
    if (digitIndex === null || !input) return

    pendingDigitIndexRef.current = null
    const caret = caretIndexFromDigitCount(value, digitIndex)
    input.setSelectionRange(caret, caret)
  }, [value])

  const handleValueChange = (nextValue: string) => {
    const input = inputRef.current
    const selectionStart = input?.selectionStart ?? nextValue.length
    pendingDigitIndexRef.current = countDigitsInAmountInput(nextValue, selectionStart)
    onValueChange(nextValue)

    // 포맷 결과가 이전 value와 같으면 useLayoutEffect가 안 돌 수 있어 즉시 복원
    queueMicrotask(() => {
      const digitIndex = pendingDigitIndexRef.current
      const el = inputRef.current
      if (digitIndex === null || !el) return

      pendingDigitIndexRef.current = null
      const caret = caretIndexFromDigitCount(el.value, digitIndex)
      el.setSelectionRange(caret, caret)
    })
  }

  return (
    <TextField
      label={label}
      labelVisuallyHidden
      suffix="원"
      description={description}
      errorMessage={errorMessage}
      invalid={invalid}
      value={value}
      onValueChange={({ value: nextValue }) => handleValueChange(nextValue)}
      className="amount-hero-field tabular-nums"
    >
      <div
        className={
          showBreezeOverlay
            ? 'amount-hero-field__input-host amount-hero-field__input-host--display'
            : 'amount-hero-field__input-host'
        }
      >
        <TextFieldInput
          ref={inputRef}
          placeholder={placeholder}
          inputMode="numeric"
          className="amount-hero amount-hero-input tabular-nums"
          aria-label={label}
          onFocus={() => {
            setIsFocused(true)
            setShowBreeze(false)
          }}
          onBlur={() => setIsFocused(false)}
        />
        {showBreezeOverlay && (
          <button
            type="button"
            className="amount-hero-field__display"
            aria-label="금액 수정"
            onMouseDown={(event) => {
              event.preventDefault()
              inputRef.current?.focus()
            }}
          >
            <AnimatedAmount
              value={amountKrw}
              startValue={startValue}
              replayKey={replayKey}
              useGrouping
              variant="hero"
            />
          </button>
        )}
      </div>
    </TextField>
  )
}
