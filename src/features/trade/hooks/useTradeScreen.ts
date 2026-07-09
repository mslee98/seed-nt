import { useActivity, useActivityParams, useFlow } from '@stackflow/react'
import { useCallback, useEffect, useRef, useState } from 'react'

import {
  focusSplitLegTrade,
  getActiveSplitGroup,
  getSplitGroupById,
  getTradeDetail,
  getTradesById,
  setOnTradeMatched,
} from '../stores/tradeSession.store'
import type { SplitLegViewModel } from '../types/splitDashboard'
import { mapSplitGroupToDashboard } from '../utils/mapSplitDashboard'
import { shouldOpenPaymentSheet, getPaymentSheetAutoOpenKey } from '../utils/tradeSheetPolicy'
import { useMatchingAcceptSheet } from './useMatchingAcceptSheet'
import { useTradeSession } from './useTradeSession'

/**
 * Trade Activity orchestration.
 * splitGroupId → 위젯 대시보드 + leg micro-flow 시트. tradeId → 단건 상세/시트.
 *
 * @see docs/architecture/trade-platform-summary.md
 */
export function useTradeScreen() {
  const { isActive } = useActivity()
  const { tradeId, splitGroupId, focusLeg } = useActivityParams<'Trade'>()
  const { push, replace } = useFlow()

  const [paymentSheetTradeId, setPaymentSheetTradeId] = useState<string | null>(null)
  const [disputeSheetLeg, setDisputeSheetLeg] = useState<SplitLegViewModel | null>(null)
  const focusHandledRef = useRef<string | null>(null)
  const autoSheetKeyRef = useRef<string | null>(null)

  const selectSplitGroup = useCallback(
    (version: number) => {
      void version
      return getSplitGroupById(splitGroupId ?? '') ?? getActiveSplitGroup()
    },
    [splitGroupId],
  )

  const selectTradesById = useCallback((version: number) => {
    void version
    return getTradesById()
  }, [])

  const splitGroup = useTradeSession(selectSplitGroup)
  const tradesById = useTradeSession(selectTradesById)

  const dashboard = useTradeSession(
    useCallback(
      (version) => {
        void version
        if (!splitGroup) return null
        return mapSplitGroupToDashboard(splitGroup, tradesById)
      },
      [splitGroup, tradesById],
    ),
  )

  const activeTrade = tradeId ? tradesById.get(tradeId) : undefined
  const matchingAcceptEnabled =
    isActive && Boolean(tradeId) && activeTrade?.status === 'MATCHING'

  const acceptSheet = useMatchingAcceptSheet({
    enabled: matchingAcceptEnabled,
    tradeId: tradeId ?? null,
  })

  const openPaymentSheet = useCallback((targetTradeId: string) => {
    setPaymentSheetTradeId(targetTradeId)
    focusSplitLegTrade(targetTradeId)
  }, [])

  const openDisputeSheet = useCallback((leg: SplitLegViewModel) => {
    setDisputeSheetLeg(leg)
  }, [])

  const closePaymentSheet = useCallback(() => {
    setPaymentSheetTradeId(null)
  }, [])

  const closeDisputeSheet = useCallback(() => {
    setDisputeSheetLeg(null)
  }, [])

  const handleLegPrimaryAction = useCallback(
    (leg: SplitLegViewModel) => {
      if (leg.primaryAction === 'OPEN_DISPUTE') {
        openDisputeSheet(leg)
        return
      }

      if (!leg.tradeId) {
        return
      }

      if (leg.primaryAction === 'VIEW_MATCHING') {
        focusSplitLegTrade(leg.tradeId)
        push('Trade', { tradeId: leg.tradeId, splitGroupId: splitGroupId ?? undefined })
        return
      }

      if (leg.primaryAction === 'NONE') {
        return
      }

      if (
        leg.primaryAction === 'REPORT_PAYMENT' ||
        leg.primaryAction === 'CONFIRM_PAYMENT' ||
        leg.primaryAction === 'VIEW_DETAIL'
      ) {
        openPaymentSheet(leg.tradeId)
      }
    },
    [openDisputeSheet, openPaymentSheet, push, splitGroupId],
  )

  const handleBrowseStore = useCallback(() => {
    push('Detail', { id: 'store' }, { animate: true })
  }, [push])

  const handleBrowseCommunity = useCallback(() => {
    push('Detail', { id: 'community' }, { animate: true })
  }, [push])

  const handleGoHome = useCallback(() => {
    replace('Home', {}, { animate: true })
  }, [replace])

  useEffect(() => {
    autoSheetKeyRef.current = null
    focusHandledRef.current = null
  }, [tradeId, splitGroupId])

  /** Binding 직후 구매자 입금 시트 자동 오픈 (정책 C) */
  useEffect(() => {
    if (!isActive) return

    setOnTradeMatched((matchedTradeId) => {
      focusSplitLegTrade(matchedTradeId)
      const detail = getTradeDetail(matchedTradeId)
      if (!detail || detail.status !== 'PAYMENT_PENDING') return

      if (detail.role === 'BUYER') {
        setPaymentSheetTradeId(matchedTradeId)
      }
    })

    return () => setOnTradeMatched(null)
  }, [isActive])

  /** focusLeg param — leg CTA deep link */
  useEffect(() => {
    if (!focusLeg || !dashboard) return
    const focusKey = `${splitGroupId ?? ''}:${focusLeg}`
    if (focusHandledRef.current === focusKey) return

    const leg = dashboard.legs.find((item) => String(item.index) === focusLeg)
    if (!leg) return

    focusHandledRef.current = focusKey
    handleLegPrimaryAction(leg)
  }, [dashboard, focusLeg, handleLegPrimaryAction, splitGroupId])

  /** MATCHING leg 진입 시 매칭 세션 포커스 */
  useEffect(() => {
    if (!isActive || !tradeId) return

    const trade = tradesById.get(tradeId)
    if (trade?.status === 'MATCHING') {
      focusSplitLegTrade(tradeId)
    }
  }, [isActive, tradeId, tradesById])

  /** 단건 tradeId 진입 시 PAYMENT 상태별 leg 시트 자동 오픈 (1회/상태) */
  useEffect(() => {
    if (!isActive || !tradeId || splitGroupId) return

    const trade = tradesById.get(tradeId)
    if (!trade) return

    const sheetKey = getPaymentSheetAutoOpenKey(trade)
    if (!shouldOpenPaymentSheet(trade)) {
      if (autoSheetKeyRef.current?.startsWith(`${tradeId}:`)) {
        autoSheetKeyRef.current = sheetKey
      }
      return
    }

    if (autoSheetKeyRef.current === sheetKey) return
    autoSheetKeyRef.current = sheetKey
    openPaymentSheet(tradeId)
  }, [isActive, openPaymentSheet, splitGroupId, tradeId, tradesById])

  const handleSingleTradeContinue = useCallback(() => {
    if (!tradeId) return

    const trade = tradesById.get(tradeId)
    if (!trade) return

    if (shouldOpenPaymentSheet(trade)) {
      openPaymentSheet(tradeId)
    }
  }, [openPaymentSheet, tradeId, tradesById])

  return {
    tradeId,
    splitGroupId,
    focusLeg,
    dashboard,
    paymentSheetTradeId,
    disputeSheetLeg,
    closePaymentSheet,
    closeDisputeSheet,
    handleLegPrimaryAction,
    handleSingleTradeContinue,
    handleBrowseStore,
    handleBrowseCommunity,
    handleGoHome,
    openPaymentSheet,
    acceptOpen: acceptSheet.acceptOpen,
    acceptCandidate: acceptSheet.acceptCandidate,
    onAcceptOpenChange: acceptSheet.onAcceptOpenChange,
    onAcceptConfirm: acceptSheet.onAcceptConfirm,
    openAcceptForCandidate: acceptSheet.openAcceptForCandidate,
  }
}
