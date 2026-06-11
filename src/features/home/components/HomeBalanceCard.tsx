import { HStack, Text, VStack } from '@seed-design/react'
import AnimateNumber from 'seed-design/breeze/animate-number/animate-number'
import { List, ListItem } from 'seed-design/ui/list'

import { formatAmount } from '../utils/formatAmount'

interface HomeBalanceCardProps {
  coinBalance: number
  estimatedKrwValue: number
}

export function HomeBalanceCard({ coinBalance, estimatedKrwValue }: HomeBalanceCardProps) {
  const hasBalance = coinBalance > 0

  return (
    <VStack p="x3" className="home-card home-card--quiet">
      {hasBalance ? (
        <List width="full">
          <ListItem
            title={
              <Text textStyle="t5Regular" color="fg.neutralMuted">
                내 코인
              </Text>
            }
            suffix={
              <HStack align="center" gap="x1">
                <AnimateNumber
                  value={coinBalance}
                  fontSize="1.25rem"
                  fontWeight="700"
                  color="var(--seed-color-fg-neutral)"
                  showComma={coinBalance >= 1_000}
                  className="tabular-nums"
                />
                <Text textStyle="t5Bold" color="fg.neutral">
                  MS
                </Text>
              </HStack>
            }
          />
          <ListItem
            title={
              <Text textStyle="t5Regular" color="fg.neutralMuted">
                보유 금액
              </Text>
            }
            suffix={
              <Text textStyle="t5Medium" color="fg.neutral" className="tabular-nums">
                {formatAmount(estimatedKrwValue)}
              </Text>
            }
          />
        </List>
      ) : (
        <VStack gap="spacingY.betweenText">
          <Text textStyle="t5Bold" color="fg.neutral">
            아직 보유한 코인이 없어요
          </Text>
          <Text textStyle="t4Regular" color="fg.neutralSubtle">
            필요한 만큼 구매해서 사용할 수 있어요.
          </Text>
        </VStack>
      )}
    </VStack>
  )
}
