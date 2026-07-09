import type { ReactNode } from 'react'
import { VStack } from '@seed-design/react'

interface SummaryListCardProps {
  children: ReactNode
}

export function SummaryListCard({ children }: SummaryListCardProps) {
  return (
    <VStack
      width="full"
      bg="bg.layerDefault"
      borderWidth="1"
      borderColor="stroke.neutralWeak"
      borderRadius="r4"
    >
      {children}
    </VStack>
  )
}
