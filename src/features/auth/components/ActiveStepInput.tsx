import { useEffect, useRef, useState, type FormEvent, type ReactNode, type RefObject } from 'react'
import { Text, VStack } from '@seed-design/react'
import { motion } from 'motion/react'
import { TextField, TextFieldInput } from 'seed-design/ui/text-field'
import { FieldButton } from 'seed-design/ui/field-button'

import type { SignupIdentityStep } from '../constants'
import { CARRIERS, getIdentityStepIndex, IDENTITY_STEP_COPY, isIdentityStepRevealed } from '../constants'
import { formatPhoneInput } from '../utils/formatPhone'
import { formatRrnInput } from '../utils/formatRrn'
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
  const [carrierSheetOpen, setCarrierSheetOpen] = useState(false)
  const prevActiveStepRef = useRef(activeStep)

  const carrierLabel = CARRIERS.find((c) => c.code === carrier)?.label ?? ''
  const activeCopy = IDENTITY_STEP_COPY[activeStep]

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (canSubmit) onSubmit?.()
  }

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

    if (activeStep !== 'carrier') {
      const ref = focusMap[activeStep]
      requestAnimationFrame(() => ref?.current?.focus())
    }

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

    switch (step) {
      case 'phone':
        return (
          <RevealedField key="phone" animate={animate}>
            <VStack as="form" onSubmit={handleFormSubmit}>
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
                />
              </TextField>
            </VStack>
          </RevealedField>
        )

      case 'carrier':
        return (
          <RevealedField key="carrier" animate={animate}>
            <FieldButton
              label={copy.fieldLabel}
              description={showFieldDescription ? copy.fieldDescription : undefined}
              buttonProps={{
                'aria-label': copy.fieldLabel,
                onClick: () => setCarrierSheetOpen(true),
                disabled: isStepLocked('carrier'),
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
            <VStack as="form" gap="x4" onSubmit={handleFormSubmit}>
              <TextField
                variant="underline"
                label={copy.fieldLabel}
                description={showFieldDescription ? copy.fieldDescription : undefined}
                value={formatRrnInput(rrnFront7)}
                onValueChange={({ value }) => onRrnChange(value)}
                readOnly={isStepLocked('rrn')}
              >
                <TextFieldInput
                  ref={rrnInputRef}
                  placeholder={copy.placeholder}
                  inputMode="numeric"
                  readOnly={isStepLocked('rrn')}
                />
              </TextField>
            </VStack>
          </RevealedField>
        )

      case 'name':
        return (
          <RevealedField key="name" animate={false}>
            <VStack as="form" onSubmit={handleFormSubmit}>
              <TextField
                variant="underline"
                label={copy.fieldLabel}
                description={showFieldDescription ? copy.fieldDescription : undefined}
                value={name}
                onValueChange={({ value }) => onNameChange(value)}
                readOnly={isStepLocked('name')}
              >
                <TextFieldInput
                  ref={nameInputRef}
                  placeholder={copy.placeholder}
                  readOnly={isStepLocked('name')}
                />
              </TextField>
            </VStack>
          </RevealedField>
        )

      default:
        return null
    }
  }

  return (
    <VStack gap="x6">
      <VStack gap="spacingY.betweenText">
        <Text textStyle="t6Bold" color="fg.neutral">
          {activeCopy.screenTitle}
        </Text>
        <Text textStyle="t5Regular" color="fg.neutralMuted">
          {activeCopy.screenSubtitle}
        </Text>
      </VStack>

      <VStack gap="x4">{FIELD_STACK_ORDER.map((step) => renderFieldSection(step))}</VStack>
    </VStack>
  )
}
