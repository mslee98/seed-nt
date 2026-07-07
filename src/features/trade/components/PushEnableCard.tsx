import { IconBellLine } from '@karrotmarket/react-monochrome-icon'
import { Text, VStack } from '@seed-design/react'
import { useState } from 'react'
import { ActionButton } from 'seed-design/ui/action-button'
import { Callout } from 'seed-design/ui/callout'

import type { PushEligibility } from '../../pwa/constants/pushNotificationCopy'
import { PUSH_ENABLE_COPY } from '../../pwa/constants/pushNotificationCopy'

interface PushEnableCardProps {
  eligibility: PushEligibility
  onRequestPermission: () => Promise<PushEligibility>
}

export function PushEnableCard({ eligibility, onRequestPermission }: PushEnableCardProps) {
  const [loading, setLoading] = useState(false)

  if (eligibility === 'ready') {
    return null
  }

  const handleClick = async () => {
    setLoading(true)
    try {
      await onRequestPermission()
    } finally {
      setLoading(false)
    }
  }

  if (eligibility === 'denied') {
    return (
      <Callout
        tone="warning"
        prefixIcon={<IconBellLine />}
        description={PUSH_ENABLE_COPY.denied}
      />
    )
  }

  return (
    <VStack gap="x3" align="center">
      <Text textStyle="t4Regular" color="fg.neutralMuted" style={{ textAlign: 'center' }}>
        {PUSH_ENABLE_COPY.title}
      </Text>
      <ActionButton
        size="medium"
        variant="neutralWeak"
        loading={loading}
        onClick={handleClick}
      >
        {PUSH_ENABLE_COPY.cta}
      </ActionButton>
    </VStack>
  )
}
