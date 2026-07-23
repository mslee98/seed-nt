import { Grid, VStack } from '@seed-design/react'

import type { Institution } from '../../data/institutions'
import { InstitutionTile } from './InstitutionTile'

interface InstitutionGridProps {
  items: Institution[]
  selectedId?: string | null
  onSelect: (institution: Institution) => void
}

export function InstitutionGrid({ items, selectedId, onSelect }: InstitutionGridProps) {
  return (
    <VStack
      role="radiogroup"
      aria-label="은행 선택"
      px="spacingX.globalGutter"
      py="x4"
      gap="x4"
    >
      <Grid columns={3} gap="x3" width="full">
        {items.map((institution) => (
          <InstitutionTile
            key={institution.id}
            institution={institution}
            selected={selectedId === institution.id}
            onSelect={onSelect}
          />
        ))}
      </Grid>
    </VStack>
  )
}
