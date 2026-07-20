import { HStack, Text, VStack } from '@seed-design/react'

import coinDecor from '../../../assets/home/31_exchange1_0.png'
import { AnimatedAmount } from '../../../shared/ui/AnimatedAmount'
import { formatAmountNumber } from '../../../shared/utils/formatAmount'
import { HOME_COMPACT } from '../constants/homeCompact'
import { HOME_TYPOGRAPHY } from '../constants/homeTypography'

interface HomeBalanceCardProps {
  availableCoin: number
  coinBalance: number
  escrowCoin: number
  startCoinBalance: number
  replayKey?: string | number
  /** true일 때만 breeze AnimateNumber 재생 (초기 진입은 정적 표시) */
  balanceAnimated?: boolean
}

/** 홈 월렛 히어로 — r6, shadow 없음, compact 밀도 */
export function HomeBalanceCard({
  availableCoin,
  coinBalance,
  escrowCoin,
  startCoinBalance,
  replayKey,
  balanceAnimated = false,
}: HomeBalanceCardProps) {
  const hasBalance = coinBalance > 0
  const t = HOME_TYPOGRAPHY
  const hero = HOME_COMPACT.hero

  return (
    <VStack
      position="relative"
      p={hero.padding}
      gap="x3"
      bg="bg.brandSolid"
      borderRadius={hero.radius}
      color="fg.neutralInverted"
      className="overflow-hidden"
    >
      <img
        src={coinDecor}
        alt=""
        aria-hidden
        className="home-balance-card__coin-decor"
      />

      <VStack position="relative" gap="x3" style={{ zIndex: 1 }}>
        {hasBalance ? (
          <VStack gap="x1" pr="x10">
            <Text textStyle={t.heroAvailableLabel} color="fg.neutralInverted">
              사용 가능 Coin
            </Text>
            <HStack gap="x1" style={{ alignItems: 'baseline' }}>
              <AnimatedAmount
                value={availableCoin}
                startValue={startCoinBalance}
                replayKey={replayKey}
                animated={balanceAnimated}
                locale="ko-KR"
                useGrouping
                variant="balance"
                textColor="fg.neutralInverted"
              />
              <Text textStyle={t.heroUnit} color="fg.neutralInverted">
                Coin
              </Text>
            </HStack>
          </VStack>
        ) : (
          <VStack gap="x1" pr="x10">
            <Text textStyle={t.heroEmptyTitle} color="fg.neutralInverted">
              아직 보유한 코인이 없어요
            </Text>
            <Text textStyle={t.heroEmptyDesc} color="fg.neutralInverted">
              필요한 만큼 구매해서 사용할 수 있어요.
            </Text>
          </VStack>
        )}

        {hasBalance && (
          <HStack
            pt="x3"
            borderTopWidth="1"
            borderColor="stroke.neutralMuted"
            justify="space-between"
            gap="x4"
          >
            <VStack gap="x0_5" flexGrow style={{ minWidth: 0 }}>
              <Text textStyle={t.metaLabel} color="fg.neutralInverted">
                총 보유
              </Text>
              <Text textStyle={t.metaValue} color="fg.neutralInverted" className="tabular-nums">
                {formatAmountNumber(coinBalance)} Coin
              </Text>
            </VStack>
            <VStack
              gap="x0_5"
              flexGrow
              pl="x4"
              borderLeftWidth="1"
              borderColor="stroke.neutralMuted"
              style={{ minWidth: 0 }}
            >
              <Text textStyle={t.metaLabel} color="fg.neutralInverted">
                거래 보류
              </Text>
              <Text textStyle={t.metaValue} color="fg.neutralInverted" className="tabular-nums">
                {formatAmountNumber(escrowCoin)} Coin
              </Text>
            </VStack>
          </HStack>
        )}
      </VStack>
    </VStack>
  )
}
