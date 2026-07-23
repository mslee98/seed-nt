/**
 * SignupAuthActivity
 *
 * 책임: 로그인 비번·닉네임·패스키 UI 조립
 * 비책임: 가입 orchestration (→ useSignupAuthFlow)
 */
import type { ActivityComponentType } from '@stackflow/react'
import { Text, VStack } from '@seed-design/react'
import { TextField, TextFieldInput } from 'seed-design/ui/text-field'

import { ActivityScreenLayout } from '../../app/layouts/ActivityScreenLayout'
import { SignupProgressHeader } from '../../features/auth/components/SignupProgressBar'
import { useSignupAuthFlow } from '../../features/auth/hooks/useSignupAuthFlow'
import { NICKNAME_MAX_LENGTH } from '../../features/auth/constants'
import { BottomActionButton } from '../../shared/ui/BottomActionButton'

const SignupAuthActivity: ActivityComponentType<'SignupAuth'> = () => {
  const screen = useSignupAuthFlow()

  if (screen.step === 'passkey') {
    return (
      <ActivityScreenLayout
        title="패스키"
        onBack={screen.handleStepBack}
        progress={<SignupProgressHeader type="auth" step="passkey" />}
        bottomCTABehavior="fixed"
        fixedBottom={
          <VStack gap="x2" px="spacingX.globalGutter" pb="x4">
            <BottomActionButton
              size="large"
              variant="brandSolid"
              loading={screen.isRegisteringPasskey}
              onClick={() => void screen.handleRegisterPasskey()}
            >
              패스키 등록하기
            </BottomActionButton>
            <BottomActionButton
              size="large"
              variant="neutralWeak"
              onClick={() => void screen.handleSkipPasskey()}
            >
              나중에 설정하기
            </BottomActionButton>
          </VStack>
        }
      >
        <VStack px="spacingX.globalGutter" py="x4" gap="spacingY.betweenText">
          <Text textStyle="screenTitle" color="fg.neutral">
            {screen.copy.title}
          </Text>
          <Text textStyle="t3Regular" color="fg.neutralMuted">
            {screen.copy.description}
          </Text>
        </VStack>
      </ActivityScreenLayout>
    )
  }

  if (screen.step === 'nickname') {
    return (
      <ActivityScreenLayout
        title="닉네임"
        onBack={screen.handleStepBack}
        progress={<SignupProgressHeader type="auth" step="nickname" />}
        bottomCTABehavior="fixed"
        fixedBottom={
          <BottomActionButton
            size="large"
            variant="brandSolid"
            disabled={!screen.canSubmitNickname}
            loading={screen.isSubmitting}
            onClick={() => void screen.handleNicknameSubmit()}
          >
            계정 만들기
          </BottomActionButton>
        }
      >
        <VStack
          px="spacingX.globalGutter"
          py="x4"
          gap="x6"
        >
          <VStack gap="spacingY.betweenText">
            <Text textStyle="screenTitle" color="fg.neutral">
              {screen.copy.title}
            </Text>
            <Text textStyle="t3Regular" color="fg.neutralMuted">
              {screen.copy.description}
            </Text>
          </VStack>
          <TextField
            label="닉네임"
            maxGraphemeCount={NICKNAME_MAX_LENGTH}
            value={screen.nickname}
            onValueChange={({ value }) => screen.setNickname(value)}
          >
            <TextFieldInput placeholder="브릿러4821" autoComplete="nickname" />
          </TextField>
        </VStack>
      </ActivityScreenLayout>
    )
  }

  return (
    <ActivityScreenLayout
      title="로그인 비밀번호"
      onBack={screen.handleStepBack}
      progress={<SignupProgressHeader type="auth" step="password" />}
      bottomCTABehavior="fixed"
      fixedBottom={
        <BottomActionButton
          size="large"
          variant="brandSolid"
          disabled={!screen.canSubmitPassword}
          onClick={() => screen.handlePasswordNext()}
        >
          다음
        </BottomActionButton>
      }
    >
      <VStack px="spacingX.globalGutter" py="x4" gap="x6">
        <VStack gap="spacingY.betweenText">
          <Text textStyle="screenTitle" color="fg.neutral">
            {screen.copy.title}
          </Text>
          <Text textStyle="t3Regular" color="fg.neutralMuted">
            {screen.copy.description}
          </Text>
        </VStack>
        <TextField
          label="로그인 비밀번호"
          description="영문·숫자 포함 8자 이상"
          value={screen.password}
          onValueChange={({ value }) => screen.setPassword(value)}
        >
          <TextFieldInput type="password" autoComplete="new-password" placeholder="비밀번호" />
        </TextField>
        <TextField
          label="비밀번호 확인"
          value={screen.passwordConfirm}
          onValueChange={({ value }) => screen.setPasswordConfirm(value)}
        >
          <TextFieldInput
            type="password"
            autoComplete="new-password"
            placeholder="비밀번호 다시 입력"
          />
        </TextField>
      </VStack>
    </ActivityScreenLayout>
  )
}

export default SignupAuthActivity
