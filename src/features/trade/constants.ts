/** mock: 매칭 시뮬레이션 대기 시간 */
export const MATCHING_SIMULATION_MS = 10_000

/** mock: EXACT 없을 때 가장 가까운 NEAR 자동 제안까지 대기 */
export const MATCH_NEAR_AUTO_PROPOSE_MS = MATCHING_SIMULATION_MS

/** mock: 승인 대기 타임아웃 */
export const MATCH_APPROVAL_TIMEOUT_MS = 60_000

/** mock: 상대 승인 시뮬레이션 지연 (always-accept) */
export const MATCH_COUNTERPARTY_ACCEPT_DELAY_MS = 1_500

/** mock: 입금 대기 기한 (분) */
export const PAYMENT_DEADLINE_MINUTES = 30
