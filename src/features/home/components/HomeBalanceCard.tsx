import { HStack, Text, VStack } from '@seed-design/react'
import { List, ListItem } from 'seed-design/ui/list'

import { AnimatedAmount } from '../../../shared/ui/AnimatedAmount'

interface HomeBalanceCardProps {
  coinBalance: number
  estimatedKrwValue: number
  startCoinBalance?: number
  startEstimatedKrwValue?: number
  replayKey?: string | number
}

export function HomeBalanceCard({
  coinBalance,
  estimatedKrwValue,
  startCoinBalance,
  startEstimatedKrwValue,
  replayKey,
}: HomeBalanceCardProps) {
  const hasBalance = coinBalance > 0

  return (
    <VStack
      p="x3"
      bg="bg.layerDefault"
      borderWidth="1"
      borderColor="stroke.neutralWeak"
      borderRadius="r5"
    >
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
                <AnimatedAmount
                  value={coinBalance}
                  startValue={startCoinBalance ?? coinBalance}
                  replayKey={replayKey}
                  locale="ko-KR"
                  useGrouping
                  numberTextStyle="t5Bold"
                  textColor="fg.neutral"
                  fontSize={20}
                  fontWeight={700}
                  className="tabular-nums"
                />
                <Text textStyle="t5Bold" color="fg.neutral">
                  Coin
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
              <AnimatedAmount
                value={estimatedKrwValue}
                startValue={startEstimatedKrwValue ?? estimatedKrwValue}
                replayKey={replayKey}
                suffix="원"
                locale="ko-KR"
                useGrouping
                numberTextStyle="t5Medium"
                suffixTextStyle="t5Medium"
                textColor="fg.neutral"
                fontSize={17}
                fontWeight={500}
                className="tabular-nums"
              />
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
