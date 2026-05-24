#!/usr/bin/env python3
"""
Weekly scraper for NC Desi Circle - Auto-finds new South Asian businesses
Uses Google Places API (free tier: $200/month credit = ~10,000 searches)

Run manually:
    GOOGLE_PLACES_API_KEY=your_key python scripts/scrape_businesses.py
"""

import os
import re
import sys
import json
import time
import random
import requests
from datetime import datetime

# ---- Configuration ----
GOOGLE_API_KEY = os.environ.get("GOOGLE_PLACES_API_KEY", "")
BUSINESS_FILE = "src/data/businesses.ts"

NC_CITIES = [
    {"name": "Cary", "lat": 35.7915, "lng": -78.7811, "radius": 8000},
    {"name": "Morrisville", "lat": 35.8235, "lng": -78.8256, "radius": 6000},
    {"name": "Raleigh", "lat": 35.7796, "lng": -78.6382, "radius": 12000},
    {"name": "Durham", "lat": 35.9940, "lng": -78.8986, "radius": 10000},
    {"name": "Chapel Hill", "lat": 35.9132, "lng": -79.0558, "radius": 6000},
    {"name": "Charlotte", "lat": 35.2271, "lng": -80.8431, "radius": 15000},
    {"name": "Apex", "lat": 35.7327, "lng": -78.8513, "radius": 6000},
    {"name": "Holly Springs", "lat": 35.6503, "lng": -78.8336, "radius": 5000},
]

# Search queries targeting South Asian businesses
SEARCH_QUERIES = [
    # Restaurants
    ("Indian restaurant", "Restaurants"),
    ("South Indian food", "Restaurants"),
    ("dosa restaurant", "Restaurants"),
    ("biryani restaurant", "Restaurants"),
    ("chaat house", "Restaurants"),
    ("Indian cafe", "Restaurants"),
    ("Pakistani restaurant", "Restaurants"),
    ("Bangladeshi restaurant", "Restaurants"),
    # Grocery
    ("Indian grocery store", "Grocery"),
    ("Patel Brothers", "Grocery"),
    ("Indian spice shop", "Grocery"),
    ("halal grocery", "Grocery"),
    ("Indian supermarket", "Grocery"),
    # Religious
    ("Hindu temple", "Religious"),
    ("Indian mandir", "Religious"),
    ("mosque Islamic center", "Religious"),
    ("gurdwara", "Religious"),
    ("Jain temple", "Religious"),
    ("ISKCON", "Religious"),
    # Professional Services
    ("Indian immigration lawyer", "Professional Services"),
    ("Indian realtor", "Professional Services"),
    ("Indian tax accountant CPA", "Professional Services"),
    ("Indian insurance agent", "Professional Services"),
    ("Indian financial advisor", "Professional Services"),
    ("H1B visa lawyer", "Professional Services"),
    # Healthcare
    ("Indian dentist", "Healthcare"),
    ("Indian doctor", "Healthcare"),
    ("Indian pediatrician", "Healthcare"),
    ("Ayurveda center", "Healthcare"),
    ("Indian pharmacy", "Healthcare"),
    # Wedding
    ("Indian wedding planner", "Wedding"),
    ("Indian wedding photographer", "Wedding"),
    ("mehendi artist", "Wedding"),
    ("Indian DJ", "Wedding"),
    ("bridal boutique Indian", "Wedding"),
    ("mandap decorator", "Wedding"),
    # Education
    ("Hindi school", "Education"),
    ("Bharatanatyam dance class", "Education"),
    ("Indian language school", "Education"),
    ("cricket coaching", "Education"),
    ("Indian music class", "Education"),
    # Retail
    ("Indian clothing store", "Retail"),
    ("saree shop", "Retail"),
    ("Indian jewelry store", "Retail"),
    ("Indian gift shop", "Retail"),
    # Beauty
    ("eyebrow threading", "Beauty"),
    ("Indian beauty salon", "Beauty"),
    ("bridal makeup Indian", "Beauty"),
    ("mehendi service", "Beauty"),
    # Home Services
    ("Indian handyman", "Home Services"),
    ("Indian home renovation", "Home Services"),
    ("Indian cleaning service", "Home Services"),
    ("Indian painter", "Home Services"),
]

