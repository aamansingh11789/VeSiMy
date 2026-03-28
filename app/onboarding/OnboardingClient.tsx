// @ts-nocheck
'use client'
// ── app/onboarding/OnboardingClient.tsx ──────────────────────────────────────
// 4-step guided onboarding:
//   1. Industry selection (primary — drives all language and templates)
//   2. Role selection
//   3. First project (templates adapt to the selected industry)
//   4. Confirm + launch

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { VesimyLogo } from '@/components/ui/Logo'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { CheckIcon, ArrowRightIcon, ChevronRightIcon } from '@/components/ui/Icons'
import {
  INDUSTRY_OPTIONS, INDUSTRY_SECTORS, getIndustriesBySector, getIndustryTerms, getIndustryLabel,
} from '@/lib/industry-language'

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

// ── Industry-aware process templates ─────────────────────────────────────────
// Each industry gets tailored templates using its own terminology.
// Falls back to universal templates if no specific match.
const INDUSTRY_TEMPLATES: Record<string, Array<{ id: string; label: string; steps: string[] }>> = {
  hospital_acute_care: [
    { id:'ed_flow',    label:'Emergency Department Patient Flow',  steps:['Triage','Registration','Nurse Assessment','Physician Assessment','Diagnostics','Treatment','Disposition','Discharge / Admission'] },
    { id:'admission',  label:'Inpatient Admission Pathway',        steps:['ED to Ward Decision','Bed Request','Transport','Ward Admission','Initial Assessment','Treatment Plan','Discharge Planning'] },
    { id:'custom',     label:'Map my own care pathway',            steps:[] },
  ],
  primary_care_outpatient: [
    { id:'visit_flow', label:'Patient Visit Flow',  steps:['Scheduling','Check-in','Rooming & Vitals','Physician Assessment','Care Plan','Checkout','Follow-up'] },
    { id:'referral',   label:'Referral Pathway',    steps:['Referral Request','Authorisation','Appointment Scheduling','Pre-visit Prep','Specialist Visit','Report Back to GP'] },
    { id:'custom',     label:'Map my own process',  steps:[] },
  ],
  surgery_operating_room: [
    { id:'surgical',   label:'Surgical Pathway',    steps:['Pre-op Scheduling','Pre-op Assessment','Day of Surgery Prep','Anaesthesia','Procedure','Recovery (PACU)','Ward / Discharge'] },
    { id:'or_turnover',label:'OR Turnover Process', steps:['Case End','Patient Out','Clean','Set Up','Patient In','Anaesthesia Induction','Case Start'] },
    { id:'custom',     label:'Map my own pathway',  steps:[] },
  ],
  software_development: [
    { id:'feature',    label:'Feature Delivery Pipeline', steps:['Backlog Refinement','Sprint Planning','Development','Code Review','QA Testing','Staging','Production Deploy'] },
    { id:'incident',   label:'Incident Response Flow',    steps:['Detection','Alert Triage','Assignment','Investigation','Fix','Deploy','Post-mortem'] },
    { id:'custom',     label:'Map my own pipeline',       steps:[] },
  ],
  restaurant_food_service: [
    { id:'dine_in',    label:'Dine-in Service Flow',  steps:['Guest Arrival','Seating','Order Taking','Kitchen Production','Food Runner','Table Service','Bill & Payment','Table Reset'] },
    { id:'kitchen',    label:'Kitchen Production Flow',steps:['Order Receipt','Prep','Cooking','Plating','Pass','Service','Waste Disposal'] },
    { id:'custom',     label:'Map my own process',    steps:[] },
  ],
  craft_brewery: [
    { id:'brew_day',   label:'Brew Day Process',        steps:['Grain Milling','Mash','Lauter / Sparge','Boil','Whirlpool / Hop Stand','Chill','Fermentation','Conditioning','Packaging'] },
    { id:'packaging',  label:'Packaging Line',          steps:['Tank to Bright','Carbonation','Canning / Kegging','Seaming / Filling','QC Sampling','Label / Pack','Pallet & Ship'] },
    { id:'custom',     label:'Map my own process',      steps:[] },
  ],
  winery: [
    { id:'production', label:'Winery Production Flow',  steps:['Grape Receiving','Crushing / Destemming','Fermentation','Pressing','Barrel Ageing','Blending','Fining & Filtering','Bottling','Labelling & Shipping'] },
    { id:'custom',     label:'Map my own process',      steps:[] },
  ],
  law_firm: [
    { id:'matter',     label:'Matter Lifecycle',        steps:['Client Instruction','Conflict Check','Engagement Letter','Legal Research','Document Drafting','Review & Approval','Filing / Service','Billing'] },
    { id:'contract',   label:'Contract Review Process', steps:['Document Receipt','Initial Review','Mark-up','Client Discussion','Negotiation','Execution','Filing'] },
    { id:'custom',     label:'Map my own process',      steps:[] },
  ],
  retail_stores: [
    { id:'store_ops',  label:'Store Operations Flow',   steps:['Delivery Receiving','Stockroom Processing','Floor Replenishment','Customer Service','Checkout','Returns Processing','End of Day'] },
    { id:'custom',     label:'Map my own process',      steps:[] },
  ],
  ecommerce_fulfillment: [
    { id:'order',      label:'Order Fulfilment Flow',   steps:['Order Receipt','Pick','Pack','Quality Check','Labelling','Dispatch','Tracking Update'] },
    { id:'returns',    label:'Returns Processing',      steps:['Return Receipt','Inspection','Grading','Restock / Dispose','Refund Processing','Customer Update'] },
    { id:'custom',     label:'Map my own process',      steps:[] },
  ],
  warehousing_distribution: [
    { id:'inbound',    label:'Inbound / Receiving Flow', steps:['Truck Arrival','Dock Assignment','Unloading','Receiving Inspection','Put-away','System Update','Confirmation'] },
    { id:'outbound',   label:'Outbound / Fulfilment',    steps:['Order Release','Pick','Sort','Pack','QC Check','Load','Dispatch'] },
    { id:'custom',     label:'Map my own process',       steps:[] },
  ],
  construction: [
    { id:'build',      label:'Construction Workflow',   steps:['Site Mobilisation','Foundations','Structure','Envelope / Cladding','MEP Rough-in','Finishes','Commissioning','Handover'] },
    { id:'custom',     label:'Map my own process',      steps:[] },
  ],
  hotel_hospitality: [
    { id:'guest',      label:'Guest Stay Lifecycle',    steps:['Reservation','Check-in','Room Service','Housekeeping','Maintenance Request','Check-out','Post-stay Follow-up'] },
    { id:'housekeeping',label:'Room Turnaround',        steps:['Departure Noted','Linen Strip','Deep Clean','Replenish Supplies','Inspection','Room Released'] },
    { id:'custom',     label:'Map my own process',      steps:[] },
  ],
  retail_banking: [
    { id:'loan',       label:'Loan Application Flow',   steps:['Enquiry','Application','Credit Assessment','Underwriting','Decision','Documentation','Drawdown'] },
    { id:'account',    label:'Account Opening Flow',    steps:['Customer Enquiry','KYC Documents','Verification','Account Setup','Card Dispatch','Activation'] },
    { id:'custom',     label:'Map my own process',      steps:[] },
  ],
  management_consulting: [
    { id:'engagement', label:'Consulting Engagement',   steps:['Proposal','Scoping','Kick-off','Data Collection','Analysis','Recommendation','Presentation','Implementation Support'] },
    { id:'custom',     label:'Map my own process',      steps:[] },
  ],
  contact_center: [
    { id:'contact',    label:'Contact Resolution Flow', steps:['Contact Received','Authentication','Issue Identification','System Check','Resolution','Confirmation','Case Closure'] },
    { id:'custom',     label:'Map my own process',      steps:[] },
  ],
}

