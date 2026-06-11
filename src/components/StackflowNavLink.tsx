import { Link } from '@stackflow/link'
import type { InferActivityParams, RegisteredActivityName } from '@stackflow/config'
import { Text } from '@seed-design/react'

interface StackflowNavLinkProps<K extends RegisteredActivityName> {
  activityName: K
  activityParams: InferActivityParams<K>
  label: string
  color?: 'fg.brand' | 'fg.informative'
}

export function StackflowNavLink<K extends RegisteredActivityName>({
  activityName,
  activityParams,
  label,
  color = 'fg.brand',
}: StackflowNavLinkProps<K>) {
  return (
    <Link
      activityName={activityName}
      activityParams={activityParams}
      style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}
    >
      <Text textStyle="t4Medium" color={color} as="span">
        {label}
      </Text>
    </Link>
  )
}
