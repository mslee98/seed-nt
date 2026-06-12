import { HStack, Box } from '@seed-design/react'

interface PinInputProps {
  length: number
  value: string
}

export function PinInput({ length, value }: PinInputProps) {
  return (
    <HStack gap="x3" justify="center" py="x4">
      {Array.from({ length }, (_, index) => {
        const filled = index < value.length
        return (
          <Box
            key={index}
            width="12px"
            height="12px"
            borderRadius="full"
            bg={filled ? 'fg.neutral' : 'bg.neutralWeak'}
          />
        )
      })}
    </HStack>
  )
}
