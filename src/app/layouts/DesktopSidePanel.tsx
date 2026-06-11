import { HStack, Text } from '@seed-design/react'
import { PageBanner } from 'seed-design/ui/page-banner'

export function DesktopSidePanel() {
  return (
    <div className="h-full pt-[150px]">
      <div
        className="fixed flex w-[344px] flex-col gap-x8"
        aria-label="download banner"
      >
        <PageBanner
          tone="positive"
          variant="weak"
          title="안전한 거래를 위해"
          description="당근 앱에서 QR 코드를 스캔하면 모바일과 동일한 환경에서 거래할 수 있어요."
        />

        <HStack justify="space-between" align="center" className="pl-x4">
          <Text textStyle="t5Bold" color="fg.neutral" className="flex-1 whitespace-pre-line">
            앱에서 스캔하면{'\n'}모바일과 동일하게
          </Text>
          <div
            aria-label="app download qr area"
            className="flex size-[140px] shrink-0 cursor-pointer items-center justify-center rounded-r2 bg-bg-neutral-weak"
          >
            <Text textStyle="t3Regular" color="fg.neutralSubtle" aria-label="app download qr code">
              QR 코드
            </Text>
          </div>
        </HStack>
      </div>
    </div>
  )
}
