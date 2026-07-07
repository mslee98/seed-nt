import { Text, VStack } from '@seed-design/react'
import { PageBanner } from 'seed-design/ui/page-banner'

const COPY = {
  store: {
    title: 'Brit 스토어',
    description: '기프티콘·상품권을 MS로 구매할 수 있어요. (준비 중)',
    banner: '매칭이 완료되면 알림으로 알려드릴게요.',
  },
  community: {
    title: '커뮤니티',
    description: '거래 팁과 Brit 소식을 나누는 공간이에요. (준비 중)',
    banner: '매칭이 완료되면 알림으로 알려드릴게요.',
  },
} as const

interface DiscoveryPlaceholderScreenProps {
  variant: keyof typeof COPY
}

export function DiscoveryPlaceholderScreen({ variant }: DiscoveryPlaceholderScreenProps) {
  const copy = COPY[variant]

  return (
    <VStack
      px="spacingX.globalGutter"
      pt="spacingY.navToTitle"
      pb="spacingY.screenBottom"
      gap="x6"
    >
      <VStack gap="spacingY.betweenText">
        <Text textStyle="screenTitle" color="fg.neutral">
          {copy.title}
        </Text>
        <Text textStyle="t5Regular" color="fg.neutralMuted">
          {copy.description}
        </Text>
      </VStack>
      <PageBanner
        tone="informative"
        variant="weak"
        title={copy.banner}
        description="앱을 나가도 알림으로 매칭 소식을 받을 수 있어요."
      />
    </VStack>
  )
}
