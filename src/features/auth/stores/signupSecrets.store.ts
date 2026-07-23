/**
 * 가입 중 메모리 전용 비밀값.
 * localStorage / sessionStorage / URL / params에 넣지 않음.
 */
type Listener = () => void

interface SignupSecrets {
  loginPassword: string
  transactionPin: string
}

const initialSecrets: SignupSecrets = {
  loginPassword: '',
  transactionPin: '',
}

let secrets: SignupSecrets = { ...initialSecrets }
const listeners = new Set<Listener>()

function notify() {
  listeners.forEach((listener) => listener())
}

export function getSignupSecrets(): SignupSecrets {
  return secrets
}

export function setLoginPassword(password: string) {
  secrets = { ...secrets, loginPassword: password }
  notify()
}

export function setTransactionPin(pin: string) {
  secrets = { ...secrets, transactionPin: pin }
  notify()
}

export function resetSignupSecrets() {
  secrets = { ...initialSecrets }
  notify()
}

export function subscribeSignupSecrets(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
