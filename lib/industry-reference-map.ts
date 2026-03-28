// @ts-nocheck
// ── lib/industry-reference-map.ts ─────────────────────────────────────────────
// Maps every industry ID to:
//   - The reference project name(s) that belong to that industry
//   - The industry watermark group for background SVG rendering
//   - The industry-aware learning content to surface

export const INDUSTRY_REFERENCE_NAMES: Record<string, string[]> = {
  // Manufacturing
  general_manufacturing:       ['Reference — General Manufacturing Production Cell'],
  automotive_manufacturing:    ['Reference — Automotive Seat Assembly'],
  aerospace_manufacturing:     ['Reference — Aerospace Component Assembly'],
  pharmaceutical_manufacturing: ['Reference — Pharmaceutical Batch Release', 'Reference — Medical Device Assembly', 'Reference — Research Laboratory Assay Flow'],
  food_beverage_manufacturing: ['Reference — Food & Beverage Production Line', 'Reference — Craft Brewery Batch Production', 'Reference — Boutique Winery Production'],
  // Healthcare
  hospital_acute_care:         ['Reference — ED Patient Flow'],
  primary_care_outpatient:     ['Reference — Primary Care Patient Visit'],
  surgery_operating_room:      ['Reference — Operating Room Surgical Pathway'],
  pharmacy:                    ['Reference — Retail Pharmacy Dispensing'],
  // Financial
  retail_banking:              ['Reference — Retail Banking Loan Process'],
  insurance:                   ['Reference — Insurance Policy Issuance'],
  investment_management:       ['Reference — Investment Management Trade Settlement'],
  accounting_audit:            ['Reference — Accounting & Audit Engagement'],
  // Tech
  software_development:        ['Reference — Software Feature Delivery'],
  it_operations:               ['Reference — IT Incident Resolution'],
  cybersecurity:               ['Reference — Cybersecurity Threat Response'],
  telecommunications:          ['Reference — Telecoms Service Provisioning'],
  // Retail
  retail_stores:               ['Reference — Retail Store Operations'],
  ecommerce_fulfillment:       ['Reference — E-Commerce Order Fulfilment'],
  grocery:                     ['Reference — Grocery Store Operations'],
  // Hospitality
  restaurant_food_service:     ['Reference — Restaurant Service Flow'],
  hotel_hospitality:           ['Reference — Hotel Guest Stay Flow'],
  airline_aviation:            ['Reference — Airline Aircraft Turnaround'],
  // Logistics
  warehousing_distribution:    ['Reference — Warehouse Fulfilment'],
  freight_trucking:            ['Reference — Freight & Trucking Load Delivery'],
  postal_parcel:               ['Reference — Postal & Parcel Delivery'],
  // Construction
  construction:                ['Reference — Construction Build Workflow'],
  architecture_engineering:    ['Reference — Architecture & Engineering Design'],
  // Education
  higher_education:            ['Reference — University Student Journey'],
  k12_education:               ['Reference — K-12 Student Support Flow'],
  corporate_training:          ['Reference — Corporate L&D Programme Delivery'],
  // Government / Public Sector
  government_services:         ['Reference — Government Permit & Licensing'],
  emergency_services_fire:     ['Reference — Fire & Rescue Emergency Response'],
  police:                      ['Reference — Police Crime Investigation'],
  military:                    ['Reference — Military Equipment Readiness'],
  // Entertainment / Media
  film_tv:                     ['Reference — Film & TV Production'],
  music_production:            ['Reference — Music Production & Recording'],
  video_games:                 ['Reference — Video Game Development'],
  live_events:                 ['Reference — Live Events Production'],
  publishing:                  ['Reference — Publishing Editorial Workflow'],
  // Sports
  professional_sports:         ['Reference — Professional Sports Performance'],
  sports_venue:                ['Reference — Sports Venue Management'],
  fitness_clubs:               ['Reference — Fitness Club Member Journey'],
  // Legal
  law_firm:                    ['Reference — Law Firm Matter Lifecycle'],
  // HR
  human_resources:             ['Reference — HR Recruitment & Onboarding'],
  staffing_agency:             ['Reference — Staffing Agency Placement Process'],
  // Marketing
  marketing_agency:            ['Reference — Marketing Agency Campaign Flow'],
  digital_marketing:           ['Reference — Digital Marketing Campaign Flow'],
  // Nonprofit / Social
  nonprofit:                   ['Reference — Nonprofit Programme Delivery'],
  social_care:                 ['Reference — Social Care Assessment Flow'],
  // Agriculture
  farming:                     ['Reference — Farming & Crop Production'],
  aquaculture:                 ['Reference — Aquaculture Production Cycle'],
  // Energy
  power_generation_utilities:  ['Reference — Power Generation Operations'],
  oil_gas:                     ['Reference — Oil & Gas Drilling Operations'],
  // Transport
  rail_passenger:              ['Reference — Rail Passenger Service Operations'],
  port_maritime:               ['Reference — Port & Maritime Container Operations'],
  // Consulting / Services
  management_consulting:       ['Reference — Automotive Seat Assembly'], // uses Mfg as consulting case study
  engineering_consulting:      ['Reference — Engineering Consulting Delivery'],
  // Research
  academic_research:           ['Reference — Academic Research Publication Flow'],
  clinical_trials:             ['Reference — Clinical Trial Operations'],
  // Events / PM
  event_management:            ['Reference — Live Events Production'],
  project_management:          ['Reference — Project Management Delivery'],
  // Customer Service
  contact_center:              ['Reference — Contact Centre Resolution Flow'],
  // Creative
  graphic_design:              ['Reference — Graphic Design Studio Flow'],
  // Real Estate
  real_estate:                 ['Reference — Real Estate Transaction Flow'],
}

