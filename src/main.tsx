import '@seed-design/css/base.css'
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionProvider } from './app/providers/MotionProvider'
import { applyCompletedTrade } from './features/home/stores/homeWallet.store'
import { initPwaInstallPromptListener } from './features/pwa/services/pwaInstallPromptStore'
import { setMatchingCandidateFactory } from './features/trade/matching/matchingSession.store'
import { setOnTradeCompleted, setTradeSessionDevHooks } from './features/trade/stores/tradeSession.store'
import './app/styles/typography.css'
import './app/styles/amount-hero-field.css'
import './app/styles/layout.css'
import './app/styles/toss-theme.css'
import './app/styles/home-header.css'
import './app/styles/home-balance-card.css'
import './app/styles/home-matching-dock.css'
import './app/styles/home-matching-feed.css'
import './app/styles/bottom-sheet-scroll.css'
import './app/styles/global-active-trade-banner.css'
import './app/styles/split-progress-bar.css'
import './app/styles/home-install-banner.css'
import './app/styles/tap-scale.css'
import './index.css'
import App from './App.tsx'

initPwaInstallPromptListener()

// trade → home wallet: 단방향 구독 (store가 home을 import하지 않음)
setOnTradeCompleted(applyCompletedTrade)

async function initDevTradeMocks() {
  if (!import.meta.env.DEV) return

  const [{ createMockCandidates }, devPay, { initTradeMockScenario }] = await Promise.all([
    import('./features/trade/mocks/matchingSession.mock'),
    import('./features/trade/mocks/devPaymentSimulation.mock'),
    import('./features/trade/mocks/tradeScenario.mock'),
  ])

  setMatchingCandidateFactory(createMockCandidates)
  setTradeSessionDevHooks({
    onPaymentReported: (tradeId, version, confirmPayment) => {
      devPay.onPaymentReportedDevMock(tradeId, version, confirmPayment)
    },
    clearSimulation: (tradeId) => {
      devPay.clearDevPaymentSimulation(tradeId)
    },
  })
  initTradeMockScenario()
}

void initDevTradeMocks()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionProvider>
      <App />
    </MotionProvider>
  </StrictMode>,
)