// Universal fallback templates (used when no industry-specific match)
const UNIVERSAL_TEMPLATES = [
  { id:'end_to_end',  label:'End-to-End Process Map',  steps:['Request / Demand','Input / Receive','Process Step 1','Process Step 2','Quality Check','Output / Deliver','Confirm Complete'] },
  { id:'order_flow',  label:'Order / Request Fulfilment', steps:['Request Received','Validate','Process','Review','Approve','Deliver','Close'] },
  { id:'custom',      label:'I\'ll start from scratch', steps:[] },
]

// Manufacturing-specific (also used as fallback for industrial)
const MFG_TEMPLATES = [
  { id:'assembly',    label:'Assembly Line',            steps:['Material Receipt','Sub-Assembly','Main Assembly','Quality Inspection','Packaging','Shipping'] },
  { id:'machining',   label:'CNC / Machining Cell',     steps:['Raw Material Queue','Setup','Machining','Deburr / Clean','Inspection','Move to Storage'] },
  { id:'order_flow',  label:'Order Fulfilment',         steps:['Order Receipt','Pick','Pack','Quality Check','Dispatch','Delivery Confirmation'] },
  { id:'custom',      label:'I\'ll start from scratch', steps:[] },
]

function getTemplates(industryId: string) {
  if (INDUSTRY_TEMPLATES[industryId]) return INDUSTRY_TEMPLATES[industryId]
  // Manufacturing group
  const mfgGroup = ['general_manufacturing','automotive_manufacturing','aerospace_manufacturing','pharmaceutical_manufacturing','food_beverage_manufacturing','medical_device']
  if (mfgGroup.includes(industryId)) return MFG_TEMPLATES
  return UNIVERSAL_TEMPLATES
}

// ── Roles ─────────────────────────────────────────────────────────────────────
// ── Industry-specific roles ───────────────────────────────────────────────────
// Every industry gets roles that match the actual job titles people in that
// field recognise. Grouped so similar industries share a set.

