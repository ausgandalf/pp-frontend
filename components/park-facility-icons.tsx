import type { LucideIcon } from 'lucide-react'
import {
  Accessibility,
  Car,
  CircleDotDashed,
  Coffee,
  Dog,
  Droplets,
  Dumbbell,
  FerrisWheel,
  Flame,
  Footprints,
  GlassWater,
  PawPrint,
  PlugZap,
  Recycle,
  ShowerHead,
  Sparkles,
  Store,
  Table2,
  Toilet,
  Trash2,
  Trees,
  Umbrella,
  WashingMachine,
  Waves,
  Wifi,
} from 'lucide-react'

/** Lucide icons + labels for park cards (touring `facilities[]` + boolean `amenities`). */
export const FACILITY_ICON_MAP: Record<string, { Icon: LucideIcon; label: string }> = {
  electric_hookup: { Icon: PlugZap, label: 'Power hook-up' },
  water_hookup: { Icon: Droplets, label: 'Water hook-up' },
  grey_waste: { Icon: CircleDotDashed, label: 'Grey waste' },
  black_waste: { Icon: Recycle, label: 'Black waste / cassette' },
  wifi: { Icon: Wifi, label: 'Wi‑Fi' },
  pet: { Icon: PawPrint, label: 'Pet friendly' },
  pet_allowed: { Icon: PawPrint, label: 'Pet friendly' },
  dog_walks_on_site: { Icon: Dog, label: 'Dog walks on site' },
  dog_friendly: { Icon: Dog, label: 'Dogs welcome' },
  swimming_pool: { Icon: Waves, label: 'Swimming pool' },
  dump_station: { Icon: Trash2, label: 'Dump station' },
  laundry: { Icon: WashingMachine, label: 'Laundry' },
  shop_onsite: { Icon: Store, label: 'Shop on site' },
  playground: { Icon: FerrisWheel, label: 'Playground' },
  toilets: { Icon: Toilet, label: 'Toilets' },
  bbq_area: { Icon: Flame, label: 'BBQ area' },
  picnic_tables: { Icon: Table2, label: 'Picnic tables' },
  car_parking: { Icon: Car, label: 'Parking' },
  disabled_access: { Icon: Accessibility, label: 'Accessible' },
  picnic_shelters: { Icon: Umbrella, label: 'Picnic shelters' },
  walking_tracks: { Icon: Footprints, label: 'Walking tracks' },
  sports_facilities: { Icon: Dumbbell, label: 'Sports facilities' },
  nature_trail: { Icon: Trees, label: 'Nature trail' },
  cafe_refreshments: { Icon: Coffee, label: 'Café & refreshments' },
  showers: { Icon: ShowerHead, label: 'Showers' },
  drinking_water: { Icon: GlassWater, label: 'Drinking water' },
}

/** Sort: touring essentials first, then amenities, then unknown keys last. */
const DISPLAY_ORDER: string[] = [
  'electric_hookup',
  'water_hookup',
  'grey_waste',
  'black_waste',
  'wifi',
  'swimming_pool',
  'dump_station',
  'pet',
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
]

function orderIndex(key: string): number {
  const i = DISPLAY_ORDER.indexOf(key)
  return i === -1 ? 900 + key.charCodeAt(0) : i
}

function humanizeKey(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

type ParkLike = {
  facilities?: { type: string; value: string }[] | null
  amenities?: Record<string, boolean> | null
}

/** Keys present on the park (`pet_allowed` + `dog_friendly` → single `pet`). */
function collectFacilityKeys(park: ParkLike): Set<string> {
  const keys = new Set<string>()
  for (const f of park.facilities ?? []) {
    keys.add(f.type === 'pet_allowed' ? 'pet' : f.type)
  }
  for (const [k, v] of Object.entries(park.amenities ?? {})) {
    if (!v) continue
    keys.add(k === 'dog_friendly' || k === 'pet_allowed' ? 'pet' : k)
  }
  return keys
}

export type FacilityDisplayItem = {
  key: string
  Icon: LucideIcon
  label: string
}

/** Icon used on park cards / facility filter for a touring key (`FACILITY_FILTER_KEYS`). */
export function getFacilityIconForType(type: string): LucideIcon {
  return FACILITY_ICON_MAP[type]?.Icon ?? Sparkles
}

export function getParkFacilityDisplayItems(park: ParkLike): FacilityDisplayItem[] {
  const present = collectFacilityKeys(park)
  const sorted = [...present].sort((a, b) => orderIndex(a) - orderIndex(b))
  const out: FacilityDisplayItem[] = []
  for (const key of sorted) {
    const mapped = FACILITY_ICON_MAP[key]
    if (mapped) {
      out.push({ key, Icon: mapped.Icon, label: mapped.label })
    } else {
      out.push({
        key,
        Icon: Sparkles,
        label: humanizeKey(key),
      })
    }
  }
  return out
}
