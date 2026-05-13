"""
Import parks from Wix export CSV into mocks/parks.json.
Run from repo root:  python src/scripts/import_parks_csv.py
"""
from __future__ import annotations

import csv
import json
import re
import hashlib
from pathlib import Path

CSV_PATH = Path(r"d:/works/platinum-pitches/res/Others/Platinum Pitches Directory OLD.csv")
OUT_PATH = Path(__file__).resolve().parents[1] / "mocks" / "parks.json"
CATEGORIES_PATH = Path(__file__).resolve().parents[1] / "mocks" / "categories.json"

# Wix "Which Area Do You Belong To?" labels → canonical `categories.json` region names.
AREA_TO_CANONICAL_REGION: dict[str, str] = {
    "South East England": "South East",
    "South West England": "South West",
    "North West England": "North West",
    "North East England": "North East",
    "East Midlands": "East Midlands",
    "West Midlands": "West Midlands",
    "East Anglia": "South East",
    "Devon & Cornwall": "South West",
    "Yorkshire": "Yorkshire",
    "Yorkshire & The Humber": "Yorkshire",
    "Wales": "Wales",
    "North Wales": "Wales",
    "Mid Wales": "Wales",
    "South Wales": "Wales",
    "Scotland": "Scotland",
    "Highlands & Islands": "Scotland",
    "North East Scotland": "Scotland",
    "Central Scotland": "Scotland",
    "South Scotland": "Scotland",
    "Southern England": "South East",
    "Lake District": "North West",
    "Cotswolds": "South West",
    "East of England": "South East",
    "Greater London": "London",
}

_CANONICAL_REGIONS: frozenset[str] | None = None


def get_canonical_regions() -> frozenset[str]:
    global _CANONICAL_REGIONS
    if _CANONICAL_REGIONS is None:
        doc = json.loads(CATEGORIES_PATH.read_text(encoding="utf-8"))
        _CANONICAL_REGIONS = frozenset(str(x) for x in doc.get("region", []))
    return _CANONICAL_REGIONS


def canonical_region_from_area(raw: str | None) -> str | None:
    if not raw:
        return None
    s = str(raw).strip()
    if not s:
        return None
    canon = get_canonical_regions()
    if s in canon:
        return s
    mapped = AREA_TO_CANONICAL_REGION.get(s)
    if mapped and mapped in canon:
        return mapped
    for k, v in AREA_TO_CANONICAL_REGION.items():
        if k.lower() == s.lower() and v in canon:
            return v
    return None

# Every CSV column → stable snake_case key (stored under `listing_import` on each park).
CSV_COLUMN_KEYS: dict[str, str] = {
    "Facebook Uploaded": "facebook_uploaded",
    "Status": "status",
    "Site Name": "site_name",
    "Biggest Pitch Size in Metres": "biggest_pitch_metres",
    "Pitch Electricity": "pitch_electricity",
    "Water tap on pitch": "water_tap_on_pitch",
    "Grey waste ": "grey_waste_on_pitch",
    "Black waste": "black_waste_on_pitch",
    "What is access to the site like": "site_access_level",
    "Site Full Address": "site_full_address",
    "Submission Time": "submitted_at",
    "Date Site Opens From": "opens_from",
    "Date Site Closes": "closes_on",
    "Seasonal Pitches": "seasonal_pitches",
    "Is this an Adults Only site?": "adults_only",
    "Which Area Do You Belong To?": "area_region",
    "Pitch Types": "pitch_types",
    "Pitch Parking": "pitch_parking",
    "Dogs Allowed": "dogs_allowed",
    "Toilets on Site": "toilets_on_site",
    "Showers on Site": "showers_on_site",
    "Laundry on Site": "laundry_on_site",
    "Shop on Site": "shop_on_site",
    "Wifi on Site": "wifi_on_site",
    "Any other amineties on site please let us know.": "other_amenities_text",
    "Should you follow sat nav": "follow_sat_nav",
    "If you should not follow a sat nav, please advise why": "sat_nav_avoid_reason",
    "Please provide reasons why it is hard or easy to access the site": "access_ease_notes",
    "Best route to access site from main road": "access_best_route",
    "What are the views like": "views_description",
    "Are there any dog walks on site": "dog_walks_on_site",
    "Are there any nearby shops": "nearby_shops",
    "Freeview": "tv_freeview",
    "Mobile signal": "mobile_signal",
    "Mobile Data (Internet)": "mobile_data",
    "Brief Description": "brief_description",
    "Adventure inspo": "adventure_notes",
    "Best places to eat": "dining_recommendations",
    "Best places to drink": "drinks_recommendations",
    "First name": "contact_first_name",
    "Last name": "contact_last_name",
    "Email": "contact_email",
    "Phone": "contact_phone_raw",
    "Please enter sites website address": "website_address_raw",
    "Is your site open year round": "open_year_round",
    "Publish Date": "publish_date",
    "Unpublish Date": "unpublish_date",
    "Subject": "message_subject",
    "Your message": "visitor_message",
    "ID": "source_id",
    "Created Date": "created_at_source",
    "Updated Date": "updated_at_source",
    "Owner": "owner_id_source",
    "Site Amineties": "site_amenities_raw",
    "Main Image": "main_image_wix_raw",
    "Media Gallery": "media_gallery_json",
    "The Big Rig Bible": "big_rig_bible_path",
    "The Big Rig Bible (All)": "big_rig_bible_all",
}