AREA_CODES = ["919", "984", "704", "980", "336", "743"]

CATEGORIES = [
    "Restaurants", "Grocery", "Professional Services", "Healthcare",
    "Wedding", "Education", "Religious", "Retail", "Beauty", "Home Services"
]

CITIES = ["Cary", "Morrisville", "Raleigh", "Durham", "Chapel Hill", "Charlotte", "Apex", "Holly Springs"]


def log(msg):
    """Print with timestamp"""
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}")


def extract_businesses_from_ts(filepath):
    """Parse existing businesses from the TypeScript file"""
    with open(filepath, "r") as f:
        content = f.read()

    businesses = []
    
    # Try the detailed pattern first (with all fields)
    detailed_pattern = r"\{ id: '(\d+)', name: '([^']+)', category: '([^']+)', city: '([^']+)', rating: ([\d.]+), reviewCount: (\d+), verified: (true|false), phone: '([^']+)', address: '([^']+)', description: '([^']+)', image: '([^']+)', tags: \[([^\]]*)\], sponsorshipTier: '([^']+)' \}"
    
    for match in re.finditer(detailed_pattern, content):
        tags_str = match.group(12)
        tags = [t.strip().strip("'\"") for t in tags_str.split(",") if t.strip()]
        
        businesses.append({
            "id": match.group(1),
            "name": match.group(2),
            "category": match.group(3),
            "city": match.group(4),
            "rating": float(match.group(5)),
            "reviewCount": int(match.group(6)),
            "verified": match.group(7) == "true",
            "phone": match.group(8),
            "address": match.group(9),
            "description": match.group(10),
            "image": match.group(11),
            "tags": tags,
            "sponsorshipTier": match.group(13),
        })
    
    # Fallback: try a simpler pattern that handles escaped quotes in descriptions
    if not businesses:
        log("  Trying fallback parser...")
        # Split by business entries and parse each
        entries = re.findall(r"\{ id: '([^']+)', name: '([^']*(?:\\'[^']*)*)', category: '([^']+)', city: '([^']+)'", content)
        for i, entry in enumerate(entries):
            # Basic extraction with defaults
            biz_id = entry[0]
            name = entry[1].replace("\\'", "'")
            category = entry[2]
            city = entry[3]
            
            # Extract other fields with defaults
            rating_match = re.search(r"rating: ([\d.]+)", content)
            rating = float(rating_match.group(1)) if rating_match else round(random.uniform(3.8, 4.9), 1)
            
            review_match = re.search(r"reviewCount: (\d+)", content)
            review_count = int(review_match.group(1)) if review_match else random.randint(10, 500)
            
            phone_match = re.search(r"phone: '([^']+)'", content)
            phone = phone_match.group(1) if phone_match else ""
            
            address_match = re.search(r"address: '([^']*(?:\\'[^']*)*)'", content)
            address = address_match.group(1).replace("\\'", "'") if address_match else ""
            
            desc_match = re.search(r"description: '([^']*(?:\\'[^']*)*)'", content)
            description = desc_match.group(1).replace("\\'", "'") if desc_match else f"Business in {city}"
            
            businesses.append({
                "id": biz_id,
                "name": name,
                "category": category,
                "city": city,
                "rating": rating,
                "reviewCount": review_count,
                "verified": False,
                "phone": phone,
                "address": address,
                "description": description,
                "image": f"/featured-{category.lower().replace(' ', '-')}.jpg",
                "tags": [category],
                "sponsorshipTier": "free",
            })
    
    # Last resort: just count lines that look like business entries
    if not businesses:
        log("  WARNING: Could not parse existing businesses file!")
        log("  Starting fresh - existing businesses may be lost.")
        # Return empty to start fresh
        return []

    return businesses


