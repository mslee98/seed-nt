import { useRef } from 'react'
import { useActivityZIndexBase } from '@seed-design/stackflow'
import { Portal } from '@seed-design/react'

import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetRoot,
} from 'seed-design/ui/bottom-sheet'
import { RadioGroup, RadioGroupItem } from 'seed-design/ui/radio-group'

import { useLayoutOverlay } from '../../../app/layouts/useLayoutOverlay'
import { CARRIERS, type CarrierCode } from '../constants'

interface CarrierSelectSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: CarrierCode | ''
  onSelect: (carrier: CarrierCode) => void
}

export function CarrierSelectSheet({
  open,
  onOpenChange,
  value,
  onSelect,
}: CarrierSelectSheetProps) {
  const portalContainerRef = useRef<HTMLElement | null>(
    typeof document !== 'undefined' ? document.getElementById('app-frame-portal') : null,
  )
  const layerIndex = useActivityZIndexBase({ activityOffset: 1 })

  useLayoutOverlay(open)

  return (
    <BottomSheetRoot open={open} onOpenChange={onOpenChange}>
      <Portal container={portalContainerRef}>
        <BottomSheetContent
          title="통신사를 선택해 주세요"
          layerIndex={layerIndex}
          showHandle
        >
          <BottomSheetBody>
            <RadioGroup
              value={value}
              onValueChange={(v) => {
                onSelect(v as CarrierCode)
                onOpenChange(false)
              }}
              aria-label="통신사 선택"
            >
              {CARRIERS.map((carrier) => (
                <RadioGroupItem
                  key={carrier.code}
                  value={carrier.code}
                  label={carrier.label}
                  tone="neutral"
                  size="large"
                />
              ))}
            </RadioGroup>
          </BottomSheetBody>
        </BottomSheetContent>
      </Portal>
    </BottomSheetRoot>
  )
}