def build_listing_import(row: dict) -> dict[str, str | None]:
    out: dict[str, str | None] = {}
    for csv_key, json_key in CSV_COLUMN_KEYS.items():
        raw = row.get(csv_key)
        if raw is None:
            out[json_key] = None
            continue
        s = str(raw).strip()
        out[json_key] = s if s else None
    return out


def slugify(name: str) -> str:
    s = (name or "").lower().strip()
    s = s.replace("'", "")
    s = re.sub(r"[^a-z0-9]+", "-", s)
    s = re.sub(r"-+", "-", s).strip("-")
    return s or "park"


def yes(val: str | None) -> bool:
    if val is None:
        return False
    return str(val).strip().lower() in ("yes", "true", "1", "y")


def uk_postcode(addr: str | None) -> str | None:
    if not addr:
        return None
    m = re.search(r"\b([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})\b", str(addr), re.I)
    if not m:
        return None
    pc = m.group(1).upper().replace("  ", " ")
    return re.sub(r"\s+", " ", pc)


def parse_views_to_list(raw: str | None) -> list[str] | None:
    """Parse Wix `What are the views like` (often a JSON stringified array) into plain strings."""
    if raw is None:
        return None
    s = str(raw).strip()
    if not s:
        return None
    data: object = s
    for _ in range(3):
        if not isinstance(data, str):
            break
        try:
            data = json.loads(data)
        except json.JSONDecodeError:
            return None
    if isinstance(data, list):
        out = [str(x).strip() for x in data if str(x).strip()]
        return out if out else None
    if isinstance(data, str):
        t = data.strip()
        return [t] if t else None
    return None


def guess_city(addr: str | None) -> str | None:
    if not addr:
        return None
    parts = [p.strip() for p in str(addr).split(",") if p.strip()]
    if len(parts) >= 2:
        pc = uk_postcode(addr)
        last = parts[-1]
        if pc and pc.replace(" ", "") in last.replace(" ", "").upper():
            return parts[-2] if len(parts) >= 2 else None
        if re.search(r"^[A-Z]{1,2}\d", last, re.I):
            return parts[-2] if len(parts) >= 2 else None
        return last
    return parts[0] if parts else None


def facilities_from_row(row: dict) -> list[dict]:
    out: list[dict] = []
    if yes(row.get("Pitch Electricity")):
        sz = (row.get("Biggest Pitch Size in Metres") or "").strip()
        out.append(
            {
                "type": "electric_hookup",
                "value": f"Up to {sz} m" if sz else "Yes",
            }
        )
    if yes(row.get("Water tap on pitch")):
        out.append({"type": "water_hookup", "value": "On pitch"})
    grey_key = "Grey waste " if "Grey waste " in row else "Grey waste"
    if yes(row.get(grey_key)):
        out.append({"type": "grey_waste", "value": "Yes"})
    if yes(row.get("Black waste")):
        out.append({"type": "black_waste", "value": "Yes"})
    if yes(row.get("Wifi on Site")):
        out.append({"type": "wifi", "value": "Yes"})
    if yes(row.get("Dogs Allowed")):
        out.append({"type": "pet_allowed", "value": "Yes"})
    if yes(row.get("Are there any dog walks on site")):
        out.append({"type": "dog_walks_on_site", "value": "Yes"})
    return out


