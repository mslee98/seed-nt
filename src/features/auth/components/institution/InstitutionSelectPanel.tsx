import { useCallback, useRef, useState } from 'react'
import { Text, VStack } from '@seed-design/react'

import {
  TabsCarousel,
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from 'seed-design/ui/tabs'

import type { FinanceCategory, Institution } from '../../data/institutions'
import { FINANCE_CATEGORY_LABELS, getFeaturedInstitutions } from '../../data/institutions'
import { InstitutionGrid } from './InstitutionGrid'
import { InstitutionNotFoundSheet } from './InstitutionNotFoundSheet'
import { TextLinkButton } from '../../../../shared/components/TextLinkButton'

const FINANCE_CATEGORIES: FinanceCategory[] = ['bank', 'securities', 'insurance']

const SELECT_FEEDBACK_MS = 180

interface InstitutionSelectPanelProps {
  onSelect: (institution: Institution) => void
}

export function InstitutionSelectPanel({ onSelect }: InstitutionSelectPanelProps) {
  const [category, setCategory] = useState<FinanceCategory>('bank')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [notFoundSheetOpen, setNotFoundSheetOpen] = useState(false)
  const isNavigatingRef = useRef(false)

  const handleSelect = useCallback(
    (institution: Institution) => {
      if (isNavigatingRef.current || institution.disabled) return

      isNavigatingRef.current = true
      setSelectedId(institution.id)

      window.setTimeout(() => {
        onSelect(institution)
        isNavigatingRef.current = false
      }, SELECT_FEEDBACK_MS)
    },
    [onSelect],
  )

  return (
    <>
      <VStack gap="x0" flexGrow style={{ minHeight: 0 }}>
        <VStack px="spacingX.globalGutter" pt="x4" pb="x3" gap="spacingY.betweenText">
          <Text textStyle="t6Bold" color="fg.neutral">
            어느 금융기관 계좌인가요?
          </Text>
          <Text textStyle="t5Regular" color="fg.neutralMuted">
            계좌가 있는 기관을 선택해 주세요.
          </Text>
        </VStack>

        <TabsRoot
          value={category}
          onValueChange={(value) => setCategory(value as FinanceCategory)}
          triggerLayout="fill"
          size="medium"
          stickyList
          style={{ minHeight: 0, flex: 1, display: 'flex', flexDirection: 'column' }}
        >
          <TabsList aria-label="금융기관 카테고리">
            {FINANCE_CATEGORIES.map((value) => (
              <TabsTrigger key={value} value={value}>
                {FINANCE_CATEGORY_LABELS[value]}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsCarousel style={{ minHeight: 0, flex: 1, overflow: 'auto' }}>
            {FINANCE_CATEGORIES.map((value) => (
              <TabsContent key={value} value={value}>
                <InstitutionGrid
                  items={getFeaturedInstitutions(value)}
                  selectedId={selectedId}
                  onSelect={handleSelect}
                />

                <VStack px="spacingX.globalGutter" pb="x6" align="center">
                  <TextLinkButton onClick={() => setNotFoundSheetOpen(true)}>
                    찾는 기관이 없어요
                  </TextLinkButton>
                </VStack>
              </TabsContent>
            ))}
          </TabsCarousel>
        </TabsRoot>
      </VStack>

      <InstitutionNotFoundSheet
        open={notFoundSheetOpen}
        category={category}
        onOpenChange={setNotFoundSheetOpen}
        onSelect={handleSelect}
      />
    </>
  )
}
