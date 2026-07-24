import { IconXmarkLine } from '@karrotmarket/react-monochrome-icon'
import { Box, HStack, Icon, Text } from '@seed-design/react'
import { useCallback, useState } from 'react'
import { ActionButton } from 'seed-design/ui/action-button'

import { usePwaInstallPrompt } from '../hooks/usePwaInstallPrompt'
import { useIsDesktopViewport } from '../../../app/layouts/useIsDesktopViewport'
import { needsManualInstallGuide } from '../services/detectInstallPlatform'
import { dismissInstallBanner, shouldShowInstallBanner } from '../services/installBannerStorage'
import { InstallGuideBottomSheet } from './InstallGuideBottomSheet'

export function HomeInstallBanner() {
  const isDesktop = useIsDesktopViewport()
  const { deferredPrompt, installApp, clearPrompt, isInstalled, isPrompting } = usePwaInstallPrompt()
  const [visible, setVisible] = useState(shouldShowInstallBanner)
  const [guideOpen, setGuideOpen] = useState(false)
  const manualGuide = needsManualInstallGuide()

  const showA2hsBanner = Boolean(deferredPrompt) && !isInstalled && visible
  const showManualBanner = manualGuide && !deferredPrompt && !isInstalled && visible
  const showBanner = showA2hsBanner || showManualBanner

  const hideManualBanner = useCallback(() => {
    dismissInstallBanner()
    setVisible(false)
  }, [])

  const handleDismiss = useCallback(() => {
    if (showA2hsBanner) {
      clearPrompt()
      return
    }

    hideManualBanner()
  }, [clearPrompt, hideManualBanner, showA2hsBanner])

  const handleInstallClick = useCallback(async () => {
    if (showA2hsBanner) {
      await installApp()
      return
    }

    setGuideOpen(true)
  }, [installApp, showA2hsBanner])

  if (isDesktop) return null

  if (!showBanner && !guideOpen) return null

  return (
    <>
      {showBanner && (
        <HStack
          className="home-install-banner"
          align="center"
          justify="space-between"
          gap="x3"
          px="spacingX.globalGutter"
          py="x2"
        >
          <Box
            as="button"
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="40px"
            height="40px"
            borderRadius="r2"
            color="fg.neutralSubtle"
            aria-label="설치 배너 닫기"
            onClick={handleDismiss}
          >
            <Icon svg={<IconXmarkLine />} size="x4" />
          </Box>

          <Box flexGrow style={{ minWidth: 0 }}>
            <Text textStyle="t4Bold" color="fg.neutral">
              앱으로 더 빠르게 거래해요
            </Text>
          </Box>

          <ActionButton
            size="small"
            variant="brandSolid"
            loading={isPrompting}
            disabled={isPrompting}
            onClick={handleInstallClick}
          >
            {showA2hsBanner ? '앱 설치' : '설치 방법'}
          </ActionButton>
        </HStack>
      )}

      {manualGuide && (
        <InstallGuideBottomSheet open={guideOpen} onOpenChange={setGuideOpen} />
      )}
    </>
  )
}
