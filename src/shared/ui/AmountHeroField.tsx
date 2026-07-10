import { useEffect, useRef, useState } from 'react'
import { TextField, TextFieldInput } from 'seed-design/ui/text-field'

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
  onBlur?: () => void
}

/**
 * hero 타이포 TextField + blur 표시 레이어.
 * 입력(focus)은 breeze .counter 와 동일 hero 타이포, 칩 replay 직후에만 breeze AnimateNumber.
 * suffix "원"은 TextField만 사용합니다.
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
  onBlur,
}: AmountHeroFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [showBreeze, setShowBreeze] = useState(false)

  const showDisplayLayer = amountKrw !== null && !isFocused

  useEffect(() => {
    if (replayKey !== undefined && Number(replayKey) > 0) {
      setShowBreeze(true)
      inputRef.current?.blur()
      setIsFocused(false)
      onBlur?.()
    }
  }, [replayKey, onBlur])

  const handleFocus = () => {
    setIsFocused(true)
    setShowBreeze(false)
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
      onValueChange={({ value: nextValue }) => onValueChange(nextValue)}
      className="amount-hero-field tabular-nums"
    >
      <div
        className={
          showDisplayLayer
            ? 'amount-hero-field__input-host amount-hero-field__input-host--display'
            : 'amount-hero-field__input-host'
        }
      >
        <TextFieldInput
          ref={inputRef}
          placeholder={placeholder}
          inputMode="numeric"
          pattern="[0-9]*"
          className="amount-hero amount-hero-input tabular-nums"
          aria-label={label}
          onFocus={handleFocus}
          onBlur={() => {
            setIsFocused(false)
            onBlur?.()
          }}
        />
        {showDisplayLayer && (
          <button
            type="button"
            className="amount-hero-field__display"
            aria-label="금액 수정"
            onMouseDown={(event) => {
              event.preventDefault()
              inputRef.current?.focus()
            }}
          >
            {showBreeze ? (
              <AnimatedAmount
                value={amountKrw}
                startValue={startValue}
                replayKey={replayKey}
                useGrouping
                variant="hero"
              />
            ) : (
              <span className="amount-hero">{value}</span>
            )}
          </button>
        )}
      </div>
    </TextField>
  )
}