// Fallback when industry has no exact match
export function getIndustryReferenceNames(industryId: string): string[] {
  if (!industryId) return []
  const direct = INDUSTRY_REFERENCE_NAMES[industryId]
  if (direct) return direct
  // Partial match — check if any key starts with the industryId prefix
  const partialKey = Object.keys(INDUSTRY_REFERENCE_NAMES).find(k =>
    industryId.startsWith(k.split('_')[0])
  )
  return partialKey ? INDUSTRY_REFERENCE_NAMES[partialKey] : []
}

// ── Watermark groups ─────────────────────────────────────────────────────────
export type WatermarkGroup =
  | 'manufacturing' | 'aerospace' | 'pharma' | 'food' | 'brewery' | 'winery'
  | 'hospital' | 'healthcare' | 'pharmacy_rx'
  | 'finance' | 'insurance_shield'
  | 'tech' | 'cybersecurity' | 'telecoms'
  | 'retail' | 'grocery' | 'ecommerce'
  | 'hospitality' | 'aviation' | 'logistics' | 'freight' | 'postal'
  | 'construction' | 'architecture'
  | 'education' | 'government' | 'emergency' | 'police' | 'military'
  | 'film' | 'music' | 'gaming' | 'events' | 'publishing'
  | 'sports' | 'venue' | 'fitness'
  | 'legal' | 'hr' | 'staffing' | 'marketing' | 'digital'
  | 'nonprofit' | 'social_care'
  | 'agriculture' | 'aquaculture'
  | 'energy' | 'oil' | 'rail' | 'maritime'
  | 'consulting' | 'engineering' | 'research' | 'clinical'
  | 'realestate' | 'project_mgmt' | 'creative'
  | 'default'

