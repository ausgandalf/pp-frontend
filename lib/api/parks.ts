import type { Park, ParkImage } from '@/lib/types'
import parksMock from '@/mocks/parks.json'
import { parkMatchesFacilityFilter } from '@/lib/park-facilities-filter'
import { parseRegionParam } from '@/lib/parks-query'
import { regionSlugToCanonical } from '@/lib/park-regions'

import type { ParkListingImport } from '@/lib/park-listing-import'

const BASE = process.env.PLATINUM_PITCHES_API_BASE_URL

export type ParksListMeta = {
  total: number
  page: number
  page_size: number
  total_pages: number
}

/** Parsed from `listing_import.media_gallery_json` with CDN `url`s for Next/Image. */
export type ParkGalleryItem = {
  url: string
  title?: string | null
  alt?: string | null
  slug?: string | null
  width?: number
  height?: number
}

export type ParkListItem = Park & {
  images?: ParkImage[]
  facilities?: { type: string; value: string }[]
  /** Season / hours text from source sheet (e.g. “Open all year”). */
  opening_hours?: string | null
  /** Free-text notes (e.g. column “Additional information”). */
  additional_notes?: string | null
  /** External “more info” URL when present in source data. */
  details_url?: string | null
  /**
   * Boolean amenity flags from spreadsheet Yes/No columns (nice snake_case keys).
   * Distinct from `facilities` (touring pitch types: electric_hookup, wifi, …).
   */
  amenities?: Record<string, boolean>
  /** Original Wix `Main Image` reference (optional). */
  main_image_wix?: string | null
  /** Same source as `listing_import.area_region` (UK area label). */
  region?: string | null
  /** Parsed from `listing_import.views_description` (JSON array of view labels). */
  view?: string[] | null
  /** Parsed Wix media gallery with `https://static.wixstatic.com/media/…` URLs. */
  gallery?: ParkGalleryItem[] | null
  /** Full original CSV row (snake_case); not shown in UI yet. */
  listing_import?: ParkListingImport | null
}

type MockParkRow = {
  id: number | string
  name: string
  slug: string
  city?: string | null
  state?: string | null
  /** Same source as `listing_import.area_region` (UK area label). */
  region?: string | null
  /** Parsed from `listing_import.views_description` (JSON array of view labels). */
  view?: string[] | null
  gallery?: ParkGalleryItem[] | null
  postcode?: string | null
  country?: string | null
  address?: string | null
  short_description?: string | null
  featured_image?: string | null
  /** Alias for featured image URL when exporting from spreadsheets. */
  image_url?: string | null
  /** Original Wix `Main Image` URL (not used by Next/Image until configured). */
  main_image_wix?: string | null
  is_featured?: boolean
  average_rating?: number
  total_reviews?: number
  facilities?: { type: string; value: string }[]
  latitude?: number | null
  longitude?: number | null
  phone?: string | null
  email?: string | null
  website?: string | null
  opening_hours?: string | null
  additional_notes?: string | null
  details_url?: string | null
  amenities?: Record<string, boolean> | null
  listing_import?: ParkListingImport | null
}

type ParksJsonFile = {
  parks: MockParkRow[]
  meta?: Partial<ParksListMeta>
}

function mockRowToPark(row: MockParkRow): ParkListItem {
  const id = String(row.id)
  const imageUrl = row.featured_image || row.image_url
  const images: ParkImage[] | undefined = imageUrl
    ? [
        {
          id: `${id}-img`,
          park_id: id,
          url: imageUrl,
          alt_text: row.name,
          is_primary: true,
          display_order: 0,
          created_at: '',
        },
      ]
    : undefined

  const now = new Date().toISOString()

  return {
    id,
    owner_id: 'mock',
    name: row.name,
    slug: row.slug,
    description: row.short_description ?? null,
    short_description: row.short_description ?? null,
    address: row.address ?? null,
    city: row.city ?? null,
    state: row.state ?? null,
    region: row.region ?? row.state ?? null,
    view: row.view ?? null,
    gallery: row.gallery ?? undefined,
    postcode: row.postcode ?? null,
    country: row.country ?? 'United Kingdom',
    latitude: row.latitude ?? null,
    longitude: row.longitude ?? null,
    phone: row.phone ?? null,
    email: row.email ?? null,
    website: row.website ?? null,
    check_in_time: '14:00',
    check_out_time: '10:00',
    min_stay_nights: 1,
    max_stay_nights: 30,
    is_published: true,
    is_featured: Boolean(row.is_featured),
    average_rating: row.average_rating ?? 0,
    total_reviews: row.total_reviews ?? 0,
    created_at: now,
    updated_at: now,
    images,
    facilities: row.facilities ?? [],
    opening_hours: row.opening_hours ?? null,
    additional_notes: row.additional_notes ?? null,
    details_url: row.details_url ?? null,
    amenities: row.amenities ?? undefined,
    main_image_wix: row.main_image_wix ?? undefined,
    listing_import: row.listing_import ?? undefined,
  }
}