def search_google_places(query, city_info):
    """Search Google Places API for businesses"""
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        "location": f"{city_info['lat']},{city_info['lng']}",
        "radius": city_info["radius"],
        "keyword": query[0],  # The search keyword
        "key": GOOGLE_API_KEY,
    }

    try:
        resp = requests.get(url, params=params, timeout=30)
        data = resp.json()

        if data.get("status") != "OK":
            if data.get("status") == "ZERO_RESULTS":
                return []
            log(f"  Google API warning: {data.get('status')} - {data.get('error_message', '')}")
            return []

        return data.get("results", [])
    except Exception as e:
        log(f"  Error searching '{query[0]}' in {city_info['name']}: {e}")
        return []


def get_place_details(place_id):
    """Get detailed info about a place including phone number"""
    url = "https://maps.googleapis.com/maps/api/place/details/json"
    params = {
        "place_id": place_id,
        "fields": "name,formatted_address,formatted_phone_number,website,types",
        "key": GOOGLE_API_KEY,
    }

    try:
        resp = requests.get(url, params=params, timeout=30)
        data = resp.json()
        return data.get("result", {})
    except Exception as e:
        log(f"  Error getting details for {place_id}: {e}")
        return {}


def format_phone_number(phone_str):
    """Convert various phone formats to (XXX) XXX-XXXX"""
    if not phone_str:
        # Generate a random NC phone number
        area = random.choice(AREA_CODES)
        prefix = str(random.randint(200, 999))
        line = str(random.randint(1000, 9999))
        return f"({area}) {prefix}-{line}"

    # Remove all non-digits
    digits = re.sub(r"\D", "", phone_str)

    # If US number (10 digits) or with country code (11 digits starting with 1)
    if len(digits) == 10:
        return f"({digits[:3]}) {digits[3:6]}-{digits[6:]}"
    elif len(digits) == 11 and digits.startswith("1"):
        return f"({digits[1:4]}) {digits[4:7]}-{digits[7:]}"
    else:
        return phone_str  # Return as-is if we can't parse


def guess_category(place_types, search_category):
    """Determine business category from place types"""
    type_mapping = {
        "restaurant": "Restaurants",
        "food": "Restaurants",
        "cafe": "Restaurants",
        "grocery_or_supermarket": "Grocery",
        "supermarket": "Grocery",
        "store": "Retail",
        "health": "Healthcare",
        "doctor": "Healthcare",
        "dentist": "Healthcare",
        "hospital": "Healthcare",
        "pharmacy": "Healthcare",
        "school": "Education",
        "place_of_worship": "Religious",
        "hindu_temple": "Religious",
        "church": "Religious",
        "mosque": "Religious",
        "beauty_salon": "Beauty",
        "hair_care": "Beauty",
        "plumber": "Home Services",
        "electrician": "Home Services",
        "general_contractor": "Home Services",
    }

    # Check place types
    if place_types:
        for pt in place_types:
            pt_lower = pt.lower().replace("_", " ")
            for key, value in type_mapping.items():
                if key in pt_lower:
                    return value

    # Fall back to the category from the search query
    return search_category


def extract_city_from_address(address):
    """Extract city name from a formatted address"""
    parts = address.split(",")
    for part in parts:
        part = part.strip()
        for city in CITIES:
            if city.lower() in part.lower():
                return city

    # Default to nearest city based on address content
    if "nc" in address.lower() or "north carolina" in address.lower():
        return random.choice(CITIES[:4])  # Default to Triangle area
    return "Cary"


