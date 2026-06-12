import { List, ListItem } from 'seed-design/ui/list'

export interface SummaryItem {
  label: string
  value: string
  visible: boolean
}

interface CompletedSummaryListProps {
  items: SummaryItem[]
}

export function CompletedSummaryList({ items }: CompletedSummaryListProps) {
  const visibleItems = items.filter((item) => item.visible && item.value)
  if (visibleItems.length === 0) return null

  return (
    <List>
      {visibleItems.map((item) => (
        <ListItem key={item.label} title={item.label} detail={item.value} />
      ))}
    </List>
  )
}
