import type { ActivityComponentType } from '@stackflow/react'
import { useStack } from '@stackflow/react'
import { Box, VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'
import { ResultSection } from 'seed-design/ui/result-section'

import { AuthActivityLayout } from '../../features/auth/components/AuthActivityLayout'
import { LottiePlayer } from '../../features/auth/components/LottiePlayer'
import { setAuthStatus } from '../../features/auth/stores/authSession.store'
import { resetSignupDraft } from '../../features/auth/stores/signupDraft.store'
import { actions } from '../../stackflow/stackflow'

const SignupCompleteActivity: ActivityComponentType<'SignupComplete'> = () => {
  const { activities } = useStack()

  const handleStart = () => {
    setAuthStatus('authenticated')
    resetSignupDraft()

    const popCount = Math.max(0, activities.length - 1)
    for (let i = 0; i < popCount; i += 1) {
      actions.pop({ animate: i === popCount - 1 })
    }
  }

  return (
    <AuthActivityLayout
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
              <LottiePlayer src="/lotties/check-blue-spot.json" />
            </Box>
          }
          title="누비에 오신 걸 환영해요"
          description="이제 원하는 거래를 쉽고 안전하게 시작할 수 있어요."
        />
      </VStack>
    </AuthActivityLayout>
  )
}

export default SignupCompleteActivity