def amenities_from_row(row: dict) -> dict[str, bool]:
    a: dict[str, bool] = {}
    if yes(row.get("Toilets on Site")):
        a["toilets"] = True
    if yes(row.get("Showers on Site")):
        a["showers"] = True
    if yes(row.get("Laundry on Site")):
        a["laundry"] = True
    if yes(row.get("Shop on Site")):
        a["shop_onsite"] = True
    other = row.get("Any other amineties on site please let us know.", "") or ""
    ol = other.lower()
    if "pool" in ol:
        a["swimming_pool"] = True
    if "playground" in ol or "play area" in ol:
        a["playground"] = True
    if "bar" in ol or "restaurant" in ol or "cafe" in ol:
        a["cafe_refreshments"] = True
    if "bbq" in ol:
        a["bbq_area"] = True
    if "dog walk" in ol or yes(row.get("Are there any dog walks on site")):
        a["walking_tracks"] = True
    return a


def synthetic_rating(site_id: str) -> float:
    h = int(hashlib.md5(site_id.encode()).hexdigest()[:8], 16)
    return round(3.9 + (h % 11) / 10, 1)


def synthetic_reviews(site_id: str) -> int:
    h = int(hashlib.md5((site_id + "r").encode()).hexdigest()[:8], 16)
    return 5 + (h % 95)


def build_notes(row: dict) -> str:
    chunks = []
    for key in (
        "Please provide reasons why it is hard or easy to access the site",
        "Best route to access site from main road",
        "If you should not follow a sat nav, please advise why",
        "What are the views like",
        "Are there any nearby shops",
        "Freeview",
        "Mobile signal",
        "Mobile Data (Internet)",
    ):
        v = (row.get(key) or "").strip()
        if v and v.lower() not in ("no", "n/a", "none"):
            chunks.append(f"{key.split('?')[0].strip()}: {v}")
    other = (row.get("Any other amineties on site please let us know.", "") or "").strip()
    if other:
        chunks.append(f"Other amenities: {other}")
    text = " \n".join(chunks)
    return text[:2500] if len(text) > 2500 else text


def opening_hours_text(row: dict) -> str:
    parts = []
    y = (row.get("Is your site open year round") or "").strip()
    if y:
        parts.append(f"Year round: {y}")
    o = (row.get("Date Site Opens From") or "").strip()
    c = (row.get("Date Site Closes") or "").strip()
    if o or c:
        parts.append(f"Season: {o or '?'} – {c or '?'}".strip())
    return " · ".join(parts) if parts else None


def wix_image_to_public_url(uri: str | None) -> str | None:
    """
    Wix CSV exports use wix:image://v1/<fileId>.<ext>/...#...
    Public CDN URL form: https://static.wixstatic.com/media/<fileId>.<ext>
    """
    if not uri or not isinstance(uri, str):
        return None
    u = uri.strip()
    m = re.match(r"^wix:image://v1/([^/#]+)", u, re.I)
    if not m:
        return None
    file_id = m.group(1)
    if not file_id:
        return None
    return f"https://static.wixstatic.com/media/{file_id}"


def _public_url_from_gallery_slug(slug: str | None) -> str | None:
    """When `src` is missing, Wix `slug` is often the media file id (e.g. ca7067_…~mv2.webp)."""
    if not slug or not isinstance(slug, str):
        return None
    s = slug.strip()
    if not s or "/" in s or ".." in s:
        return None
    if not re.match(r"^[\w~-]+\.(?:jpe?g|png|webp|gif)$", s, re.I):
        return None
    return f"https://static.wixstatic.com/media/{s}"


def build_gallery(row: dict) -> list[dict] | None:
    """
    Parse Wix `Media Gallery` JSON into top-level gallery items with static.wixstatic.com URLs.
    `listing_import.media_gallery_json` stays the raw CSV string.
    """
    raw = row.get("Media Gallery")
    if raw is None:
        return None
    s = str(raw).strip()
    if not s:
        return None
    try:
        data = json.loads(s)
    except json.JSONDecodeError:
        return None
    if not isinstance(data, list):
        return None
    out: list[dict] = []
    for item in data:
        if not isinstance(item, dict):
            continue
        src = item.get("src")
        slug = item.get("slug")
        src_str = str(src).strip() if src else None
        slug_str = str(slug).strip() if slug else None
        url = wix_image_to_public_url(src_str)
        if not url:
            url = _public_url_from_gallery_slug(slug_str)
        if not url:
            continue
        settings = item.get("settings")
        width = height = None
        if isinstance(settings, dict):
            w, h = settings.get("width"), settings.get("height")
            if isinstance(w, (int, float)):
                width = int(w)
            if isinstance(h, (int, float)):
                height = int(h)
        rec: dict[str, object | None] = {
            "url": url,
            "title": (str(item["title"]).strip() if item.get("title") else "") or None,
            "alt": (str(item["alt"]).strip() if item.get("alt") else "") or None,
            "slug": slug_str,
        }
        if width is not None:
            rec["width"] = width
        if height is not None:
            rec["height"] = height
        out.append(rec)
    return out if out else None


