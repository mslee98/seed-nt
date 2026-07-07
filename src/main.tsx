import '@seed-design/css/base.css'
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionProvider } from './app/providers/MotionProvider'
import { initPwaInstallPromptListener } from './features/home/utils/pwaInstallPromptStore'
import './app/styles/typography.css'
import './app/styles/layout.css'
import './app/styles/toss-theme.css'
import './app/styles/home-header.css'
import './app/styles/home-matching-dock.css'
import './app/styles/home-matching-feed.css'
import './app/styles/global-active-trade-banner.css'
import './app/styles/split-progress-bar.css'
import './app/styles/home-install-banner.css'
import './index.css'
import App from './App.tsx'

initPwaInstallPromptListener()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionProvider>
      <App />
    </MotionProvider>
  </StrictMode>,
)
