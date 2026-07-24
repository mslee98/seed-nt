/**
 * LoginActivity — 패스키 우선, 휴대폰+비밀번호 보조
 */
import type { ActivityComponentType } from '@stackflow/react'
import { Box, Text, VStack } from '@seed-design/react'
import { TextField, TextFieldInput } from 'seed-design/ui/text-field'

import { ActivityScreenLayout } from '../../app/layouts/ActivityScreenLayout'
import { useLoginScreen } from '../../features/auth/hooks/useLoginScreen'
import { BottomActionButton } from '../../shared/ui/BottomActionButton'

const LoginActivity: ActivityComponentType<'Login'> = () => {
  const screen = useLoginScreen()

  if (screen.mode === 'password') {
    return (
      <ActivityScreenLayout title="로그인" onBack={() => screen.goPasskeyMode()}>
        <VStack px="spacingX.globalGutter" py="x4" gap="x6" flexGrow>
          <VStack gap="spacingY.betweenText">
            <Text textStyle="screenTitle" color="fg.neutral">
              휴대폰 번호로 로그인
            </Text>
            <Text textStyle="t3Regular" color="fg.neutralMuted">
              가입할 때 만든 로그인 비밀번호를 입력해 주세요.
            </Text>
          </VStack>

          <TextField
            label="휴대폰 번호"
            value={screen.phone}
            onValueChange={({ value }) => screen.setPhone(value)}
          >
            <TextFieldInput placeholder="010-0000-0000" inputMode="tel" autoComplete="tel" />
          </TextField>
          <TextField
            label="로그인 비밀번호"
            value={screen.password}
            onValueChange={({ value }) => screen.setPassword(value)}
          >
            <TextFieldInput type="password" autoComplete="current-password" placeholder="비밀번호" />
          </TextField>

          <VStack gap="x2" style={{ marginTop: 'auto' }}>
            <BottomActionButton
              size="large"
              variant="brandSolid"
              loading={screen.isSubmitting}
              onClick={() => void screen.handlePasswordLogin()}
            >
              로그인
            </BottomActionButton>
            <BottomActionButton size="large" variant="neutralOutline" onClick={screen.goSignup}>
              아직 계정이 없어요
            </BottomActionButton>
            <BottomActionButton size="large" variant="neutralOutline" onClick={screen.goRecovery}>
              로그인에 문제가 있나요?
            </BottomActionButton>
          </VStack>
        </VStack>
      </ActivityScreenLayout>
    )
  }

  return (
    <ActivityScreenLayout title="로그인" onBack={() => screen.pop()}>
      <VStack px="spacingX.globalGutter" py="x4" gap="x6" flexGrow>
        <VStack gap="spacingY.betweenText">
          <Text textStyle="screenTitle" color="fg.neutral">
            BRIT에 로그인
          </Text>
          <Text textStyle="t3Regular" color="fg.neutralMuted">
            패스키로 간편하게 로그인하거나, 휴대폰 번호와 비밀번호를 사용할 수 있어요.
          </Text>
        </VStack>

        <VStack gap="x3" style={{ marginTop: 'auto' }}>
          <BottomActionButton
            size="large"
            variant="brandSolid"
            loading={screen.isSubmitting}
            onClick={() => void screen.handlePasskeyLogin()}
          >
            패스키로 로그인
          </BottomActionButton>

          <Box display="flex" alignItems="center" gap="x3" py="x2">
            <Box flexGrow height="1px" bg="stroke.neutralMuted" />
            <Text textStyle="t3Regular" color="fg.neutralSubtle">
              또는
            </Text>
            <Box flexGrow height="1px" bg="stroke.neutralMuted" />
          </Box>

          <BottomActionButton size="large" variant="neutralWeak" onClick={screen.goPasswordMode}>
            휴대폰 번호와 비밀번호로 로그인
          </BottomActionButton>
          <BottomActionButton size="large" variant="neutralOutline" onClick={screen.goSignup}>
            아직 계정이 없어요
          </BottomActionButton>
          <BottomActionButton size="large" variant="neutralOutline" onClick={screen.goRecovery}>
            로그인에 문제가 있나요?
          </BottomActionButton>
        </VStack>
      </VStack>
    </ActivityScreenLayout>
  )
}

export default LoginActivity
