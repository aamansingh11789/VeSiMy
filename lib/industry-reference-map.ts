// @ts-nocheck
// ── lib/industry-reference-map.ts ─────────────────────────────────────────────
// Single source of truth for:
//   1. INDUSTRY_REFERENCE_NAMES — maps every industry ID → reference project name(s)
//   2. INDUSTRY_WATERMARK_GROUP — maps every industry ID → SVG watermark group
//   3. getIndustryReferenceNames — safe getter with fallback
//   4. getWatermarkGroup — safe getter with fallback
//
// RULE: Every id in INDUSTRY_OPTIONS (lib/industry-language.ts) must appear
// exactly once here. No duplicates.

// ── Watermark group type (matches IndustryWatermark.tsx) ─────────────────────
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

// ── Reference project names by industry ID ────────────────────────────────────
export const INDUSTRY_REFERENCE_NAMES: Record<string, string[]> = {
  // ── Manufacturing & Industrial ─────────────────────────────────────────────
  general_manufacturing:         ['Reference — General Manufacturing Production Cell'],
  metal_finishing:               ['Reference — Metal Finishing Job Flow'],
  automotive_manufacturing:      ['Reference — Automotive Seat Assembly'],
  aerospace_manufacturing:       ['Reference — Aerospace Component Assembly'],
  pharmaceutical_manufacturing:  ['Reference — Pharmaceutical Batch Release'],
  food_beverage_manufacturing:   ['Reference — Food & Beverage Production Line'],
  medical_device_manufacturing:  ['Reference — Medical Device Assembly'],

  // ── Healthcare ────────────────────────────────────────────────────────────
  hospital_acute_care:           ['Reference — ED Patient Flow'],
  primary_care_outpatient:       ['Reference — Primary Care Patient Visit'],
  surgery_operating_room:        ['Reference — Operating Room Surgical Pathway'],
  pharmacy:                      ['Reference — Retail Pharmacy Dispensing'],
  clinical_trials:               ['Reference — Clinical Trial Operations'],
  research_laboratory:           ['Reference — Research Laboratory Assay Flow'],

  // ── Finance ───────────────────────────────────────────────────────────────
  retail_banking:                ['Reference — Retail Banking Loan Process'],
  insurance:                     ['Reference — Insurance Policy Issuance'],
  investment_management:         ['Reference — Investment Management Trade Settlement'],
  accounting_audit:              ['Reference — Accounting & Audit Engagement'],

  // ── Technology ────────────────────────────────────────────────────────────
  software_development:          ['Reference — Software Feature Delivery'],
  it_operations:                 ['Reference — IT Incident Resolution'],
  cybersecurity:                 ['Reference — Cybersecurity Threat Response'],
  telecommunications:            ['Reference — Telecoms Service Provisioning'],

  // ── Retail & E-commerce ───────────────────────────────────────────────────
  retail_stores:                 ['Reference — Retail Store Operations'],
  ecommerce_fulfillment:         ['Reference — E-Commerce Order Fulfilment'],
  grocery_supermarket:           ['Reference — Grocery Store Operations'],

  // ── Hospitality & Travel ──────────────────────────────────────────────────
  restaurant_food_service:       ['Reference — Restaurant Service Flow'],
  hotel_hospitality:             ['Reference — Hotel Guest Stay Flow'],
  airline_aviation:              ['Reference — Airline Aircraft Turnaround'],
  craft_brewery:                 ['Reference — Craft Brewery Batch Production'],
  winery:                        ['Reference — Boutique Winery Production'],

  // ── Logistics & Supply Chain ──────────────────────────────────────────────
  warehousing_distribution:      ['Reference — Warehouse Fulfilment'],
  freight_trucking:              ['Reference — Freight & Trucking Load Delivery'],
  postal_parcel:                 ['Reference — Postal & Parcel Delivery'],

  // ── Construction & Design ─────────────────────────────────────────────────
  construction:                  ['Reference — Construction Build Workflow'],
  architecture_engineering:      ['Reference — Architecture & Engineering Design'],

  // ── Professional Services ─────────────────────────────────────────────────
  law_firm:                      ['Reference — Law Firm Matter Lifecycle'],
  management_consulting:         ['Reference — Management Consulting Engagement'],
  engineering_consulting:        ['Reference — Engineering Consulting Delivery'],
  marketing_agency:              ['Reference — Marketing Agency Campaign Flow'],
  digital_marketing:             ['Reference — Digital Marketing Campaign Flow'],
  staffing_agency:               ['Reference — Staffing Agency Placement Process'],
  graphic_design:                ['Reference — Graphic Design Studio Flow'],

  // ── HR & People ───────────────────────────────────────────────────────────
  human_resources:               ['Reference — HR Recruitment & Onboarding'],

  // ── Education & Research ──────────────────────────────────────────────────
  higher_education:              ['Reference — University Student Journey'],
  k12_education:                  ['Reference — K-12 Student Support Flow'],

  corporate_training:            ['Reference — Corporate L&D Programme Delivery'],
  academic_research:             ['Reference — Academic Research Publication Flow'],

  // ── Government & Public Sector ────────────────────────────────────────────
  government_services:           ['Reference — Government Permit & Licensing'],
  emergency_services_fire:       ['Reference — Fire & Rescue Emergency Response'],
  police:                        ['Reference — Police Crime Investigation'],
  military:                      ['Reference — Military Equipment Readiness'],

  // ── Contact Centre ────────────────────────────────────────────────────────
  contact_center:                ['Reference — Contact Centre Resolution Flow'],

  // ── Entertainment & Media ─────────────────────────────────────────────────
  film_tv:                       ['Reference — Film & TV Production'],
  music_production:              ['Reference — Music Production & Recording'],
  video_games:                   ['Reference — Video Game Development'],
  live_events:                   ['Reference — Live Events Production'],
  publishing:                    ['Reference — Publishing Editorial Workflow'],
  event_management:              ['Reference — Live Events Production'],

  // ── Sports & Fitness ──────────────────────────────────────────────────────
  professional_sports:           ['Reference — Professional Sports Performance'],
  sports_team:                   ['Reference — Professional Sports Performance'],
  sports_venue:                  ['Reference — Sports Venue Management'],
  fitness_clubs:                 ['Reference — Fitness Club Member Journey'],

  // ── Health & Social Services ──────────────────────────────────────────────
  social_care:                   ['Reference — Social Care Assessment Flow'],
  nonprofit:                     ['Reference — Nonprofit Programme Delivery'],

  // ── Agriculture & Natural Resources ──────────────────────────────────────
  farming_crop:                  ['Reference — Farming & Crop Production'],
  aquaculture:                   ['Reference — Aquaculture Production Cycle'],

  // ── Energy & Utilities ────────────────────────────────────────────────────
  power_generation_utilities:    ['Reference — Power Generation Operations'],
  oil_gas:                       ['Reference — Oil & Gas Drilling Operations'],

  // ── Transport ─────────────────────────────────────────────────────────────
  rail_passenger:                ['Reference — Rail Passenger Service Operations'],
  port_maritime:                 ['Reference — Port & Maritime Container Operations'],

  // ── Real Estate ───────────────────────────────────────────────────────────
  real_estate:                   ['Reference — Real Estate Transaction Flow'],

  // ── Project Management ────────────────────────────────────────────────────
  project_management:            ['Reference — Project Management Delivery'],
}

