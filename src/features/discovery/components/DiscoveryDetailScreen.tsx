import { DiscoveryPlaceholderScreen } from '../../discovery/components/DiscoveryPlaceholderScreen'

interface DiscoveryDetailProps {
  variant: 'store' | 'community'
}

export function DiscoveryDetailScreen({ variant }: DiscoveryDetailProps) {
  return <DiscoveryPlaceholderScreen variant={variant} />
}
