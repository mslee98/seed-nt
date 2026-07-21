import { TagGroupItem, TagGroupRoot } from 'seed-design/ui/tag-group'

import type { MatchingCandidate } from '../matching/types'

interface MatchingCandidateTagGroupProps {
  candidate: MatchingCandidate
}

export function MatchingCandidateTagGroup({ candidate }: MatchingCandidateTagGroupProps) {
  return (
    <TagGroupRoot size="t3" tone="neutralSubtle">
      <TagGroupItem label={`완료 거래 ${candidate.tradeCount}건`} />
      <TagGroupItem label={`완료율 ${candidate.completionRatePct}%`} />
      <TagGroupItem label={`평균 응답 ${candidate.avgResponseSec}초`} />
    </TagGroupRoot>
  )
}
