// @ts-nocheck
// ── lib/industry-language.ts ──────────────────────────────────────────────────
// Industry-specific terminology mapping for VeSiMy.
// Every lean term is translated to the native language of each industry.
// This makes the platform feel built FOR that industry, not adapted from manufacturing.

export interface IndustryTerms {
  // Core entity terms
  product:        string   // The thing being made/delivered
  products:       string
  customer:       string   // The recipient of value
  customers:      string
  process:        string   // The value-creating sequence
  processStep:    string   // A discrete activity
  processSteps:   string

  // Time terms
  cycleTime:      string   // Time to complete one unit through one step
  waitTime:       string   // Time spent waiting/queued
  leadTime:       string   // End-to-end elapsed time
  taktTime:       string   // Required pace to meet demand
  setupTime:      string   // Changeover/preparation time

  // Flow and status terms
  wip:            string   // Work in progress
  wipUnit:        string   // A single unit of WIP
  inventory:      string   // Stock/backlog
  bottleneck:     string   // Constraining step
  throughput:     string   // Output rate
  flow:           string   // How work moves

  // Quality terms
  defect:         string   // A failure to meet requirements
  defects:        string
  defectRate:     string
  rework:         string   // Fixing failures
  quality:        string

  // Work terms
  operator:       string   // Person doing the work
  operators:      string
  gemba:          string   // Where work happens
  standardWork:   string   // Best-known method
  valueAdded:     string   // VA activities
  nonValueAdded:  string   // NVA activities

  // Improvement terms
  kaizen:         string   // Improvement action
  kaizenEvent:    string   // Structured improvement activity
  waste:          string   // Resource use without value
  valueStream:    string   // End-to-end sequence

  // Tool labels (used in sidebar, headings, buttons)
  vsmTool:        string   // Value Stream Map tool name
  timStudyTool:   string   // Time Study tool name
  fiveWhyTool:    string   // 5 Why Analysis tool name
  fishboneTool:   string   // Fishbone Diagram tool name
  wasteTool:      string   // Waste Identification tool name
  kaizenTool:     string   // Kaizen Tracker tool name
  yamazumiTool:   string   // Yamazumi Chart tool name
  standardWorkTool: string // Standard Work Sheet tool name

  // Dashboard / project labels
  project:        string
  projects:       string
  step:           string   // A step in the process
  steps:          string
  target:         string   // Performance target
  targets:        string
  improvement:    string
  improvements:   string
  metric:         string
  metrics:        string

  // Sector / display
  sectorLabel:    string   // Short display label e.g. "Healthcare"
  gembaLabel:     string   // "Go to the floor" equivalent
}

// ── Default (Manufacturing) ────────────────────────────────────────────────────
export const MFG_DEFAULT: IndustryTerms = {
  product: 'unit', products: 'units',
  customer: 'customer', customers: 'customers',
  process: 'production process', processStep: 'operation', processSteps: 'operations',
  cycleTime: 'Cycle Time', waitTime: 'Wait Time', leadTime: 'Lead Time',
  taktTime: 'Takt Time', setupTime: 'Changeover Time',
  wip: 'WIP', wipUnit: 'part', inventory: 'inventory',
  bottleneck: 'bottleneck', throughput: 'throughput', flow: 'production flow',
  defect: 'defect', defects: 'defects', defectRate: 'Defect Rate', rework: 'rework', quality: 'quality',
  operator: 'operator', operators: 'operators',
  gemba: 'shop floor', standardWork: 'Standard Work', valueAdded: 'Value-Add', nonValueAdded: 'Waste',
  kaizen: 'kaizen', kaizenEvent: 'kaizen event', waste: 'waste', valueStream: 'value stream',
  vsmTool: 'Value Stream Map', timStudyTool: 'Time Study', fiveWhyTool: '5 Why Analysis',
  fishboneTool: 'Fishbone Diagram', wasteTool: 'Waste Identification', kaizenTool: 'Kaizen Tracker',
  yamazumiTool: 'Yamazumi Chart', standardWorkTool: 'Standard Work Sheet',
  project: 'project', projects: 'projects',
  step: 'step', steps: 'steps',
  target: 'target', targets: 'targets',
  improvement: 'improvement', improvements: 'improvements',
  metric: 'metric', metrics: 'metrics',
  sectorLabel: 'Manufacturing', gembaLabel: 'Go to the floor',
}

