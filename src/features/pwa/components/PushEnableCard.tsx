import { IconBellFill } from '@karrotmarket/react-monochrome-icon'
import { Box, HStack, Icon, Text, VStack } from '@seed-design/react'
import { useState } from 'react'
import { Callout } from 'seed-design/ui/callout'

import { TextLinkButton } from '../../../shared/components/TextLinkButton'
import type { PushEligibility } from '../constants/pushNotificationCopy'
import { PUSH_ENABLE_COPY } from '../constants/pushNotificationCopy'

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
        prefixIcon={<IconBellFill />}
        description={PUSH_ENABLE_COPY.denied}
      />
    )
  }

  return (
    <HStack
      width="full"
      gap="x3"
      align="center"
      p="x3"
      bg="bg.neutralWeak"
      borderRadius="r3"
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="x10"
        height="x10"
        borderRadius="full"
        bg="bg.brandWeak"
        flexShrink={0}
      >
        <Icon svg={<IconBellFill />} size="x5" color="fg.brand" />
      </Box>
      <VStack gap="x0_5" align="flex-start" flexGrow minWidth="0">
        <Text textStyle="t5Bold" color="fg.neutral">
          {PUSH_ENABLE_COPY.title}
        </Text>
        <Text textStyle="t3Regular" color="fg.neutralMuted">
          {PUSH_ENABLE_COPY.description}
        </Text>
      </VStack>
      <Box flexShrink={0}>
        <TextLinkButton onClick={handleClick} disabled={loading}>
          {PUSH_ENABLE_COPY.cta}
        </TextLinkButton>
      </Box>
    </HStack>
  )
}
