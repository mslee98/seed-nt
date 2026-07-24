/**
 * SignupCredentialsActivity
 *
 * 책임: 닉네임·로그인 비밀번호 UI (제출 없음)
 */
import type { ActivityComponentType } from '@stackflow/react'
import { Text, VStack } from '@seed-design/react'
import { TextField, TextFieldInput } from 'seed-design/ui/text-field'

import { ActivityScreenLayout } from '../../app/layouts/ActivityScreenLayout'
import { SignupProgressHeader } from '../../features/auth/components/SignupProgressBar'
import { useSignupCredentialsFlow } from '../../features/auth/hooks/useSignupCredentialsFlow'
import { NICKNAME_MAX_LENGTH } from '../../features/auth/constants'
import { BottomActionButton } from '../../shared/ui/BottomActionButton'

const SignupCredentialsActivity: ActivityComponentType<'SignupCredentials'> = () => {
  const screen = useSignupCredentialsFlow()

  if (screen.step === 'password') {
    return (
      <ActivityScreenLayout
        title="로그인 비밀번호"
        onBack={screen.handleStepBack}
        progress={<SignupProgressHeader type="credentials" step="password" />}
        bottomCTABehavior="fixed"
        fixedBottom={
          <BottomActionButton
            size="large"
            variant="brandSolid"
            disabled={!screen.canSubmitPassword}
            onClick={screen.handlePasswordNext}
          >
            거래 PIN 만들기
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

  return (
    <ActivityScreenLayout
      title="닉네임"
      onBack={screen.handleStepBack}
      progress={<SignupProgressHeader type="credentials" step="nickname" />}
      bottomCTABehavior="fixed"
      fixedBottom={
        <BottomActionButton
          size="large"
          variant="brandSolid"
          disabled={!screen.canSubmitNickname}
          onClick={screen.handleNicknameNext}
        >
          로그인 비밀번호 만들기
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
          label="닉네임"
          description={screen.nicknameHint}
          maxGraphemeCount={NICKNAME_MAX_LENGTH}
          value={screen.nickname}
          onValueChange={({ value }) => screen.setNickname(value)}
          invalid={
            screen.nicknameState === 'duplicated' || screen.nicknameState === 'invalid'
          }
        >
          <TextFieldInput placeholder="브릿러4821" autoComplete="nickname" />
        </TextField>
      </VStack>
    </ActivityScreenLayout>
  )
}

export default SignupCredentialsActivity