// ── All industry mappings ──────────────────────────────────────────────────────
export const INDUSTRY_LANGUAGE: Record<string, IndustryTerms> = {

  // ── MANUFACTURING ─────────────────────────────────────────────────────────────
  'general_manufacturing':     MFG_DEFAULT,
  'automotive_manufacturing': {
    ...MFG_DEFAULT,
    product: 'vehicle', products: 'vehicles',
    processStep: 'assembly station', processSteps: 'assembly stations',
    cycleTime: 'Jobs Per Hour', taktTime: 'Required JPH',
    wip: 'vehicles-in-process', wipUnit: 'vehicle',
    defect: 'quality finding', defects: 'quality findings',
    vsmTool: 'Production Line Map', sectorLabel: 'Automotive',
  },
  'aerospace_manufacturing': {
    ...MFG_DEFAULT,
    product: 'aircraft component', products: 'components',
    customer: 'prime contractor', customers: 'contractors',
    processStep: 'assembly station', processSteps: 'assembly stations',
    cycleTime: 'Build Time', leadTime: 'Build Lead Time',
    defect: 'non-conformance', defects: 'non-conformances', defectRate: 'NCR Rate',
    gemba: 'assembly bay', sectorLabel: 'Aerospace',
  },
  'pharmaceutical_manufacturing': {
    ...MFG_DEFAULT,
    product: 'batch', products: 'batches',
    customer: 'patient', customers: 'patients',
    processStep: 'process step', processSteps: 'process steps',
    cycleTime: 'Batch Cycle Time', leadTime: 'Batch Lead Time',
    defect: 'OOS result', defects: 'OOS results', defectRate: 'Batch Failure Rate',
    wip: 'in-process batches', wipUnit: 'batch',
    gemba: 'manufacturing suite', sectorLabel: 'Pharmaceutical',
  },
  'food_beverage_manufacturing': {
    ...MFG_DEFAULT,
    product: 'product batch', products: 'batches',
    processStep: 'production step', processSteps: 'production steps',
    defect: 'nonconforming product', defects: 'nonconforming items',
    gemba: 'production floor', sectorLabel: 'Food & Beverage',
  },

  // ── HEALTHCARE ────────────────────────────────────────────────────────────────
  'hospital_acute_care': {
    product: 'patient outcome', products: 'patient outcomes',
    customer: 'patient', customers: 'patients',
    process: 'care pathway', processStep: 'care activity', processSteps: 'care activities',
    cycleTime: 'Care Step Duration', waitTime: 'Wait Time', leadTime: 'Length of Stay',
    taktTime: 'Required Patient Throughput', setupTime: 'Room Turnover Time',
    wip: 'patients waiting', wipUnit: 'patient',
    inventory: 'patient backlog', bottleneck: 'care bottleneck',
    throughput: 'patient throughput', flow: 'patient flow',
    defect: 'adverse event', defects: 'adverse events', defectRate: 'Error Rate', rework: 'readmission', quality: 'patient safety',
    operator: 'clinician', operators: 'clinicians',
    gemba: 'care floor', standardWork: 'Care Protocol',
    valueAdded: 'Direct Care', nonValueAdded: 'Administrative Burden',
    kaizen: 'care improvement', kaizenEvent: 'improvement sprint', waste: 'care waste', valueStream: 'patient pathway',
    vsmTool: 'Patient Journey Map', timStudyTool: 'Care Time Study', fiveWhyTool: '5 Why Analysis',
    fishboneTool: 'Cause & Effect Diagram', wasteTool: 'Care Waste Review', kaizenTool: 'Improvement Tracker',
    yamazumiTool: 'Workload Balance Chart', standardWorkTool: 'Care Protocol Sheet',
    project: 'project', projects: 'projects',
    step: 'care step', steps: 'care steps',
    target: 'target', targets: 'targets',
    improvement: 'improvement', improvements: 'improvements',
    metric: 'metric', metrics: 'metrics',
    sectorLabel: 'Healthcare', gembaLabel: 'Go to the unit',
  },
  'primary_care_outpatient': {
    product: 'clinical encounter', products: 'encounters',
    customer: 'patient', customers: 'patients',
    process: 'patient visit flow', processStep: 'visit step', processSteps: 'visit steps',
    cycleTime: 'Visit Step Time', waitTime: 'Patient Wait Time', leadTime: 'Total Visit Time',
    taktTime: 'Patients Per Hour Target', setupTime: 'Room Prep Time',
    wip: 'patients in queue', wipUnit: 'patient',
    inventory: 'appointment backlog', bottleneck: 'visit bottleneck',
    throughput: 'patient throughput', flow: 'patient flow',
    defect: 'clinical error', defects: 'clinical errors', defectRate: 'Error Rate', rework: 're-encounter', quality: 'care quality',
    operator: 'provider', operators: 'providers',
    gemba: 'clinic floor', standardWork: 'Visit Protocol',
    valueAdded: 'Clinical Care', nonValueAdded: 'Administrative Waste',
    kaizen: 'clinic improvement', kaizenEvent: 'improvement sprint', waste: 'clinic waste', valueStream: 'patient visit pathway',
    vsmTool: 'Patient Visit Map', timStudyTool: 'Visit Time Study', fiveWhyTool: '5 Why Analysis',
    fishboneTool: 'Cause & Effect Diagram', wasteTool: 'Clinic Waste Review', kaizenTool: 'Improvement Tracker',
    yamazumiTool: 'Provider Workload Chart', standardWorkTool: 'Visit Protocol Sheet',
    project: 'project', projects: 'projects',
    step: 'visit step', steps: 'visit steps',
    target: 'target', targets: 'targets',
    improvement: 'improvement', improvements: 'improvements',
    metric: 'metric', metrics: 'metrics',
    sectorLabel: 'Primary Care', gembaLabel: 'Go to the clinic',
  },
  'surgery_operating_room': {
    ...MFG_DEFAULT,
    product: 'surgical outcome', products: 'surgical outcomes',
    customer: 'patient', customers: 'patients',
    process: 'surgical pathway', processStep: 'surgical step', processSteps: 'surgical steps',
    cycleTime: 'Case Duration', waitTime: 'OR Wait Time', leadTime: 'Case-to-Clearance Time',
    taktTime: 'Cases Per Day Target', setupTime: 'OR Turnover Time',
    wip: 'cases queued', wipUnit: 'case',
    defect: 'surgical safety event', defects: 'safety events', defectRate: 'Case Cancellation Rate',
    gemba: 'operating room', standardWork: 'Surgical Checklist',
    vsmTool: 'Surgical Pathway Map', timStudyTool: 'OR Time Study',
    sectorLabel: 'Surgery / OR',
  },
  'pharmacy': {
    ...MFG_DEFAULT,
    product: 'prescription', products: 'prescriptions',
    customer: 'patient', customers: 'patients',
    processStep: 'dispensing step', processSteps: 'dispensing steps',
    cycleTime: 'Prescription Fill Time', waitTime: 'Queue Wait Time',
    defect: 'dispensing error', defects: 'dispensing errors', defectRate: 'Error Rate',
    gemba: 'dispensing area', sectorLabel: 'Pharmacy',
  },

  // ── FINANCIAL SERVICES ────────────────────────────────────────────────────────
  'retail_banking': {
    product: 'account opened', products: 'applications processed',
    customer: 'customer', customers: 'customers',
    process: 'application process', processStep: 'processing step', processSteps: 'processing steps',
    cycleTime: 'Processing Time', waitTime: 'Application Wait Time', leadTime: 'Application Cycle Time',
    taktTime: 'Applications Per Day Target', setupTime: 'Case Setup Time',
    wip: 'applications in queue', wipUnit: 'application',
    inventory: 'application backlog', bottleneck: 'processing bottleneck',
    throughput: 'application throughput', flow: 'application flow',
    defect: 'processing error', defects: 'errors', defectRate: 'Error Rate', rework: 'correction', quality: 'accuracy',
    operator: 'officer', operators: 'officers',
    gemba: 'processing centre', standardWork: 'Processing Standard',
    valueAdded: 'Value-Adding Work', nonValueAdded: 'Administrative Waste',
    kaizen: 'process improvement', kaizenEvent: 'improvement sprint', waste: 'process waste', valueStream: 'application flow',
    vsmTool: 'Application Flow Map', timStudyTool: 'Process Time Study', fiveWhyTool: '5 Why Analysis',
    fishboneTool: 'Cause & Effect Diagram', wasteTool: 'Waste Review', kaizenTool: 'Improvement Tracker',
    yamazumiTool: 'Workload Balance Chart', standardWorkTool: 'Process Standard Sheet',
    project: 'project', projects: 'projects',
    step: 'step', steps: 'steps', target: 'target', targets: 'targets',
    improvement: 'improvement', improvements: 'improvements',
    metric: 'metric', metrics: 'metrics',
    sectorLabel: 'Banking', gembaLabel: 'Go to the floor',
  },
  'insurance': {
    ...MFG_DEFAULT,
    product: 'policy', products: 'policies',
    customer: 'policyholder', customers: 'policyholders',
    processStep: 'underwriting step', processSteps: 'underwriting steps',
    cycleTime: 'Time-to-Bind', leadTime: 'Policy Cycle Time',
    wip: 'policies in underwriting', wipUnit: 'policy',
    defect: 'underwriting error', defects: 'errors',
    gemba: 'underwriting team', sectorLabel: 'Insurance',
  },

  // ── TECHNOLOGY ────────────────────────────────────────────────────────────────
  'software_development': {
    product: 'feature', products: 'features',
    customer: 'end user', customers: 'users',
    process: 'development pipeline', processStep: 'dev stage', processSteps: 'dev stages',
    cycleTime: 'Cycle Time', waitTime: 'Queue Time', leadTime: 'Lead Time',
    taktTime: 'Stories Per Sprint', setupTime: 'Context Switch Time',
    wip: 'stories in progress', wipUnit: 'story',
    inventory: 'backlog', bottleneck: 'bottleneck stage',
    throughput: 'velocity', flow: 'deployment flow',
    defect: 'bug', defects: 'bugs', defectRate: 'Bug Escape Rate', rework: 'rework', quality: 'code quality',
    operator: 'developer', operators: 'developers',
    gemba: 'codebase / production', standardWork: 'Engineering Standard',
    valueAdded: 'Feature Work', nonValueAdded: 'Toil / Overhead',
    kaizen: 'sprint improvement', kaizenEvent: 'improvement sprint', waste: 'engineering waste', valueStream: 'idea-to-deploy pipeline',
    vsmTool: 'Deployment Pipeline Map', timStudyTool: 'Cycle Time Study', fiveWhyTool: '5 Why Analysis',
    fishboneTool: 'Cause & Effect Diagram', wasteTool: 'Waste Review', kaizenTool: 'Improvement Tracker',
    yamazumiTool: 'Team Workload Chart', standardWorkTool: 'Engineering Standard Sheet',
    project: 'project', projects: 'projects',
    step: 'stage', steps: 'stages', target: 'target', targets: 'targets',
    improvement: 'improvement', improvements: 'improvements',
    metric: 'metric', metrics: 'metrics',
    sectorLabel: 'Software Dev', gembaLabel: 'Go to production',
  },
  'it_operations': {
    ...MFG_DEFAULT,
    product: 'incident resolved', products: 'tickets resolved',
    customer: 'user', customers: 'users',
    processStep: 'resolution step', processSteps: 'resolution steps',
    cycleTime: 'Handle Time', leadTime: 'Ticket Cycle Time',
    wip: 'open tickets', wipUnit: 'ticket',
    defect: 'SLA breach', defects: 'SLA breaches',
    gemba: 'service desk / production', sectorLabel: 'IT Operations',
  },

  // ── RETAIL ────────────────────────────────────────────────────────────────────
  'retail_stores': {
    product: 'customer transaction', products: 'transactions',
    customer: 'shopper', customers: 'shoppers',
    process: 'store operations', processStep: 'store task', processSteps: 'store tasks',
    cycleTime: 'Task Time', waitTime: 'Queue Wait Time', leadTime: 'Customer Experience Time',
    taktTime: 'Customers Per Hour Target', setupTime: 'Setup Time',
    wip: 'customers in queue', wipUnit: 'customer',
    inventory: 'stock / shelf inventory', bottleneck: 'checkout bottleneck',
    throughput: 'customer throughput', flow: 'customer flow',
    defect: 'out-of-stock / error', defects: 'errors', defectRate: 'Error Rate', rework: 'correction', quality: 'service quality',
    operator: 'associate', operators: 'associates',
    gemba: 'sales floor', standardWork: 'Store Standard',
    valueAdded: 'Customer Service', nonValueAdded: 'Store Waste',
    kaizen: 'store improvement', kaizenEvent: 'improvement sprint', waste: 'store waste', valueStream: 'customer journey',
    vsmTool: 'Customer Journey Map', timStudyTool: 'Task Time Study', fiveWhyTool: '5 Why Analysis',
    fishboneTool: 'Cause & Effect Diagram', wasteTool: 'Waste Review', kaizenTool: 'Improvement Tracker',
    yamazumiTool: 'Workload Balance Chart', standardWorkTool: 'Store Standard Sheet',
    project: 'project', projects: 'projects',
    step: 'task', steps: 'tasks', target: 'target', targets: 'targets',
    improvement: 'improvement', improvements: 'improvements',
    metric: 'metric', metrics: 'metrics',
    sectorLabel: 'Retail', gembaLabel: 'Go to the floor',
  },
  'ecommerce_fulfillment': {
    ...MFG_DEFAULT,
    product: 'order', products: 'orders',
    customer: 'shopper', customers: 'shoppers',
    processStep: 'fulfilment step', processSteps: 'fulfilment steps',
    cycleTime: 'Order Processing Time', leadTime: 'Order-to-Ship Time',
    wip: 'orders in progress', wipUnit: 'order',
    defect: 'fulfilment error', defects: 'errors',
    gemba: 'fulfilment floor', sectorLabel: 'E-Commerce',
  },

  // ── HOSPITALITY ──────────────────────────────────────────────────────────────
  'restaurant_food_service': {
    product: 'meal', products: 'covers',
    customer: 'guest', customers: 'guests',
    process: 'service flow', processStep: 'service step', processSteps: 'service steps',
    cycleTime: 'Step Time', waitTime: 'Guest Wait Time', leadTime: 'Table Turn Time',
    taktTime: 'Covers Per Hour Target', setupTime: 'Table Reset Time',
    wip: 'tables in service', wipUnit: 'cover',
    inventory: 'food inventory', bottleneck: 'kitchen bottleneck',
    throughput: 'covers per hour', flow: 'service flow',
    defect: 'wrong order / complaint', defects: 'service failures', defectRate: 'Error Rate', rework: 're-fire', quality: 'food & service quality',
    operator: 'team member', operators: 'team members',
    gemba: 'kitchen / floor', standardWork: 'Service Standard',
    valueAdded: 'Guest Service', nonValueAdded: 'Service Waste',
    kaizen: 'service improvement', kaizenEvent: 'improvement sprint', waste: 'service waste', valueStream: 'guest journey',
    vsmTool: 'Guest Journey Map', timStudyTool: 'Service Time Study', fiveWhyTool: '5 Why Analysis',
    fishboneTool: 'Cause & Effect Diagram', wasteTool: 'Waste Review', kaizenTool: 'Improvement Tracker',
    yamazumiTool: 'Team Workload Chart', standardWorkTool: 'Service Standard Sheet',
    project: 'project', projects: 'projects',
    step: 'step', steps: 'steps', target: 'target', targets: 'targets',
    improvement: 'improvement', improvements: 'improvements',
    metric: 'metric', metrics: 'metrics',
    sectorLabel: 'Hospitality', gembaLabel: 'Go to the floor',
  },
  'hotel_hospitality': {
    ...MFG_DEFAULT,
    product: 'room night', products: 'room nights',
    customer: 'guest', customers: 'guests',
    processStep: 'guest service step', processSteps: 'guest service steps',
    cycleTime: 'Service Time', leadTime: 'Guest Stay Lifecycle',
    taktTime: 'Rooms Per Hour Target', setupTime: 'Room Turnaround Time',
    wip: 'rooms in service', wipUnit: 'room',
    defect: 'guest complaint', defects: 'guest complaints',
    gemba: 'hotel floor', sectorLabel: 'Hotels',
  },
  'airline_aviation': {
    ...MFG_DEFAULT,
    product: 'passenger journey', products: 'flights',
    customer: 'passenger', customers: 'passengers',
    processStep: 'turnaround step', processSteps: 'turnaround steps',
    cycleTime: 'Step Time', leadTime: 'Aircraft Turn Time',
    taktTime: 'Aircraft Turns Per Day', setupTime: 'Ground Turnaround Time',
    wip: 'passengers in terminal', wipUnit: 'passenger',
    defect: 'delay / cancellation', defects: 'operational failures',
    gemba: 'ramp / gate', sectorLabel: 'Aviation',
  },

  // ── LOGISTICS ─────────────────────────────────────────────────────────────────
  'warehousing_distribution': {
    ...MFG_DEFAULT,
    product: 'order fulfilled', products: 'orders fulfilled',
    customer: 'retailer / shipper', customers: 'customers',
    processStep: 'warehouse task', processSteps: 'warehouse tasks',
    cycleTime: 'Task Time', leadTime: 'Dock-to-Ship Time',
    wip: 'orders in progress', wipUnit: 'order',
    defect: 'mis-pick / damage', defects: 'fulfilment errors',
    gemba: 'warehouse floor', sectorLabel: 'Warehousing',
  },
  'freight_trucking': {
    ...MFG_DEFAULT,
    product: 'load delivered', products: 'loads',
    customer: 'shipper', customers: 'shippers',
    processStep: 'transit step', processSteps: 'transit steps',
    cycleTime: 'Load Cycle Time', leadTime: 'Tender-to-Delivery Time',
    defect: 'late delivery / damage', defects: 'delivery failures',
    gemba: 'terminal / dock', sectorLabel: 'Freight',
  },

  // ── CONSTRUCTION ─────────────────────────────────────────────────────────────
  'construction': {
    product: 'completed asset', products: 'work packages',
    customer: 'building owner', customers: 'clients',
    process: 'construction sequence', processStep: 'activity', processSteps: 'activities',
    cycleTime: 'Activity Duration', waitTime: 'Activity Wait Time', leadTime: 'Project Lead Time',
    taktTime: 'Activities Per Week Target', setupTime: 'Site Mobilisation Time',
    wip: 'incomplete work packages', wipUnit: 'work package',
    inventory: 'materials on site', bottleneck: 'critical path constraint',
    throughput: 'work packages per week', flow: 'work flow',
    defect: 'rework / non-conformance', defects: 'defects', defectRate: 'Rework Rate', rework: 'rework', quality: 'build quality',
    operator: 'tradesperson', operators: 'tradespeople',
    gemba: 'site', standardWork: 'Method Statement',
    valueAdded: 'Value-Adding Work', nonValueAdded: 'Site Waste',
    kaizen: 'site improvement', kaizenEvent: 'improvement sprint', waste: 'site waste', valueStream: 'design-to-occupancy flow',
    vsmTool: 'Construction Programme Map', timStudyTool: 'Activity Time Study', fiveWhyTool: '5 Why Analysis',
    fishboneTool: 'Cause & Effect Diagram', wasteTool: 'Waste Review', kaizenTool: 'Improvement Tracker',
    yamazumiTool: 'Trade Workload Chart', standardWorkTool: 'Method Statement Sheet',
    project: 'project', projects: 'projects',
    step: 'activity', steps: 'activities', target: 'target', targets: 'targets',
    improvement: 'improvement', improvements: 'improvements',
    metric: 'metric', metrics: 'metrics',
    sectorLabel: 'Construction', gembaLabel: 'Go to site',
  },

  // ── EDUCATION ─────────────────────────────────────────────────────────────────
  'higher_education': {
    ...MFG_DEFAULT,
    product: 'graduate', products: 'graduates',
    customer: 'student', customers: 'students',
    processStep: 'learning step', processSteps: 'learning steps',
    cycleTime: 'Learning Duration', leadTime: 'Time-to-Degree',
    wip: 'students in progress', wipUnit: 'student',
    defect: 'dropout / failed outcome', defects: 'failures',
    gemba: 'campus / classroom', sectorLabel: 'Higher Education',
  },
  'k12_education': {
    ...MFG_DEFAULT,
    product: 'learning outcome', products: 'learning outcomes',
    customer: 'student', customers: 'students',
    processStep: 'lesson step', processSteps: 'lesson steps',
    cycleTime: 'Lesson Time', leadTime: 'Term Duration',
    wip: 'students awaiting support', wipUnit: 'student',
    defect: 'learning gap', defects: 'learning gaps',
    gemba: 'classroom', sectorLabel: 'K-12 Education',
  },
  'corporate_training': {
    ...MFG_DEFAULT,
    product: 'trained employee', products: 'trained employees',
    customer: 'learner', customers: 'learners',
    processStep: 'training step', processSteps: 'training steps',
    cycleTime: 'Training Session Time', leadTime: 'Training Lead Time',
    wip: 'employees awaiting training', wipUnit: 'learner',
    defect: 'compliance gap', defects: 'compliance gaps',
    gemba: 'training room / workplace', sectorLabel: 'L&D',
  },

  // ── LEGAL ─────────────────────────────────────────────────────────────────────
  'law_firm': {
    product: 'matter closed', products: 'matters',
    customer: 'client', customers: 'clients',
    process: 'matter workflow', processStep: 'matter step', processSteps: 'matter steps',
    cycleTime: 'Task Time', waitTime: 'Matter Wait Time', leadTime: 'Matter Cycle Time',
    taktTime: 'Matters Per Month Target', setupTime: 'Matter Intake Time',
    wip: 'active matters', wipUnit: 'matter',
    inventory: 'matter pipeline', bottleneck: 'matter bottleneck',
    throughput: 'matters per month', flow: 'matter flow',
    defect: 'error / missed deadline', defects: 'errors', defectRate: 'Error Rate', rework: 'correction', quality: 'matter quality',
    operator: 'fee-earner', operators: 'fee-earners',
    gemba: 'office / court', standardWork: 'Matter Protocol',
    valueAdded: 'Legal Work', nonValueAdded: 'Administrative Overhead',
    kaizen: 'matter improvement', kaizenEvent: 'improvement sprint', waste: 'practice waste', valueStream: 'instruction-to-closure flow',
    vsmTool: 'Matter Flow Map', timStudyTool: 'Task Time Study', fiveWhyTool: '5 Why Analysis',
    fishboneTool: 'Cause & Effect Diagram', wasteTool: 'Waste Review', kaizenTool: 'Improvement Tracker',
    yamazumiTool: 'Fee-Earner Workload Chart', standardWorkTool: 'Matter Protocol Sheet',
    project: 'project', projects: 'projects',
    step: 'step', steps: 'steps', target: 'target', targets: 'targets',
    improvement: 'improvement', improvements: 'improvements',
    metric: 'metric', metrics: 'metrics',
    sectorLabel: 'Legal', gembaLabel: 'Go to the client',
  },

  // ── HR / STAFFING ─────────────────────────────────────────────────────────────
  'human_resources': {
    ...MFG_DEFAULT,
    product: 'hire made', products: 'hires made',
    customer: 'hiring manager', customers: 'hiring managers',
    processStep: 'recruitment step', processSteps: 'recruitment steps',
    cycleTime: 'Step Duration', leadTime: 'Time-to-Fill',
    wip: 'open roles', wipUnit: 'requisition',
    defect: 'wrong hire / dropout', defects: 'hiring failures',
    gemba: 'HR office / hiring meeting', sectorLabel: 'HR',
  },

  // ── MARKETING ────────────────────────────────────────────────────────────────
  'marketing_agency': {
    product: 'campaign delivered', products: 'deliverables',
    customer: 'client', customers: 'clients',
    process: 'campaign workflow', processStep: 'campaign step', processSteps: 'campaign steps',
    cycleTime: 'Task Time', waitTime: 'Approval Wait Time', leadTime: 'Campaign Cycle Time',
    taktTime: 'Deliverables Per Week', setupTime: 'Brief Setup Time',
    wip: 'work in progress', wipUnit: 'deliverable',
    inventory: 'briefs in pipeline', bottleneck: 'approval bottleneck',
    throughput: 'deliverables per week', flow: 'creative flow',
    defect: 'revision / missed brief', defects: 'revisions', defectRate: 'Revision Rate', rework: 'revision', quality: 'creative quality',
    operator: 'creative', operators: 'creatives',
    gemba: 'studio', standardWork: 'Creative Standard',
    valueAdded: 'Creative Work', nonValueAdded: 'Administrative Overhead',
    kaizen: 'studio improvement', kaizenEvent: 'improvement sprint', waste: 'studio waste', valueStream: 'brief-to-delivery flow',
    vsmTool: 'Campaign Flow Map', timStudyTool: 'Task Time Study', fiveWhyTool: '5 Why Analysis',
    fishboneTool: 'Cause & Effect Diagram', wasteTool: 'Waste Review', kaizenTool: 'Improvement Tracker',
    yamazumiTool: 'Team Workload Chart', standardWorkTool: 'Creative Standard Sheet',
    project: 'project', projects: 'projects',
    step: 'step', steps: 'steps', target: 'target', targets: 'targets',
    improvement: 'improvement', improvements: 'improvements',
    metric: 'metric', metrics: 'metrics',
    sectorLabel: 'Marketing', gembaLabel: 'Go to the studio',
  },

  // ── ENERGY ───────────────────────────────────────────────────────────────────
  'power_generation_utilities': {
    ...MFG_DEFAULT,
    product: 'unit of energy', products: 'units',
    customer: 'grid operator / consumer', customers: 'customers',
    processStep: 'generation step', processSteps: 'generation steps',
    cycleTime: 'Generation Step Time', leadTime: 'Fuel-to-Meter Time',
    defect: 'outage / safety incident', defects: 'incidents',
    gemba: 'generation facility / control room', sectorLabel: 'Energy',
  },

  // ── CRAFT BREWERY / WINERY ────────────────────────────────────────────────────
  'craft_brewery': {
    product: 'batch', products: 'batches',
    customer: 'distributor / taproom guest', customers: 'customers',
    process: 'brew house flow', processStep: 'brew step', processSteps: 'brew steps',
    cycleTime: 'Step Time', waitTime: 'Wait Time', leadTime: 'Grain-to-Glass Lead Time',
    taktTime: 'Batches Per Week Target', setupTime: 'Clean-in-Place Time',
    wip: 'batches in progress', wipUnit: 'batch',
    inventory: 'raw material inventory', bottleneck: 'fermentation constraint',
    throughput: 'batches per week', flow: 'brew flow',
    defect: 'off-flavour / failed batch', defects: 'failed batches', defectRate: 'Batch Failure Rate', rework: 'batch rework', quality: 'beer quality',
    operator: 'brewer', operators: 'brewers',
    gemba: 'brew house', standardWork: 'Recipe & Procedure',
    valueAdded: 'Brewing Work', nonValueAdded: 'Brewery Waste',
    kaizen: 'brewery improvement', kaizenEvent: 'improvement sprint', waste: 'brewery waste', valueStream: 'grain-to-glass flow',
    vsmTool: 'Brew Flow Map', timStudyTool: 'Brew Time Study', fiveWhyTool: '5 Why Analysis',
    fishboneTool: 'Cause & Effect Diagram', wasteTool: 'Waste Review', kaizenTool: 'Improvement Tracker',
    yamazumiTool: 'Brewer Workload Chart', standardWorkTool: 'Recipe & Procedure Sheet',
    project: 'project', projects: 'projects',
    step: 'brew step', steps: 'brew steps', target: 'target', targets: 'targets',
    improvement: 'improvement', improvements: 'improvements',
    metric: 'metric', metrics: 'metrics',
    sectorLabel: 'Craft Brewery', gembaLabel: 'Go to the brew house',
  },
  'winery': {
    ...MFG_DEFAULT,
    product: 'vintage / batch', products: 'batches',
    customer: 'distributor / consumer', customers: 'customers',
    processStep: 'production step', processSteps: 'production steps',
    cycleTime: 'Step Duration', leadTime: 'Grape-to-Bottle Lead Time',
    taktTime: 'Batches Per Season Target', setupTime: 'Tank Preparation Time',
    wip: 'batches in production', wipUnit: 'batch',
    defect: 'batch defect / TCA', defects: 'defects',
    gemba: 'winery floor', sectorLabel: 'Winery',
  },

  // ── PROFESSIONAL SERVICES ─────────────────────────────────────────────────────
  'management_consulting': {
    product: 'deliverable', products: 'deliverables',
    customer: 'client', customers: 'clients',
    process: 'engagement workflow', processStep: 'project step', processSteps: 'project steps',
    cycleTime: 'Task Time', waitTime: 'Approval Wait Time', leadTime: 'Engagement Cycle Time',
    taktTime: 'Deliverables Per Week', setupTime: 'Project Setup Time',
    wip: 'tasks in progress', wipUnit: 'deliverable',
    inventory: 'project pipeline', bottleneck: 'review bottleneck',
    throughput: 'deliverables per week', flow: 'project flow',
    defect: 'revision / error', defects: 'revisions', defectRate: 'Revision Rate', rework: 'rework', quality: 'deliverable quality',
    operator: 'consultant', operators: 'consultants',
    gemba: 'client site / project room', standardWork: 'Engagement Standard',
    valueAdded: 'Client Work', nonValueAdded: 'Internal Overhead',
    kaizen: 'practice improvement', kaizenEvent: 'improvement sprint', waste: 'practice waste', valueStream: 'brief-to-delivered flow',
    vsmTool: 'Engagement Flow Map', timStudyTool: 'Task Time Study', fiveWhyTool: '5 Why Analysis',
    fishboneTool: 'Cause & Effect Diagram', wasteTool: 'Waste Review', kaizenTool: 'Improvement Tracker',
    yamazumiTool: 'Consultant Workload Chart', standardWorkTool: 'Engagement Standard Sheet',
    project: 'engagement', projects: 'engagements',
    step: 'step', steps: 'steps', target: 'target', targets: 'targets',
    improvement: 'improvement', improvements: 'improvements',
    metric: 'metric', metrics: 'metrics',
    sectorLabel: 'Consulting', gembaLabel: 'Go to the client',
  },

  // ── CONTACT CENTRE ────────────────────────────────────────────────────────────
  'contact_center': {
    ...MFG_DEFAULT,
    product: 'issue resolved', products: 'contacts handled',
    customer: 'customer', customers: 'customers',
    processStep: 'resolution step', processSteps: 'resolution steps',
    cycleTime: 'Average Handle Time', leadTime: 'Contact-to-Resolution Time',
    taktTime: 'Contacts Per Hour Target', setupTime: 'Wrap-Up Time',
    wip: 'contacts in queue', wipUnit: 'contact',
    defect: 'unresolved / wrong resolution', defects: 'errors',
    gemba: 'contact centre floor', sectorLabel: 'Contact Centre',
  },

  // ── PROJECT MANAGEMENT ────────────────────────────────────────────────────────
  'project_management': {
    ...MFG_DEFAULT,
    product: 'project milestone', products: 'deliverables',
    customer: 'project sponsor', customers: 'stakeholders',
    processStep: 'work package', processSteps: 'work packages',
    cycleTime: 'Task Duration', leadTime: 'Project Lead Time',
    wip: 'tasks in progress', wipUnit: 'work package',
    defect: 'scope / schedule / budget failure', defects: 'project failures',
    gemba: 'project site / office', sectorLabel: 'Project Management',
  },

  // ── EVENTS ────────────────────────────────────────────────────────────────────
  'event_management': {
    ...MFG_DEFAULT,
    product: 'delivered event', products: 'events',
    customer: 'delegate', customers: 'delegates',
    processStep: 'event planning step', processSteps: 'planning steps',
    cycleTime: 'Step Duration', leadTime: 'Concept-to-Delivery Time',
    wip: 'planning tasks in progress', wipUnit: 'task',
    defect: 'event failure / incident', defects: 'incidents',
    gemba: 'event venue', sectorLabel: 'Events',
  },

  // ── SPORTS ───────────────────────────────────────────────────────────────────
  'professional_sports': {
    ...MFG_DEFAULT,
    product: 'performance outcome', products: 'performances',
    customer: 'fan / sponsor', customers: 'fans',
    processStep: 'training element', processSteps: 'training elements',
    cycleTime: 'Training Session Time', leadTime: 'Season Preparation Time',
    wip: 'players in development', wipUnit: 'player',
    defect: 'injury / underperformance', defects: 'performance failures',
    gemba: 'training ground / pitch', sectorLabel: 'Sports',
  },

  // ── REAL ESTATE ──────────────────────────────────────────────────────────────
  'real_estate': {
    product: 'transaction closed', products: 'transactions',
    customer: 'buyer / seller', customers: 'clients',
    process: 'transaction flow', processStep: 'transaction step', processSteps: 'transaction steps',
    cycleTime: 'Step Duration', waitTime: 'Approval Wait Time', leadTime: 'Contract-to-Close Time',
    taktTime: 'Transactions Per Month Target', setupTime: 'Transaction Setup Time',
    wip: 'transactions in pipeline', wipUnit: 'transaction',
    inventory: 'transaction pipeline', bottleneck: 'deal bottleneck',
    throughput: 'transactions per month', flow: 'transaction flow',
    defect: 'deal fall-through / error', defects: 'errors', defectRate: 'Fall-Through Rate', rework: 'document correction', quality: 'transaction quality',
    operator: 'agent', operators: 'agents',
    gemba: 'office / property', standardWork: 'Transaction Protocol',
    valueAdded: 'Deal Work', nonValueAdded: 'Transaction Waste',
    kaizen: 'transaction improvement', kaizenEvent: 'improvement sprint', waste: 'transaction waste', valueStream: 'lead-to-close flow',
    vsmTool: 'Transaction Flow Map', timStudyTool: 'Task Time Study', fiveWhyTool: '5 Why Analysis',
    fishboneTool: 'Cause & Effect Diagram', wasteTool: 'Waste Review', kaizenTool: 'Improvement Tracker',
    yamazumiTool: 'Agent Workload Chart', standardWorkTool: 'Transaction Protocol Sheet',
    project: 'project', projects: 'projects',
    step: 'step', steps: 'steps', target: 'target', targets: 'targets',
    improvement: 'improvement', improvements: 'improvements',
    metric: 'metric', metrics: 'metrics',
    sectorLabel: 'Real Estate', gembaLabel: 'Go to the property',
  },

  // ── NONPROFIT ─────────────────────────────────────────────────────────────────
  'nonprofit': {
    ...MFG_DEFAULT,
    product: 'outcome achieved', products: 'outcomes',
    customer: 'beneficiary', customers: 'beneficiaries',
    processStep: 'service step', processSteps: 'service steps',
    cycleTime: 'Service Step Time', leadTime: 'Intake-to-Outcome Time',
    wip: 'beneficiaries in service', wipUnit: 'beneficiary',
    defect: 'unmet need / poor outcome', defects: 'service failures',
    gemba: 'service site / community', sectorLabel: 'Nonprofit',
  },

  // ── CUSTOM / FALLBACK ─────────────────────────────────────────────────────────
  'custom':  MFG_DEFAULT,
  'other':   MFG_DEFAULT,
}

