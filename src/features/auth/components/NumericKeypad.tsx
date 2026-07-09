import type { ReactNode } from 'react'
import { IconBackspacekeyLine } from '@karrotmarket/react-monochrome-icon'
import { Box, HStack, Text, VStack } from '@seed-design/react'

interface NumericKeypadProps {
  onDigit: (digit: string) => void
  onBackspace: () => void
  disabled?: boolean
}

const ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
] as const

function KeyButton({
  label,
  onClick,
  disabled,
  ariaLabel,
}: {
  label: ReactNode
  onClick: () => void
  disabled?: boolean
  ariaLabel?: string
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={onClick}
      className="flex h-14 flex-1 items-center justify-center rounded-r2 bg-bg-layer-default disabled:cursor-not-allowed"
    >
      {typeof label === 'string' ? (
        <Text textStyle="t6Medium" color="fg.neutral">
          {label}
        </Text>
      ) : (
        label
      )}
    </button>
  )
}

export function NumericKeypad({ onDigit, onBackspace, disabled }: NumericKeypadProps) {
  return (
    <VStack gap="x2" px="spacingX.globalGutter" pb="x4">
      {ROWS.map((row) => (
        <HStack key={row.join('-')} gap="x2" width="full">
          {row.map((digit) => (
            <KeyButton
              key={digit}
              label={digit}
              disabled={disabled}
              onClick={() => onDigit(digit)}
            />
          ))}
        </HStack>
      ))}
      <HStack gap="x2" width="full">
        <KeyButton
          label={<IconBackspacekeyLine width={24} height={24} />}
          ariaLabel="지우기"
          disabled={disabled}
          onClick={onBackspace}
        />
        <KeyButton label="0" disabled={disabled} onClick={() => onDigit('0')} />
        <Box flexGrow={1} />
      </HStack>
    </VStack>
  )
}
