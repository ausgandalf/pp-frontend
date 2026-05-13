'use client'

import { filterToggleButtonClassName } from '@/lib/filter-toggle-styles'
import { getFacilityFilterOptions } from '@/lib/park-facilities-filter'
import { getFacilityIconForType } from '@/components/park-facility-icons'

const FACILITY_OPTIONS = getFacilityFilterOptions()

type FacilityFilterCheckboxStripProps = {
  selected: Set<string>
  onSelectionChange: (next: Set<string>) => void
  id?: string
}

/**
 * Facility multi-select tiles — same layout and styles as {@link RegionFilterCheckboxStrip}.
 */
export function FacilityFilterCheckboxStrip({
  selected,
  onSelectionChange,
  id,
}: FacilityFilterCheckboxStripProps) {
  const toggle = (type: string) => {
    const next = new Set(selected)
    if (next.has(type)) next.delete(type)
    else next.add(type)
    onSelectionChange(next)
  }

  return (
    <div id={id} className="leading-[0]">
      {FACILITY_OPTIONS.map(({ type, label }) => {
        const checked = selected.has(type)
        const Icon = getFacilityIconForType(type)
        return (
          <button
            key={type}
            type="button"
            role="checkbox"
            aria-checked={checked}
            onClick={() => toggle(type)}
            className={filterToggleButtonClassName(checked)}
          >
            <span className="flex align-bottom justify-center max-w-[min(100%,15rem)] items-center gap-2 text-left font-medium">
              <Icon className={["size-4 shrink-0", checked ? "text-primary" : "text-brand-green"].join(" ")} aria-hidden />
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
