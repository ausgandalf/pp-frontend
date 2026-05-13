type ParkFacilitiesPick = {
  facilities?: { type: string; value: string }[] | null
  amenities?: Record<string, boolean> | null
}

/**
 * All facility keys that can appear in the `facilities` URL param and filter UI.
 * Order = drawer display order.
 */
export const FACILITY_FILTER_KEYS = [
  'electric_hookup',
  'wifi',
  'water_hookup',
  'grey_waste',
  'black_waste',
  'swimming_pool',
  'dump_station',
  'pet_allowed',
  'dog_walks_on_site',
  'playground',
  'toilets',
  'showers',
  'laundry',
  'shop_onsite',
  'drinking_water',
  'bbq_area',
  'picnic_tables',
  'picnic_shelters',
  'cafe_refreshments',
  'car_parking',
  'disabled_access',
  'walking_tracks',
  'nature_trail',
  'sports_facilities',
] as const

const LABELS: Record<string, string> = {
  electric_hookup: 'Power hook-up',
  water_hookup: 'Water hook-up',
  grey_waste: 'Grey waste',
  black_waste: 'Black waste / cassette',
  wifi: 'Wi‑Fi',
  swimming_pool: 'Swimming pool',
  dump_station: 'Dump station',
  pet_allowed: 'Pet friendly',
  dog_walks_on_site: 'Dog walks on site',
  playground: 'Playground',
  toilets: 'Toilets',
  showers: 'Showers',
  laundry: 'Laundry',
  shop_onsite: 'Shop on site',
  drinking_water: 'Drinking water',
  bbq_area: 'BBQ area',
  picnic_tables: 'Picnic tables',
  picnic_shelters: 'Picnic shelters',
  cafe_refreshments: 'Café & refreshments',
  car_parking: 'Parking',
  disabled_access: 'Accessible',
  walking_tracks: 'Walking tracks',
  nature_trail: 'Nature trail',
  sports_facilities: 'Sports facilities',
}

/** Remove trailing “hook-up” style wording (e.g. “Power hook-up” → “Power”). */
function stripHookupPhrasing(label: string): string {
  return label
    .replace(/\s*hook[\s-]*up\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

export function getFacilityFilterLabel(type: string): string {
  const raw =
    LABELS[type] ?? type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  return stripHookupPhrasing(raw)
}
export function getFacilityFilterOptions(): { type: string; label: string }[] {
  return FACILITY_FILTER_KEYS.map((type) => ({
    type,
    label: getFacilityFilterLabel(type),
  }))
}

/** True if the park satisfies one selected filter key (pitch `facilities[]` and/or `amenities`). */
export function parkMatchesFacilityFilter(p: ParkFacilitiesPick, key: string): boolean {
  const facTypes = new Set((p.facilities ?? []).map((f) => f.type))
  if (facTypes.has(key)) return true
  if (p.amenities?.[key]) return true

  if (key === 'pet_allowed') {
    return (
      facTypes.has('pet_allowed') ||
      p.amenities?.dog_friendly === true ||
      p.amenities?.pet_allowed === true
    )
  }

  if (key === 'dog_walks_on_site') {
    return facTypes.has('dog_walks_on_site') || facTypes.has('dog_walk_on_site')
  }

  if (key === 'swimming_pool') {
    return facTypes.has('swimming_pool') || p.amenities?.swimming_pool === true
  }

  return false
}
