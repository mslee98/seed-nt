/**
 * PhoneWithCarrierField
 *
 * 통신사 선택 + 휴대폰 번호를 하나의 underline 행으로 표현한다.
 * (이미지형 본인인증 UI)
 */
import { useState, type RefObject } from 'react'
import { HStack, Icon, Text, Field as SeedField } from '@seed-design/react'
import { IconChevronDownLine } from '@karrotmarket/react-monochrome-icon'

function getUnderlineColor(invalid: boolean, focused: boolean): string {
  if (invalid) return 'var(--seed-color-stroke-critical-solid)'
  if (focused) return 'var(--seed-color-fg-brand)'
  return 'var(--seed-color-stroke-neutral-weak)'
}

export interface PhoneWithCarrierFieldProps {
  label?: string
  description?: string
  carrierLabel: string
  carrierPlaceholder?: string
  phoneDisplay: string
  phonePlaceholder?: string
  onPhoneChange: (value: string) => void
  onCarrierClick: () => void
  carrierButtonRef?: RefObject<HTMLButtonElement | null>
  phoneInputRef?: RefObject<HTMLInputElement | null>
  carrierDisabled?: boolean
  phoneReadOnly?: boolean
  invalid?: boolean
}

export function PhoneWithCarrierField({
  label = '휴대폰번호',
  description,
  carrierLabel,
  carrierPlaceholder = '통신사 선택',
  phoneDisplay,
  phonePlaceholder = '휴대폰번호 입력',
  onPhoneChange,
  onCarrierClick,
  carrierButtonRef,
  phoneInputRef,
  carrierDisabled = false,
  phoneReadOnly = false,
  invalid = false,
}: PhoneWithCarrierFieldProps) {
  const [focused, setFocused] = useState(false)
  const showBrand = focused && !carrierDisabled
  const hasCarrier = carrierLabel.length > 0

  return (
    <SeedField.Root invalid={invalid}>
      {label && (
        <SeedField.Header>
          <SeedField.Label>
            <Text textStyle="t4Medium" color={showBrand ? 'fg.brand' : 'fg.neutral'}>
              {label}
            </Text>
          </SeedField.Label>
        </SeedField.Header>
      )}

      <HStack
        align="center"
        gap="x3"
        width="full"
        style={{
          minHeight: 48,
          paddingBottom: 12,
          borderBottomWidth: showBrand || invalid ? 2 : 1,
          borderBottomStyle: 'solid',
          borderBottomColor: getUnderlineColor(invalid, showBrand),
        }}
      >
        <button
          ref={carrierButtonRef}
          type="button"
          onClick={onCarrierClick}
          disabled={carrierDisabled}
          aria-label="통신사 선택"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            flexShrink: 0,
            background: 'none',
            border: 0,
            padding: 0,
            cursor: carrierDisabled ? 'default' : 'pointer',
            maxWidth: 132,
          }}
        >
          <Text
            textStyle="t5Regular"
            color={hasCarrier ? 'fg.neutral' : 'fg.neutralSubtle'}
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {hasCarrier ? carrierLabel : carrierPlaceholder}
          </Text>
          <Icon svg={<IconChevronDownLine />} size="x3" color="fg.neutralSubtle" />
        </button>

        <input
          ref={phoneInputRef}
          type="text"
          inputMode="tel"
          enterKeyHint="done"
          maxLength={13}
          value={phoneDisplay}
          placeholder={phonePlaceholder}
          readOnly={phoneReadOnly}
          tabIndex={phoneReadOnly ? -1 : 0}
          aria-label="휴대폰 번호"
          onChange={(e) => onPhoneChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            minWidth: 0,
            border: 0,
            outline: 'none',
            background: 'transparent',
            padding: 0,
            fontSize: 'var(--seed-font-size-t5)',
            lineHeight: 'var(--seed-line-height-t5)',
            color: 'var(--seed-color-fg-neutral)',
            caretColor: 'var(--seed-color-fg-brand)',
          }}
        />
      </HStack>

      {description && (
        <SeedField.Footer>
          <SeedField.Description>{description}</SeedField.Description>
        </SeedField.Footer>
      )}
    </SeedField.Root>
  )
}
