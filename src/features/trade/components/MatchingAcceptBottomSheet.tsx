import { useRef } from 'react'
import { useActivityZIndexBase } from '@seed-design/stackflow'
import { Badge, Portal, Text, VStack } from '@seed-design/react'
import { useLoading } from 'react-simplikit'
import { useSnackbarAdapter } from 'seed-design/ui/snackbar'
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from 'seed-design/ui/bottom-sheet'
import { List, ListDivider, ListItem } from 'seed-design/ui/list'

import { useLayoutOverlay } from '../../../app/layouts/useLayoutOverlay'
import { TextLinkButton } from '../../../shared/components/TextLinkButton'
import { BottomActionButton } from '../../../shared/ui/BottomActionButton'
import { formatAmount, formatCoinAmount } from '../../../shared/utils/formatAmount'
import { showSnackbar } from '../../../shared/utils/showSnackbar'
import {
  getMatchingProposalCtaLabel,
  getMatchingProposalMatchBadge,
  getMatchingProposalSubtitle,
  getMatchingProposalTitle,
  getMatchingProposalTrustLine,
  MATCHING_NO_RESTRICTION_HINT,
  MATCHING_PROPOSAL_START_NOTICE,
} from '../copy'
import type { MatchingCandidate } from '../matching/types'

interface MatchingAcceptBottomSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  candidate: MatchingCandidate | null
  onConfirm: (candidateId: string) => void | Promise<void>
  onSkip: (candidateId: string) => void
}

/**
 * 거래 제안 Bottom Sheet — 금액·신뢰 근거·요청 CTA (문서 TradeProposalSheet).
 */
export function MatchingAcceptBottomSheet({
  open,
  onOpenChange,
  candidate,
  onConfirm,
  onSkip,
}: MatchingAcceptBottomSheetProps) {
  const portalContainerRef = useRef<HTMLElement | null>(
    typeof document !== 'undefined' ? document.getElementById('app-frame-portal') : null,
  )
  const layerIndex = useActivityZIndexBase({ activityOffset: 2 })
  const [loading, startLoading] = useLoading()
  const snackbar = useSnackbarAdapter()

  useLayoutOverlay(open)

  if (!candidate) return null

  const coinLabel = formatCoinAmount(candidate.amountKrw)
  const amountLabel = formatAmount(candidate.amountKrw)

  const handleConfirm = () => {
    void startLoading(Promise.resolve(onConfirm(candidate.id)))
  }

  const handleSkip = () => {
    onSkip(candidate.id)
  }

  const handleTrustDetail = () => {
    showSnackbar(snackbar, '거래 신뢰 기준은 곧 자세히 볼 수 있어요.')
  }

  return (
    <BottomSheetRoot open={open} onOpenChange={onOpenChange}>
      <Portal container={portalContainerRef}>
        <BottomSheetContent
          title={getMatchingProposalTitle(coinLabel)}
          layerIndex={layerIndex}
          showHandle
          aria-describedby={undefined}
        >
          <BottomSheetBody>
            <VStack gap="x4" width="full">
              <VStack gap="x2" align="flex-start" width="full">
                <Badge
                  tone={candidate.matchType === 'EXACT' ? 'brand' : 'neutral'}
                  variant="weak"
                  size="medium"
                >
                  {getMatchingProposalMatchBadge(candidate.matchType)}
                </Badge>
                <Text textStyle="t7Bold" color="fg.neutral">
                  {getMatchingProposalTitle(coinLabel)}
                </Text>
                <Text textStyle="t4Medium" color="fg.neutralMuted">
                  {getMatchingProposalSubtitle(candidate.nickname, candidate.tradeCount)}
                </Text>
              </VStack>

              <List width="full" aria-label="거래 조건 요약">
                <ListItem title="입금할 금액" detail={amountLabel} />
                <ListDivider />
                <ListItem title="받을 Coin" detail={coinLabel} />
                <ListDivider />
                <ListItem title="수수료" detail="없어요" />
              </List>

              <VStack gap="x1" align="flex-start" width="full">
                <Text textStyle="t4Medium" color="fg.neutral" className="tabular-nums">
                  {getMatchingProposalTrustLine({
                    completionRatePct: candidate.completionRatePct,
                    avgResponseSec: candidate.avgResponseSec,
                  })}
                </Text>
                <Text textStyle="t3Regular" color="fg.neutralMuted">
                  {MATCHING_NO_RESTRICTION_HINT}
                </Text>
                <TextLinkButton onClick={handleTrustDetail}>거래 정보 자세히 보기</TextLinkButton>
              </VStack>

              <Text textStyle="t4Regular" color="fg.neutralSubtle">
                {MATCHING_PROPOSAL_START_NOTICE}
              </Text>
            </VStack>
          </BottomSheetBody>
          <BottomSheetFooter>
            <VStack gap="x3" width="full" align="center">
              <BottomActionButton
                size="large"
                variant="brandSolid"
                flexGrow
                loading={loading}
                disabled={loading}
                onClick={handleConfirm}
              >
                {getMatchingProposalCtaLabel(coinLabel)}
              </BottomActionButton>
              <TextLinkButton disabled={loading} onClick={handleSkip}>
                이 제안 건너뛰기
              </TextLinkButton>
            </VStack>
          </BottomSheetFooter>
        </BottomSheetContent>
      </Portal>
    </BottomSheetRoot>
  )
}
