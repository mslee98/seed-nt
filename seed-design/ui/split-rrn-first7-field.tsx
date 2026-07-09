/**
 * @file ui:split-rrn-first7-field
 * 주민등록번호 앞 7자리(생년월일 6 + 성별 1) 분리 입력 필드
 */

import * as React from 'react'
import {
  Box,
  Field as SeedField,
  HStack,
  Text,
  TextField as SeedTextField,
  VisuallyHidden,
} from '@seed-design/react'
import type { FieldLabelVariantProps } from '@seed-design/css/recipes/field-label'

function extractDigits(value: string, maxLength: number): string {
  return value.replace(/\D/g, '').slice(0, maxLength)
}

const RRN_TAIL_SLOT_COUNT = 6
const SPLIT_BOX_STYLE = { flexGrow: 1, flexBasis: 0, minWidth: 0 } as const

export interface SplitRrnFirst7FieldProps {
  value: string
  onValueChange?: (value: string) => void
  label?: React.ReactNode
  labelWeight?: FieldLabelVariantProps['weight']
  description?: React.ReactNode
  readOnly?: boolean
  disabled?: boolean
  invalid?: boolean
  /** 성별코드(7번째) 마스킹 */
  maskGender?: boolean
  birthPlaceholder?: string
  genderPlaceholder?: string
  firstInputRef?: React.Ref<HTMLInputElement>
  secondInputRef?: React.Ref<HTMLInputElement>
  fieldRef?: React.Ref<HTMLDivElement>
  /** 성별 1자리까지 입력 완료 시 (Enter / Tab) */
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
      maskGender = false,
      birthPlaceholder = '000000',
      genderPlaceholder = '0',
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

    valueRef.current = value

    const digits = extractDigits(value, 7)
    const birth6 = digits.slice(0, 6)
    const gender1 = digits.slice(6, 7)

    const handleBirthChange = React.useCallback(
      (nextBirth: string) => {
        const current = extractDigits(valueRef.current, 7)
        const sanitizedBirth = extractDigits(nextBirth, 6)
        const nextGender = sanitizedBirth.length < 6 ? '' : current.slice(6, 7)
        onValueChange?.(sanitizedBirth + nextGender)
      },
      [onValueChange],
    )

    const handleGenderChange = React.useCallback(
      (nextGender: string) => {
        const current = extractDigits(valueRef.current, 7)
        const sanitizedGender = extractDigits(nextGender, 1)
        onValueChange?.(current.slice(0, 6) + sanitizedGender)
      },
      [onValueChange],
    )

    const tryCompleteGender = React.useCallback(
      (birth: string, gender: string) => {
        if (extractDigits(birth, 6).length !== 6 || extractDigits(gender, 1).length !== 1) return
        requestAnimationFrame(() => onGenderComplete?.())
      },
      [onGenderComplete],
    )

    const handleBirthKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (readOnly || disabled) return

      if (event.key === 'Enter') {
        const birth = extractDigits(event.currentTarget.value, 6)
        const gender = extractDigits(valueRef.current, 7).slice(6, 7)
        if (birth.length === 6 && gender.length === 1) {
          tryCompleteGender(birth, gender)
        }
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

    const genderInputType = maskGender && gender1 ? 'password' : 'text'
    const sharedFieldProps = { size: 'large' as const, readOnly, disabled, invalid }
    const genderFilled = gender1.length > 0

    return (
      <SeedField.Root
        ref={fieldRef}
        readOnly={readOnly}
        disabled={disabled}
        invalid={invalid}
      >
        {label && (
          <SeedField.Header>
            <SeedField.Label weight={labelWeight}>{label}</SeedField.Label>
          </SeedField.Header>
        )}

        <HStack gap="x2" align="center" width="full">
          <Box style={SPLIT_BOX_STYLE}>
            <SeedTextField.Root
              {...sharedFieldProps}
              value={birth6}
              onValueChange={handleBirthChange}
              style={{ width: '100%' }}
            >
              <SeedTextField.Input
                ref={mergedFirstRef}
                maxLength={6}
                placeholder={birthPlaceholder}
                inputMode="numeric"
                enterKeyHint="next"
                autoComplete="off"
                aria-label="생년월일 6자리"
                className="tabular-nums"
                tabIndex={readOnly ? -1 : 0}
                onKeyDown={handleBirthKeyDown}
              />
            </SeedTextField.Root>
          </Box>

          <Text
            textStyle="t5Regular"
            color="fg.neutralMuted"
            style={{ flexShrink: 0 }}
            aria-hidden
          >
            -
          </Text>

          <Box style={SPLIT_BOX_STYLE}>
            <SeedTextField.Root
              {...sharedFieldProps}
              value={gender1}
              onValueChange={handleGenderChange}
              style={{ width: '100%' }}
            >
              <HStack align="center" width="full" gap="x1">
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  style={{ flexGrow: 1, flexBasis: 0, minWidth: 0 }}
                >
                  <SeedTextField.Input
                    ref={mergedSecondRef}
                    maxLength={1}
                    placeholder={genderPlaceholder}
                    type={genderInputType}
                    inputMode="numeric"
                    enterKeyHint="next"
                    autoComplete="off"
                    aria-label="성별코드 1자리"
                    className="tabular-nums"
                    tabIndex={readOnly ? -1 : 0}
                    style={{
                      width: '100%',
                      maxWidth: '1.75rem',
                      textAlign: 'center',
                      paddingInline: 0,
                      fontWeight: genderFilled ? 700 : 400,
                      color: genderFilled ? 'var(--seed-color-fg-neutral)' : undefined,
                    }}
                    onKeyDown={handleGenderKeyDown}
                  />
                </Box>

                {Array.from({ length: RRN_TAIL_SLOT_COUNT }, (_, index) => (
                  <Box
                    key={index}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    style={{ flexGrow: 1, flexBasis: 0, minWidth: 0 }}
                  >
                    <Text textStyle="t5Regular" color="fg.neutralSubtle" aria-hidden>
                      ●
                    </Text>
                  </Box>
                ))}
              </HStack>
            </SeedTextField.Root>
          </Box>
        </HStack>

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

/**
 * This file is a project snippet inspired by SEED TextField patterns.
 * TDS SplitTextField.RRNFirst7 UX를 SEED 토큰으로 구현합니다.
 */
