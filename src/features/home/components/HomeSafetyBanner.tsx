import { PageBanner } from 'seed-design/ui/page-banner'

export function HomeSafetyBanner() {
  return (
    <PageBanner
      tone="informative"
      variant="weak"
      title="입금 전 확인해 주세요"
      description="상대 정보와 금액이 맞는지 꼭 확인해요."
    />
  )
}
