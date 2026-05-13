/**
 * Full Wix CSV export preserved under each mock park’s `listing_import`.
 * Keys mirror `CSV_COLUMN_KEYS` in `scripts/import_parks_csv.py`.
 */
export type ParkListingImport = {
  facebook_uploaded?: string | null
  status?: string | null
  site_name?: string | null
  biggest_pitch_metres?: string | null
  pitch_electricity?: string | null
  water_tap_on_pitch?: string | null
  grey_waste_on_pitch?: string | null
  black_waste_on_pitch?: string | null
  site_access_level?: string | null
  site_full_address?: string | null
  submitted_at?: string | null
  opens_from?: string | null
  closes_on?: string | null
  seasonal_pitches?: string | null
  adults_only?: string | null
  area_region?: string | null
  pitch_types?: string | null
  pitch_parking?: string | null
  dogs_allowed?: string | null
  toilets_on_site?: string | null
  showers_on_site?: string | null
  laundry_on_site?: string | null
  shop_on_site?: string | null
  wifi_on_site?: string | null
  other_amenities_text?: string | null
  follow_sat_nav?: string | null
  sat_nav_avoid_reason?: string | null
  access_ease_notes?: string | null
  access_best_route?: string | null
  views_description?: string | null
  dog_walks_on_site?: string | null
  nearby_shops?: string | null
  tv_freeview?: string | null
  mobile_signal?: string | null
  mobile_data?: string | null
  brief_description?: string | null
  adventure_notes?: string | null
  dining_recommendations?: string | null
  drinks_recommendations?: string | null
  contact_first_name?: string | null
  contact_last_name?: string | null
  contact_email?: string | null
  contact_phone_raw?: string | null
  website_address_raw?: string | null
  open_year_round?: string | null
  publish_date?: string | null
  unpublish_date?: string | null
  message_subject?: string | null
  visitor_message?: string | null
  source_id?: string | null
  created_at_source?: string | null
  updated_at_source?: string | null
  owner_id_source?: string | null
  site_amenities_raw?: string | null
  main_image_wix_raw?: string | null
  media_gallery_json?: string | null
  big_rig_bible_path?: string | null
  big_rig_bible_all?: string | null
}