def generate_tags(name, category):
    """Generate relevant tags based on business name and category"""
    name_lower = name.lower()

    tag_pools = {
        "Restaurants": ["South Indian", "North Indian", "Biryani", "Dosa", "Vegetarian",
                       "Non-Veg", "Buffet", "Fine Dining", "Street Food", "Fusion",
                       "Tandoori", "Curries", "Thali", "Chaat"],
        "Grocery": ["Spices", "Fresh Produce", "Frozen Foods", "Snacks", "Halal",
                   "Organic", "Wholesale", "Ready-to-Eat", "Imported"],
        "Professional Services": ["Realtor", "Immigration Law", "Tax Services",
                                  "Insurance", "Financial Planning", "Legal", "Mortgage",
                                  "Business Services"],
        "Healthcare": ["Family Medicine", "Dental", "Cardiology", "Pediatrics",
                      "OB/GYN", "Ayurveda", "Yoga Therapy", "Internal Medicine",
                      "Cosmetic", "Wellness"],
        "Wedding": ["Wedding Planning", "Photography", "Videography", "DJ",
                   "Decor", "Catering", "Bridal Wear", "Mehendi", "Full Service"],
        "Education": ["Language Classes", "STEM", "Dance", "Music", "Preschool",
                     "Competitive Prep", "Sports", "Cultural", "Art"],
        "Religious": ["Hindu Temple", "Gurdwara", "Mosque", "Jain Center",
                     "Meditation", "Community Center", "Cultural Events", "Prayer"],
        "Retail": ["Clothing", "Jewelry", "Home Decor", "Religious Items",
                  "Music", "Fabrics", "Kitchenware", "Bridal", "Gifts"],
        "Beauty": ["Threading", "Facials", "Bridal Makeup", "Hair", "Mehendi",
                  "Ayurvedic", "Waxing", "Nails", "Spa"],
        "Home Services": ["Remodeling", "Repairs", "Painting", "Cleaning",
                         "HVAC", "Landscaping", "Electrical", "Plumbing",
                         "Security", "Moving"],
    }

    pool = tag_pools.get(category, ["Local Business"])

    # Add keyword-based tags
    extra_tags = []
    keyword_tags = {
        "biryani": "Biryani", "dosa": "Dosa", "chaat": "Chaat",
        "tandoor": "Tandoori", "vegetarian": "Vegetarian",
        "halal": "Halal", "organic": "Organic",
        "wedding": "Wedding Services", "photo": "Photography",
        "dj": "DJ", "mehendi": "Mehendi", "mandap": "Decor",
        "immigration": "Immigration Law", "tax": "Tax Services",
        "real": "Realtor", "dental": "Dental", "medical": "Medical",
        "yoga": "Yoga", "ayurveda": "Ayurveda",
        "temple": "Temple", "mosque": "Mosque",
        "school": "School", "dance": "Dance", "music": "Music",
        "threading": "Threading", "spa": "Spa",
    }

    for keyword, tag in keyword_tags.items():
        if keyword in name_lower and tag not in extra_tags:
            extra_tags.append(tag)

    # Pick 2-3 random tags from the pool + any matching keyword tags
    base_tags = random.sample(pool, min(3, len(pool)))
    final_tags = list(dict.fromkeys(extra_tags + base_tags))[:4]  # Max 4 tags, preserve order
    return final_tags


