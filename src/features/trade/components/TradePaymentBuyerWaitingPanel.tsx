import { Badge, VStack } from '@seed-design/react'
import { PageBanner } from 'seed-design/ui/page-banner'

import {
  getPaymentReportedBuyerDescription,
  getPaymentReportedBuyerTitle,
} from '../utils/paymentCopy'

export function TradePaymentBuyerWaitingPanel() {
  return (
    <VStack gap="x4" width="full">
      <Badge tone="warning" variant="weak" size="medium">
        확인 대기
      </Badge>
      <PageBanner
        tone="informative"
        variant="weak"
        title={getPaymentReportedBuyerTitle()}
        description={getPaymentReportedBuyerDescription()}
      />
    </VStack>
  )
}
