import type { ActivityComponentType } from '@stackflow/react'
import { useStack } from '@stackflow/react'
import { Box, VStack } from '@seed-design/react'
import { BottomActionButton } from '../../shared/ui/BottomActionButton'
import { ResultSection } from 'seed-design/ui/result-section'

import { ActivityScreenLayout } from '../../app/layouts/ActivityScreenLayout'
import { LOTTIE_ASSETS } from '../../assets/lottie/lottieRegistry'
import { LottiePlayer } from '../../shared/components/LottiePlayer'
import { RESULT_HERO_LOTTIE_SIZE } from '../../shared/constants/motion'
import { setAuthStatus } from '../../features/auth/stores/authSession.store'
import { resetSignupDraft } from '../../features/auth/stores/signupDraft.store'
import { resetSignupSecrets } from '../../features/auth/stores/signupSecrets.store'
import { actions } from '../../stackflow/stackflow'
import { navigateToRootHome } from '../../stackflow/navigateToRootHome'

const SIGNUP_COMPLETE_LOTTIE = LOTTIE_ASSETS.success

const SignupCompleteActivity: ActivityComponentType<'SignupComplete'> = () => {
  const { activities } = useStack()

  const finishSignup = () => {
    setAuthStatus('authenticated')
    resetSignupDraft()
    resetSignupSecrets()
    navigateToRootHome(activities.length)
  }

  const handleStart = () => {
    finishSignup()
  }

  const handlePasskeySettings = () => {
    finishSignup()
    window.setTimeout(() => {
      actions.push('SecuritySettings', {})
    }, 50)
  }

  return (
    <ActivityScreenLayout
      showAppBar={false}
      appScreenProps={{ preventSwipeBack: true, transitionStyle: 'fadeIn' }}
      bottomCTABehavior="fixed"
      fixedBottom={
        <VStack gap="x2" px="spacingX.globalGutter" pb="x4">
          <BottomActionButton size="large" variant="brandSolid" onClick={handleStart}>
            거래 시작하기
          </BottomActionButton>
          <BottomActionButton size="large" variant="neutralWeak" onClick={handlePasskeySettings}>
            패스키 설정하기
          </BottomActionButton>
        </VStack>
      }
    >
      <VStack flexGrow justify="center" minHeight="full">
        <ResultSection
          asset={
            <Box pb="x4" display="flex" justifyContent="center">
              <LottiePlayer animationData={SIGNUP_COMPLETE_LOTTIE} size={RESULT_HERO_LOTTIE_SIZE} />
            </Box>
          }
          title="Brit에 오신 걸 환영해요"
          description="이제 원하는 거래를 쉽고 안전하게 시작할 수 있어요. 패스키는 설정에서 언제든 등록할 수 있어요."
        />
      </VStack>
    </ActivityScreenLayout>
  )
}

export default SignupCompleteActivity