export type GetParksParams = {
  page?: number
  pageSize?: number
  location?: string
  /** UK regions: comma-separated URL slugs; park matches if its region is any of the listed (OR). */
  region?: string
  featured?: string
  minRating?: string
  facilities?: string
  sort?: string
}

function sortParks(list: ParkListItem[], sort: string | undefined): ParkListItem[] {
  const s = sort || 'featured'
  const copy = [...list]
  switch (s) {
    case 'rating':
      return copy.sort((a, b) => b.average_rating - a.average_rating || a.name.localeCompare(b.name))
    case 'reviews':
      return copy.sort((a, b) => b.total_reviews - a.total_reviews || a.name.localeCompare(b.name))
    case 'newest':
      return copy.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime() || a.name.localeCompare(b.name),
      )
    case 'featured':
    default:
      return copy.sort((a, b) => {
        if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1
        return a.name.localeCompare(b.name)
      })
  }
}

function applyFilters(parks: ParkListItem[], params: GetParksParams): ParkListItem[] {
  let list = [...parks]

  const loc = params.location?.trim().toLowerCase()
  if (loc) {
    list = list.filter((p) => {
      const hay = [p.name, p.city, p.state, p.region, p.address, p.short_description]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return hay.includes(loc)
    })
  }

  const regionSlugs = parseRegionParam(params.region)
  if (regionSlugs.length > 0) {
    const canonSet = new Set(
      regionSlugs.map((s) => regionSlugToCanonical(s)).filter((c): c is string => Boolean(c)),
    )
    if (canonSet.size > 0) {
      list = list.filter((p) => {
        const pr = p.region ?? p.state
        return pr != null && canonSet.has(pr)
      })
    }
  }

  if (params.featured === 'true') {
    list = list.filter((p) => p.is_featured)
  }

  const minR = params.minRating ? parseFloat(params.minRating) : NaN
  if (!Number.isNaN(minR)) {
    list = list.filter((p) => p.average_rating >= minR)
  }

  const required = (params.facilities ?? '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
  if (required.length > 0) {
    list = list.filter((p) => required.every((key) => parkMatchesFacilityFilter(p, key)))
  }

  return sortParks(list, params.sort)
}

export type ParksListResponse = {
  parks: ParkListItem[]
  meta: ParksListMeta
}

/**
 * Loads parks for the listing page. Without `PLATINUM_PITCHES_API_BASE_URL`, reads `mocks/parks.json`.
 * With a base URL, calls `GET {BASE}/parks?page=&page_size=` (response shape must match `{ parks, meta }`).
 */
export async function getParks(params: GetParksParams = {}): Promise<ParksListResponse> {
  const page = Math.max(1, params.page ?? 1)
  const pageSize = Math.max(1, params.pageSize ?? 12)

  if (BASE) {
    const url = new URL(`${BASE.replace(/\/$/, '')}/parks`)
    url.searchParams.set('page', String(page))
    url.searchParams.set('page_size', String(pageSize))
    if (params.location) url.searchParams.set('location', params.location)
    if (params.region) url.searchParams.set('region', params.region)
    if (params.featured) url.searchParams.set('featured', params.featured)
    if (params.minRating) url.searchParams.set('min_rating', params.minRating)
    if (params.facilities) url.searchParams.set('facilities', params.facilities)
    if (params.sort) url.searchParams.set('sort', params.sort)

    const res = await fetch(url.toString(), { next: { revalidate: 60 } })
    if (!res.ok) throw new Error('Failed to load parks')
    const json = (await res.json()) as {
      parks: MockParkRow[]
      meta: ParksListMeta
    }
    const parks = json.parks.map(mockRowToPark)
    return { parks, meta: json.meta }
  }

  const file = parksMock as ParksJsonFile
  const all = file.parks.map(mockRowToPark)
  const filtered = applyFilters(all, params)
  const total = filtered.length
  const total_pages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(page, total_pages)
  const offset = (safePage - 1) * pageSize
  const parks = filtered.slice(offset, offset + pageSize)

  return {
    parks,
    meta: {
      total,
      page: safePage,
      page_size: pageSize,
      total_pages,
    },
  }
}
