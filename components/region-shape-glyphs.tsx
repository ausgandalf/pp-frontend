import { cn } from '@/lib/utils'

/**
 * Stylised “patch” silhouettes (48×48) — one distinct shape per UK region filter.
 * Used inside region radio tiles; `currentColor` inherits from the parent.
 */
export const REGION_SHAPE_PATHS: Record<string, string> = {
  'South West': 'M8 30 L22 24 L30 42 L10 44 Z',
  'South East': 'M28 26 L44 24 L46 40 L30 42 L24 32 Z',
  'East Midlands': 'M22 18 L36 18 L38 30 L24 32 L18 24 Z',
  'West Midlands': 'M12 20 L26 18 L28 30 L14 32 L10 24 Z',
  'North West': 'M6 10 L24 8 L28 24 L10 28 L4 18 Z',
  'North East': 'M30 8 L46 10 L44 24 L28 22 L26 14 Z',
  Yorkshire: 'M20 12 L40 14 L38 26 L18 24 L16 16 Z',
  London: 'M18 36 L32 36 L32 44 L18 44 Z',
  Scotland: 'M16 4 L44 6 L42 20 L18 18 L12 10 Z',
  Wales: 'M6 22 L16 20 L18 44 L8 46 Z',
}

type RegionShapeGlyphProps = {
  region: string
  className?: string
}

export function RegionShapeGlyph({ region, className }: RegionShapeGlyphProps) {
  const d = REGION_SHAPE_PATHS[region]
  if (!d) {
    return (
      <svg viewBox="0 0 48 48" className={cn('shrink-0', className)} aria-hidden>
        <rect
          x="10"
          y="14"
          width="28"
          height="22"
          rx="3"
          className="fill-none stroke-current stroke-[1.75] opacity-50"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 48 48" className={cn('shrink-0', className)} aria-hidden>
      <path
        d={d}
        className="fill-current/20 stroke-current stroke-[1.75]"
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}
