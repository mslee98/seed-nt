import type { HomeTradeListItem } from '../utils/buildHomeTradeLists'

/**
 * 홈 대시보드 UI 목업 — 「지금 필요한 활동」/「진행 중인 거래」.
 * 실제 진행 거래가 없을 때 DEV에서 시안처럼 보이도록 씁니다.
 */
export const MOCK_HOME_TRADE_LISTS: {
  attentionItems: HomeTradeListItem[]
  inProgressItems: HomeTradeListItem[]
} = {
  attentionItems: [
    {
      id: 'mock-attn-deposit',
      kind: 'attention',
      title: '입금이 필요해요',
      meta: '120,000원 · 8분 남음',
      metaPrimary: '120,000원',
      metaSecondary: '8분 남음',
      metaSecondaryTone: 'warning',
      detail: '입금하면 바로 다음 단계로 진행돼요',
      attentionAction: 'deposit',
      tradeId: 'trade-mock-deposit',
    },
    {
      id: 'mock-attn-confirm',
      kind: 'attention',
      title: '입금 확인이 필요해요',
      meta: '30,000원 · 구매자 입금 완료',
      metaPrimary: '30,000원',
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
      title: '구매 · 확인 대기',
      meta: '85,000 Coin 받을 예정',
      detail: '상대방의 확인을 기다려요',
      progressSide: 'BUY',
      tradeId: 'trade-mock-waiting',
    },
  ],
}
