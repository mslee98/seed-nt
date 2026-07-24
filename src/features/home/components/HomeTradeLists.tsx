import {
  IconArrowDownLine,
  IconArrowUpLine,
  IconChevronRightLine,
  IconClockLine,
  IconWonCircleArrowRightLine,
} from '@karrotmarket/react-monochrome-icon'
import { Box, Divider, HStack, Icon, Text, VStack } from '@seed-design/react'
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

function ProgressPrefix({ side }: { side?: 'BUY' | 'SELL' }) {
  const isSell = side === 'SELL'
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="full"
      bg={isSell ? 'bg.positiveWeak' : 'bg.informativeWeak'}
      style={{
        width: HOME_COMPACT.requiredAction.leadingSize,
        height: HOME_COMPACT.requiredAction.leadingSize,
      }}
    >
      <Icon
        svg={isSell ? <IconArrowUpLine /> : <IconArrowDownLine />}
        size="x5"
        color={isSell ? 'fg.positive' : 'fg.informative'}
      />
    </Box>
  )
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
      borderRadius={HOME_COMPACT.card.radius}
      boxShadow={HOME_COMPACT.card.shadow}
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

function LeadingSlot({ children }: { children: ReactNode }) {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      style={{
        width: HOME_COMPACT.requiredAction.leadingSize,
        height: HOME_COMPACT.requiredAction.leadingSize,
      }}
    >
      {children}
    </Box>
  )
}

/** compact 행 — 섹션 카드 안에서 Divider로 구분 */
function TradeListRow({
  item,
  onItemClick,
  prefix,
  showDivider,
}: {
  item: HomeTradeListItem
  onItemClick: (item: HomeTradeListItem) => void
  prefix?: ReactNode
  showDivider?: boolean
}) {
  const t = HOME_TYPOGRAPHY
  const ra = HOME_COMPACT.requiredAction

  return (
    <>
      {showDivider && (
        <Divider
          as="div"
          aria-hidden
          orientation="horizontal"
          thickness={1}
          color="stroke.neutralMuted"
        />
      )}
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
            <VStack gap="x0_5" style={{ minWidth: 0 }}>
              <Text textStyle={t.taskStatus} color="fg.neutral">
                {item.meta}
              </Text>
              {item.detail && (
                <Text textStyle={t.taskDesc} color="fg.neutralMuted">
                  {item.detail}
                </Text>
              )}
            </VStack>
          )}
        </VStack>
        <Icon svg={<IconChevronRightLine />} size="x5" color="fg.neutralSubtle" />
      </PressableScale>
    </>
  )
}

function TradeListSection({
  title,
  items,
  onItemClick,
  variant,
}: {
  title: string
  items: HomeTradeListItem[]
  onItemClick: (item: HomeTradeListItem) => void
  variant: 'attention' | 'inProgress'
}) {
  if (items.length === 0) return null

  const { itemGap } = HOME_COMPACT.layout

  return (
    <VStack gap={itemGap} width="full">
      <SectionTitle>{title}</SectionTitle>
      <ListCard>
        {items.map((item, index) => (
          <TradeListRow
            key={item.id}
            item={item}
            onItemClick={onItemClick}
            showDivider={index > 0}
            prefix={
              variant === 'attention' ? (
                <LeadingSlot>
                  <AttentionPrefix action={item.attentionAction} />
                </LeadingSlot>
              ) : (
                <ProgressPrefix side={item.progressSide} />
              )
            }
          />
        ))}
      </ListCard>
    </VStack>
  )
}

/** 홈 — 지금 필요한 활동 / 진행 중인 거래 (섹션당 단일 리스트 카드) */
export function HomeTradeLists({
  attentionItems,
  inProgressItems,
  onItemClick,
}: HomeTradeListsProps) {
  if (attentionItems.length === 0 && inProgressItems.length === 0) {
    return null
  }

  const { sectionGap } = HOME_COMPACT.layout

  return (
    <VStack gap={sectionGap} width="full">
      <TradeListSection
        title="지금 필요한 활동"
        items={attentionItems}
        onItemClick={onItemClick}
        variant="attention"
      />
      <TradeListSection
        title="진행 중인 거래"
        items={inProgressItems}
        onItemClick={onItemClick}
        variant="inProgress"
      />
    </VStack>
  )
}
