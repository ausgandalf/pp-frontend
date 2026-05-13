/**
 * Builds mocks/parks.json with 87 parks: enriches existing rows + appends AU rows
 * from the first names visible on the provided spreadsheet image (exact names are
 * best replaced by pasting a CSV export when available).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const target = path.join(root, 'mocks', 'parks.json')

const AMENITY_KEYS = [
  'playground',
  'toilets',
  'bbq_area',
  'picnic_tables',
  'car_parking',
  'disabled_access',
  'dog_friendly',
  'picnic_shelters',
  'walking_tracks',
  'sports_facilities',
  'nature_trail',
  'cafe_refreshments',
  'showers',
  'drinking_water',
]

const OPENING_OPTIONS = [
  'Open all year',
  'Dawn to dusk',
  '06:00–22:00 daily',
  'Seasonal: 1 Mar – 30 Nov',
  '24-hour pedestrian access',
  'Sunrise to sunset',
]

const NOTE_SNIPPETS = [
  'Wheelchair-accessible paths in the main precinct.',
  'Dogs on leash permitted; signed off-lead exercise area.',
  'Portable BBQs allowed in designated picnic zones only.',
  'Free general entry; some events may charge a separate ticket.',
  'Paid parking applies on weekends and public holidays.',
  'Visitor information available at the main gate weekends.',
  'Connects to regional walking and cycling network.',
]

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function ukPostcodeFromAddress(addr) {
  if (!addr) return null
  const m = addr.match(/\b([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})\b/i)
  return m ? m[1].toUpperCase().replace(/\s+/, ' ') : null
}

function amenitiesFor(id) {
  const o = {}
  for (let i = 0; i < AMENITY_KEYS.length; i++) {
    const k = AMENITY_KEYS[i]
    o[k] = ((Number(id) * (i + 13)) % 5) !== 0
  }
  return o
}

function touringFacilities(id, isAu) {
  const base = []
  if ((id * 3) % 4 !== 0) base.push({ type: 'wifi', value: isAu ? 'Park Wi‑Fi' : 'Free' })
  if ((id * 5) % 3 === 0) base.push({ type: 'pet_allowed', value: isAu ? 'On leash' : 'Yes' })
  if (!isAu && id % 4 !== 1) {
    base.push({ type: 'electric_hookup', value: id % 2 === 0 ? '32 amp' : '16 amp' })
    base.push({ type: 'water_hookup', value: id % 3 === 0 ? 'Personal' : 'Shared' })
  }
  if ((id * 7) % 5 === 0) base.push({ type: 'dump_station', value: 'On site' })
  if ((id * 11) % 6 === 0) base.push({ type: 'swimming_pool', value: 'Seasonal' })
  if (base.length === 0) {
    base.push({ type: 'wifi', value: 'Limited' })
    base.push({ type: 'pet_allowed', value: 'Restrictions apply' })
  }
  return base
}

const EXTRA_AU = [
  ['Abbotsford Cove', 'Sydney', 'NSW', 'Harbour-side open space with views and walking links.'],
  ['Adelaide Hill Park', 'Adelaide', 'SA', 'Hills lookout park popular for picnics and short walks.'],
  ['Agnes Banks Nature Reserve', 'Agnes Banks', 'NSW', 'Bushland reserve with walking tracks and birdlife.'],
  ['Albermarle Park', 'Sydney', 'NSW', 'Neighbourhood park with playground and shaded seating.'],
  ['Alexandria Park', 'Alexandria', 'NSW', 'Sports fields, playground, and community events space.'],
  ['Ashfield Park', 'Ashfield', 'NSW', 'Town park with mature trees and picnic facilities.'],
  ['Banksmeadow Reserve', 'Banksmeadow', 'NSW', 'Wetland margins and shared paths for walking and cycling.'],
  ['Bankstown City Gardens', 'Bankstown', 'NSW', 'Formal gardens and family-friendly lawns.'],
  ['Barangaroo Parklands', 'Sydney', 'NSW', 'Waterfront parklands with cultural walks and harbour access.'],
  ['Bicentennial Park Glebe', 'Glebe', 'NSW', 'Open parkland near the bay with cycle routes.'],
  ['Blacktown Showground', 'Blacktown', 'NSW', 'Showground precinct with events space and playgrounds.'],
  ['Bonna Reserve Sydney', 'Sydney', 'NSW', 'Local reserve with playground and dog-friendly zones.'],
  ['Bradfield Park North', 'Milsons Point', 'NSW', 'Harbour bridge approach lawns and picnic spots.'],
  ['Bronte Gully Reserve', 'Bronte', 'NSW', 'Gully bushland link to coastal walks.'],
  ['Burwood Park Central', 'Burwood', 'NSW', 'Heritage park with rotunda and community gatherings.'],
  ['Camellia Gardens East', 'Caringbah', 'NSW', 'Garden walks, ponds, and accessible paths.'],
  ['Centennial Park Moore Park', 'Sydney', 'NSW', 'Major metropolitan parklands for cycling and events.'],
  ['Chatswood Rotary Park', 'Chatswood', 'NSW', 'Neighbourhood playground and shaded seating.'],
  ['Clovelly Beach Reserve', 'Clovelly', 'NSW', 'Coastal reserve with ocean pool access nearby.'],
  ['Coogee Foreshore Park', 'Coogee', 'NSW', 'Beach foreshore lawns and coastal walk connections.'],
  ['Croydon Memorial Park', 'Croydon', 'NSW', 'Memorial gardens and quiet picnic pockets.'],
  ['Curl Curl Lagoon Park', 'Curl Curl', 'NSW', 'Lagoon boardwalks and birdwatching viewpoints.'],
  ['Dawes Point Reserve Sydney', 'Dawes Point', 'NSW', 'Historic headland with harbour panoramas.'],
  ['Eveleigh Green', 'Eveleigh', 'NSW', 'Urban green link near rail workshops heritage area.'],
  ['Fairfield Adventure Park', 'Fairfield', 'NSW', 'Large adventure playground and splash play seasonally.'],
  ['Gosford Regional Reserve', 'Gosford', 'NSW', 'Regional open space with trails and picnic hubs.'],
  ['Harris Park Greens', 'Harris Park', 'NSW', 'River corridor lawns and family picnic tables.'],
  ['Henson Recreation Ground', 'Marrickville', 'NSW', 'Sports oval and playground with clubhouse access.'],
  ['Iron Cove Bay Park', 'Rozelle', 'NSW', 'Bay walk circuit connections and harbour views.'],
  ['Jacka Street Community Park', 'North Sydney', 'NSW', 'Compact community pocket park.'],
  ['Kellyville Ridge Park', 'Kellyville', 'NSW', 'Suburban park with playground and shared paths.'],
  ['Moore Park West', 'Moore Park', 'NSW', 'Sports precinct edges with cycle links to the city.'],
  ['Narrabeen Lagoon Park', 'Narrabeen', 'NSW', 'Lagoon foreshore paths and paddle launch points.'],
  ['Oak Flats Recreation Ground', 'Oak Flats', 'NSW', 'District playing fields and playground.'],
  ['Parramatta River Park', 'Parramatta', 'NSW', 'Riverfront promenade and event lawns.'],
  ['Quakers Hill Commons', 'Quakers Hill', 'NSW', 'Open commons with dog off-lead times posted.'],
  ['Rhodes Waterside Park', 'Rhodes', 'NSW', 'Waterfront park with cycling and picnic shelters.'],
]

function enrichUkPark(p) {
  const id = Number(p.id)
  const pc = p.postcode || ukPostcodeFromAddress(p.address) || `EX${20 + (id % 9)} ${1 + (id % 4)}AA`
  const lat = 50.2 + (id % 40) * 0.055
  const lng = -5.4 - (id % 35) * 0.038
  return {
    ...p,
    postcode: pc,
    country: 'United Kingdom',
    latitude: Math.round(lat * 1e6) / 1e6,
    longitude: Math.round(lng * 1e6) / 1e6,
    phone: `+44 (0)1693 ${String(100000 + id * 97).slice(0, 6)}`,
    email: `info@${p.slug}.example.co.uk`,
    website: `https://www.${p.slug}.example.co.uk`,
    opening_hours: OPENING_OPTIONS[id % OPENING_OPTIONS.length],
    additional_notes: NOTE_SNIPPETS[id % NOTE_SNIPPETS.length],
    details_url: `https://maps.example.co.uk/parks/${p.slug}`,
    amenities: amenitiesFor(id),
    facilities: p.facilities?.length ? p.facilities : touringFacilities(id, false),
  }
}

function buildAuPark(row, id) {
  const [name, city, state, desc] = row
  const slug = slugify(name)
  const pc = `${2000 + (id % 799)}`
  const lat = -33.86 + (id % 15) * 0.018
  const lng = 151.1 + (id % 18) * 0.022
  const featured = id % 11 === 0
  const rating = Math.round((40 + (id * 7) % 9) * 0.1 * 10) / 10
  const reviews = 5 + (id * 17) % 120
  return {
    id,
    name,
    slug,
    city,
    state,
    postcode: pc,
    country: 'Australia',
    address: `${name}, ${city} ${state} ${pc}`,
    short_description: desc,
    featured_image: `/images/parks/featured/${slug}.jpg`,
    image_url: `/images/parks/gallery/${slug}-hero.jpg`,
    is_featured: featured,
    average_rating: rating,
    total_reviews: reviews,
    facilities: touringFacilities(id, true),
    latitude: Math.round(lat * 1e6) / 1e6,
    longitude: Math.round(lng * 1e6) / 1e6,
    phone: `+61 2 ${8000 + (id % 999)} ${1000 + (id % 8999)}`,
    email: `visitors@${slug}.example.com.au`,
    website: `https://www.${slug}.example.com.au`,
    opening_hours: OPENING_OPTIONS[id % OPENING_OPTIONS.length],
    additional_notes: NOTE_SNIPPETS[id % NOTE_SNIPPETS.length],
    details_url: `https://maps.example.com.au/park/${slug}`,
    amenities: amenitiesFor(id),
  }
}

const raw = JSON.parse(fs.readFileSync(target, 'utf8'))
const enrichedUk = raw.parks.map((p) => enrichUkPark(p))
const auParks = EXTRA_AU.map((row, i) => buildAuPark(row, 51 + i))
const parks = [...enrichedUk, ...auParks]
const total = parks.length
const pageSize = 12
const out = {
  parks,
  meta: {
    total,
    page: 1,
    page_size: pageSize,
    total_pages: Math.max(1, Math.ceil(total / pageSize)),
  },
}
fs.writeFileSync(target, JSON.stringify(out, null, 2) + '\n', 'utf8')
console.log('Wrote', target, 'parks:', total, 'pages:', out.meta.total_pages)
