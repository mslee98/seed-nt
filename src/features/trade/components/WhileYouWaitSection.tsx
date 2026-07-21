import { IconChevronRightLine } from '@karrotmarket/react-monochrome-icon'
import { Icon, Text, VStack } from '@seed-design/react'
import { List, ListButtonItem } from 'seed-design/ui/list'

import { WHILE_YOU_WAIT_COPY } from '../../pwa/constants/pushNotificationCopy'

interface WhileYouWaitSectionProps {
  onStoreClick: () => void
  onCommunityClick: () => void
}

export function WhileYouWaitSection({ onStoreClick, onCommunityClick }: WhileYouWaitSectionProps) {
  return (
    <VStack gap="x3" width="full">
      <VStack gap="x1">
        <Text textStyle="t7Bold" color="fg.neutral">
          {WHILE_YOU_WAIT_COPY.title}
        </Text>
        <Text textStyle="t3Regular" color="fg.neutralMuted">
          {WHILE_YOU_WAIT_COPY.description}
        </Text>
      </VStack>

      <List>
        <ListButtonItem
          title="Brit 스토어 구경하기"
          detail="기프티콘·상품권을 미리 둘러보세요"
          suffix={<Icon svg={<IconChevronRightLine />} size="x5" color="fg.neutralSubtle" />}
          onClick={onStoreClick}
        />
        <ListButtonItem
          title="커뮤니티 둘러보기"
          detail="거래 팁과 소식을 확인해 보세요"
          suffix={<Icon svg={<IconChevronRightLine />} size="x5" color="fg.neutralSubtle" />}
          onClick={onCommunityClick}
        />
      </List>
    </VStack>
  )
}
