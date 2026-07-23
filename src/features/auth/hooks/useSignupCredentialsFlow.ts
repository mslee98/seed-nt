/**
 * useSignupCredentialsFlow
 *
 * 책임: 닉네임(선검사) → 로그인 비밀번호 수집. 회원 생성은 하지 않음.
 */
import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { useActivityParams, useFlow } from '@stackflow/react'
import { useSnackbarAdapter } from 'seed-design/ui/snackbar'

import { SIGNUP_CREDENTIALS_COPY, type NicknameCheckState } from '../constants'
import { checkNickname } from '../api/auth.api'
import { getSignupDraft, updateSignupDraft } from '../stores/signupDraft.store'
import { setLoginPassword } from '../stores/signupSecrets.store'
import { isValidLoginPassword, isValidNickname } from '../utils/signupAuthValidation'
import { showSnackbar } from '../../../shared/utils/showSnackbar'

const NICKNAME_DEBOUNCE_MS = 450

export function useSignupCredentialsFlow() {
  const { step = 'nickname' } = useActivityParams<'SignupCredentials'>()
  const { push, replace, pop } = useFlow()
  const snackbar = useSnackbarAdapter()

  const [nickname, setNickname] = useState(getSignupDraft().nickname)
  const [nicknameState, setNicknameState] = useState<NicknameCheckState>(
    getSignupDraft().nickname ? 'available' : 'idle',
  )
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const checkSeqRef = useRef(0)

  const copy = SIGNUP_CREDENTIALS_COPY[step]

  useEffect(() => {
    if (step !== 'nickname') return

    if (debounceRef.current) clearTimeout(debounceRef.current)

    const trimmed = nickname.trim()
    if (!trimmed) {
      setNicknameState('idle')
      return
    }
    if (!isValidNickname(trimmed)) {
      setNicknameState('invalid')
      return
    }

    setNicknameState('checking')
    const seq = ++checkSeqRef.current
    debounceRef.current = setTimeout(() => {
      void (async () => {
        try {
          const { available } = await checkNickname(trimmed)
          if (seq !== checkSeqRef.current) return
          setNicknameState(available ? 'available' : 'duplicated')
        } catch {
          if (seq !== checkSeqRef.current) return
          setNicknameState('error')
        }
      })()
    }, NICKNAME_DEBOUNCE_MS)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [nickname, step])

  const canSubmitNickname = nicknameState === 'available' && isValidNickname(nickname)
  const canSubmitPassword =
    isValidLoginPassword(password) && password === passwordConfirm && password.length > 0

  const handleNicknameNext = () => {
    if (!canSubmitNickname) {
      if (nicknameState === 'duplicated') {
        showSnackbar(snackbar, '이미 쓰는 이름이에요. 다른 이름을 적어 주세요.')
      } else {
        showSnackbar(snackbar, '2~12자 한글·영문·숫자·밑줄로 입력해 주세요.')
      }
      return
    }
    updateSignupDraft({ nickname: nickname.trim() })
    replace('SignupCredentials', { step: 'password' })
  }

  const handlePasswordNext = () => {
    if (!canSubmitPassword) {
      if (password !== passwordConfirm) {
        showSnackbar(snackbar, '비밀번호가 일치하지 않아요.')
      } else {
        showSnackbar(snackbar, '영문과 숫자를 포함해 8자 이상으로 만들어 주세요.')
      }
      return
    }
    setLoginPassword(password)
    push('SignupPin', { step: 'create' })
  }

  const handleStepBack = (e: MouseEvent<HTMLButtonElement>) => {
    if (step === 'password') {
      e.preventDefault()
      replace('SignupCredentials', { step: 'nickname' })
      return
    }
    pop()
  }

  const nicknameHint =
    nicknameState === 'checking'
      ? '사용 가능한지 확인 중…'
      : nicknameState === 'available'
        ? '사용할 수 있는 이름이에요'
        : nicknameState === 'duplicated'
          ? '이미 쓰는 이름이에요'
          : nicknameState === 'invalid'
            ? '2~12자, 한글·영문·숫자·밑줄만 가능해요'
            : nicknameState === 'error'
              ? '확인하지 못했어요. 잠시 후 다시 시도해 주세요'
              : '2~12자, 한글·영문·숫자 사용 가능'

  return {
    step,
    copy,
    nickname,
    nicknameState,
    nicknameHint,
    password,
    passwordConfirm,
    canSubmitNickname,
    canSubmitPassword,
    setNickname,
    setPassword,
    setPasswordConfirm,
    handleNicknameNext,
    handlePasswordNext,
    handleStepBack,
  }
}
