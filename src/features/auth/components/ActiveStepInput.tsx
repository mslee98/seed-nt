import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode, type RefObject } from 'react'
import { Text, VStack } from '@seed-design/react'
import { motion } from 'motion/react'
import { TextField, TextFieldInput } from 'seed-design/ui/text-field'
import { FieldButton } from 'seed-design/ui/field-button'
import { SplitRrnFirst7Field } from 'seed-design/ui/split-rrn-first7-field'

import type { SignupIdentityStep } from '../constants'
import {
  CARRIERS,
  getIdentityStepIndex,
  IDENTITY_STEP_COPY,
  isIdentityStepRevealed,
  SIGNUP_IDENTITY_FORM_ID,
} from '../constants'
import { formatPhoneInput } from '../utils/formatPhone'
import { CarrierSelectSheet } from './CarrierSelectSheet'
import type { CarrierCode } from '../constants'

interface ActiveStepInputProps {
  activeStep: SignupIdentityStep
  name: string
  rrnFront7: string
  carrier: CarrierCode | ''
  phone: string
  onNameChange: (value: string) => void
  onRrnChange: (value: string) => void
  onCarrierSelect: (carrier: CarrierCode) => void
  onPhoneChange: (value: string) => void
  onSubmit?: () => void
  canSubmit?: boolean
}

/** 최근 단계가 위로 쌓이도록 역순 렌더 */
const FIELD_STACK_ORDER: SignupIdentityStep[] = ['phone', 'carrier', 'rrn', 'name']

function RevealedField({ children, animate }: { children: ReactNode; animate?: boolean }) {
  if (!animate) {
    return <>{children}</>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.2, 0.1, 0.21, 0.99] }}
    >
      {children}
    </motion.div>
  )
}

export function ActiveStepInput({
  activeStep,
  name,
  rrnFront7,
  carrier,
  phone,
  onNameChange,
  onRrnChange,
  onCarrierSelect,
  onPhoneChange,
  onSubmit,
  canSubmit = false,
}: ActiveStepInputProps) {
  const nameInputRef = useRef<HTMLInputElement>(null)
  const rrnInputRef = useRef<HTMLInputElement>(null)
  const phoneInputRef = useRef<HTMLInputElement>(null)
  const carrierButtonRef = useRef<HTMLButtonElement>(null)
  const [carrierSheetOpen, setCarrierSheetOpen] = useState(false)
  const prevActiveStepRef = useRef(activeStep)

  const carrierLabel = CARRIERS.find((c) => c.code === carrier)?.label ?? ''
  const activeCopy = IDENTITY_STEP_COPY[activeStep]

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (canSubmit) onSubmit?.()
  }

  const handleRrnGenderComplete = useCallback(() => {
    onSubmit?.()
  }, [onSubmit])

  useEffect(() => {
    const prev = prevActiveStepRef.current
    if (prev === activeStep) return

    if (activeStep !== 'carrier') {
      setCarrierSheetOpen(false)
    } else if (getIdentityStepIndex(activeStep) > getIdentityStepIndex(prev)) {
      setCarrierSheetOpen(true)
    }

    const focusMap: Partial<Record<SignupIdentityStep, RefObject<HTMLInputElement | null>>> = {
      name: nameInputRef,
      rrn: rrnInputRef,
      phone: phoneInputRef,
    }

    requestAnimationFrame(() => {
      if (activeStep === 'carrier') {
        carrierButtonRef.current?.focus()
        return
      }
      focusMap[activeStep]?.current?.focus()
    })

    prevActiveStepRef.current = activeStep
  }, [activeStep])

  const isStepActive = (step: SignupIdentityStep) => step === activeStep
  const isStepLocked = (step: SignupIdentityStep) =>
    isIdentityStepRevealed(activeStep, step) && step !== activeStep

  const renderFieldSection = (step: SignupIdentityStep) => {
    if (!isIdentityStepRevealed(activeStep, step)) return null

    const copy = IDENTITY_STEP_COPY[step]
    const animate = isStepActive(step) && step !== 'name'
    const showFieldDescription = isStepActive(step)
    const locked = isStepLocked(step)

    switch (step) {
      case 'phone':
        return (
          <RevealedField key="phone" animate={animate}>
            <TextField
              label={copy.fieldLabel}
              description={showFieldDescription ? copy.fieldDescription : undefined}
              value={formatPhoneInput(phone)}
              onValueChange={({ value }) => onPhoneChange(value)}
            >
              <TextFieldInput
                ref={phoneInputRef}
                placeholder={copy.placeholder}
                inputMode="tel"
                enterKeyHint="done"
                maxLength={13}
                readOnly={locked}
                tabIndex={locked ? -1 : 0}
              />
            </TextField>
          </RevealedField>
        )

      case 'carrier':
        return (
          <RevealedField key="carrier" animate={animate}>
            <FieldButton
              ref={carrierButtonRef}
              label={copy.fieldLabel}
              description={showFieldDescription ? copy.fieldDescription : undefined}
              buttonProps={{
                'aria-label': copy.fieldLabel,
                type: 'button',
                onClick: () => setCarrierSheetOpen(true),
                disabled: locked,
                tabIndex: locked ? -1 : 0,
              }}
            >
              {carrierLabel || copy.placeholder}
            </FieldButton>
            <CarrierSelectSheet
              open={carrierSheetOpen}
              onOpenChange={setCarrierSheetOpen}
              value={carrier}
              onSelect={onCarrierSelect}
            />
          </RevealedField>
        )

      case 'rrn':
        return (
          <RevealedField key="rrn" animate={animate}>
            <SplitRrnFirst7Field
              ref={rrnInputRef}
              label={copy.fieldLabel}
              description={showFieldDescription ? copy.fieldDescription : undefined}
              value={rrnFront7}
              onValueChange={onRrnChange}
              onGenderComplete={isStepActive('rrn') ? handleRrnGenderComplete : undefined}
              readOnly={locked}
              birthPlaceholder="000000"
              genderPlaceholder="0"
            />
          </RevealedField>
        )

      case 'name':
        return (
          <RevealedField key="name" animate={false}>
            <TextField
              variant="underline"
              label={copy.fieldLabel}
              description={showFieldDescription ? copy.fieldDescription : undefined}
              value={name}
              onValueChange={({ value }) => onNameChange(value)}
              readOnly={locked}
            >
              <TextFieldInput
                ref={nameInputRef}
                placeholder={copy.placeholder}
                enterKeyHint="next"
                readOnly={locked}
                tabIndex={locked ? -1 : 0}
              />
            </TextField>
          </RevealedField>
        )

      default:
        return null
    }
  }

  return (
    <VStack gap="x6">
      <VStack gap="spacingY.betweenText">
        <Text textStyle="screenTitle" color="fg.neutral">
          {activeCopy.screenTitle}
        </Text>
        <Text textStyle="t5Regular" color="fg.neutralMuted">
          {activeCopy.screenSubtitle}
        </Text>
      </VStack>

      <VStack
        as="form"
        id={SIGNUP_IDENTITY_FORM_ID}
        gap="x4"
        onSubmit={handleFormSubmit}
      >
        {FIELD_STACK_ORDER.map((step) => renderFieldSection(step))}
      </VStack>
    </VStack>
  )
}
