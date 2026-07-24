import { HStack, Text, VStack } from '@seed-design/react'

import coinRateBadge from '../../../assets/home/coin-rate-badge.png'
import { COIN_TO_KRW } from '../../../shared/constants/money'
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

/** 홈 월렛 히어로 — Hero Blue 그라데이션 + 3단 정보 밀도 */
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
      gap={hero.blockGap}
      borderRadius={hero.radius}
      color="fg.neutralInverted"
      className="home-balance-card"
      style={{
        minHeight: hasBalance ? hero.minHeight : undefined,
        justifyContent: hasBalance ? 'space-between' : undefined,
      }}
    >
      <img
        src={coinRateBadge}
        alt=""
        aria-hidden
        className="home-balance-card__coin-decor"
      />

      <VStack position="relative" gap={hero.blockGap} style={{ zIndex: 1, flexGrow: 1 }}>
        {hasBalance ? (
          <VStack gap={hero.amountToBadgeGap} style={{ flexGrow: 1 }}>
            <VStack gap={hero.labelGap}>
              <Text
                textStyle={t.heroAvailableLabel}
                color="fg.neutralInverted"
                className="home-balance-card__muted"
              >
                사용 가능한 Coin
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
            <div className="home-balance-card__rate-badge">
              <img
                src={coinRateBadge}
                alt=""
                aria-hidden
                className="home-balance-card__rate-badge-icon"
              />
              <Text textStyle={t.heroRateBadge} color="fg.neutralInverted">
                1 Coin = {formatAmountNumber(COIN_TO_KRW)} KRW
              </Text>
            </div>
          </VStack>
        ) : (
          <VStack gap={hero.labelGap}>
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
          <VStack gap="x0" width="full">
            <div aria-hidden className="home-balance-card__divider" />
            <HStack
              align="stretch"
              justify="space-between"
              gap="x4"
              width="full"
              pt={hero.metaPt}
            >
              <VStack gap="x1" flexGrow style={{ minWidth: 0 }}>
                <Text
                  textStyle={t.metaLabel}
                  color="fg.neutralInverted"
                  className="home-balance-card__muted"
                >
                  전체 보유
                </Text>
                <Text
                  textStyle={t.metaValue}
                  color="fg.neutralInverted"
                  className="tabular-nums home-balance-card__meta-value"
                >
                  {formatAmountNumber(coinBalance)} Coin
                </Text>
              </VStack>
              <div aria-hidden className="home-balance-card__divider--vertical" />
              <VStack gap="x1" flexGrow style={{ minWidth: 0 }}>
                <Text
                  textStyle={t.metaLabel}
                  color="fg.neutralInverted"
                  className="home-balance-card__muted"
                >
                  거래 중
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
          </VStack>
        )}
      </VStack>
    </VStack>
  )
}
