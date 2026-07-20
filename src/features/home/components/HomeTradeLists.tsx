import {
  IconChevronRightLine,
  IconClockLine,
  IconWonCircleArrowRightLine,
} from '@karrotmarket/react-monochrome-icon'
import { Badge, Box, HStack, Icon, Text, VStack } from '@seed-design/react'
import type { ReactNode } from 'react'

import { PressableScale } from '../../../shared/ui/PressableScale'
import { HOME_COMPACT } from '../constants/homeCompact'
import { HOME_TYPOGRAPHY } from '../constants/homeTypography'
import type {
  HomeAttentionAction,
  HomeMetaSecondaryTone,
  HomeTradeListItem,
} from '../utils/buildHomeTradeLists'

interface HomeTradeListsProps {
  attentionItems: HomeTradeListItem[]
  inProgressItems: HomeTradeListItem[]
  onItemClick: (item: HomeTradeListItem) => void
}

const META_SECONDARY_COLOR: Record<
  HomeMetaSecondaryTone,
  'fg.warning' | 'fg.neutralMuted' | 'fg.brand'
> = {
  warning: 'fg.warning',
  muted: 'fg.neutralMuted',
  brand: 'fg.brand',
}

function AttentionPrefix({ action }: { action?: HomeAttentionAction }) {
  if (action === 'confirm') {
    return <Icon svg={<IconClockLine />} size="x6" color="fg.informative" />
  }
  return <Icon svg={<IconWonCircleArrowRightLine />} size="x6" color="fg.warning" />
}

function AttentionMeta({ item }: { item: HomeTradeListItem }) {
  const t = HOME_TYPOGRAPHY

  if (item.metaPrimary) {
    return (
      <HStack align="center" gap="x1" wrap>
        <Text textStyle={t.taskStatus} color="fg.brand">
          {item.metaPrimary}
        </Text>
        {item.metaSecondary && (
          <>
            <Text textStyle={t.taskStatus} color="fg.neutralMuted">
              ·
            </Text>
            <Text
              textStyle={t.taskStatus}
              color={META_SECONDARY_COLOR[item.metaSecondaryTone ?? 'brand']}
            >
              {item.metaSecondary}
            </Text>
          </>
        )}
      </HStack>
    )
  }

  return (
    <Text textStyle={t.taskStatus} color="fg.brand">
      {item.meta}
    </Text>
  )
}

function ListCard({ children }: { children: ReactNode }) {
  return (
    <Box
      bg="bg.layerDefault"
      borderRadius={HOME_COMPACT.requiredAction.radius}
      boxShadow="s1"
      width="full"
      className="overflow-hidden"
    >
      {children}
    </Box>
  )
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <Text as="h3" textStyle={HOME_TYPOGRAPHY.sectionTitle} color="fg.neutral">
      {children}
    </Text>
  )
}

/** ListButtonItem 대신 compact 행 — min 84, detail 없음 */
function TradeListRow({
  item,
  onItemClick,
  prefix,
  suffix,
}: {
  item: HomeTradeListItem
  onItemClick: (item: HomeTradeListItem) => void
  prefix?: ReactNode
  suffix?: ReactNode
}) {
  const t = HOME_TYPOGRAPHY
  const ra = HOME_COMPACT.requiredAction

  return (
    <ListCard>
      <PressableScale
        aria-label={item.title}
        onClick={() => onItemClick(item)}
        style={{
          display: 'grid',
          gridTemplateColumns: prefix
            ? `${ra.leadingSize}px minmax(0, 1fr) auto`
            : 'minmax(0, 1fr) auto',
          alignItems: 'center',
          columnGap: ra.columnGap,
          width: '100%',
          minHeight: ra.minHeight,
          padding: `${ra.paddingY}px ${ra.paddingX}px`,
          border: 'none',
          background: 'transparent',
          borderRadius: 'inherit',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        {prefix}
        <VStack gap="x0_5" style={{ minWidth: 0 }}>
          <Text textStyle={t.taskTitle} color="fg.neutral">
            {item.title}
          </Text>
          {item.kind === 'attention' ? (
            <AttentionMeta item={item} />
          ) : (
            <Text textStyle={t.taskStatus} color="fg.neutralMuted">
              {item.meta}
            </Text>
          )}
        </VStack>
        {suffix ?? (
          <Icon svg={<IconChevronRightLine />} size="x5" color="fg.neutralSubtle" />
        )}
      </PressableScale>
    </ListCard>
  )
}

/** 홈 — 지금 필요한 활동 / 진행 중인 거래 (compact, detail 미표시) */
export function HomeTradeLists({
  attentionItems,
  inProgressItems,
  onItemClick,
}: HomeTradeListsProps) {
  if (attentionItems.length === 0 && inProgressItems.length === 0) {
    return null
  }

  const { sectionGap, itemGap } = HOME_COMPACT.layout

  return (
    <VStack gap={sectionGap} width="full">
      {attentionItems.length > 0 && (
        <VStack gap={itemGap} width="full">
          <SectionTitle>지금 필요한 활동</SectionTitle>
          <VStack gap={itemGap} width="full">
            {attentionItems.map((item) => (
              <TradeListRow
                key={item.id}
                item={item}
                onItemClick={onItemClick}
                prefix={
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    style={{ width: HOME_COMPACT.requiredAction.leadingSize, height: HOME_COMPACT.requiredAction.leadingSize }}
                  >
                    <AttentionPrefix action={item.attentionAction} />
                  </Box>
                }
              />
            ))}
          </VStack>
        </VStack>
      )}

      {inProgressItems.length > 0 && (
        <VStack gap={itemGap} width="full">
          <SectionTitle>진행 중인 거래</SectionTitle>
          <VStack gap={itemGap} width="full">
            {inProgressItems.map((item) => (
              <TradeListRow
                key={item.id}
                item={item}
                onItemClick={onItemClick}
                suffix={
                  <HStack align="center" gap="x2">
                    {item.badge && (
                      <Badge tone="brand" variant="weak" size="medium">
                        {item.badge}
                      </Badge>
                    )}
                    <Icon svg={<IconChevronRightLine />} size="x5" color="fg.neutralSubtle" />
                  </HStack>
                }
              />
            ))}
          </VStack>
        </VStack>
      )}
    </VStack>
  )
}
