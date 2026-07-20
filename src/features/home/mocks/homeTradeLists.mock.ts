import type { HomeTradeListItem } from '../utils/buildHomeTradeLists'

/**
 * 홈 대시보드 UI 목업 — 「지금 필요한 활동」/「진행 중인 거래」.
 * 실제 진행 거래가 없을 때 DEV에서 시안처럼 보이도록 씁니다.
 *
 * 동일 금액을 서로 다른 상태로 동시에 두지 않습니다.
 * (입금 필요 vs 판매자 확인 대기는 한 거래의 전·후 단계)
 */
export const MOCK_HOME_TRADE_LISTS: {
  attentionItems: HomeTradeListItem[]
  inProgressItems: HomeTradeListItem[]
} = {
  attentionItems: [
    {
      id: 'mock-attn-deposit',
      kind: 'attention',
      title: '120,000원 입금이 필요해요',
      meta: '구매 거래 · 8분 남음',
      metaPrimary: '구매 거래',
      metaSecondary: '8분 남음',
      metaSecondaryTone: 'warning',
      detail: '입금하면 바로 다음 단계로 진행돼요',
      attentionAction: 'deposit',
      tradeId: 'trade-mock-deposit',
    },
    {
      id: 'mock-attn-confirm',
      kind: 'attention',
      title: '30,000원 입금을 확인해 주세요',
      meta: '판매 거래 · 구매자 입금 완료',
      metaPrimary: '판매 거래',
      metaSecondary: '구매자 입금 완료',
      metaSecondaryTone: 'muted',
      detail: '확인 후 Coin 이전이 진행돼요',
      attentionAction: 'confirm',
      tradeId: 'trade-mock-confirm',
    },
  ],
  inProgressItems: [
    {
      id: 'mock-prog-waiting',
      kind: 'inProgress',
      title: '받을 예정 85,000 Coin',
      meta: '판매자 확인 대기',
      badge: '구매',
      tradeId: 'trade-mock-waiting',
    },
  ],
}
