// Database types for the RV/Caravan Park Booking Platform

export type UserType = 'guest' | 'owner' | 'admin'

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  user_type: UserType
  created_at: string
  updated_at: string
}

export interface Park {
  id: string
  owner_id: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  address: string | null
  city: string | null
  state: string | null
  postcode: string | null
  country: string
  latitude: number | null
  longitude: number | null
  phone: string | null
  email: string | null
  website: string | null
  check_in_time: string
  check_out_time: string
  min_stay_nights: number
  max_stay_nights: number
  is_published: boolean
  is_featured: boolean
  average_rating: number
  total_reviews: number
  created_at: string
  updated_at: string
}

export interface ParkImage {
  id: string
  park_id: string
  url: string
  alt_text: string | null
  is_primary: boolean
  display_order: number
  created_at: string
}

export interface Facility {
  id: string
  name: string
  icon: string | null
  category: 'amenities' | 'activities' | 'services' | 'accessibility'
  created_at: string
}

export interface ParkFacility {
  id: string
  park_id: string
  facility_id: string
  notes: string | null
  created_at: string
  facility?: Facility
}

export interface PitchType {
  id: string
  name: string
  description: string | null
  icon: string | null
  created_at: string
}

export interface Pitch {
  id: string
  park_id: string
  pitch_type_id: string | null
  name: string
  description: string | null
  max_length_meters: number | null
  max_width_meters: number | null
  has_power: boolean
  has_water: boolean
  has_sewer: boolean
  is_pull_through: boolean
  is_shaded: boolean
  base_price_per_night: number
  max_guests: number
  max_vehicles: number
  is_active: boolean
  created_at: string
  updated_at: string
  pitch_type?: PitchType
}

export interface PricingRule {
  id: string
  park_id: string
  pitch_id: string | null
  name: string
  rule_type: 'seasonal' | 'weekend' | 'holiday' | 'special'
  price_modifier_type: 'fixed' | 'percentage' | 'absolute'
  price_modifier_value: number
  start_date: string | null
  end_date: string | null
  days_of_week: number[] | null
  min_stay_nights: number | null
  is_active: boolean
  created_at: string
}

export interface AvailabilityBlock {
  id: string
  pitch_id: string
  start_date: string
  end_date: string
  reason: string | null
  created_at: string
}

export type RigType = 'motorhome' | 'caravan' | 'camper_trailer' | 'fifth_wheel' | 'tent' | 'other'
export type PowerRequirement = '15amp' | '10amp' | 'none'

export interface RigProfile {
  id: string
  user_id: string
  name: string
  rig_type: RigType
  make: string | null
  model: string | null
  year: number | null
  length_meters: number | null
  width_meters: number | null
  height_meters: number | null
  weight_kg: number | null
  has_slide_outs: boolean
  slide_out_length: number | null
  power_requirement: PowerRequirement
  is_default: boolean
  created_at: string
  updated_at: string
}

export type BookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show'
export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded'

export interface Booking {
  id: string
  booking_reference: string
  park_id: string
  pitch_id: string
  guest_id: string
  rig_profile_id: string | null
  check_in_date: string
  check_out_date: string
  num_guests: number
  num_vehicles: number
  total_nights: number
  subtotal: number
  fees: number
  taxes: number
  total_price: number
  status: BookingStatus
  payment_status: PaymentStatus
  guest_notes: string | null
  owner_notes: string | null
  cancelled_at: string | null
  cancellation_reason: string | null
  created_at: string
  updated_at: string
  park?: Park
  pitch?: Pitch
  guest?: Profile
  rig_profile?: RigProfile
}

export interface Review {
  id: string
  park_id: string
  booking_id: string | null
  guest_id: string
  rating: number
  title: string | null
  content: string | null
  owner_response: string | null
  owner_response_at: string | null
  is_verified: boolean
  is_published: boolean
  created_at: string
  updated_at: string
  guest?: Profile
}

export interface SavedPark {
  id: string
  user_id: string
  park_id: string
  created_at: string
  park?: Park
}

export interface ParkDirections {
  id: string
  park_id: string
  content: string
  gps_coordinates: string | null
  landmarks: string | null
  road_conditions: string | null
  created_at: string
  updated_at: string
}

export interface ParkPolicies {
  id: string
  park_id: string
  cancellation_policy: string | null
  pet_policy: string | null
  quiet_hours: string | null
  visitor_policy: string | null
  fire_policy: string | null
  other_rules: string | null
  created_at: string
  updated_at: string
}

// Extended types with relations
export interface ParkWithDetails extends Park {
  images: ParkImage[]
  facilities: (ParkFacility & { facility: Facility })[]
  pitches: Pitch[]
  directions?: ParkDirections
  policies?: ParkPolicies
  reviews?: Review[]
}

// Search/filter types
export interface ParkSearchFilters {
  query?: string
  city?: string
  state?: string
  facilities?: string[]
  minPrice?: number
  maxPrice?: number
  minRating?: number
  hasPower?: boolean
  petFriendly?: boolean
  checkIn?: string
  checkOut?: string
  guests?: number
}

export interface ParkSearchResult {
  parks: Park[]
  total: number
  page: number
  pageSize: number
}