const INDUSTRY_ROLES: Record<string, Array<{ id: string; label: string }>> = {

  // ── Healthcare ──────────────────────────────────────────────────────────────
  hospital_acute_care: [
    { id:'physician',       label:'Physician / Consultant'     },
    { id:'nurse',           label:'Nurse / Charge Nurse'       },
    { id:'ops_manager',     label:'Operations / Service Manager'},
    { id:'quality_patient', label:'Quality & Patient Safety'   },
    { id:'allied_health',   label:'Allied Health Professional' },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],
  primary_care_outpatient: [
    { id:'gp',              label:'GP / Primary Care Physician'},
    { id:'practice_manager',label:'Practice Manager'           },
    { id:'nurse',           label:'Nurse / ANP'                },
    { id:'ops_manager',     label:'Operations Manager'         },
    { id:'quality_patient', label:'Quality & Patient Safety'   },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],
  surgery_operating_room: [
    { id:'surgeon',         label:'Surgeon / Consultant'       },
    { id:'anaesthetist',    label:'Anaesthetist / CRNA'        },
    { id:'scrub_nurse',     label:'Scrub Nurse / ODP'          },
    { id:'or_manager',      label:'OR / Theatre Manager'       },
    { id:'quality_patient', label:'Quality & Patient Safety'   },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],
  pharmacy: [
    { id:'pharmacist',      label:'Pharmacist'                 },
    { id:'pharmacy_tech',   label:'Pharmacy Technician'        },
    { id:'pharmacy_mgr',    label:'Pharmacy Manager'           },
    { id:'quality',         label:'Quality / Regulatory'       },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],
  clinical_trials: [
    { id:'cra',             label:'CRA / Monitor'              },
    { id:'principal_inv',   label:'Principal Investigator'     },
    { id:'cto_manager',     label:'Clinical Trial Manager'     },
    { id:'data_manager',    label:'Data Manager / Biostatistician'},
    { id:'regulatory',      label:'Regulatory Affairs'         },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],
  research_laboratory: [
    { id:'researcher',      label:'Researcher / Scientist'     },
    { id:'lab_manager',     label:'Lab Manager'                },
    { id:'pi',              label:'Principal Investigator'     },
    { id:'postdoc',         label:'Postdoc / Research Fellow'  },
    { id:'lab_tech',        label:'Lab Technician'             },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],

  // ── Legal ───────────────────────────────────────────────────────────────────
  law_firm: [
    { id:'partner',         label:'Partner'                    },
    { id:'solicitor',       label:'Solicitor / Associate'      },
    { id:'barrister',       label:'Barrister / Counsel'        },
    { id:'paralegal',       label:'Paralegal'                  },
    { id:'practice_mgr',    label:'Practice Manager'           },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],

  // ── Finance & Banking ───────────────────────────────────────────────────────
  retail_banking: [
    { id:'relationship_mgr',label:'Relationship Manager'       },
    { id:'underwriter',     label:'Underwriter'                },
    { id:'branch_manager',  label:'Branch / Region Manager'    },
    { id:'ops_manager',     label:'Operations Manager'         },
    { id:'risk_compliance', label:'Risk & Compliance'          },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],
  investment_management: [
    { id:'fund_manager',    label:'Fund / Portfolio Manager'   },
    { id:'trader',          label:'Trader / Dealer'            },
    { id:'ops_manager',     label:'Operations Manager'         },
    { id:'risk_compliance', label:'Risk & Compliance'          },
    { id:'settlements',     label:'Settlements / Middle Office'},
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],
  accounting_audit: [
    { id:'partner',         label:'Partner / Director'         },
    { id:'manager',         label:'Audit / Accounts Manager'   },
    { id:'senior',          label:'Senior / Semi-Senior'       },
    { id:'junior',          label:'Junior / Trainee'           },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],
  insurance: [
    { id:'underwriter',     label:'Underwriter'                },
    { id:'claims_handler',  label:'Claims Handler'             },
    { id:'actuary',         label:'Actuary'                    },
    { id:'ops_manager',     label:'Operations Manager'         },
    { id:'compliance',      label:'Risk & Compliance'          },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],

  // ── Technology ──────────────────────────────────────────────────────────────
  software_development: [
    { id:'eng_lead',        label:'Engineering Lead / Manager' },
    { id:'developer',       label:'Developer / Engineer'       },
    { id:'product_manager', label:'Product Manager'            },
    { id:'qa_engineer',     label:'QA / Test Engineer'         },
    { id:'scrum_master',    label:'Scrum Master / Agile Coach' },
    { id:'ci_analyst',      label:'CI / DevOps Analyst'        },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],
  cybersecurity: [
    { id:'soc_analyst',     label:'SOC Analyst'                },
    { id:'soc_manager',     label:'SOC Manager'                },
    { id:'pen_tester',      label:'Pen Tester / Red Team'      },
    { id:'ciso',            label:'CISO / Security Director'   },
    { id:'incident_resp',   label:'Incident Responder'         },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],
  it_operations: [
    { id:'sre',             label:'SRE / Platform Engineer'    },
    { id:'sysadmin',        label:'Sysadmin / IT Manager'      },
    { id:'noc_engineer',    label:'NOC Engineer'               },
    { id:'head_it',         label:'Head of IT / CTO'           },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],

  // ── Education ───────────────────────────────────────────────────────────────
  higher_education: [
    { id:'academic',        label:'Academic / Lecturer'        },
    { id:'head_dept',       label:'Head of Department'         },
    { id:'registrar',       label:'Registrar / Academic Ops'   },
    { id:'student_support', label:'Student Support Manager'    },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student'                    },
    { id:'other',           label:'Other'                      },
  ],
  k12_education: [
    { id:'teacher',         label:'Teacher / Class Teacher'    },
    { id:'senco',           label:'SENCO / Learning Support'   },
    { id:'head_teacher',    label:'Headteacher / Principal'    },
    { id:'pastoral',        label:'Pastoral / Year Head'       },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student'                    },
    { id:'other',           label:'Other'                      },
  ],
  corporate_training: [
    { id:'ld_manager',      label:'L&D Manager'                },
    { id:'trainer',         label:'Trainer / Facilitator'      },
    { id:'instructional',   label:'Instructional Designer'     },
    { id:'hr_director',     label:'HR / People Director'       },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],

  // ── Government & Public Sector ───────────────────────────────────────────────
  government_services: [
    { id:'case_officer',    label:'Case Officer / Processing'  },
    { id:'service_manager', label:'Service / Team Manager'     },
    { id:'policy_officer',  label:'Policy Officer'             },
    { id:'inspector',       label:'Inspector / Enforcement'    },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],
  emergency_services_fire: [
    { id:'firefighter',     label:'Firefighter / Crew'         },
    { id:'watch_manager',   label:'Watch Manager'              },
    { id:'station_manager', label:'Station Manager'            },
    { id:'group_manager',   label:'Group / Area Manager'       },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],
  police: [
    { id:'officer',         label:'Police Officer / Detective' },
    { id:'sergeant',        label:'Sergeant / Inspector'       },
    { id:'supt',            label:'Superintendent / Chief'     },
    { id:'analyst',         label:'Intelligence Analyst'       },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],
  military: [
    { id:'junior_nco',      label:'Junior Rank / NCO'          },
    { id:'senior_nco',      label:'Senior NCO / WO'            },
    { id:'officer',         label:'Officer'                    },
    { id:'reme_tech',       label:'REME / Technical Specialist' },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],

  // ── Hospitality & Food ──────────────────────────────────────────────────────
  restaurant_food_service: [
    { id:'head_chef',       label:'Head Chef / Chef de Cuisine'},
    { id:'sous_chef',       label:'Sous Chef / Kitchen Team'   },
    { id:'foh_manager',     label:'FOH / Restaurant Manager'   },
    { id:'gm',              label:'General Manager'            },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],
  hotel_hospitality: [
    { id:'gm',              label:'General Manager'            },
    { id:'housekeeping_mgr',label:'Housekeeping Manager'       },
    { id:'fom',             label:'Front Office Manager'       },
    { id:'f_and_b',         label:'F&B Manager'                },
    { id:'revenue_mgr',     label:'Revenue Manager'            },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],
  craft_brewery: [
    { id:'head_brewer',     label:'Head Brewer'                },
    { id:'brewer',          label:'Brewer / Cellarman'         },
    { id:'taproom_mgr',     label:'Taproom Manager'            },
    { id:'owner',           label:'Owner / Director'           },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],
  winery: [
    { id:'winemaker',       label:'Winemaker / Viticulturalist'},
    { id:'cellarmaster',    label:'Cellarmaster'               },
    { id:'tasting_room',    label:'Tasting Room Manager'       },
    { id:'owner',           label:'Owner / Director'           },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],

  // ── Agriculture & Environment ────────────────────────────────────────────────
  farming_crop: [
    { id:'farmer',          label:'Farmer / Owner'             },
    { id:'farm_manager',    label:'Farm Manager'               },
    { id:'agronomist',      label:'Agronomist'                 },
    { id:'harvest_manager', label:'Harvest / Operations Manager'},
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],
  aquaculture: [
    { id:'fish_farmer',     label:'Fish Farmer / Owner'        },
    { id:'prod_manager',    label:'Production Manager'         },
    { id:'fish_health',     label:'Fish Health Officer'        },
    { id:'technician',      label:'Aquaculture Technician'     },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],

  // ── Energy & Resources ───────────────────────────────────────────────────────
  oil_gas: [
    { id:'drilling_eng',    label:'Drilling Engineer'          },
    { id:'drilling_supt',   label:'Drilling Superintendent'    },
    { id:'toolpusher',      label:'Toolpusher / Driller'       },
    { id:'hse',             label:'HSE Manager'                },
    { id:'ops_manager',     label:'Operations Manager'         },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],
  power_generation_utilities: [
    { id:'plant_operator',  label:'Plant Operator'             },
    { id:'maintenance_eng', label:'Maintenance Engineer'       },
    { id:'plant_manager',   label:'Plant / Station Manager'    },
    { id:'hse',             label:'HSE Manager'                },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],

  // ── Transport ────────────────────────────────────────────────────────────────
  airline_aviation: [
    { id:'ground_ops',      label:'Ground Operations Manager'  },
    { id:'pilot',           label:'Pilot / Captain'            },
    { id:'cabin_crew',      label:'Cabin Crew / Purser'        },
    { id:'dispatch',        label:'Dispatcher / Ops Controller'},
    { id:'maintenance',     label:'Aircraft Maintenance Eng'   },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],
  rail_passenger: [
    { id:'train_driver',    label:'Train Driver / Conductor'   },
    { id:'station_manager', label:'Station Manager'            },
    { id:'control_room',    label:'Control Room / Ops'         },
    { id:'performance_mgr', label:'Performance Manager'        },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],
  port_maritime: [
    { id:'terminal_ops',    label:'Terminal / Port Operator'   },
    { id:'crane_operator',  label:'Crane Operator'             },
    { id:'terminal_mgr',    label:'Terminal Manager'           },
    { id:'harbour_master',  label:'Harbour Master'             },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],

  // ── Entertainment & Media ────────────────────────────────────────────────────
  film_tv: [
    { id:'director',        label:'Director'                   },
    { id:'producer',        label:'Producer / Line Producer'   },
    { id:'1st_ad',          label:'1st AD / Production Manager'},
    { id:'dop',             label:'DOP / Camera'               },
    { id:'post_producer',   label:'Post-production Supervisor' },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],
  music_production: [
    { id:'producer',        label:'Producer'                   },
    { id:'engineer',        label:'Recording / Mix Engineer'   },
    { id:'artist_manager',  label:'Artist Manager'             },
    { id:'studio_mgr',      label:'Studio Manager'             },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],
  video_games: [
    { id:'game_director',   label:'Game Director'              },
    { id:'producer',        label:'Producer / Project Manager' },
    { id:'lead_developer',  label:'Lead Developer / Engineer'  },
    { id:'qa_lead',         label:'QA Lead / Tester'           },
    { id:'ci_analyst',      label:'CI / Agile Coach'           },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],

  // ── Sports & Fitness ──────────────────────────────────────────────────────────
  sports_team:      [
    { id:'head_coach',      label:'Head Coach / Manager'       },
    { id:'sports_scientist',label:'Sports Scientist'           },
    { id:'physio',          label:'Physiotherapist / Medic'    },
    { id:'analyst',         label:'Performance Analyst'        },
    { id:'operations',      label:'Club Operations Manager'    },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],
  professional_sports: [
    { id:'head_coach',      label:'Head Coach / Manager'       },
    { id:'sports_scientist',label:'Sports Scientist'           },
    { id:'physio',          label:'Physiotherapist / Medic'    },
    { id:'analyst',         label:'Performance Analyst'        },
    { id:'operations',      label:'Club Operations Manager'    },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],
  fitness_clubs: [
    { id:'personal_trainer',label:'Personal Trainer / Coach'   },
    { id:'club_manager',    label:'Club / Gym Manager'         },
    { id:'class_instructor',label:'Class Instructor'           },
    { id:'membership',      label:'Membership Manager'         },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],

  // ── Social & Nonprofit ────────────────────────────────────────────────────────
  social_care: [
    { id:'social_worker',   label:'Social Worker'              },
    { id:'care_coordinator',label:'Care Coordinator'           },
    { id:'team_manager',    label:'Team / Service Manager'     },
    { id:'service_director',label:'Service Director'           },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],
  nonprofit: [
    { id:'programme_mgr',   label:'Programme Manager'          },
    { id:'service_director',label:'Service / Operations Director'},
    { id:'fundraising',     label:'Fundraising Manager'        },
    { id:'frontline',       label:'Frontline Worker'           },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],

  // ── Real Estate ───────────────────────────────────────────────────────────────
  real_estate: [
    { id:'estate_agent',    label:'Estate Agent / Realtor'     },
    { id:'broker',          label:'Broker / Branch Manager'    },
    { id:'transaction_coord',label:'Transaction Coordinator'   },
    { id:'property_mgr',    label:'Property Manager'           },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],

  // ── Architecture & Design ─────────────────────────────────────────────────────
  architecture_engineering: [
    { id:'architect',       label:'Architect / Project Architect'},
    { id:'structural_eng',  label:'Structural / Civil Engineer' },
    { id:'project_manager', label:'Project Manager'             },
    { id:'bim_manager',     label:'BIM / Design Manager'        },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'    },
    { id:'student',         label:'Student / Learning'          },
    { id:'other',           label:'Other'                       },
  ],
  graphic_design: [
    { id:'designer',        label:'Designer / Art Director'    },
    { id:'creative_dir',    label:'Creative Director'          },
    { id:'studio_mgr',      label:'Studio Manager'             },
    { id:'brand_manager',   label:'Brand Manager'              },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],

  // ── HR & People ────────────────────────────────────────────────────────────────
  human_resources: [
    { id:'hr_business_partner',label:'HR Business Partner'     },
    { id:'recruiter',       label:'Recruiter / TA Manager'     },
    { id:'hr_director',     label:'HR Director / CHRO'         },
    { id:'people_ops',      label:'People Ops Manager'         },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],
  staffing_agency: [
    { id:'consultant',      label:'Recruitment Consultant'     },
    { id:'branch_manager',  label:'Branch / Division Manager'  },
    { id:'delivery_lead',   label:'Delivery Lead / Resource Mgr'},
    { id:'md',              label:'Managing Director'          },
    { id:'ci_analyst',      label:'CI / Improvement Analyst'   },
    { id:'student',         label:'Student / Learning'         },
    { id:'other',           label:'Other'                      },
  ],
}

