/**
 * DEV mock — reportPayment 후 판매자 confirmPayment를 랜덤 지연으로 시뮬레이션.
 *
 * 제거 시:
 * 1. 이 파일 삭제
 * 2. main.tsx 의 setTradeSessionDevHooks 등록 제거
 */

const DEV_SELLER_CONFIRM_MIN_MS = 3_000
const DEV_SELLER_CONFIRM_MAX_MS = 8_000

const timers = new Map<string, ReturnType<typeof setTimeout>>()

type ConfirmPaymentFn = (tradeId: string, version: number) => Promise<unknown>

function randomDelayMs(): number {
  return (
    DEV_SELLER_CONFIRM_MIN_MS +
    Math.floor(Math.random() * (DEV_SELLER_CONFIRM_MAX_MS - DEV_SELLER_CONFIRM_MIN_MS + 1))
  )
}

export function onPaymentReportedDevMock(
  tradeId: string,
  version: number,
  confirmPayment: ConfirmPaymentFn,
) {
  if (!import.meta.env.DEV) return

  clearDevPaymentSimulation(tradeId)

  timers.set(
    tradeId,
    setTimeout(() => {
      timers.delete(tradeId)
      void confirmPayment(tradeId, version).catch(() => {
        // mock: 취소·분쟁·수동 완료 등으로 상태가 바뀐 경우 무시
      })
    }, randomDelayMs()),
  )
}

export function clearDevPaymentSimulation(tradeId?: string) {
  if (tradeId) {
    const timerId = timers.get(tradeId)
    if (timerId !== undefined) clearTimeout(timerId)
    timers.delete(tradeId)
    return
  }

  timers.forEach((timerId) => clearTimeout(timerId))
  timers.clear()
}
