function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function randomDelay(min = 300, max = 800) {
  return delay(min + Math.floor(Math.random() * (max - min)))
}

export async function sendSmsCode(phone: string): Promise<{ success: true }> {
  const mockCode = String(Math.floor(100000 + Math.random() * 900000))
  if (import.meta.env.DEV) {
    console.info(`[mock] SMS code for ${phone}: ${mockCode}`)
  }
  await randomDelay()
  return { success: true }
}

export async function verifySmsCode(
  _phone: string,
  code: string,
): Promise<{ verified: true }> {
  await randomDelay(400, 700)
  if (!/^\d{6}$/.test(code)) {
    throw new Error('INVALID_CODE')
  }
  return { verified: true }
}

export async function verifyAccount(_payload: {
  name: string
  bankCode: string
  accountNumber: string
}): Promise<{ verified: true; holderName: string }> {
  await randomDelay(600, 1200)
  return { verified: true, holderName: _payload.name }
}

export async function registerPin(_pin: string): Promise<{ success: true }> {
  await randomDelay(300, 600)
  if (!/^\d{4}$/.test(_pin)) {
    throw new Error('INVALID_PIN')
  }
  return { success: true }
}
