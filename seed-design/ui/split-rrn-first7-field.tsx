/**
 * @file ui:split-rrn-first7-field
 * 주민등록번호 앞 7자리(생년월일 6 + 성별 1) — 닷 슬롯 마스크 UI
 *
 * 실제 입력값은 7자리만 받고, 화면은 6 + 1 + 고정마스크 6 구조로 보여 준다.
 */

import * as React from 'react'
import {
  Box,
  Field as SeedField,
  HStack,
  Text,
  VisuallyHidden,
} from '@seed-design/react'
import type { FieldLabelVariantProps } from '@seed-design/css/recipes/field-label'

function extractDigits(value: string, maxLength: number): string {
  return value.replace(/\D/g, '').slice(0, maxLength)
}

const RRN_TAIL_SLOT_COUNT = 6
const DOT_SIZE = '16px'
const DOT_GAP = '8px'

type DotTone = 'empty' | 'filled' | 'masked'

function DotSlot({ tone }: { tone: DotTone }) {
  // empty: 입력 가능 슬롯 / filled: 입력된 자리 / masked: 뒤 6자리 고정
  const bg =
    tone === 'masked' ? 'fg.neutral' : tone === 'filled' ? 'fg.neutralSubtle' : 'fg.disabled'

  return (
    <Box
      width={DOT_SIZE}
      height={DOT_SIZE}
      borderRadius="full"
      bg={bg}
      flexShrink={0}
      aria-hidden
    />
  )
}

const hiddenInputStyle: React.CSSProperties = {
  position: 'absolute',
  opacity: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
}

function getUnderlineColor(invalid: boolean, focused: boolean): string {
  if (invalid) return 'var(--seed-color-stroke-critical-solid)'
  if (focused) return 'var(--seed-color-fg-brand)'
  return 'var(--seed-color-stroke-neutral-weak)'
}

export interface SplitRrnFirst7FieldProps {
  value: string
  onValueChange?: (value: string) => void
  label?: React.ReactNode
  labelWeight?: FieldLabelVariantProps['weight']
  description?: React.ReactNode
  readOnly?: boolean
  disabled?: boolean
  invalid?: boolean
  /** @deprecated 닷 슬롯 UI에서는 숫자가 보이지 않음 — API 호환용 */
  maskGender?: boolean
  birthPlaceholder?: string
  genderPlaceholder?: string
  firstInputRef?: React.Ref<HTMLInputElement>
  secondInputRef?: React.Ref<HTMLInputElement>
  fieldRef?: React.Ref<HTMLDivElement>
  /** 성별코드(7번째)까지 입력 완료 시 (Enter / Tab / 자동) */
  onGenderComplete?: () => void
}

