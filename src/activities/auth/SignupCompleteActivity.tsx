import type { ActivityComponentType } from '@stackflow/react'
import { useStack } from '@stackflow/react'
import { Box, VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'
import { ResultSection } from 'seed-design/ui/result-section'

import { ActivityScreenLayout } from '../../app/layouts/ActivityScreenLayout'
import { LottiePlayer } from '../../shared/components/LottiePlayer'
import { setAuthStatus } from '../../features/auth/stores/authSession.store'
import { resetSignupDraft } from '../../features/auth/stores/signupDraft.store'
import { actions } from '../../stackflow/stackflow'

const SIGNUP_COMPLETE_LOTTIE = '/lotties/Success.json'

const SignupCompleteActivity: ActivityComponentType<'SignupComplete'> = () => {
  const { activities } = useStack()

  const handleStart = () => {
    setAuthStatus('authenticated')
    resetSignupDraft()

    const popCount = Math.max(0, activities.length - 1)
    if (popCount > 0) {
      actions.pop(popCount, { animate: false })
    }
    actions.replace('Home', {}, { animate: true })
  }

  return (
    <ActivityScreenLayout
      showAppBar={false}
      appScreenProps={{ preventSwipeBack: true, transitionStyle: 'fadeIn' }}
      fixedBottom={
        <ActionButton size="large" variant="brandSolid" onClick={handleStart}>
          거래 시작하기
        </ActionButton>
      }
    >
      <VStack flexGrow justify="center" minHeight="full">
        <ResultSection
          asset={
            <Box pb="x4" display="flex" justifyContent="center">
              <LottiePlayer src={SIGNUP_COMPLETE_LOTTIE} size={240} />
            </Box>
          }
          title="Brit에 오신 걸 환영해요"
          description="이제 원하는 거래를 쉽고 안전하게 시작할 수 있어요."
        />
      </VStack>
    </ActivityScreenLayout>
  )
}

export default SignupCompleteActivity
