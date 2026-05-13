'use client'

import { filterToggleButtonClassName, filterToggleLabelClassName } from '@/lib/filter-toggle-styles'
import { regionToSlug, UK_REGIONS } from '@/lib/park-regions'

type RegionFilterCheckboxStripProps = {
  selected: Set<string>
  onSelectionChange: (next: Set<string>) => void
  id?: string
}

/**
 * Region toggle tiles (`inline-block`, wrapping): selected state via border, ring, and type.
 */
export function RegionFilterCheckboxStrip({
  selected,
  onSelectionChange,
  id,
}: RegionFilterCheckboxStripProps) {
  const toggle = (slug: string) => {
    const next = new Set(selected)
    if (next.has(slug)) next.delete(slug)
    else next.add(slug)
    onSelectionChange(next)
  }

  return (
    <div id={id} className="leading-[0]">
      {UK_REGIONS.map((region) => {
        const slug = regionToSlug(region)
        const checked = selected.has(slug)
        return (
          <button
            key={slug}
            type="button"
            role="checkbox"
            aria-checked={checked}
            onClick={() => toggle(slug)}
            className={filterToggleButtonClassName(checked)}
          >
            <span className={filterToggleLabelClassName}>
              {region}
            </span>
          </button>
        )
      })}
    </div>
  )
}
