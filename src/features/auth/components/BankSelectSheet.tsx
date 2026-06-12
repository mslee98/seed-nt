import { useEffect, useMemo, useRef, useState } from 'react'
import { useActivityZIndexBase } from '@seed-design/stackflow'
import { Portal, VStack } from '@seed-design/react'

import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetRoot,
} from 'seed-design/ui/bottom-sheet'
import { List, ListButtonItem } from 'seed-design/ui/list'
import { TextField, TextFieldInput } from 'seed-design/ui/text-field'

import { useLayoutOverlay } from '../../../app/layouts/useLayoutOverlay'
import { BANKS, type BankOption } from '../constants'

interface BankSelectSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (bank: BankOption) => void
}

export function BankSelectSheet({ open, onOpenChange, onSelect }: BankSelectSheetProps) {
  const portalContainerRef = useRef<HTMLElement | null>(
    typeof document !== 'undefined' ? document.getElementById('app-frame-portal') : null,
  )
  const layerIndex = useActivityZIndexBase({ activityOffset: 1 })
  const [query, setQuery] = useState('')

  useLayoutOverlay(open)

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  const filteredBanks = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return BANKS
    return BANKS.filter((bank) => bank.name.toLowerCase().includes(q))
  }, [query])

  return (
    <BottomSheetRoot open={open} onOpenChange={onOpenChange}>
      <Portal container={portalContainerRef}>
        <BottomSheetContent title="은행을 선택해 주세요" layerIndex={layerIndex} showHandle>
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
                {filteredBanks.map((bank) => (
                  <ListButtonItem
                    key={bank.code}
                    title={bank.name}
                    onClick={() => {
                      onSelect(bank)
                      onOpenChange(false)
                    }}
                  />
                ))}
              </List>
            </VStack>
          </BottomSheetBody>
        </BottomSheetContent>
      </Portal>
    </BottomSheetRoot>
  )
}
