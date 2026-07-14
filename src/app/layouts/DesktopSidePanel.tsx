import { Text, VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'
import { PageBanner } from 'seed-design/ui/page-banner'

import { usePwaInstallPrompt } from '../../features/pwa/hooks/usePwaInstallPrompt'
import { getInstallGuideSteps } from '../../features/pwa/services/detectInstallPlatform'

export function DesktopSidePanel() {
  const { deferredPrompt, installApp, isInstalled, isPrompting } = usePwaInstallPrompt()
  const manualSteps = getInstallGuideSteps('desktop')

  if (isInstalled) return null

  return (
    <div className="sticky top-[var(--sticky-header-height)] flex w-full flex-col gap-x6 pt-x6">
      <PageBanner
        tone="informative"
        variant="weak"
        title="PC에서 앱처럼 사용해요"
        description={
          deferredPrompt
            ? '브라우저 앱으로 설치하면 주소창 없이 더 빠르게 거래할 수 있어요.'
            : 'Chrome·Edge 주소창에서도 설치할 수 있어요. 아래 방법을 참고해 주세요.'
        }
      />

      <VStack align="center" gap="x3" className="w-full pl-x4">
        <div className="flex w-full max-w-[280px] flex-col items-center gap-x3 rounded-r3 border border-stroke-neutral-weak bg-bg-layer-default p-x4">
          {deferredPrompt ? (
            <>
              <Text textStyle="t4Regular" color="fg.neutralMuted" style={{ textAlign: 'center' }}>
                설치 버튼을 누르면 브라우저 설치 창이 열려요.
              </Text>
              <ActionButton
                variant="brandSolid"
                className="w-full"
                loading={isPrompting}
                disabled={isPrompting}
                onClick={() => installApp()}
              >
                브라우저 앱 설치하기
              </ActionButton>
            </>
          ) : (
            <>
              <Text textStyle="t4Bold" color="fg.neutral">
                브라우저 앱 설치하기
              </Text>
              <Text textStyle="t4Regular" color="fg.neutralMuted" style={{ textAlign: 'center' }}>
                설치 버튼이 곧 활성화되거나, 주소창 오른쪽 설치 아이콘(⊕)을 이용해 주세요.
              </Text>
              {manualSteps && (
                <VStack gap="x1" width="full">
                  {manualSteps.map((step, index) => (
                    <Text key={step} textStyle="t3Regular" color="fg.neutralSubtle">
                      {index + 1}. {step}
                    </Text>
                  ))}
                </VStack>
              )}
            </>
          )}
        </div>
      </VStack>
    </div>
  )
}