// ── Default roles (universal fallback) ───────────────────────────────────────
const DEFAULT_ROLES = [
  { id:'manager',         label:'Manager / Team Lead'          },
  { id:'analyst',         label:'Process / CI Analyst'         },
  { id:'ops_engineer',    label:'Operations Engineer'          },
  { id:'quality',         label:'Quality / Compliance'         },
  { id:'consultant',      label:'Consultant / Advisor'         },
  { id:'frontline',       label:'Frontline / Practitioner'     },
  { id:'student',         label:'Student / Learning'           },
  { id:'other',           label:'Other'                        },
]

// Manufacturing roles (shared by all manufacturing industry IDs)
const MFG_ROLES = [
  { id:'plant_manager',   label:'Plant / Site Manager'         },
  { id:'lean_engineer',   label:'Lean / CI Engineer'           },
  { id:'ops_manager',     label:'Operations Manager'           },
  { id:'quality_manager', label:'Quality Manager'              },
  { id:'maintenance',     label:'Maintenance Engineer'         },
  { id:'team_leader',     label:'Team Leader / Supervisor'     },
  { id:'student',         label:'Student / Learning'           },
  { id:'other',           label:'Other'                        },
]

const MFG_IDS = [
  'general_manufacturing','automotive_manufacturing','aerospace_manufacturing',
  'pharmaceutical_manufacturing','food_beverage_manufacturing',
  'medical_device_manufacturing',
]

