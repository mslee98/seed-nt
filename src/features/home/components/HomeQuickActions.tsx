import {
  IconMinusCircleLine,
  IconPlusCircleLine,
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

const ACTIONS: Array<{
  id: HomeQuickActionId
  label: string
  icon: ReactNode
}> = [
  { id: 'buy', label: '구매', icon: <IconPlusCircleLine /> },
  { id: 'sell', label: '판매', icon: <IconMinusCircleLine /> },
  { id: 'exchange', label: '거래소', icon: <IconReceiptLine /> },
  { id: 'merchants', label: '사용처', icon: <IconStoreLine /> },
]

/** 홈 퀵액션 — r4 + s1, 높이 72 (compact) */
export function HomeQuickActions({ disabledTrade = false, onAction }: HomeQuickActionsProps) {
  const qa = HOME_COMPACT.quickAction

  return (
    <HStack gap={qa.cardGap} width="full">
      {ACTIONS.map((action) => {
        const isTrade = action.id === 'buy' || action.id === 'sell'
        const disabled = isTrade && disabledTrade

        return (
          <Box
            key={action.id}
            flexGrow
            minWidth={0}
            bg="bg.layerDefault"
            borderRadius={qa.radius}
            boxShadow="s1"
            opacity={disabled ? 0.5 : 1}
          >
            <PressableScale
              disabled={disabled}
              aria-label={action.label}
              onClick={() => {
                if (!disabled) onAction(action.id)
              }}
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
              }}
            >
              <VStack align="center" justify="center" gap={qa.iconGap} width="full">
                <Icon svg={action.icon} size="x6" color="fg.brand" />
                <Text textStyle={HOME_TYPOGRAPHY.quickLabel} color="fg.neutral">
                  {action.label}
                </Text>
              </VStack>
            </PressableScale>
          </Box>
        )
      })}
    </HStack>
  )
}
