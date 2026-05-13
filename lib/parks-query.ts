/** URL query shape for `/parks` listing (shared by page, pagination, and client toolbar). */

export type ParksQueryParams = {
  location?: string
  /** UK regions: comma-separated URL slugs (`regionToSlug`); park matches if in any selected region. */
  region?: string
  checkIn?: string
  checkOut?: string
  guests?: string
  featured?: string
  minPrice?: string
  maxPrice?: string
  minRating?: string
  facilities?: string
  sort?: string
  page?: string
}

export function buildParksQueryString(sp: ParksQueryParams, page?: number): string {
  const entries: [string, string][] = []
  if (sp.location) entries.push(['location', sp.location])
  if (sp.region?.trim()) entries.push(['region', sp.region.trim()])
  if (sp.checkIn) entries.push(['checkIn', sp.checkIn])
  if (sp.checkOut) entries.push(['checkOut', sp.checkOut])
  if (sp.guests) entries.push(['guests', sp.guests])
  if (sp.featured) entries.push(['featured', sp.featured])
  if (sp.minPrice) entries.push(['minPrice', sp.minPrice])
  if (sp.maxPrice) entries.push(['maxPrice', sp.maxPrice])
  if (sp.minRating && sp.minRating !== 'any') entries.push(['minRating', sp.minRating])
  if (sp.facilities) entries.push(['facilities', sp.facilities])
  if (sp.sort && sp.sort !== 'featured') entries.push(['sort', sp.sort])
  entries.push(['page', String(page ?? Math.max(1, parseInt(sp.page || '1', 10) || 1))])
  return new URLSearchParams(entries).toString()
}

export function parseFacilitiesParam(facilities: string | undefined): string[] {
  if (!facilities?.trim()) return []
  return facilities.split(',').map((s) => s.trim()).filter(Boolean)
}

export function facilitiesParamWithout(facilities: string | undefined, removeType: string): string | undefined {
  const rest = parseFacilitiesParam(facilities).filter((t) => t !== removeType)
  if (rest.length === 0) return undefined
  return rest.join(',')
}

export function parseRegionParam(region: string | undefined): string[] {
  if (!region?.trim()) return []
  return region
    .split(',')
    .map((s) => s.trim())
    .filter((s) => Boolean(s) && s !== 'all')
}

export function regionParamWithout(region: string | undefined, removeSlug: string): string | undefined {
  const rest = parseRegionParam(region).filter((s) => s !== removeSlug)
  if (rest.length === 0) return undefined
  return rest.join(',')
}

export function searchParamsToParksQuery(sp: URLSearchParams): ParksQueryParams {
  return {
    location: sp.get('location') ?? undefined,
    region: sp.get('region') ?? sp.get('state') ?? undefined,
    checkIn: sp.get('checkIn') ?? undefined,
    checkOut: sp.get('checkOut') ?? undefined,
    guests: sp.get('guests') ?? undefined,
    featured: sp.get('featured') ?? undefined,
    minPrice: sp.get('minPrice') ?? undefined,
    maxPrice: sp.get('maxPrice') ?? undefined,
    minRating: sp.get('minRating') ?? undefined,
    facilities: sp.get('facilities') ?? undefined,
    sort: sp.get('sort') ?? undefined,
    page: sp.get('page') ?? undefined,
  }
}

export function mergeParksQuery(
  current: ParksQueryParams,
  updates: Partial<Record<keyof ParksQueryParams, string | undefined>>,
): ParksQueryParams {
  const next: Record<string, string | undefined> = { ...current }
  for (const [k, v] of Object.entries(updates) as [keyof ParksQueryParams, string | undefined][]) {
    if (v === undefined || v === '') {
      delete next[k as string]
    } else {
      next[k as string] = v
    }
  }
  return next as ParksQueryParams
}