// Tech/IT roles shared set
const TECH_ROLES = [
  { id:'eng_lead',        label:'Engineering Lead / Manager'   },
  { id:'developer',       label:'Developer / Engineer'         },
  { id:'product_manager', label:'Product Manager'              },
  { id:'qa_engineer',     label:'QA / Test Engineer'           },
  { id:'devops',          label:'DevOps / SRE'                 },
  { id:'ci_analyst',      label:'CI / Improvement Analyst'     },
  { id:'student',         label:'Student / Learning'           },
  { id:'other',           label:'Other'                        },
]

// Retail roles shared set
const RETAIL_ROLES = [
  { id:'store_manager',   label:'Store / Branch Manager'       },
  { id:'ops_manager',     label:'Operations Manager'           },
  { id:'department_mgr',  label:'Department / Category Manager'},
  { id:'loss_prevention', label:'Loss Prevention / Compliance' },
  { id:'ci_analyst',      label:'CI / Improvement Analyst'     },
  { id:'student',         label:'Student / Learning'           },
  { id:'other',           label:'Other'                        },
]

// Logistics roles shared set
const LOGISTICS_ROLES = [
  { id:'warehouse_manager',label:'Warehouse Manager'           },
  { id:'ops_manager',     label:'Operations Manager'           },
  { id:'logistics_coord', label:'Logistics Coordinator'        },
  { id:'dispatch',        label:'Dispatcher / Planner'         },
  { id:'ci_analyst',      label:'CI / Improvement Analyst'     },
  { id:'student',         label:'Student / Learning'           },
  { id:'other',           label:'Other'                        },
]

// Marketing / creative shared set
const MARKETING_ROLES = [
  { id:'account_manager', label:'Account / Client Manager'     },
  { id:'marketing_dir',   label:'Marketing Director'           },
  { id:'campaign_manager',label:'Campaign Manager'             },
  { id:'creative_dir',    label:'Creative Director'            },
  { id:'performance',     label:'Performance / Analytics Lead' },
  { id:'ci_analyst',      label:'CI / Improvement Analyst'     },
  { id:'student',         label:'Student / Learning'           },
  { id:'other',           label:'Other'                        },
]

function getRolesForIndustry(industryId: string) {
  if (INDUSTRY_ROLES[industryId]) return INDUSTRY_ROLES[industryId]
  if (MFG_IDS.includes(industryId)) return MFG_ROLES
  if (['telecommunications','it_operations','cybersecurity'].includes(industryId)) return TECH_ROLES
  if (['retail_stores','ecommerce_fulfillment','grocery_supermarket'].includes(industryId)) return RETAIL_ROLES
  if (['warehousing_distribution','freight_trucking','postal_parcel'].includes(industryId)) return LOGISTICS_ROLES
  if (['marketing_agency','digital_marketing'].includes(industryId)) return MARKETING_ROLES
  return DEFAULT_ROLES
}

// ── Industry-specific welcome copy ────────────────────────────────────────────
function getWelcomeCopy(industryId: string) {
  const t = getIndustryTerms(industryId)
  const label = getIndustryLabel(industryId)
  return {
    headline: `Map your ${t.process}.`,
    sub: `VeSiMy is now set up for ${label}. Your ${t.processSteps}, ${t.cycleTime.toLowerCase()}, ${t.defects.toLowerCase()}, and ${t.kaizen} will all use the language your team already knows.`,
    badge: label,
  }
}

interface Props { profile: any }

