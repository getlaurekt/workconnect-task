import { Badge } from "@workspace/ui/components/badge"

export function ProductStatusBadge({ available }: { available: boolean }) {
  if (!available) {
    return <Badge variant="destructive" text="Niedostępny" />
  }

  return <Badge text="Dostępny" variant="default" />
}
