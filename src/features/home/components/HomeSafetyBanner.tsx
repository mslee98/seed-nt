import { PageBanner } from 'seed-design/ui/page-banner'

export function HomeSafetyBanner() {
  return (
    <PageBanner
      tone="informative"
      variant="weak"
      title="안전 거래 안내"
      description="입금 전 상대 정보와 금액을 다시 확인해 주세요."
    />
  )
}