export function OnboardingClient({ profile }: Props) {
  const router = useRouter()
  const db     = createClient()

  const [step,     setStep]    = useState(1)
  const [industry, setIndustry] = useState('')
  const [sector,   setSector]  = useState('')   // for grouping UI
  const [role,     setRole]    = useState('')
  const [template, setTemplate] = useState('')
  const [projName, setProjName] = useState('')
  const [saving,   setSaving]  = useState(false)
  const [done,     setDone]    = useState(false)

  const templates = useMemo(() => getTemplates(industry), [industry])
  const roles = useMemo(() => getRolesForIndustry(industry), [industry])
  const t = useMemo(() => getIndustryTerms(industry || 'general_manufacturing'), [industry])
  const industryLabel = useMemo(() => getIndustryLabel(industry), [industry])

  const TOTAL_STEPS = 4
  const pct = ((step - 1) / TOTAL_STEPS) * 100

  // When industry changes, reset template (templates change)
  function selectIndustry(id: string) {
    setIndustry(id)
    setTemplate('')
    setProjName('')
    setRole('')  // reset role — it changes per industry
  }

  async function finish() {
    setSaving(true)
    try {
      // 1. Mark profile onboarded + save role/industry
      await db.from('profiles').update({
        onboarded: true,
        role:      role || 'other',
        industry:  industry,
      }).eq('id', profile.id)

      // 2. Create the first project (unless sample)
      if (template === 'sample') {
        const refRes = await fetch('/api/projects/seed-industry-reference', { method: 'POST' })
        const refData = await refRes.json()
        setDone(true)
        setTimeout(() => {
          if (refData?.id) router.push(`/project/${refData.id}`)
          else router.push('/dashboard')
        }, 2000)
        return
      }

      const name = projName.trim() || `My First ${industryLabel} Process`
      const res = await fetch('/api/projects', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, industry }),
      })
      const { project } = await res.json()

      // 3. Pre-load template steps
      const tpl = templates.find(t => t.id === template)
      if (project?.id && tpl?.steps.length) {
        await Promise.all(tpl.steps.map((stepName, i) =>
          fetch('/api/steps', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ project_id: project.id, name: stepName, order_index: i, cycle_time: 0, wait_time: 0 }),
          })
        ))
      }

      // 4. Seed reference projects silently in background
      fetch('/api/projects/seed-industry-reference', { method: 'POST' }).catch(() => {})

      setDone(true)
      setTimeout(() => {
        if (project?.id) router.push(`/project/${project.id}`)
        else router.push('/dashboard')
      }, 2000)
    } catch (e) {
      toast.error('Something went wrong. Please try again.')
      setSaving(false)
    }
  }

  // ── Done screen ─────────────────────────────────────────────────────────────
  if (done) return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:20, padding:24 }}>
      <div style={{ width:72, height:72, borderRadius:'50%', background:'rgba(46,132,74,0.12)', border:'2px solid #2E844A', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <CheckIcon size={36} color='#2E844A' />
      </div>
      <h2 style={{ fontFamily:serif, fontSize:28, color:'var(--text)', fontWeight:700, textAlign:'center' }}>
        You're set up for {industryLabel}.
      </h2>
      <p style={{ color:'var(--text3)', fontSize:15, textAlign:'center', maxWidth:420 }}>
        Your workspace speaks your language. Opening your first {t.process} map now…
      </p>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column',
      backgroundImage:'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(1,118,211,0.05) 0%, transparent 60%)',
    }}>
      {/* Top bar */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 40px', borderBottom:'1px solid var(--border)' }}>
        <VesimyLogo size={30} showText />
        {/* Step indicators */}
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map(n => (
            <div key={n} style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{
                width:28, height:28, borderRadius:'50%',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:12, fontWeight:700,
                background: step > n ? 'rgba(46,132,74,0.12)' : step === n ? 'rgba(1,118,211,0.12)' : 'var(--sl-100)',
                border: step > n ? '1.5px solid #2E844A' : step === n ? '1.5px solid #0176D3' : '1.5px solid var(--border)',
                color: step > n ? '#2E844A' : step === n ? '#0176D3' : 'var(--text3)',
              }}>
                {step > n ? <CheckIcon size={12} strokeWidth={3} /> : n}
              </div>
              {n < TOTAL_STEPS && <div style={{ width:20, height:1, background:'var(--border)' }} />}
            </div>
          ))}
        </div>
        <button onClick={() => router.push('/dashboard')} style={{ fontSize:12, color:'var(--text3)', background:'none', border:'none', cursor:'pointer' }}>
          Skip →
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ height:3, background:'var(--sl-200)' }}>
        <div style={{ height:'100%', background:'#0176D3', width:`${pct}%`, transition:'width 0.4s ease' }} />
      </div>

      {/* Content */}
      <div style={{ flex:1, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'40px 24px', overflowY:'auto' }}>
        <div style={{ width:'100%', maxWidth:680 }}>

          {/* ══════════════════════════════════════════════════════════════════
              STEP 1 — INDUSTRY (the most important choice)
          ══════════════════════════════════════════════════════════════════ */}
          {step === 1 && (
            <div>
              <p style={{ fontSize:11, color:'#0176D3', letterSpacing:3, fontFamily:'monospace', marginBottom:16, textTransform:'uppercase' }}>Step 1 of 4 — Your Industry</p>
              <h1 style={{ fontFamily:serif, fontSize:'clamp(26px,4vw,42px)', fontWeight:700, color:'var(--text)', marginBottom:10, lineHeight:1.15 }}>
                What field do you work in?
              </h1>
              <p style={{ fontSize:14, color:'var(--text3)', marginBottom:32, lineHeight:1.65, maxWidth:520 }}>
                VeSiMy adapts its language to your field — your processes, metrics, and terminology. A nurse never sees "WIP". A brewer never sees "takt time" as a phrase they don't recognise.
              </p>

              {/* Sector tabs */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:20 }}>
                <button onClick={() => setSector('')} style={{
                  padding:'5px 12px', borderRadius:100, fontSize:12, cursor:'pointer', border:'1px solid',
                  background: sector==='' ? '#0176D3' : '#FFFFFF',
                  borderColor: sector==='' ? '#0176D3' : 'var(--border)',
                  color: sector==='' ? '#FFFFFF' : 'var(--text2)',
                  fontWeight: sector==='' ? 600 : 400,
                }}>All</button>
                {INDUSTRY_SECTORS.map(s => (
                  <button key={s} onClick={() => setSector(s)} style={{
                    padding:'5px 12px', borderRadius:100, fontSize:12, cursor:'pointer', border:'1px solid',
                    background: sector===s ? '#0176D3' : '#FFFFFF',
                    borderColor: sector===s ? '#0176D3' : 'var(--border)',
                    color: sector===s ? '#FFFFFF' : 'var(--text2)',
                    fontWeight: sector===s ? 600 : 400,
                  }}>{s}</button>
                ))}
              </div>

              {/* Industry grid */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))', gap:8, marginBottom:32, maxHeight:380, overflowY:'auto', paddingRight:4 }}>
                {(sector ? getIndustriesBySector(sector) : INDUSTRY_OPTIONS).map(ind => (
                  <button key={ind.id} onClick={() => selectIndustry(ind.id)} style={{
                    padding:'12px 14px', borderRadius:10, textAlign:'left', cursor:'pointer', transition:'all 0.12s',
                    background: industry===ind.id ? 'rgba(1,118,211,0.08)' : '#FFFFFF',
                    border: industry===ind.id ? '1.5px solid #0176D3' : '1.5px solid var(--border)',
                    boxShadow: industry===ind.id ? '0 0 0 3px rgba(1,118,211,0.10)' : 'none',
                  }}>
                    <div style={{ fontSize:12, fontWeight: industry===ind.id ? 700 : 500, color: industry===ind.id ? '#0176D3' : 'var(--text)', lineHeight:1.3 }}>
                      {ind.label}
                    </div>
                    <div style={{ fontSize:10, color:'var(--text3)', marginTop:2 }}>{ind.sector}</div>
                  </button>
                ))}
              </div>

              {/* Preview of what changes */}
              {industry && (() => {
                const preview = getWelcomeCopy(industry)
                const terms = getIndustryTerms(industry)
                return (
                  <div style={{ background:'rgba(1,118,211,0.04)', border:'1px solid rgba(1,118,211,0.2)', borderRadius:12, padding:'16px 18px', marginBottom:24 }}>
                    <div style={{ fontSize:10, color:'#0176D3', fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', marginBottom:10, fontFamily:'monospace' }}>
                      How VeSiMy will look for {preview.badge}
                    </div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                      {[
                        ['Product / Unit', terms.product],
                        ['Process step', terms.processStep],
                        [terms.cycleTime, 'Time per step'],
                        ['Waste / Defect', terms.defect],
                        ['Improvement', terms.kaizen],
                        ['Where you work', terms.gemba],
                      ].map(([lean, industry_term]) => (
                        <div key={lean} style={{ background:'#FFFFFF', border:'1px solid var(--border)', borderRadius:8, padding:'6px 10px', fontSize:11 }}>
                          <span style={{ color:'var(--text3)' }}>{lean} →</span>
                          <span style={{ color:'#0176D3', fontWeight:700, marginLeft:4 }}>{industry_term}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}

              <button onClick={() => setStep(2)} disabled={!industry} style={{
                padding:'12px 32px', borderRadius:8, fontSize:15, fontWeight:600, cursor: !industry ? 'not-allowed' : 'pointer',
                background: !industry ? 'var(--sl-200)' : '#0176D3',
                color: !industry ? 'var(--text3)' : '#FFFFFF',
                border:'none', display:'inline-flex', alignItems:'center', gap:8,
                boxShadow: industry ? '0 4px 14px rgba(1,118,211,0.30)' : 'none',
                transition:'all 0.15s',
              }}>
                Continue <ArrowRightIcon size={15} />
              </button>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              STEP 2 — ROLE
          ══════════════════════════════════════════════════════════════════ */}
          {step === 2 && (
            <div>
              <p style={{ fontSize:11, color:'#0176D3', letterSpacing:3, fontFamily:'monospace', marginBottom:16, textTransform:'uppercase' }}>Step 2 of 4 — Your Role</p>
              <h1 style={{ fontFamily:serif, fontSize:'clamp(26px,4vw,42px)', fontWeight:700, color:'var(--text)', marginBottom:10, lineHeight:1.15 }}>
                What's your role<br /><span style={{ color:'#0176D3' }}>in {getIndustryLabel(industry) || 'your field'}?</span>
              </h1>
              <p style={{ fontSize:14, color:'var(--text3)', marginBottom:28, lineHeight:1.65 }}>
                Select the role that best fits how you work. VeSiMy uses this to personalise its improvement suggestions and coaching.
              </p>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:8, marginBottom:36 }}>
                {roles.map(r => (
                  <button key={r.id} onClick={() => setRole(r.id)} style={{
                    padding:'14px 16px', borderRadius:10, textAlign:'left', cursor:'pointer', transition:'all 0.12s',
                    background: role===r.id ? 'rgba(1,118,211,0.08)' : '#FFFFFF',
                    border: role===r.id ? '1.5px solid #0176D3' : '1.5px solid var(--border)',
                  }}>
                    <div style={{ fontSize:13, fontWeight: role===r.id ? 700 : 500, color: role===r.id ? '#0176D3' : 'var(--text)' }}>
                      {r.label}
                    </div>
                  </button>
                ))}
              </div>

              <div style={{ display:'flex', gap:10 }}>
                <button onClick={() => setStep(1)} style={{ padding:'12px 20px', borderRadius:8, fontSize:14, background:'var(--sl-100)', border:'1px solid var(--border)', color:'var(--text2)', cursor:'pointer' }}>
                  ← Back
                </button>
                <button onClick={() => setStep(3)} disabled={!role} style={{
                  flex:1, padding:'12px 32px', borderRadius:8, fontSize:15, fontWeight:600,
                  cursor: !role ? 'not-allowed' : 'pointer',
                  background: !role ? 'var(--sl-200)' : '#0176D3',
                  color: !role ? 'var(--text3)' : '#FFFFFF',
                  border:'none', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                  transition:'all 0.15s',
                }}>
                  Continue <ArrowRightIcon size={15} />
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              STEP 3 — FIRST PROJECT (industry-aware templates)
          ══════════════════════════════════════════════════════════════════ */}
          {step === 3 && (
            <div>
              <p style={{ fontSize:11, color:'#0176D3', letterSpacing:3, fontFamily:'monospace', marginBottom:16, textTransform:'uppercase' }}>Step 3 of 4 — Your First Process</p>
              <h1 style={{ fontFamily:serif, fontSize:'clamp(26px,4vw,42px)', fontWeight:700, color:'var(--text)', marginBottom:10, lineHeight:1.15 }}>
                Name your first<br /><span style={{ color:'#0176D3' }}>{t.process}.</span>
              </h1>
              <p style={{ fontSize:14, color:'var(--text3)', marginBottom:24, lineHeight:1.65 }}>
                This is the {t.valueStream} you'll map first. You can always add more later.
              </p>

              <label className="label" style={{ marginBottom:6, display:'block' }}>
                {t.processStep.charAt(0).toUpperCase() + t.processStep.slice(1)} / Project Name
              </label>
              <input className="input" value={projName} onChange={e => setProjName(e.target.value)}
                placeholder={`e.g. My ${industryLabel} ${t.process}`}
                style={{ marginBottom:24, fontSize:14 }} autoFocus />

              <p style={{ fontSize:13, color:'var(--text2)', marginBottom:12, fontWeight:600 }}>
                Start with a template for {industryLabel}:
              </p>
              <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:32 }}>
                {/* Sample reference option */}
                <button onClick={() => { setTemplate('sample'); setProjName('Explore reference projects') }} style={{
                  padding:'14px 16px', borderRadius:10, textAlign:'left', cursor:'pointer', transition:'all 0.12s',
                  background: template==='sample' ? 'rgba(46,132,74,0.08)' : '#FFFFFF',
                  border: template==='sample' ? '1.5px solid #2E844A' : '1.5px solid var(--border)',
                }}>
                  <div style={{ fontWeight:600, fontSize:13, color: template==='sample' ? '#2E844A' : 'var(--text)', marginBottom:4 }}>
                    Load reference projects — explore fully-built examples
                  </div>
                  <div style={{ fontSize:11, color:'var(--text3)' }}>
                    18 industries, every CI tool populated — stopwatch, fishbone, 5 Why, waste ID, kaizen, PDCA, SMED, and more. Real bottlenecks, root causes, and countermeasures.
                  </div>
                </button>

                {/* Industry-specific templates */}
                {templates.map(tpl => tpl.id !== 'sample' && (
                  <button key={tpl.id} onClick={() => setTemplate(tpl.id)} style={{
                    padding:'14px 16px', borderRadius:10, textAlign:'left', cursor:'pointer', transition:'all 0.12s',
                    background: template===tpl.id ? 'rgba(1,118,211,0.06)' : '#FFFFFF',
                    border: template===tpl.id ? '1.5px solid #0176D3' : '1.5px solid var(--border)',
                  }}>
                    <div style={{ fontWeight:600, fontSize:13, color: template===tpl.id ? '#0176D3' : 'var(--text)', marginBottom: tpl.steps.length ? 5 : 0 }}>
                      {tpl.label}
                    </div>
                    {tpl.steps.length > 0 && (
                      <div style={{ fontSize:11, color:'var(--text3)', lineHeight:1.6 }}>
                        {tpl.steps.slice(0, 4).join(' → ')}{tpl.steps.length > 4 ? ' → …' : ''}
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div style={{ display:'flex', gap:10 }}>
                <button onClick={() => setStep(2)} style={{ padding:'12px 20px', borderRadius:8, fontSize:14, background:'var(--sl-100)', border:'1px solid var(--border)', color:'var(--text2)', cursor:'pointer' }}>
                  ← Back
                </button>
                <button onClick={() => setStep(4)}
                  disabled={!template || (!projName.trim() && template !== 'sample')}
                  style={{
                    flex:1, padding:'12px 32px', borderRadius:8, fontSize:15, fontWeight:600,
                    cursor: (!template || (!projName.trim() && template !== 'sample')) ? 'not-allowed' : 'pointer',
                    background: (!template || (!projName.trim() && template !== 'sample')) ? 'var(--sl-200)' : '#0176D3',
                    color: (!template || (!projName.trim() && template !== 'sample')) ? 'var(--text3)' : '#FFFFFF',
                    border:'none', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                    transition:'all 0.15s',
                  }}>
                  Continue <ArrowRightIcon size={15} />
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              STEP 4 — CONFIRM + LAUNCH
          ══════════════════════════════════════════════════════════════════ */}
          {step === 4 && (
            <div>
              <p style={{ fontSize:11, color:'#0176D3', letterSpacing:3, fontFamily:'monospace', marginBottom:16, textTransform:'uppercase' }}>Step 4 of 4 — Ready</p>
              <h1 style={{ fontFamily:serif, fontSize:'clamp(26px,4vw,42px)', fontWeight:700, color:'var(--text)', marginBottom:10, lineHeight:1.15 }}>
                Your workspace is<br /><span style={{ color:'#0176D3' }}>ready to build.</span>
              </h1>
              <p style={{ fontSize:14, color:'var(--text3)', marginBottom:28, lineHeight:1.65 }}>
                Here's what's being set up for you:
              </p>

              {/* Summary */}
              <div style={{ background:'#FFFFFF', border:'1px solid var(--border)', borderRadius:12, padding:24, marginBottom:24 }}>
                <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  {[
                    { label:'Industry', value: industryLabel, note:'Your terminology is set' },
                    { label:'Role', value: roles.find(r => r.id===role)?.label || role, note:'' },
                    { label:template==='sample' ? 'Starting with' : 'First project', value: template==='sample' ? 'Reference projects (5 industries)' : projName, note:'' },
                    { label:'Template', value: [...templates, { id:'sample', label:'Reference projects', steps:[] }].find(t => t.id===template)?.label || '', note:'' },
                  ].filter(row => row.value).map(row => (
                    <div key={row.label} style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16 }}>
                      <span style={{ fontSize:13, color:'var(--text3)', flexShrink:0 }}>{row.label}</span>
                      <div style={{ textAlign:'right' }}>
                        <span style={{ fontSize:13, color:'var(--text)', fontWeight:600 }}>{row.value}</span>
                        {row.note && <div style={{ fontSize:11, color:'#2E844A', marginTop:2 }}>{row.note}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Industry language preview */}
              <div style={{ background:'rgba(1,118,211,0.04)', border:'1px solid rgba(1,118,211,0.18)', borderRadius:12, padding:'14px 18px', marginBottom:24 }}>
                <div style={{ fontSize:11, color:'#0176D3', fontWeight:700, letterSpacing:1.2, textTransform:'uppercase', marginBottom:10 }}>
                  Your workspace will use {industryLabel} language
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                  {[
                    ['Cycle Time', t.cycleTime],
                    ['Product / Unit', t.product],
                    ['Defect', t.defect],
                    ['Process step', t.processStep],
                    ['Where you work', t.gemba],
                    ['Improvement', t.kaizen],
                  ].map(([lean, ind]) => (
                    <div key={lean} style={{ fontSize:11, display:'flex', gap:4 }}>
                      <span style={{ color:'var(--text3)', flexShrink:0 }}>{lean}:</span>
                      <span style={{ color:'#0176D3', fontWeight:600 }}>{ind}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display:'flex', gap:10 }}>
                <button onClick={() => setStep(3)} style={{ padding:'12px 20px', borderRadius:8, fontSize:14, background:'var(--sl-100)', border:'1px solid var(--border)', color:'var(--text2)', cursor:'pointer' }}>
                  ← Back
                </button>
                <button onClick={finish} disabled={saving} style={{
                  flex:1, padding:'14px 32px', borderRadius:8, fontSize:15, fontWeight:600,
                  cursor: saving ? 'wait' : 'pointer',
                  background:'#0176D3', color:'#FFFFFF', border:'none',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                  boxShadow:'0 4px 18px rgba(1,118,211,0.30)',
                  opacity: saving ? 0.8 : 1, transition:'all 0.15s',
                }}>
                  {saving ? 'Setting up your workspace…' : 'Launch My Workspace'} {!saving && <ArrowRightIcon size={15} />}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
