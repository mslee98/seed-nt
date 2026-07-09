import type { ActivityComponentType } from '@stackflow/react'
import { useActivityParams, useFlow } from '@stackflow/react'
import { useState } from 'react'
import { Text, VStack } from '@seed-design/react'
import { useSnackbarAdapter } from 'seed-design/ui/snackbar'
import { ActionButton } from 'seed-design/ui/action-button'
import { FieldButton } from 'seed-design/ui/field-button'
import { PageBanner } from 'seed-design/ui/page-banner'
import { TextField, TextFieldInput } from 'seed-design/ui/text-field'

import { verifyAccount } from '../../features/auth/api/auth.api'
import { ActivityScreenLayout } from '../../app/layouts/ActivityScreenLayout'
import { InstitutionSelectPanel } from '../../features/auth/components/institution/InstitutionSelectPanel'
import { SignupProgressHeader } from '../../features/auth/components/SignupProgressBar'
import type { Institution } from '../../features/auth/data/institutions'
import { useSignupForm } from '../../features/auth/hooks/useSignupForm'
import { updateSignupDraft } from '../../features/auth/stores/signupDraft.store'
import { showSnackbar } from '../../shared/utils/showSnackbar'

const SignupAccountActivity: ActivityComponentType<'SignupAccount'> = () => {
  const { step = 'bank' } = useActivityParams<'SignupAccount'>()
  const { push, replace, pop } = useFlow()
  const snackbar = useSnackbarAdapter()
  const { draft } = useSignupForm()
  const [isVerifying, setIsVerifying] = useState(false)

  const handleInstitutionSelect = (institution: Institution) => {
    updateSignupDraft({
      bankCode: institution.code,
      bankName: institution.name,
    })
    replace('SignupAccount', { step: 'accountNumber' })
  }

  const handleAccountNumberChange = (value: string) => {
    updateSignupDraft({ accountNumber: value.replace(/\D/g, '') })
  }

  const canSubmit = Boolean(draft.bankCode && draft.accountNumber.length >= 10)

  const handleVerify = async () => {
    if (!canSubmit || isVerifying) return
    setIsVerifying(true)
    try {
      await verifyAccount({
        name: draft.name,
        bankCode: draft.bankCode,
        accountNumber: draft.accountNumber,
      })
      showSnackbar(snackbar, '계좌가 확인되었어요')
      push('SignupPin', { step: 'create' })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleBack = () => {
    if (step === 'accountNumber') {
      replace('SignupAccount', { step: 'bank' })
      return
    }
    pop()
  }

  if (step === 'bank') {
    return (
      <ActivityScreenLayout
        title="금융기관 선택"
        onBack={handleBack}
        progress={<SignupProgressHeader type="account" step="bank" />}
      >
        <InstitutionSelectPanel onSelect={handleInstitutionSelect} />
      </ActivityScreenLayout>
    )
  }

  return (
    <ActivityScreenLayout
      title="계좌 등록"
      onBack={handleBack}
      progress={<SignupProgressHeader type="account" step="accountNumber" />}
      fixedBottom={
        <ActionButton
          size="large"
          variant="brandSolid"
          disabled={!canSubmit}
          loading={isVerifying}
          onClick={() => void handleVerify()}
        >
          계좌 확인하기
        </ActionButton>
      }
    >
      <VStack
        as="form"
        px="spacingX.globalGutter"
        py="x4"
        gap="x6"
        onSubmit={(e) => {
          e.preventDefault()
          void handleVerify()
        }}
      >
        <VStack gap="spacingY.betweenText">
          <Text textStyle="t6Bold" color="fg.neutral">
            계좌번호를 입력해 주세요
          </Text>
          <Text textStyle="t5Regular" color="fg.neutralMuted">
            {draft.bankName} 계좌의 번호를 입력해 주세요.
          </Text>
        </VStack>

        <FieldButton
          label="금융기관"
          buttonProps={{
            'aria-label': '금융기관 다시 선택',
            onClick: () => replace('SignupAccount', { step: 'bank' }),
          }}
        >
          {draft.bankName}
        </FieldButton>

        <TextField
          label="계좌번호"
          value={draft.accountNumber}
          onValueChange={({ value }) => handleAccountNumberChange(value)}
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