export const INDUSTRY_WATERMARK_GROUP: Record<string, WatermarkGroup> = {
  general_manufacturing: 'manufacturing',
  automotive_manufacturing: 'manufacturing',
  aerospace_manufacturing: 'aerospace',
  pharmaceutical_manufacturing: 'pharma',
  food_beverage_manufacturing: 'food',
  hospital_acute_care: 'hospital',
  primary_care_outpatient: 'healthcare',
  surgery_operating_room: 'healthcare',
  pharmacy: 'healthcare',
  medical_device_manufacturing: 'healthcare',
  research_laboratory: 'research',
  retail_banking: 'finance',
  insurance: 'finance',
  investment_management: 'finance',
  accounting_audit: 'finance',
  software_development: 'tech',
  it_operations: 'tech',
  cybersecurity: 'cybersecurity',
  telecommunications: 'tech',
  retail_stores: 'retail',
  ecommerce_fulfillment: 'retail',
  grocery: 'retail',
  restaurant_food_service: 'hospitality',
  hotel_hospitality: 'hospitality',
  airline_aviation: 'aviation',
  warehousing_distribution: 'logistics',
  freight_trucking: 'logistics',
  postal_parcel: 'logistics',
  construction: 'construction',
  architecture_engineering: 'construction',
  higher_education: 'education',
  k12_education: 'education',
  corporate_training: 'education',
  government_services: 'government',
  emergency_services_fire: 'emergency',
  police: 'emergency',
  military: 'military',
  film_tv: 'entertainment',
  music_production: 'entertainment',
  video_games: 'tech',
  live_events: 'events',
  publishing: 'entertainment',
  professional_sports: 'sports',
  sports_venue: 'sports',
  fitness_clubs: 'sports',
  law_firm: 'legal',
  human_resources: 'hr',
  staffing_agency: 'hr',
  marketing_agency: 'marketing',
  digital_marketing: 'marketing',
  nonprofit: 'social',
  social_care: 'social',
  farming: 'agriculture',
  aquaculture: 'agriculture',
  power_generation_utilities: 'energy',
  oil_gas: 'oil',
  rail_passenger: 'transport',
  port_maritime: 'maritime',
  management_consulting: 'consulting',
  engineering_consulting: 'consulting',
  academic_research: 'research',
  clinical_trials: 'research',
  event_management: 'events',
  project_management: 'consulting',
  contact_center: 'consulting',
  graphic_design: 'creative',
  real_estate: 'realestate',
  craft_brewery: 'brewery',
  winery: 'food',

  'insurance': 'insurance_shield',
  'investment_management': 'finance',
  'accounting_audit': 'finance',
  'it_operations': 'tech',
  'telecommunications': 'telecoms',
  'grocery': 'grocery',
  'airline_aviation': 'aviation',
  'freight_trucking': 'freight',
  'postal_parcel': 'postal',
  'architecture_engineering': 'architecture',
  'higher_education': 'education',
  'k12_education': 'education',
  'corporate_training': 'education',
  'government_services': 'government',
  'emergency_services_fire': 'emergency',
  'police': 'police',
  'film_tv': 'film',
  'music_production': 'music',
  'video_games': 'gaming',
  'live_events': 'events',
  'publishing': 'publishing',
  'professional_sports': 'sports',
  'sports_venue': 'venue',
  'fitness': 'fitness',
  'law_firm': 'legal',
  'hr_management': 'hr',
  'staffing_agency': 'staffing',
  'marketing_agency': 'marketing',
  'digital_marketing': 'digital',
  'nonprofit': 'nonprofit',
  'social_care': 'social_care',
  'farming': 'agriculture',
  'aquaculture': 'aquaculture',
  'power_generation': 'energy',
  'oil_gas': 'oil',
  'rail': 'rail',
  'port_maritime': 'maritime',
  'management_consulting': 'consulting',
  'engineering_consulting': 'engineering',
  'academic_research': 'research',
  'clinical_trials': 'clinical',
  'real_estate': 'realestate',
  'project_management': 'project_mgmt',
  'graphic_design': 'creative',
}

export function getWatermarkGroup(industryId: string): WatermarkGroup {
  return INDUSTRY_WATERMARK_GROUP[industryId] || 'default'
}