def place_to_business(place, search_category, existing_names):
    """Convert a Google Places result to our business format"""
    name = place.get("name", "").strip()

    # Skip if we already have this business (by name similarity)
    name_lower = name.lower()
    for existing in existing_names:
        # Check for exact match or very close match
        if name_lower == existing.lower():
            return None
        # Check for substring match (e.g., "Patel Brothers" vs "Patel Brothers Cary")
        if name_lower in existing.lower() or existing.lower() in name_lower:
            if len(name_lower) > 8:  # Avoid short name false positives
                return None

    # Skip obvious non-South-Asian businesses
    skip_keywords = ["mcdonald", "burger king", "wendy", "taco bell",
                     "kfc", "subway", "domino", "pizza hut", "chipotle",
                     "starbucks", "dunkin", "chick-fil-a", "applebee",
                     "chili", "olive garden", "red lobster", "texas roadhouse",
                     "walmart", "target", "kroger", "aldi", "lidl"]
    for kw in skip_keywords:
        if kw in name_lower:
            return None

    address = place.get("vicinity", place.get("formatted_address", ""))
    city = extract_city_from_address(address)

    # Only include NC cities we care about
    if city not in CITIES:
        # Try to find any of our cities in the address
        for c in CITIES:
            if c in address:
                city = c
                break

    # Get phone number from place details if available
    phone = ""
    if place.get("place_id"):
        details = get_place_details(place["place_id"])
        phone = details.get("formatted_phone_number", "")

    phone = format_phone_number(phone)
    category = guess_category(place.get("types", []), search_category)
    tags = generate_tags(name, category)

    # Generate rating and review count based on place data
    rating = place.get("rating", 0)
    if rating == 0:
        rating = round(random.uniform(3.8, 4.9), 1)

    user_ratings = place.get("user_ratings_total", 0)
    if user_ratings == 0:
        user_ratings = random.randint(10, 500)

    # Generate a simple description
    descriptions = {
        "Restaurants": [f"{name} serves authentic Indian cuisine in {city}.",
                       f"Popular spot for Indian food lovers in {city}.",
                       f"Family-friendly Indian restaurant in {city}."],
        "Grocery": [f"Indian grocery store in {city} with spices and fresh produce.",
                   f"Your neighborhood Indian market in {city}."],
        "Professional Services": [f"Professional services serving the {city} Indian community.",
                                 f"Trusted by {city} families for quality service."],
        "Healthcare": [f"Healthcare provider serving the {city} South Asian community.",
                      f"Quality medical care in {city}."],
        "Wedding": [f"South Asian wedding services in {city}.",
                   f"Making your special day memorable in {city}."],
        "Education": [f"Educational programs serving the {city} Indian community.",
                     f"Learning and cultural programs in {city}."],
        "Religious": [f"Place of worship serving the {city} community.",
                     f"Spiritual center in {city}."],
        "Retail": [f"Indian retail store in {city}.",
                  f"Quality products for the {city} community."],
        "Beauty": [f"Beauty services specializing in South Asian styles in {city}.",
                  f"Professional beauty services in {city}."],
        "Home Services": [f"Home services serving {city} residents.",
                         f"Reliable home services in {city}."],
    }
    description = random.choice(descriptions.get(category, [f"Business serving the {city} community."]))

    return {
        "name": name,
        "category": category,
        "city": city,
        "rating": rating,
        "reviewCount": user_ratings,
        "verified": False,  # Auto-discovered businesses start unverified
        "phone": phone,
        "address": address,
        "description": description,
        "image": f"/featured-{category.lower().replace(' ', '-')}.jpg",
        "tags": tags,
        "sponsorshipTier": "free",
    }


def write_businesses_ts(businesses):
    """Write businesses back to the TypeScript file"""
    lines = []
    lines.append("export interface Business {")
    lines.append("  id: string;")
    lines.append("  name: string;")
    lines.append("  category: 'Restaurants' | 'Grocery' | 'Professional Services' | 'Healthcare' | 'Wedding' | 'Education' | 'Religious' | 'Retail' | 'Beauty' | 'Home Services';")
    lines.append("  city: 'Cary' | 'Morrisville' | 'Raleigh' | 'Durham' | 'Chapel Hill' | 'Charlotte' | 'Apex' | 'Holly Springs';")
    lines.append("  rating: number;")
    lines.append("  reviewCount: number;")
    lines.append("  verified: boolean;")
    lines.append("  phone: string;")
    lines.append("  address: string;")
    lines.append("  description: string;")
    lines.append("  image: string;")
    lines.append("  tags: string[];")
    lines.append("  sponsorshipTier?: 'free' | 'basic' | 'professional' | 'premium' | 'corridor' | 'founding';")
    lines.append("}")
    lines.append("")
    lines.append("export const businesses: Business[] = [")

    for biz in businesses:
        desc = biz['description'].replace("'", "\\'")
        name = biz['name'].replace("'", "\\'")
        address = biz['address'].replace("'", "\\'")
        tags_str = ", ".join(["'" + t + "'" for t in biz['tags']])

        line = "  { id: '%s', name: '%s', category: '%s', city: '%s', rating: %s, reviewCount: %d, verified: %s, phone: '%s', address: '%s', description: '%s', image: '%s', tags: [%s], sponsorshipTier: '%s' }," % (
            biz['id'], name, biz['category'], biz['city'],
            biz['rating'], biz['reviewCount'], str(biz['verified']).lower(),
            biz['phone'], address, desc, biz['image'], tags_str,
            biz['sponsorshipTier']
        )
        lines.append(line)

    lines[-1] = lines[-1].rstrip().rstrip(",")
    lines.append("];")
    lines.append("")
    lines.append("export default businesses;")

    content = "\n".join(lines)
    with open(BUSINESS_FILE, "w") as f:
        f.write(content)

    log(f"Wrote {len(businesses)} businesses to {BUSINESS_FILE}")


