import type { PaymentCountdownTone } from '../hooks/usePaymentCountdown'

export function getPaymentHeroTitle(amountLabel: string): string {
  return `${amountLabel}을 입금해 주세요`
}

export function getPaymentHeroDescription(coinLabel: string): string {
  return `입금 확인 후 ${coinLabel}이 지급돼요`
}

export function getPaymentFooterDismissHint(): string {
  return '시트를 닫아도 거래는 유지돼요.'
}

export function getPaymentFooterReportHint(): string {
  return '입금 후 [입금했어요]를 누르면 상대에게 알림이 전송돼요.'
}

export function getPaymentReportedBuyerBadge(): string {
  return '입금 확인 중'
}

export function getPaymentReportedBuyerTitle(): string {
  return '판매자 확인을 기다리고 있어요'
}

export function getPaymentReportedBuyerDescription(): string {
  return '판매자가 입금을 확인하고 있어요'
}

export function getPaymentReportedBuyerOutcome(coinLabel: string): string {
  return `판매자가 입금을 확인하면\n${coinLabel}이 자동으로 지급돼요.`
}

export function getPaymentReportedBuyerAssetProtection(coinLabel: string): string {
  return `판매자의 ${coinLabel}은 거래용으로 보류돼 있어요.`
}

export function getPaymentReportedBuyerNextSteps(): readonly [string, string, string] {
  return [
    '판매자가 입금을 확인해요',
    '확인되면 Coin이 자동 지급돼요',
    '제한시간이 지나면 추가 확인을 요청할 수 있어요',
  ]
}

export function getPaymentReportedBuyerCancelHint(): string {
  return '입금 후에는 거래를 임의로 취소할 수 없어요.'
}

export function getPaymentReportedBuyerStatusLine(): string {
  return '판매자 확인 대기'
}

export function getPaymentReportedBuyerReassuranceLines(): readonly [string, string] {
  return ['앱을 닫아도 거래는 계속 진행돼요.', '확인 결과는 알림으로 알려드릴게요.']
}

export function getPaymentReportedBuyerDelayHint(): string {
  return '확인이 늦어지면 거래 내역에서 문의할 수 있어요.'
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
