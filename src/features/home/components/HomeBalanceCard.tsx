import { Divider, HStack, Text, VStack } from '@seed-design/react'

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

/** 홈 월렛 히어로 — 금액 앵커, 라벨·메타는 muted (Toss 월렛 위계) */
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
      gap="x2"
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

      <VStack position="relative" gap="x2" style={{ zIndex: 1 }}>
        {hasBalance ? (
          <VStack gap="x1" pr="x16">
            <Text
              textStyle={t.heroAvailableLabel}
              color="fg.neutralInverted"
              className="home-balance-card__muted"
            >
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
          <VStack gap="x1" pr="x16">
            <Text textStyle={t.heroEmptyTitle} color="fg.neutralInverted">
              필요한 Coin을 구매해 보세요
            </Text>
            <Text
              textStyle={t.heroEmptyDesc}
              color="fg.neutralInverted"
              className="home-balance-card__muted"
            >
              구매하면 여기서 잔액을 확인할 수 있어요.
            </Text>
          </VStack>
        )}

        {hasBalance && (
          <>
            <Divider
              as="div"
              aria-hidden
              orientation="horizontal"
              thickness={1}
              color="palette.staticWhiteAlpha300"
            />
            <HStack align="stretch" justify="space-between" gap="x4" width="full">
              <VStack gap="x0_5" flexGrow style={{ minWidth: 0 }}>
                <Text
                  textStyle={t.metaLabel}
                  color="fg.neutralInverted"
                  className="home-balance-card__muted"
                >
                  총 보유
                </Text>
                <Text
                  textStyle={t.metaValue}
                  color="fg.neutralInverted"
                  className="tabular-nums home-balance-card__meta-value"
                >
                  {formatAmountNumber(coinBalance)} Coin
                </Text>
              </VStack>
              <Divider
                as="div"
                aria-hidden
                orientation="vertical"
                thickness={1}
                color="palette.staticWhiteAlpha300"
                className="home-balance-card__divider--vertical"
              />
              <VStack gap="x0_5" flexGrow style={{ minWidth: 0 }}>
                <Text
                  textStyle={t.metaLabel}
                  color="fg.neutralInverted"
                  className="home-balance-card__muted"
                >
                  거래 보류
                </Text>
                <Text
                  textStyle={t.metaValue}
                  color="fg.neutralInverted"
                  className="tabular-nums home-balance-card__meta-value"
                >
                  {formatAmountNumber(escrowCoin)} Coin
                </Text>
              </VStack>
            </HStack>
          </>
        )}
      </VStack>
    </VStack>
  )
}