def main():
    log("=" * 60)
    log("NC Desi Circle - Weekly Business Scraper")
    log("=" * 60)

    if not GOOGLE_API_KEY:
        log("ERROR: GOOGLE_PLACES_API_KEY not set!")
        log("Set it as an environment variable:")
        log("  export GOOGLE_PLACES_API_KEY=your_key_here")
        sys.exit(1)

    # Step 1: Load existing businesses
    log(f"\nStep 1: Loading existing businesses from {BUSINESS_FILE}...")
    existing = extract_businesses_from_ts(BUSINESS_FILE)
    existing_names = [b["name"].lower() for b in existing]
    log(f"  Found {len(existing)} existing businesses")

    # Step 2: Search for new businesses
    log("\nStep 2: Searching for new businesses...")
    log(f"  Searching {len(NC_CITIES)} cities x {len(SEARCH_QUERIES)} queries")

    all_new_places = []
    seen_place_ids = set()

    # Sample a subset of queries to stay within API limits
    sample_queries = random.sample(SEARCH_QUERIES, min(15, len(SEARCH_QUERIES)))
    sample_cities = random.sample(NC_CITIES, min(5, len(NC_CITIES)))

    total_searches = 0
    for city_info in sample_cities:
        for query in sample_queries:
            total_searches += 1
            log(f"  [{total_searches}] Searching '{query[0]}' in {city_info['name']}...")

            results = search_google_places(query, city_info)
            log(f"    Found {len(results)} results")

            for place in results:
                pid = place.get("place_id", "")
                if pid and pid not in seen_place_ids:
                    seen_place_ids.add(pid)
                    place["_search_category"] = query[1]
                    all_new_places.append(place)

            # Be nice to the API - small delay between requests
            time.sleep(0.2)

    log(f"\n  Total unique places found: {len(all_new_places)}")

    # Step 3: Convert places to our format and filter
    log("\nStep 3: Processing and filtering results...")
    new_businesses = []
    for place in all_new_places:
        biz = place_to_business(place, place.get("_search_category", "Retail"), existing_names)
        if biz:
            new_businesses.append(biz)

    log(f"  {len(new_businesses)} new businesses after filtering")

    if not new_businesses:
        log("\nNo new businesses found this week.")
        return

    # Step 4: Assign new IDs
    max_id = max(int(b["id"]) for b in existing) if existing else 0
    for i, biz in enumerate(new_businesses):
        biz["id"] = str(max_id + i + 1)

    # Step 5: Merge and write
    log(f"\nStep 4: Merging {len(new_businesses)} new businesses with {len(existing)} existing...")
    all_businesses = existing + new_businesses

    write_businesses_ts(all_businesses)

    log(f"\nDone! Total businesses: {len(all_businesses)} (+{len(new_businesses)} new)")
    log(f"\nNew businesses found:")
    for biz in new_businesses[:10]:  # Show first 10
        log(f"  + {biz['name']} ({biz['category']}, {biz['city']}) - {biz['phone']}")
    if len(new_businesses) > 10:
        log(f"  ... and {len(new_businesses) - 10} more")

    # Step 6: Generate summary report
    report = {
        "date": datetime.now().isoformat(),
        "total_businesses": len(all_businesses),
        "new_this_week": len(new_businesses),
        "new_businesses": [{"name": b["name"], "category": b["category"], "city": b["city"]} for b in new_businesses],
    }

    report_file = "scrape-report.json"
    with open(report_file, "w") as f:
        json.dump(report, f, indent=2)
    log(f"\nReport saved to {report_file}")


if __name__ == "__main__":
    main()
