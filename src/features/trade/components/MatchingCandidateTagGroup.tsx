import { IconStarFill } from '@karrotmarket/react-monochrome-icon'
import { TagGroupItem, TagGroupRoot } from 'seed-design/ui/tag-group'
import { mannerTempToLevel } from 'seed-design/lib/manner-temp-level'

import type { MatchingCandidate } from '../matching/types'

interface MatchingCandidateTagGroupProps {
  candidate: MatchingCandidate
}

function formatRating(rating: number): string {
  return rating.toFixed(1)
}

function getMannerTrustLabel(temperature: number): string {
  const level = mannerTempToLevel(temperature) ?? 'l5'
  const levelNumber = Number.parseInt(level.slice(1), 10)
  if (levelNumber >= 8) return '신뢰온도 높음'
  if (levelNumber >= 5) return '신뢰온도 보통'
  return '신뢰도 확인 필요'
}

export function MatchingCandidateTagGroup({ candidate }: MatchingCandidateTagGroupProps) {
  return (
    <TagGroupRoot size="t3" tone="neutralSubtle">
      <TagGroupItem label={`거래 ${candidate.tradeCount}회`} />
      <TagGroupItem
        prefixIcon={<IconStarFill />}
        label={formatRating(candidate.rating)}
        aria-label={`평점 ${formatRating(candidate.rating)}`}
      />
      <TagGroupItem label={getMannerTrustLabel(candidate.mannerTemperature)} />
    </TagGroupRoot>
  )
}