export const SplitRrnFirst7Field = React.forwardRef<HTMLInputElement, SplitRrnFirst7FieldProps>(
  (
    {
      value,
      onValueChange,
      label,
      labelWeight,
      description,
      readOnly = false,
      disabled = false,
      invalid = false,
      firstInputRef,
      secondInputRef,
      fieldRef,
      onGenderComplete,
    },
    ref,
  ) => {
    const internalSecondRef = React.useRef<HTMLInputElement>(null)
    const valueRef = React.useRef(value)
    const prevBirthLengthRef = React.useRef(0)
    const [focusedPart, setFocusedPart] = React.useState<'birth' | 'gender' | null>(null)

    valueRef.current = value

    const digits = extractDigits(value, 7)
    const birth6 = digits.slice(0, 6)
    const gender1 = digits.slice(6, 7)
    const focused = focusedPart !== null && !readOnly && !disabled

    const tryCompleteGender = React.useCallback(
      (birth: string, gender: string) => {
        if (extractDigits(birth, 6).length !== 6 || extractDigits(gender, 1).length !== 1) return
        requestAnimationFrame(() => onGenderComplete?.())
      },
      [onGenderComplete],
    )

    const commitDigits = React.useCallback(
      (next: string) => {
        const sanitized = extractDigits(next, 7)
        onValueChange?.(sanitized)
        if (sanitized.length === 7) {
          tryCompleteGender(sanitized.slice(0, 6), sanitized.slice(6, 7))
        }
      },
      [onValueChange, tryCompleteGender],
    )

    const handleBirthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (readOnly || disabled) return
      const sanitized = extractDigits(event.target.value, 7)
      // 붙여넣기 시 7자리까지 한 번에 수용
      if (sanitized.length > 6) {
        commitDigits(sanitized)
        return
      }
      const currentGender = extractDigits(valueRef.current, 7).slice(6, 7)
      onValueChange?.(sanitized.length < 6 ? sanitized : sanitized + currentGender)
    }

    const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (readOnly || disabled) return
      const current = extractDigits(valueRef.current, 7)
      const sanitizedGender = extractDigits(event.target.value, 1)
      const next = current.slice(0, 6) + sanitizedGender
      onValueChange?.(next)
      if (next.length === 7) {
        tryCompleteGender(next.slice(0, 6), sanitizedGender)
      }
    }

    const handleBirthKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (readOnly || disabled) return
      if (event.key !== 'Enter') return
      const birth = extractDigits(event.currentTarget.value, 6)
      const gender = extractDigits(valueRef.current, 7).slice(6, 7)
      if (birth.length === 6 && gender.length === 1) {
        tryCompleteGender(birth, gender)
      }
    }

    const handleGenderKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (readOnly || disabled) return

      if (event.key === 'Backspace' && gender1.length === 0) {
        requestAnimationFrame(() => {
          const first =
            typeof firstInputRef === 'function'
              ? null
              : firstInputRef?.current ?? (ref as React.RefObject<HTMLInputElement>)?.current
          first?.focus()
        })
        return
      }

      if (event.key !== 'Enter' && (event.key !== 'Tab' || event.shiftKey)) return

      const birth = extractDigits(valueRef.current, 7).slice(0, 6)
      const gender = extractDigits(event.currentTarget.value, 1) || gender1
      if (birth.length !== 6 || gender.length !== 1) return

      if (event.key === 'Tab') {
        event.preventDefault()
      }
      tryCompleteGender(birth, gender)
    }

    React.useEffect(() => {
      const prevLength = prevBirthLengthRef.current
      prevBirthLengthRef.current = birth6.length

      if (readOnly || disabled || birth6.length !== 6 || gender1.length > 0 || prevLength >= 6) {
        return
      }

      requestAnimationFrame(() => internalSecondRef.current?.focus())
    }, [birth6.length, gender1.length, readOnly, disabled])

    const mergedFirstRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
        if (typeof firstInputRef === 'function') {
          firstInputRef(node)
        } else if (firstInputRef) {
          firstInputRef.current = node
        }
      },
      [firstInputRef, ref],
    )

    const mergedSecondRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        internalSecondRef.current = node
        if (typeof secondInputRef === 'function') {
          secondInputRef(node)
        } else if (secondInputRef) {
          secondInputRef.current = node
        }
      },
      [secondInputRef],
    )

    const focusBirth = () => {
      if (readOnly || disabled) return
      const first =
        typeof firstInputRef === 'function'
          ? null
          : firstInputRef?.current ?? (ref as React.RefObject<HTMLInputElement>)?.current
      first?.focus()
    }

    const focusGender = () => {
      if (readOnly || disabled) return
      internalSecondRef.current?.focus()
    }

    const labelColor = focused ? 'fg.brand' : 'fg.neutral'

    return (
      <SeedField.Root
        ref={fieldRef}
        readOnly={readOnly}
        disabled={disabled}
        invalid={invalid}
      >
        {label && (
          <SeedField.Header>
            <SeedField.Label weight={labelWeight}>
              <Text textStyle="t4Medium" color={labelColor}>
                {label}
              </Text>
            </SeedField.Label>
          </SeedField.Header>
        )}

        <Box
          position="relative"
          width="full"
          style={{
            minHeight: 48,
            paddingBottom: 12,
            borderBottomWidth: focused || invalid ? 2 : 1,
            borderBottomStyle: 'solid',
            borderBottomColor: getUnderlineColor(invalid, focused),
          }}
        >
          <HStack align="center" gap="x3" width="full" height="full" minHeight="36px">
            <Box
              as="button"
              type="button"
              onClick={focusBirth}
              disabled={readOnly || disabled}
              aria-label="주민등록번호 앞 6자리 입력"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: DOT_GAP,
                background: 'none',
                border: 0,
                padding: 0,
                cursor: readOnly || disabled ? 'default' : 'text',
              }}
            >
              {Array.from({ length: 6 }, (_, i) => (
                <DotSlot key={i} tone={i < birth6.length ? 'filled' : 'empty'} />
              ))}
            </Box>

            <Text textStyle="t5Regular" color="fg.neutralMuted" aria-hidden>
              -
            </Text>

            <Box
              as="button"
              type="button"
              onClick={focusGender}
              disabled={readOnly || disabled}
              aria-label="주민등록번호 뒤 자리 입력"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: DOT_GAP,
                background: 'none',
                border: 0,
                padding: 0,
                cursor: readOnly || disabled ? 'default' : 'text',
              }}
            >
              <DotSlot tone={gender1.length === 1 ? 'filled' : 'empty'} />
              {Array.from({ length: RRN_TAIL_SLOT_COUNT }, (_, i) => (
                <DotSlot key={i} tone="masked" />
              ))}
            </Box>
          </HStack>

          <input
            ref={mergedFirstRef}
            style={hiddenInputStyle}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            enterKeyHint="next"
            maxLength={7}
            value={birth6}
            readOnly={readOnly}
            disabled={disabled}
            tabIndex={readOnly || disabled ? -1 : 0}
            aria-label="생년월일 6자리"
            onChange={handleBirthChange}
            onKeyDown={handleBirthKeyDown}
            onFocus={() => setFocusedPart('birth')}
            onBlur={() => setFocusedPart((part) => (part === 'birth' ? null : part))}
          />

          <input
            ref={mergedSecondRef}
            style={hiddenInputStyle}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            enterKeyHint="next"
            maxLength={1}
            value={gender1}
            readOnly={readOnly}
            disabled={disabled}
            tabIndex={readOnly || disabled ? -1 : 0}
            aria-label="성별코드 1자리"
            onChange={handleGenderChange}
            onKeyDown={handleGenderKeyDown}
            onFocus={() => setFocusedPart('gender')}
            onBlur={() => setFocusedPart((part) => (part === 'gender' ? null : part))}
          />
        </Box>

        {description && (
          <SeedField.Footer>
            <SeedField.Description>{description}</SeedField.Description>
          </SeedField.Footer>
        )}

        <VisuallyHidden aria-live="polite">
          {digits.length}/7
        </VisuallyHidden>
      </SeedField.Root>
    )
  },
)

SplitRrnFirst7Field.displayName = 'SplitRrnFirst7Field'
