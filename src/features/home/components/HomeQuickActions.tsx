import {
  IconMinusLine,
  IconPlusLine,
  IconReceiptLine,
  IconStoreLine,
} from '@karrotmarket/react-monochrome-icon'
import { Box, HStack, Icon, Text, VStack } from '@seed-design/react'
import type { ReactNode } from 'react'

import { PressableScale } from '../../../shared/ui/PressableScale'
import { HOME_COMPACT } from '../constants/homeCompact'
import { HOME_TYPOGRAPHY } from '../constants/homeTypography'

export type HomeQuickActionId = 'buy' | 'sell' | 'exchange' | 'merchants'

interface HomeQuickActionsProps {
  disabledTrade?: boolean
  onAction: (id: HomeQuickActionId) => void
}

const PRIMARY_ACTIONS: Array<{
  id: Extract<HomeQuickActionId, 'buy' | 'sell'>
  label: string
  description: string
  icon: ReactNode
}> = [
  {
    id: 'buy',
    label: '구매하기',
    description: 'Coin을 충전해요',
    icon: <IconPlusLine />,
  },
  {
    id: 'sell',
    label: '판매하기',
    description: 'Coin을 판매해요',
    icon: <IconMinusLine />,
  },
]

const SECONDARY_ACTIONS: Array<{
  id: Extract<HomeQuickActionId, 'exchange' | 'merchants'>
  label: string
  description: string
  icon: ReactNode
}> = [
  {
    id: 'exchange',
    label: '거래소',
    description: '시세를 확인해요',
    icon: <IconReceiptLine />,
  },
  {
    id: 'merchants',
    label: '사용처',
    description: 'Coin으로 결제해요',
    icon: <IconStoreLine />,
  },
]

function ActionIcon({
  icon,
  variant,
}: {
  icon: ReactNode
  variant: 'primary' | 'secondary'
}) {
  const size = HOME_COMPACT.quickAction.iconSize
  const isPrimary = variant === 'primary'

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="full"
      bg={isPrimary ? 'bg.brandSolid' : 'bg.brandWeak'}
      flexShrink={0}
      style={{ width: size, height: size }}
    >
      <Icon
        svg={icon}
        size="x5"
        color={isPrimary ? 'fg.neutralInverted' : 'fg.brand'}
      />
    </Box>
  )
}

function ActionCard({
  label,
  description,
  icon,
  variant,
  disabled,
  onClick,
}: {
  label: string
  description: string
  icon: ReactNode
  variant: 'primary' | 'secondary'
  disabled?: boolean
  onClick: () => void
}) {
  const t = HOME_TYPOGRAPHY
  const { card, quickAction: qa } = HOME_COMPACT

  return (
    <Box
      flexGrow
      minWidth="0"
      bg="bg.layerDefault"
      borderRadius={card.radius}
      boxShadow={card.shadow}
      style={{ flex: '1 1 0', opacity: disabled ? 0.5 : 1 }}
    >
      <PressableScale
        disabled={disabled}
        aria-label={label}
        onClick={onClick}
        style={{
          display: 'flex',
          width: '100%',
          height: qa.height,
          minHeight: 44,
          paddingBlock: qa.paddingBlock,
          paddingInline: qa.paddingInline,
          border: 'none',
          background: 'transparent',
          borderRadius: 'inherit',
          cursor: disabled ? 'not-allowed' : 'pointer',
          textAlign: 'left',
        }}
      >
        <HStack align="center" gap="x3" width="full" style={{ minWidth: 0 }}>
          <ActionIcon icon={icon} variant={variant} />
          <VStack gap={qa.iconGap} style={{ minWidth: 0, flex: '1 1 0' }}>
            <Text textStyle={t.quickPrimaryLabel} color="fg.neutral">
              {label}
            </Text>
            <Text
              textStyle={t.quickPrimaryDesc}
              color="fg.neutralMuted"
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {description}
            </Text>
          </VStack>
        </HStack>
      </PressableScale>
    </Box>
  )
}

/** 홈 퀵액션 — 4칸 동일 크기, 구매·판매만 채운 아이콘 */
export function HomeQuickActions({ disabledTrade = false, onAction }: HomeQuickActionsProps) {
  const qa = HOME_COMPACT.quickAction

  return (
    <VStack gap={HOME_COMPACT.layout.primaryToSecondaryGap} width="full">
      <HStack gap={qa.cardGap} width="full">
        {PRIMARY_ACTIONS.map((action) => (
          <ActionCard
            key={action.id}
            label={action.label}
            description={action.description}
            icon={action.icon}
            variant="primary"
            disabled={disabledTrade}
            onClick={() => {
              if (!disabledTrade) onAction(action.id)
            }}
          />
        ))}
      </HStack>

      <HStack gap={qa.cardGap} width="full">
        {SECONDARY_ACTIONS.map((action) => (
          <ActionCard
            key={action.id}
            label={action.label}
            description={action.description}
            icon={action.icon}
            variant="secondary"
            onClick={() => onAction(action.id)}
          />
        ))}
      </HStack>
    </VStack>
  )
}
