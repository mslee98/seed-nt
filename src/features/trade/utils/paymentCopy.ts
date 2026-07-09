import type { PaymentCountdownTone } from '../hooks/usePaymentCountdown'

export function getPaymentHeroTitle(amountLabel: string): string {
  return `${amountLabel}을 입금해 주세요`
}

export function getPaymentHeroDescription(coinLabel: string): string {
  return `입금 확인 후 ${coinLabel}이 지급돼요`
}

export function getPaymentMemoCalloutDescription(): string {
  return '입금 확인을 위해 송금 메모에 입력해 주세요.'
}

export function getPaymentFooterDismissHint(): string {
  return '시트를 닫아도 거래는 유지돼요.'
}

export function getPaymentFooterReportHint(): string {
  return '입금 후 [입금했어요]를 누르면 상대에게 알림이 전송돼요.'
}

export function getPaymentReportedBuyerTitle(): string {
  return '입금 확인을 기다리고 있어요'
}

export function getPaymentReportedBuyerDescription(): string {
  return '상대가 확인하면 코인이 지급돼요.'
}

export function getPaymentCountdownCopy(
  tone: PaymentCountdownTone,
  remainingLabel: string,
  deadlineLabel: string,
): { title: string; description: string } {
  if (tone === 'critical') {
    return {
      title: '입금 시간이 지났어요',
      description: '이미 입금했다면 고객센터에 문의해 주세요.',
    }
  }

  if (tone === 'warning') {
    return {
      title: `${remainingLabel} 남았어요`,
      description: '기한 내 입금하지 않으면 거래가 취소될 수 있어요.',
    }
  }

  return {
    title: `남은 시간 ${remainingLabel}`,
    description: deadlineLabel ? `${deadlineLabel}해야 거래가 유지돼요.` : '',
  }
}
