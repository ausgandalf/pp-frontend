import categories from '@/mocks/categories.json'

/** UK filter regions (same list as `categories.json` → `region`). */
export const UK_REGIONS = categories.region as readonly string[]

export function regionToSlug(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/\s*&\s*/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

const SLUG_TO_CANONICAL: Record<string, string> = Object.fromEntries(
  UK_REGIONS.map((r) => [regionToSlug(r), r]),
)

/** Resolve `?region=` slug (or exact label) to canonical region string. */
export function regionSlugToCanonical(param: string): string | undefined {
  const raw = param.trim()
  if (!raw || raw === 'all') return undefined
  const asSlug = raw.toLowerCase()
  if (SLUG_TO_CANONICAL[asSlug]) return SLUG_TO_CANONICAL[asSlug]
  const direct = UK_REGIONS.find((r) => r === raw || r.toLowerCase() === asSlug)
  return direct
}
