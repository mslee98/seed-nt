import { Box } from '@seed-design/react'

import { RESULT_HERO_LOTTIE_SIZE } from '../../../shared/constants/motion'
import type { MotionAssetKey } from '../constants/motionAssets'
import { TradeMotion } from './TradeMotion'

type TradeHeroMotionVariant = Extract<MotionAssetKey, 'completed' | 'paymentTransfer'>

interface TradeHeroMotionProps {
  variant: TradeHeroMotionVariant
  mountWhen?: boolean
}

/** SignupComplete ResultSection asset 과 동일한 크기·가운데 정렬 */
export function TradeHeroMotion({ variant, mountWhen = true }: TradeHeroMotionProps) {
  return (
    <Box pb="x4" display="flex" justifyContent="center" width="full">
      <TradeMotion
        variant={variant}
        size={RESULT_HERO_LOTTIE_SIZE}
        mountWhen={mountWhen}
      />
    </Box>
  )
}
