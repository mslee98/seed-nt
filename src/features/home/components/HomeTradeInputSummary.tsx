import { motion } from 'motion/react'
import { HStack, Text, VStack } from '@seed-design/react'

import { usePrefersReducedMotion } from '../../../shared/hooks/usePrefersReducedMotion'
import { formatAmount } from '../utils/formatAmount'
import type { TradeSide } from '../types'

interface HomeTradeInputSummaryProps {
  side: TradeSide
  amountKrw: number
}

export function HomeTradeInputSummary({ side, amountKrw }: HomeTradeInputSummaryProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const sideLabel = side === 'BUY' ? '구매' : '판매'
  const headline = `${formatAmount(amountKrw)} ${sideLabel} 매칭 중`

  const content = (
    <VStack
      bg="bg.neutralWeak"
      borderWidth="1"
      borderColor="stroke.neutralWeak"
      borderRadius="r5"
      boxShadow="s1"
      p="x4"
      gap="x1"
      width="full"
    >
      <HStack align="center" gap="x2">
        <Text textStyle="t4Regular" color="fg.neutralMuted">
          내 요청
        </Text>
      </HStack>
      <Text textStyle="t5Bold" color="fg.neutralMuted" className="tabular-nums">
        {headline}
      </Text>
    </VStack>
  )

  if (prefersReducedMotion) {
    return content
  }

  return (
    <motion.div layout transition={{ duration: 0.28, ease: [0.2, 0.1, 0.21, 0.99] }}>
      {content}
    </motion.div>
  )
}
