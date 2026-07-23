import { useCallback, useMemo, useRef, useState } from 'react'
import { Text, VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'

import type { Institution } from '../../data/institutions'
import { useBanks } from '../../hooks/useBanks'
import { InstitutionGrid } from './InstitutionGrid'
import { InstitutionNotFoundSheet } from './InstitutionNotFoundSheet'
import { TextLinkButton } from '../../../../shared/components/TextLinkButton'

const SELECT_FEEDBACK_MS = 180

interface InstitutionSelectPanelProps {
  onSelect: (institution: Institution) => void
}

export function InstitutionSelectPanel({ onSelect }: InstitutionSelectPanelProps) {
  const { banks, isLoading, error, reload } = useBanks()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [notFoundSheetOpen, setNotFoundSheetOpen] = useState(false)
  const isNavigatingRef = useRef(false)

  const searchableBanks = useMemo(
    () => banks.filter((bank) => !bank.disabled),
    [banks],
  )

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
      <VStack gap="x0" flexGrow style={{ minHeight: 0, overflow: 'auto' }}>
        <VStack px="spacingX.globalGutter" pt="x4" pb="x3" gap="spacingY.betweenText">
          <Text textStyle="screenTitle" color="fg.neutral">
            어느 은행 계좌인가요?
          </Text>
          <Text textStyle="t3Regular" color="fg.neutralMuted">
            계좌가 있는 은행을 선택해 주세요.
          </Text>
        </VStack>

        {isLoading ? (
          <VStack px="spacingX.globalGutter" py="x8" align="center">
            <Text textStyle="t4Regular" color="fg.neutralMuted">
              은행 목록을 불러오는 중이에요
            </Text>
          </VStack>
        ) : error ? (
          <VStack px="spacingX.globalGutter" py="x8" gap="x4" align="center">
            <Text textStyle="t4Regular" color="fg.neutralMuted" align="center">
              은행 목록을 불러오지 못했어요
            </Text>
            <ActionButton size="small" variant="neutralWeak" onClick={() => void reload()}>
              다시 불러오기
            </ActionButton>
          </VStack>
        ) : (
          <>
            <InstitutionGrid
              items={banks}
              selectedId={selectedId}
              onSelect={handleSelect}
            />

            <VStack px="spacingX.globalGutter" pb="x6" align="center">
              <TextLinkButton onClick={() => setNotFoundSheetOpen(true)}>
                찾는 은행이 없어요
              </TextLinkButton>
            </VStack>
          </>
        )}
      </VStack>

      <InstitutionNotFoundSheet
        open={notFoundSheetOpen}
        institutions={searchableBanks}
        onOpenChange={setNotFoundSheetOpen}
        onSelect={handleSelect}
      />
    </>
  )
}