def normalize_phone(raw: str | None) -> str | None:
    if not raw:
        return None
    s = re.sub(r"[^\d+]", "", str(raw).strip())
    if not s:
        return None
    if s.startswith("+"):
        return s
    if len(s) >= 10 and s.startswith("44"):
        return "+" + s
    if len(s) >= 10:
        return "+44 " + s  # UK directory default
    return s


def main() -> None:
    with CSV_PATH.open(newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        rows = list(reader)

    if fieldnames:
        unknown = [h for h in fieldnames if h not in CSV_COLUMN_KEYS]
        unused = [h for h in CSV_COLUMN_KEYS if h not in fieldnames]
        if unknown:
            print("WARNING: CSV columns missing from CSV_COLUMN_KEYS:", unknown)
        if unused:
            print("WARNING: CSV_COLUMN_KEYS entries not in CSV file:", unused)

    if len(rows) != 87:
        print(f"Warning: expected 87 rows, got {len(rows)}")

    slug_counts: dict[str, int] = {}
    parks: list[dict] = []

    for i, row in enumerate(rows):
        name = (row.get("Site Name") or "").strip()
        if not name:
            continue
        base_slug = slugify(name)
        slug_counts[base_slug] = slug_counts.get(base_slug, 0) + 1
        n = slug_counts[base_slug]
        slug = base_slug if n == 1 else f"{base_slug}-{n}"

        site_id = (row.get("ID") or "").strip() or str(i + 1)
        addr = (row.get("Site Full Address") or "").strip() or None
        area_raw = (row.get("Which Area Do You Belong To?") or "").strip() or None
        region_canon = canonical_region_from_area(area_raw)
        views_raw = row.get("What are the views like")
        view = parse_views_to_list(views_raw if isinstance(views_raw, str) else None)
        pc = uk_postcode(addr)
        city = guess_city(addr)

        main_img = (row.get("Main Image") or "").strip() or None
        public_img = wix_image_to_public_url(main_img)
        featured = public_img or f"/images/parks/featured/{slug}.jpg"

        website = (row.get("Please enter sites website address") or "").strip() or None
        if website and not website.startswith(("http://", "https://")):
            website = "https://" + website.lstrip("/")

        email = (row.get("Email") or "").strip() or None
        phone = normalize_phone((row.get("Phone") or "").strip())

        big_rig = (row.get("The Big Rig Bible") or "").strip() or None

        is_feat = (row.get("Facebook Uploaded") or "").strip().lower() == "yes" or (i % 9 == 0)

        listing_import = build_listing_import(row)
        gallery = build_gallery(row)

        park = {
            "id": site_id,
            "name": name,
            "slug": slug,
            "city": city,
            "state": region_canon,
            "region": region_canon,
            "view": view,
            "gallery": gallery,
            "postcode": pc,
            "country": "United Kingdom",
            "address": addr,
            "short_description": ((row.get("Brief Description") or "").strip() or None),
            "featured_image": featured,
            "main_image_wix": main_img,
            "is_featured": is_feat,
            "average_rating": synthetic_rating(site_id),
            "total_reviews": synthetic_reviews(site_id),
            "facilities": facilities_from_row(row),
            "latitude": None,
            "longitude": None,
            "phone": phone,
            "email": email,
            "website": website,
            "opening_hours": opening_hours_text(row),
            "additional_notes": build_notes(row) or None,
            "details_url": big_rig if big_rig else None,
            "amenities": amenities_from_row(row) or None,
            "listing_import": listing_import,
        }
        parks.append(park)

    page_size = 12
    total = len(parks)
    doc = {
        "parks": parks,
        "meta": {
            "total": total,
            "page": 1,
            "page_size": page_size,
            "total_pages": max(1, (total + page_size - 1) // page_size),
        },
    }
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(doc, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {OUT_PATH} ({total} parks)")


if __name__ == "__main__":
    main()