// ── Helper: Get industry terms by industry key ────────────────────────────────
export function getIndustryTerms(industryKey?: string | null): IndustryTerms {
  if (!industryKey) return MFG_DEFAULT
  const key = industryKey.toLowerCase().replace(/[\s-]+/g, '_')
  return INDUSTRY_LANGUAGE[key] || MFG_DEFAULT
}

// ── Onboarding industry list (what users see in the picker) ──────────────────
export const INDUSTRY_OPTIONS = [
  // Manufacturing
  { id: 'general_manufacturing',      label: 'General Manufacturing',        sector: 'Manufacturing' },
  { id: 'automotive_manufacturing',   label: 'Automotive Manufacturing',     sector: 'Manufacturing' },
  { id: 'aerospace_manufacturing',    label: 'Aerospace & Defence',          sector: 'Manufacturing' },
  { id: 'pharmaceutical_manufacturing',label: 'Pharmaceutical Manufacturing',sector: 'Manufacturing' },
  { id: 'food_beverage_manufacturing',label: 'Food & Beverage Manufacturing',sector: 'Manufacturing' },
  // Healthcare
  { id: 'hospital_acute_care',        label: 'Hospital / Acute Care',        sector: 'Healthcare' },
  { id: 'primary_care_outpatient',    label: 'Primary Care / Outpatient',    sector: 'Healthcare' },
  { id: 'surgery_operating_room',     label: 'Surgery / Operating Room',     sector: 'Healthcare' },
  { id: 'pharmacy',                   label: 'Pharmacy',                     sector: 'Healthcare' },
  // Financial
  { id: 'retail_banking',             label: 'Retail Banking',               sector: 'Financial Services' },
  { id: 'insurance',                  label: 'Insurance',                    sector: 'Financial Services' },
  // Technology
  { id: 'software_development',       label: 'Software Development',         sector: 'Technology' },
  { id: 'it_operations',              label: 'IT Operations',                sector: 'Technology' },
  // Retail
  { id: 'retail_stores',              label: 'Retail Stores',                sector: 'Retail' },
  { id: 'ecommerce_fulfillment',      label: 'E-Commerce / Fulfillment',     sector: 'Retail' },
  // Hospitality
  { id: 'restaurant_food_service',    label: 'Restaurant / Food Service',    sector: 'Hospitality' },
  { id: 'hotel_hospitality',          label: 'Hotel / Hospitality',          sector: 'Hospitality' },
  { id: 'airline_aviation',           label: 'Airline / Aviation',           sector: 'Hospitality' },
  // Logistics
  { id: 'warehousing_distribution',   label: 'Warehousing & Distribution',   sector: 'Logistics' },
  { id: 'freight_trucking',           label: 'Freight & Trucking',           sector: 'Logistics' },
  // Construction
  { id: 'construction',               label: 'Construction',                 sector: 'Construction' },
  // Education
  { id: 'higher_education',           label: 'Higher Education',             sector: 'Education' },
  { id: 'k12_education',              label: 'K-12 Education',               sector: 'Education' },
  { id: 'corporate_training',         label: 'Corporate Training / L&D',     sector: 'Education' },
  // Legal
  { id: 'law_firm',                   label: 'Law Firm / Legal Services',    sector: 'Legal' },
  // HR
  { id: 'human_resources',            label: 'Human Resources',              sector: 'HR & Staffing' },
  // Marketing
  { id: 'marketing_agency',           label: 'Marketing Agency',             sector: 'Marketing' },
  // Energy
  { id: 'power_generation_utilities', label: 'Power Generation / Utilities', sector: 'Energy' },
  // Beverage
  { id: 'craft_brewery',              label: 'Craft Brewery',                sector: 'Food & Beverage' },
  { id: 'winery',                     label: 'Winery',                       sector: 'Food & Beverage' },
  // Services
  { id: 'management_consulting',      label: 'Management Consulting',        sector: 'Professional Services' },
  { id: 'contact_center',             label: 'Contact Centre',               sector: 'Customer Service' },
  { id: 'project_management',         label: 'Project Management',           sector: 'Cross-Industry' },
  { id: 'event_management',           label: 'Event Management',             sector: 'Events' },
  { id: 'professional_sports',        label: 'Professional Sports',          sector: 'Sports' },
  { id: 'real_estate',                label: 'Real Estate',                  sector: 'Real Estate' },
  { id: 'nonprofit',                  label: 'Nonprofit / Social Services',  sector: 'Non-profit' },
  { id: 'other',                      label: 'Other / Custom',               sector: 'Other' },
]

// ── Group options by sector for the picker UI ────────────────────────────────
export const INDUSTRY_SECTORS = [
  ...new Set(INDUSTRY_OPTIONS.map(o => o.sector))
]

export function getIndustriesBySector(sector: string) {
  return INDUSTRY_OPTIONS.filter(o => o.sector === sector)
}

export function getIndustryLabel(id: string): string {
  return INDUSTRY_OPTIONS.find(o => o.id === id)?.label || 'Custom'
}
