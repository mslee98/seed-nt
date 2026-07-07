import { Box, HStack } from '@seed-design/react'

export interface PinFieldProps {
  length: number
  value: string
  /** 포커스 표시 셀. 기본값은 다음 입력 대기 index (`value.length`) */
  activeIndex?: number
  invalid?: boolean
  'aria-label'?: string
}

function getCellBorderColor(invalid: boolean, active: boolean): string {
  if (invalid) return 'var(--seed-color-stroke-critical-solid)'
  if (active) return 'var(--seed-color-stroke-neutral-contrast)'
  return 'var(--seed-color-stroke-neutral-weak)'
}

export function PinField({
  length,
  value,
  activeIndex,
  invalid = false,
  'aria-label': ariaLabel,
}: PinFieldProps) {
  const focusIndex = activeIndex ?? Math.min(value.length, length - 1)
  const showCursor = value.length < length

  return (
    <HStack
      gap="x2"
      justify="center"
      width="full"
      py="x4"
      role="group"
      aria-label={ariaLabel}
    >
      {Array.from({ length }, (_, index) => {
        const filled = index < value.length
        const active = showCursor && index === focusIndex

        return (
          <Box
            key={index}
            flexGrow
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
            height="56px"
            style={{
              minWidth: 40,
              maxWidth: 52,
              borderBottomWidth: active || invalid ? 2 : 1,
              borderBottomStyle: 'solid',
              borderBottomColor: getCellBorderColor(invalid, active),
            }}
            aria-hidden
          >
            {filled ? (
              <Box width="14px" height="14px" borderRadius="full" bg="fg.neutral" />
            ) : active ? (
              <Box width="2px" height="28px" bg="fg.neutral" className="pin-field-cursor" />
            ) : null}
          </Box>
        )
      })}
    </HStack>
  )
}
