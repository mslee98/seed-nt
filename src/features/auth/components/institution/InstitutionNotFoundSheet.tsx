import { useEffect, useMemo, useRef, useState } from 'react'
import { useActivityZIndexBase } from '@seed-design/stackflow'
import { Box, Portal, VStack } from '@seed-design/react'

import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetRoot,
} from 'seed-design/ui/bottom-sheet'
import { List, ListButtonItem } from 'seed-design/ui/list'
import { TextField, TextFieldInput } from 'seed-design/ui/text-field'

import { useLayoutOverlay } from '../../../../app/layouts/useLayoutOverlay'
import type { Institution } from '../../data/institutions'
import { getInstitutionIconUrl } from '../../utils/institutionIcons'

interface InstitutionNotFoundSheetProps {
  open: boolean
  institutions: Institution[]
  onOpenChange: (open: boolean) => void
  onSelect: (institution: Institution) => void
}

export function InstitutionNotFoundSheet({
  open,
  institutions,
  onOpenChange,
  onSelect,
}: InstitutionNotFoundSheetProps) {
  const portalContainerRef = useRef<HTMLElement | null>(
    typeof document !== 'undefined' ? document.getElementById('app-frame-portal') : null,
  )
  const layerIndex = useActivityZIndexBase({ activityOffset: 1 })
  const [query, setQuery] = useState('')

  useLayoutOverlay(open)

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  const filteredInstitutions = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return institutions
    return institutions.filter((item) => item.name.toLowerCase().includes(normalized))
  }, [institutions, query])

  return (
    <BottomSheetRoot open={open} onOpenChange={onOpenChange}>
      <Portal container={portalContainerRef}>
        <BottomSheetContent
          title="찾는 은행이 없나요?"
          description="은행 이름을 검색하거나 목록에서 선택해 주세요."
          layerIndex={layerIndex}
          showHandle
        >
          <BottomSheetBody>
            <VStack gap="x4">
              <TextField
                label="은행 이름 검색"
                labelVisuallyHidden
                value={query}
                onValueChange={({ value }) => setQuery(value)}
              >
                <TextFieldInput placeholder="은행 이름 검색" />
              </TextField>
              <List>
                {filteredInstitutions.map((institution) => {
                  const iconUrl = institution.iconUrl || getInstitutionIconUrl(institution.iconKey)

                  return (
                    <ListButtonItem
                      key={institution.id}
                      title={institution.name}
                      prefix={
                        iconUrl ? (
                          <Box
                            width="x6"
                            height="x6"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <img
                              src={iconUrl}
                              alt=""
                              width={24}
                              height={24}
                              style={{ objectFit: 'contain' }}
                            />
                          </Box>
                        ) : undefined
                      }
                      onClick={() => {
                        onSelect(institution)
                        onOpenChange(false)
                      }}
                    />
                  )
                })}
              </List>
            </VStack>
          </BottomSheetBody>
        </BottomSheetContent>
      </Portal>
    </BottomSheetRoot>
  )
}
