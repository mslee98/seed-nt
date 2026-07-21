import { ActionButton } from 'seed-design/ui/action-button'

interface MatchingBottomActionsProps {
  onStopMatching: () => void
  disabled?: boolean
}

export function MatchingBottomActions({
  onStopMatching,
  disabled = false,
}: MatchingBottomActionsProps) {
  return (
    <ActionButton
      size="large"
      variant="neutralOutline"
      width="full"
      disabled={disabled}
      onClick={onStopMatching}
    >
      찾기 중단
    </ActionButton>
  )
}