// ── Watermark groups by industry ID ──────────────────────────────────────────
export const INDUSTRY_WATERMARK_GROUP: Record<string, WatermarkGroup> = {
  // Manufacturing & Industrial
  general_manufacturing:         'manufacturing',
  metal_finishing:               'manufacturing',
  automotive_manufacturing:      'manufacturing',
  aerospace_manufacturing:       'aerospace',
  pharmaceutical_manufacturing:  'pharma',
  food_beverage_manufacturing:   'food',
  medical_device_manufacturing:  'pharma',

  // Healthcare
  hospital_acute_care:           'hospital',
  primary_care_outpatient:       'healthcare',
  surgery_operating_room:        'hospital',
  pharmacy:                      'pharmacy_rx',
  clinical_trials:               'clinical',
  research_laboratory:           'research',

  // Finance
  retail_banking:                'finance',
  insurance:                     'insurance_shield',
  investment_management:         'finance',
  accounting_audit:              'finance',

  // Technology
  software_development:          'tech',
  it_operations:                 'tech',
  cybersecurity:                 'cybersecurity',
  telecommunications:            'telecoms',

  // Retail & E-commerce
  retail_stores:                 'retail',
  ecommerce_fulfillment:         'ecommerce',
  grocery_supermarket:           'grocery',

  // Hospitality & Travel
  restaurant_food_service:       'hospitality',
  hotel_hospitality:             'hospitality',
  airline_aviation:              'aviation',
  craft_brewery:                 'brewery',
  winery:                        'winery',

  // Logistics
  warehousing_distribution:      'logistics',
  freight_trucking:              'freight',
  postal_parcel:                 'postal',

  // Construction & Design
  construction:                  'construction',
  architecture_engineering:      'architecture',

  // Professional Services
  law_firm:                      'legal',
  management_consulting:         'consulting',
  engineering_consulting:        'engineering',
  marketing_agency:              'marketing',
  digital_marketing:             'digital',
  staffing_agency:               'staffing',
  graphic_design:                'creative',

  // HR
  human_resources:               'hr',

  // Education
  higher_education:              'education',
  k12_education:                  'education',

  corporate_training:            'education',
  academic_research:             'research',

  // Government & Public Sector
  government_services:           'government',
  emergency_services_fire:       'emergency',
  police:                        'police',
  military:                      'military',

  // Contact Centre
  contact_center:                'consulting',

  // Entertainment & Media
  film_tv:                       'film',
  music_production:              'music',
  video_games:                   'gaming',
  live_events:                   'events',
  publishing:                    'publishing',
  event_management:              'events',

  // Sports & Fitness
  professional_sports:           'sports',
  sports_team:                   'sports',
  sports_venue:                  'venue',
  fitness_clubs:                 'fitness',

  // Health & Social Services
  social_care:                   'social_care',
  nonprofit:                     'nonprofit',

  // Agriculture & Natural Resources
  farming_crop:                  'agriculture',
  aquaculture:                   'aquaculture',

  // Energy & Utilities
  power_generation_utilities:    'energy',
  oil_gas:                       'oil',

  // Transport
  rail_passenger:                'rail',
  port_maritime:                 'maritime',

  // Real Estate
  real_estate:                   'realestate',

  // Project Management
  project_management:            'project_mgmt',
}

// ── Safe getters ──────────────────────────────────────────────────────────────
export function getIndustryReferenceNames(industryId: string): string[] {
  if (!industryId) return []
  return INDUSTRY_REFERENCE_NAMES[industryId] || []
}

export function getWatermarkGroup(industryId: string): WatermarkGroup {
  if (!industryId) return 'default'
  return INDUSTRY_WATERMARK_GROUP[industryId] || 'default'
}
