import { useFlow } from '@stackflow/react'
import { IconBellLine } from '@karrotmarket/react-monochrome-icon'
import { Badge, Box, HStack, Text, VStack } from '@seed-design/react'

import IconCoinDollarSyncFill from '../../../assets/icons/icon-coin-dollar-sync-fill.svg?react'
import type { HomeViewModel } from '../types'
import { formatAmount } from '../utils/formatAmount'
import { getTradeStatusCopy } from '../utils/tradeStatusCopy'
import { HomeHeaderIconButton } from './HomeHeaderIconButton'

interface HomeHeaderProps {
  activeTrade?: HomeViewModel['activeTrade']
}

export function HomeHeader({ activeTrade }: HomeHeaderProps) {
  const { push } = useFlow()

  return (
    <section className="home-header">
      <VStack px="spacingX.globalGutter" pb="x10" gap="x5">
        <HStack justify="space-between" align="center" height="56px">
          <HStack align="center" gap="x2">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="32px"
              height="32px"
              borderRadius="r3"
              bg="bg.brandSolid"
            >
              <Text textStyle="t4Bold" color="palette.staticWhite">
                N
              </Text>
            </Box>

            <VStack gap="x0_5">
              <Text textStyle="t5Bold" color="fg.neutral">
                누비
              </Text>
              <Text textStyle="t2Regular" color="fg.neutralMuted">
                개인 간 코인 거래
              </Text>
            </VStack>
          </HStack>

          <HomeHeaderIconButton label="알림">
            <IconBellLine />
          </HomeHeaderIconButton>
        </HStack>

        <VStack gap="spacingY.betweenText">
          <HStack align="center" gap="x2">
            <IconCoinDollarSyncFill width={40} height={40} aria-hidden />
            <Text textStyle="screenTitle" color="fg.neutral">
              필요한 만큼{'\n'}쉽게 거래해요
            </Text>
          </HStack>
          <Text textStyle="t5Regular" color="fg.neutralMuted">
            비슷한 금액의 상대와 연결해드릴게요.
          </Text>
        </VStack>

        {activeTrade && (
          <button
            type="button"
            className="home-header-active-trade"
            onClick={() => push('Detail', { id: activeTrade.id })}
          >
            <Badge tone="warning" variant="weak" size="medium">
              {getTradeStatusCopy(activeTrade.status).badge}
            </Badge>
            <VStack gap="x0_5" className="min-w-0 flex-1">
              <Text textStyle="t4Bold" color="fg.neutral">
                {getTradeStatusCopy(activeTrade.status).title}
              </Text>
              <Text textStyle="t3Regular" color="fg.neutralMuted" className="tabular-nums">
                {formatAmount(activeTrade.amountKrw)} · {activeTrade.coinAmount} MS
              </Text>
            </VStack>
          </button>
        )}
      </VStack>
    </section>
  )
}
