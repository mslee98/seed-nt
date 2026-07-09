export function releaseOverlayFocus() {
  if (typeof document === 'undefined') return
  const active = document.activeElement
  if (active instanceof HTMLElement) {
    active.blur()
  }
}

export function getReportPaymentErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message === 'TRADE_STATE_CONFLICT') {
      return '거래 상태가 바뀌었어요. 다시 시도해 주세요.'
    }
    if (error.message === 'TRADE_NOT_FOUND') {
      return '거래를 찾을 수 없어요.'
    }
  }
  return '요청을 처리하지 못했어요.'
}

export function logReportPaymentDev(
  phase: 'start' | 'success' | 'error',
  tradeId: string,
  extra?: Record<string, unknown>,
) {
  if (!import.meta.env.DEV) return

  const label = `[reportPayment:${phase}]`
  if (phase === 'error') {
    console.error(label, { tradeId, ...extra })
    return
  }
  console.info(label, { tradeId, ...extra })
}

/** 다이얼로그 unmount 후 시트·스낵바 순서 맞추기 */
export function waitOverlayTick(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve())
    })
  })
}
