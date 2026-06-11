import { Text, VStack } from '@seed-design/react'
import { PageBanner } from 'seed-design/ui/page-banner'

export function DesktopSidePanel() {
  return (
    <div className="sticky top-[var(--sticky-header-height)] flex w-full flex-col gap-x6 pt-x6">
      <PageBanner
        tone="informative"
        variant="weak"
        title="모바일에서 더 안전하게 거래해요"
        description="QR 코드를 스캔하면 현재 화면을 모바일에서 이어볼 수 있어요."
      />

      <VStack align="center" className="pl-x4">
        <div
          aria-label="app download qr area"
          className="flex size-[140px] shrink-0 cursor-pointer items-center justify-center rounded-r2 bg-bg-neutral-weak"
        >
          <Text textStyle="t3Regular" color="fg.neutralSubtle" aria-label="app download qr code">
            QR 코드
          </Text>
        </div>
      </VStack>
    </div>
  )
}
