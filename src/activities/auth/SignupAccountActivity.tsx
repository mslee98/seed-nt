/**
 * SignupAccountActivity
 *
 * 책임: 계좌 등록 화면 JSX 조립
 * 비책임: 검증·draft·네비 (→ useSignupAccountScreen)
 */
import type { ActivityComponentType } from '@stackflow/react'
import { Text, VStack } from '@seed-design/react'
import { BottomActionButton } from '../../shared/ui/BottomActionButton'
import { FieldButton } from 'seed-design/ui/field-button'
import { PageBanner } from 'seed-design/ui/page-banner'
import { TextField, TextFieldInput } from 'seed-design/ui/text-field'

import { ActivityScreenLayout } from '../../app/layouts/ActivityScreenLayout'
import { InstitutionSelectPanel } from '../../features/auth/components/institution/InstitutionSelectPanel'
import { SignupProgressHeader } from '../../features/auth/components/SignupProgressBar'
import { useSignupAccountScreen } from '../../features/auth/hooks/useSignupAccountScreen'

const SignupAccountActivity: ActivityComponentType<'SignupAccount'> = () => {
  const screen = useSignupAccountScreen()

  if (screen.step === 'bank') {
    return (
      <ActivityScreenLayout
        title="금융기관 선택"
        onBack={screen.handleBack}
        progress={<SignupProgressHeader type="account" step="bank" />}
      >
        <InstitutionSelectPanel onSelect={screen.handleInstitutionSelect} />
      </ActivityScreenLayout>
    )
  }

  return (
    <ActivityScreenLayout
      title="계좌 등록"
      onBack={screen.handleBack}
      progress={<SignupProgressHeader type="account" step="accountNumber" />}
      fixedBottom={
        <BottomActionButton
          size="large"
          variant="brandSolid"
          disabled={!screen.canSubmit}
          loading={screen.isVerifying}
          onClick={() => void screen.handleVerify()}
        >
          계좌 확인하기
        </BottomActionButton>
      }
    >
      <VStack
        as="form"
        px="spacingX.globalGutter"
        py="x4"
        gap="x6"
        onSubmit={(e) => {
          e.preventDefault()
          void screen.handleVerify()
        }}
      >
        <VStack gap="spacingY.betweenText">
          <Text textStyle="screenTitle" color="fg.neutral">
            계좌번호를 입력해 주세요
          </Text>
          <Text textStyle="t3Regular" color="fg.neutralMuted">
            {screen.draft.bankName} 계좌의 번호를 입력해 주세요.
          </Text>
        </VStack>

        <FieldButton
          label="금융기관"
          buttonProps={{
            'aria-label': '금융기관 다시 선택',
            onClick: screen.handleReselectBank,
          }}
        >
          {screen.draft.bankName}
        </FieldButton>

        <TextField
          label="계좌번호"
          value={screen.draft.accountNumber}
          onValueChange={({ value }) => screen.handleAccountNumberChange(value)}
        >
          <TextFieldInput placeholder="숫자만 입력" inputMode="numeric" />
        </TextField>

        <PageBanner
          tone="informative"
          variant="weak"
          description="계좌는 거래 취소, 환불, 환전에 사용돼요."
        />
      </VStack>
    </ActivityScreenLayout>
  )
}

export default SignupAccountActivity
