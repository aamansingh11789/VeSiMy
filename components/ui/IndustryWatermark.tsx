// @ts-nocheck
// ── components/ui/IndustryWatermark.tsx ───────────────────────────────────────
// Industry-specific SVG watermarks rendered as a fixed background element.
// Opacity 0.038, monochrome brand blue. Unique illustration per industry group.
'use client'

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

interface Props { group: WatermarkGroup; size?: number }

// Helper to make gear teeth
function gearTeeth(cx: number, cy: number, r: number, count: number, toothLen: number, strokeW: number) {
  return Array.from({ length: count }, (_, i) => {
    const a = (Math.PI * 2 * i) / count
    return (
      <line
        key={i} stroke="currentColor" strokeWidth={strokeW} strokeLinecap="round"
        x1={cx + r * Math.cos(a)} y1={cy + r * Math.sin(a)}
        x2={cx + (r + toothLen) * Math.cos(a)} y2={cy + (r + toothLen) * Math.sin(a)}
      />
    )
  })
}

const W: Record<WatermarkGroup, React.ReactNode> = {

  // ── MANUFACTURING ─────────────────────────────────────────────────────────
  manufacturing: (
    <svg viewBox="0 0 500 500" fill="none">
      {gearTeeth(200,200,88,12,20,16)}
      <circle cx="200" cy="200" r="88" stroke="currentColor" strokeWidth="16" fill="none"/>
      <circle cx="200" cy="200" r="36" stroke="currentColor" strokeWidth="10" fill="none"/>
      {gearTeeth(330,105,50,8,14,12)}
      <circle cx="330" cy="105" r="50" stroke="currentColor" strokeWidth="12" fill="none"/>
      <circle cx="330" cy="105" r="20" stroke="currentColor" strokeWidth="8" fill="none"/>
      {gearTeeth(355,320,62,10,16,13)}
      <circle cx="355" cy="320" r="62" stroke="currentColor" strokeWidth="13" fill="none"/>
      <circle cx="355" cy="320" r="25" stroke="currentColor" strokeWidth="8" fill="none"/>
    </svg>
  ),

  // ── AEROSPACE ────────────────────────────────────────────────────────────
  aerospace: (
    <svg viewBox="0 0 500 500" fill="none">
      <ellipse cx="250" cy="250" rx="200" ry="75" stroke="currentColor" strokeWidth="8" strokeDasharray="18 10" opacity="0.55"/>
      <path d="M70 250 Q160 228 250 250 Q340 272 430 250" stroke="currentColor" strokeWidth="18" strokeLinecap="round" fill="none"/>
      <path d="M195 250 L118 198 L165 248 Z" stroke="currentColor" strokeWidth="7" fill="currentColor" opacity="0.7"/>
      <path d="M195 250 L118 302 L165 252 Z" stroke="currentColor" strokeWidth="7" fill="currentColor" opacity="0.5"/>
      <path d="M380 250 L418 222 L408 248 Z" stroke="currentColor" strokeWidth="6" fill="currentColor" opacity="0.6"/>
      <path d="M380 250 L418 278 L408 252 Z" stroke="currentColor" strokeWidth="6" fill="currentColor" opacity="0.4"/>
      {[[65,75],[435,85],[60,385],[440,360],[250,38]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r="5" fill="currentColor" opacity="0.5"/>)}
    </svg>
  ),

  // ── PHARMA ───────────────────────────────────────────────────────────────
  pharma: (
    <svg viewBox="0 0 500 500" fill="none">
      <polygon points="250,95 328,142 328,236 250,283 172,236 172,142" stroke="currentColor" strokeWidth="12" fill="none"/>
      {[[250,95],[328,142],[328,236],[250,283],[172,236],[172,142]].map(([x,y],i) => {
        const angle = i * 60 * Math.PI / 180
        return <line key={i} x1={x} y1={y} x2={x+52*Math.cos(angle-Math.PI/2)} y2={y+52*Math.sin(angle-Math.PI/2)} stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
      })}
      {[[250,95],[328,142],[328,236],[250,283],[172,236],[172,142]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r="13" stroke="currentColor" strokeWidth="8" fill="none"/>)}
      <circle cx="250" cy="189" r="22" stroke="currentColor" strokeWidth="8" fill="none"/>
      <text x="178" y="415" fontFamily="serif" fontSize="118" fontWeight="700" stroke="currentColor" strokeWidth="6" fill="none" opacity="0.35">Rx</text>
    </svg>
  ),

  // ── FOOD & BEVERAGE MFG ──────────────────────────────────────────────────
  food: (
    <svg viewBox="0 0 500 500" fill="none">
      <line x1="148" y1="80" x2="148" y2="380" stroke="currentColor" strokeWidth="14" strokeLinecap="round"/>
      <line x1="118" y1="80" x2="118" y2="185" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
      <line x1="148" y1="80" x2="148" y2="185" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
      <line x1="178" y1="80" x2="178" y2="185" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
      <path d="M118 185 Q148 205 178 185" stroke="currentColor" strokeWidth="10" fill="none"/>
      <line x1="278" y1="80" x2="278" y2="380" stroke="currentColor" strokeWidth="14" strokeLinecap="round"/>
      <path d="M278 80 Q338 134 278 205" stroke="currentColor" strokeWidth="10" fill="none"/>
      <rect x="355" y="195" width="85" height="165" stroke="currentColor" strokeWidth="10" fill="none"/>
      <rect x="315" y="255" width="22" height="105" stroke="currentColor" strokeWidth="8" fill="none"/>
      <line x1="325" y1="195" x2="325" y2="255" stroke="currentColor" strokeWidth="6"/>
      {[372,392,412].map((x,i) => <line key={i} x1={x} y1="195" x2={x} y2="212" stroke="currentColor" strokeWidth="6"/>)}
      {[325,372,392].map((x,i) => <path key={i} d={`M${x} ${195-i*5} Q${x-10} ${175-i*5} ${x} ${155-i*5} Q${x+10} ${135-i*5} ${x} ${115-i*5}`} stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.55"/>)}
    </svg>
  ),

  // ── BREWERY ──────────────────────────────────────────────────────────────
  brewery: (
    <svg viewBox="0 0 500 500" fill="none">
      <path d="M118 162 L140 422 L338 422 L360 162 Z" stroke="currentColor" strokeWidth="14" fill="none" strokeLinejoin="round"/>
      <path d="M360 202 Q438 202 438 282 Q438 362 360 362" stroke="currentColor" strokeWidth="14" fill="none" strokeLinecap="round"/>
      {[[142,156,30,24],[198,140,36,30],[258,138,33,27],[318,150,28,23]].map(([cx,cy,rx,ry],i) => <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} stroke="currentColor" strokeWidth="10" fill="none"/>)}
      <line x1="173" y1="262" x2="305" y2="262" stroke="currentColor" strokeWidth="6" opacity="0.45"/>
      <line x1="163" y1="312" x2="315" y2="312" stroke="currentColor" strokeWidth="6" opacity="0.45"/>
      <circle cx="418" cy="90" r="30" stroke="currentColor" strokeWidth="8" fill="none"/>
      <line x1="418" y1="60" x2="418" y2="28" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
      {[0,60,120,180,240,300].map((a,i) => <line key={i} x1={418} y1={90} x2={418+26*Math.cos(a*Math.PI/180)} y2={90+26*Math.sin(a*Math.PI/180)} stroke="currentColor" strokeWidth="6" opacity="0.6"/>)}
    </svg>
  ),

  // ── WINERY ───────────────────────────────────────────────────────────────
  winery: (
    <svg viewBox="0 0 500 500" fill="none">
      <path d="M158 78 Q118 182 200 252 L220 382 L170 382" stroke="currentColor" strokeWidth="14" strokeLinecap="round" fill="none"/>
      <path d="M310 78 Q350 182 268 252 L248 382 L298 382" stroke="currentColor" strokeWidth="14" strokeLinecap="round" fill="none"/>
      <path d="M158 78 L310 78" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
      <path d="M170 192 Q234 212 298 192" stroke="currentColor" strokeWidth="8" fill="none" opacity="0.55"/>
      {[[382,118],[360,148],[402,148],[338,178],[380,178],[422,178],[360,206],[402,206],[442,206],[382,234]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r="19" stroke="currentColor" strokeWidth="8" fill="none"/>)}
      <path d="M382 94 Q392 68 412 58" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none"/>
    </svg>
  ),

  // ── HOSPITAL ─────────────────────────────────────────────────────────────
  hospital: (
    <svg viewBox="0 0 500 500" fill="none">
      <circle cx="250" cy="355" r="58" stroke="currentColor" strokeWidth="14" fill="none"/>
      <circle cx="250" cy="355" r="22" stroke="currentColor" strokeWidth="8" fill="none"/>
      <path d="M250 297 L250 200 Q250 138 188 118 Q126 98 106 140" stroke="currentColor" strokeWidth="14" strokeLinecap="round" fill="none"/>
      <circle cx="100" cy="146" r="19" stroke="currentColor" strokeWidth="10" fill="none"/>
      <path d="M250 297 L250 200 Q250 138 312 118 Q374 98 394 140" stroke="currentColor" strokeWidth="14" strokeLinecap="round" fill="none"/>
      <circle cx="400" cy="146" r="19" stroke="currentColor" strokeWidth="10" fill="none"/>
      <path d="M46 452 L130 452 L156 390 L178 492 L202 420 L226 452 L422 452" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.48"/>
    </svg>
  ),

  // ── HEALTHCARE (general) ─────────────────────────────────────────────────
  healthcare: (
    <svg viewBox="0 0 500 500" fill="none">
      <rect x="198" y="78" width="104" height="344" rx="14" stroke="currentColor" strokeWidth="14" fill="none"/>
      <rect x="78" y="198" width="344" height="104" rx="14" stroke="currentColor" strokeWidth="14" fill="none"/>
      <path d="M128 250 L176 250 L196 208 L222 292 L246 228 L262 250 L372 250" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.48"/>
    </svg>
  ),

  // ── PHARMACY ─────────────────────────────────────────────────────────────
  pharmacy_rx: (
    <svg viewBox="0 0 500 500" fill="none">
      <path d="M118 278 Q118 402 250 402 Q382 402 382 278" stroke="currentColor" strokeWidth="14" fill="none"/>
      <line x1="98" y1="278" x2="402" y2="278" stroke="currentColor" strokeWidth="14" strokeLinecap="round"/>
      <line x1="312" y1="158" x2="198" y2="302" stroke="currentColor" strokeWidth="16" strokeLinecap="round"/>
      <ellipse cx="317" cy="152" rx="24" ry="32" stroke="currentColor" strokeWidth="10" fill="none" transform="rotate(-30 317 152)"/>
      <text x="138" y="262" fontFamily="serif" fontSize="82" fontWeight="700" stroke="currentColor" strokeWidth="5" fill="none" opacity="0.68">Rx</text>
    </svg>
  ),

  // ── FINANCE ──────────────────────────────────────────────────────────────
  finance: (
    <svg viewBox="0 0 500 500" fill="none">
      <path d="M58 162 L250 50 L442 162 Z" stroke="currentColor" strokeWidth="14" fill="none" strokeLinejoin="round"/>
      <line x1="58" y1="162" x2="442" y2="162" stroke="currentColor" strokeWidth="10"/>
      {[108,185,250,315,392].map((x,i) => <rect key={i} x={x-14} y={177} width={28} height={222} stroke="currentColor" strokeWidth="10" fill="none" rx="2"/>)}
      <rect x="58" y="399" width="384" height="20" stroke="currentColor" strokeWidth="8" fill="none"/>
      <rect x="38" y="419" width="424" height="20" stroke="currentColor" strokeWidth="8" fill="none"/>
    </svg>
  ),

  // ── INSURANCE ────────────────────────────────────────────────────────────
  insurance_shield: (
    <svg viewBox="0 0 500 500" fill="none">
      <path d="M250 58 L412 132 L412 282 Q412 392 250 452 Q88 392 88 282 L88 132 Z" stroke="currentColor" strokeWidth="14" fill="none" strokeLinejoin="round"/>
      <path d="M153 252 L215 322 L348 178" stroke="currentColor" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M250 108 L377 167 L377 282 Q377 362 250 407 Q123 362 123 282 L123 167 Z" stroke="currentColor" strokeWidth="6" strokeDasharray="12 8" fill="none" opacity="0.48"/>
    </svg>
  ),

  // ── TECH ─────────────────────────────────────────────────────────────────
  tech: (
    <svg viewBox="0 0 500 500" fill="none">
      <path d="M78 148 L162 148 L162 252 L242 252" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M242 252 L322 252 L322 148 L402 148 L402 352" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M78 352 L202 352 L202 332" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M202 332 L202 178 L302 178 L302 352 L422 352" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M78 252 L118 252 L118 422 L382 422 L382 352" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="208" y="212" width="84" height="84" stroke="currentColor" strokeWidth="10" rx="4" fill="none"/>
      <rect x="128" y="118" width="62" height="62" stroke="currentColor" strokeWidth="8" rx="4" fill="none"/>
      <rect x="348" y="298" width="62" height="62" stroke="currentColor" strokeWidth="8" rx="4" fill="none"/>
      {[224,244,264,284].map((x,i) => <line key={i} x1={x} y1={212} x2={x} y2={195} stroke="currentColor" strokeWidth="5"/>)}
      {[224,244,264,284].map((x,i) => <line key={i} x1={x} y1={296} x2={x} y2={312} stroke="currentColor" strokeWidth="5"/>)}
      {[78,242].map((x,i) => <circle key={i} cx={x} cy={[148,252][i]} r="12" stroke="currentColor" strokeWidth="6" fill="none"/>)}
    </svg>
  ),

  // ── CYBERSECURITY ────────────────────────────────────────────────────────
  cybersecurity: (
    <svg viewBox="0 0 500 500" fill="none">
      <path d="M250 48 L422 125 L422 278 Q422 402 250 462 Q78 402 78 278 L78 125 Z" stroke="currentColor" strokeWidth="14" fill="none" strokeLinejoin="round"/>
      <rect x="188" y="238" width="124" height="104" rx="10" stroke="currentColor" strokeWidth="12" fill="none"/>
      <path d="M208 238 L208 198 Q208 163 250 163 Q292 163 292 198 L292 238" stroke="currentColor" strokeWidth="12" fill="none" strokeLinecap="round"/>
      <circle cx="250" cy="278" r="16" stroke="currentColor" strokeWidth="8" fill="none"/>
      <line x1="250" y1="294" x2="250" y2="322" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
      <text x="98" y="162" fontFamily="monospace" fontSize="16" fill="currentColor" opacity="0.22">01101001</text>
      <text x="298" y="142" fontFamily="monospace" fontSize="13" fill="currentColor" opacity="0.18">10110010</text>
    </svg>
  ),

  // ── TELECOMS ─────────────────────────────────────────────────────────────
  telecoms: (
    <svg viewBox="0 0 500 500" fill="none">
      <path d="M250 98 L198 422 L302 422 Z" stroke="currentColor" strokeWidth="10" fill="none" strokeLinejoin="round"/>
      <line x1="218" y1="202" x2="282" y2="202" stroke="currentColor" strokeWidth="8"/>
      <line x1="211" y1="272" x2="289" y2="272" stroke="currentColor" strokeWidth="8"/>
      <line x1="203" y1="342" x2="297" y2="342" stroke="currentColor" strokeWidth="8"/>
      {[0,1,2].map(i => <path key={i} d={`M${198-i*40} ${118+i*20} Q${148-i*40} ${145+i*20} ${162-i*40} ${188+i*20} Q${178-i*40} ${228+i*20} ${136-i*40} ${260+i*20}`} stroke="currentColor" strokeWidth={8-i*2} strokeLinecap="round" fill="none" opacity={0.7-i*0.2}/>)}
      {[0,1,2].map(i => <path key={i} d={`M${302+i*40} ${118+i*20} Q${352+i*40} ${145+i*20} ${338+i*40} ${188+i*20} Q${322+i*40} ${228+i*20} ${364+i*40} ${260+i*20}`} stroke="currentColor" strokeWidth={8-i*2} strokeLinecap="round" fill="none" opacity={0.7-i*0.2}/>)}
    </svg>
  ),

  // ── RETAIL ───────────────────────────────────────────────────────────────
  retail: (
    <svg viewBox="0 0 500 500" fill="none">
      <path d="M118 182 L78 422 L422 422 L382 182 Z" stroke="currentColor" strokeWidth="14" fill="none" strokeLinejoin="round"/>
      <path d="M174 182 Q174 98 250 98 Q326 98 326 182" stroke="currentColor" strokeWidth="14" fill="none" strokeLinecap="round"/>
      <line x1="148" y1="282" x2="352" y2="282" stroke="currentColor" strokeWidth="8" opacity="0.45"/>
      <line x1="154" y1="332" x2="346" y2="332" stroke="currentColor" strokeWidth="8" opacity="0.45"/>
      {[[172,270],[218,264],[264,268],[312,270]].map(([x,y],i) => <rect key={i} x={x} y={y} width={30} height={14} rx="2" stroke="currentColor" strokeWidth="4" fill="none"/>)}
    </svg>
  ),

  // ── GROCERY ──────────────────────────────────────────────────────────────
  grocery: (
    <svg viewBox="0 0 500 500" fill="none">
      <path d="M58 98 L118 98 L186 342 L402 342" stroke="currentColor" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M138 162 L182 342 L402 342 L422 162 Z" stroke="currentColor" strokeWidth="12" fill="none" strokeLinejoin="round"/>
      <line x1="238" y1="162" x2="252" y2="342" stroke="currentColor" strokeWidth="6" opacity="0.48"/>
      <line x1="322" y1="162" x2="336" y2="342" stroke="currentColor" strokeWidth="6" opacity="0.48"/>
      <circle cx="204" cy="392" r="34" stroke="currentColor" strokeWidth="12" fill="none"/>
      <circle cx="377" cy="392" r="34" stroke="currentColor" strokeWidth="12" fill="none"/>
      <circle cx="204" cy="392" r="9" stroke="currentColor" strokeWidth="6" fill="none"/>
      <circle cx="377" cy="392" r="9" stroke="currentColor" strokeWidth="6" fill="none"/>
      {[168,254,340].map((x,i) => <rect key={i} x={x} y={198} width={44} height={58} rx="4" stroke="currentColor" strokeWidth="6" fill="none"/>)}
    </svg>
  ),

  // ── E-COMMERCE ───────────────────────────────────────────────────────────
  ecommerce: (
    <svg viewBox="0 0 500 500" fill="none">
      <rect x="98" y="178" width="284" height="244" rx="8" stroke="currentColor" strokeWidth="14" fill="none"/>
      <path d="M98 178 L164 118 L338 118 L402 178" stroke="currentColor" strokeWidth="10" fill="none"/>
      <line x1="164" y1="118" x2="164" y2="178" stroke="currentColor" strokeWidth="8"/>
      <line x1="338" y1="118" x2="338" y2="178" stroke="currentColor" strokeWidth="8"/>
      <line x1="238" y1="178" x2="238" y2="422" stroke="currentColor" strokeWidth="12" opacity="0.38"/>
      <path d="M352 298 L432 298" stroke="currentColor" strokeWidth="14" strokeLinecap="round"/>
      <path d="M402 268 L432 298 L402 328" stroke="currentColor" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <rect x="128" y="238" width="122" height="82" rx="4" stroke="currentColor" strokeWidth="6" fill="none" opacity="0.48"/>
    </svg>
  ),

  // ── HOSPITALITY ──────────────────────────────────────────────────────────
  hospitality: (
    <svg viewBox="0 0 500 500" fill="none">
      <rect x="78" y="162" width="344" height="282" stroke="currentColor" strokeWidth="12" fill="none"/>
      <path d="M58 162 L250 68 L442 162" stroke="currentColor" strokeWidth="12" fill="none" strokeLinejoin="round"/>
      <line x1="250" y1="68" x2="250" y2="28" stroke="currentColor" strokeWidth="8"/>
      <path d="M250 28 L292 48 L250 58 Z" fill="currentColor" opacity="0.45"/>
      {[118,188,258,328,388].flatMap((x,i) => [192,272,352].map((y,j) => <rect key={`${i}${j}`} x={x} y={y} width={32} height={40} rx="2" stroke="currentColor" strokeWidth="6" fill="none"/>))}
      <rect x="213" y="372" width="74" height="72" rx="4" stroke="currentColor" strokeWidth="8" fill="none"/>
    </svg>
  ),

  // ── AVIATION ─────────────────────────────────────────────────────────────
  aviation: (
    <svg viewBox="0 0 500 500" fill="none">
      <ellipse cx="250" cy="250" rx="36" ry="182" stroke="currentColor" strokeWidth="14" fill="none"/>
      <path d="M233 198 L58 322 L79 342 L238 262" stroke="currentColor" strokeWidth="12" fill="none" strokeLinejoin="round"/>
      <path d="M267 198 L442 322 L421 342 L262 262" stroke="currentColor" strokeWidth="12" fill="none" strokeLinejoin="round"/>
      <path d="M238 392 L128 432 L139 448 L246 406" stroke="currentColor" strokeWidth="10" fill="none" strokeLinejoin="round"/>
      <path d="M262 392 L372 432 L361 448 L254 406" stroke="currentColor" strokeWidth="10" fill="none" strokeLinejoin="round"/>
      <rect x="128" y="296" width="52" height="22" rx="11" stroke="currentColor" strokeWidth="8" fill="none"/>
      <rect x="320" y="296" width="52" height="22" rx="11" stroke="currentColor" strokeWidth="8" fill="none"/>
      <ellipse cx="250" cy="88" rx="15" ry="22" stroke="currentColor" strokeWidth="6" fill="none" opacity="0.55"/>
    </svg>
  ),

  // ── LOGISTICS ────────────────────────────────────────────────────────────
  logistics: (
    <svg viewBox="0 0 500 500" fill="none">
      <path d="M58 202 L250 78 L442 202 L442 442 L58 442 Z" stroke="currentColor" strokeWidth="12" fill="none" strokeLinejoin="round"/>
      <rect x="188" y="352" width="124" height="90" stroke="currentColor" strokeWidth="10" fill="none"/>
      {[362,378,394,410,426,440].map((y,i) => <line key={i} x1="193" y1={y} x2="307" y2={y} stroke="currentColor" strokeWidth="5" opacity="0.38"/>)}
      {[[128,322,182,322],[128,362,182,362],[318,322,372,322],[318,362,372,362]].map(([x1,y1,x2,y2],i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="7" opacity="0.48"/>)}
      <rect x="208" y="148" width="84" height="42" rx="4" stroke="currentColor" strokeWidth="7" fill="none" opacity="0.48"/>
    </svg>
  ),

  // ── FREIGHT ──────────────────────────────────────────────────────────────
  freight: (
    <svg viewBox="0 0 500 500" fill="none">
      <rect x="78" y="178" width="262" height="202" rx="6" stroke="currentColor" strokeWidth="14" fill="none"/>
      <path d="M340 228 L340 178 Q340 178 412 228 L432 278 L432 380 L340 380 Z" stroke="currentColor" strokeWidth="12" fill="none" strokeLinejoin="round"/>
      <path d="M344 240 L344 194 Q380 208 402 240 Z" stroke="currentColor" strokeWidth="7" fill="none" opacity="0.48"/>
      {[[128,402,36],[228,402,36],[330,402,36],[422,402,28]].map(([cx,cy,r],i) => <>
        <circle key={`o${i}`} cx={cx} cy={cy} r={r} stroke="currentColor" strokeWidth={i===3?8:10} fill="none"/>
        <circle key={`i${i}`} cx={cx} cy={cy} r={i===3?9:15} stroke="currentColor" strokeWidth={i===3?7:7} fill="none"/>
      </>)}
      {[222,262,302].map((y,i) => <line key={i} x1="92" y1={y} x2="326" y2={y} stroke="currentColor" strokeWidth="5" opacity="0.28"/>)}
    </svg>
  ),

  // ── POSTAL ───────────────────────────────────────────────────────────────
  postal: (
    <svg viewBox="0 0 500 500" fill="none">
      <rect x="78" y="158" width="344" height="244" rx="8" stroke="currentColor" strokeWidth="14" fill="none"/>
      <path d="M78 158 L250 282 L422 158" stroke="currentColor" strokeWidth="10" fill="none"/>
      <path d="M78 402 L192 290" stroke="currentColor" strokeWidth="8" opacity="0.48"/>
      <path d="M422 402 L308 290" stroke="currentColor" strokeWidth="8" opacity="0.48"/>
      <path d="M68 222 L18 202 L48 242 L18 262 L68 252" stroke="currentColor" strokeWidth="8" fill="none" strokeLinejoin="round"/>
      <path d="M432 222 L482 202 L452 242 L482 262 L432 252" stroke="currentColor" strokeWidth="8" fill="none" strokeLinejoin="round"/>
      <rect x="348" y="176" width="47" height="55" rx="2" stroke="currentColor" strokeWidth="5" strokeDasharray="5 3" fill="none"/>
    </svg>
  ),

  // ── CONSTRUCTION ─────────────────────────────────────────────────────────
  construction: (
    <svg viewBox="0 0 500 500" fill="none">
      <rect x="98" y="278" width="222" height="162" stroke="currentColor" strokeWidth="12" fill="none"/>
      <line x1="98" y1="358" x2="320" y2="358" stroke="currentColor" strokeWidth="8"/>
      <line x1="98" y1="318" x2="320" y2="318" stroke="currentColor" strokeWidth="8"/>
      {[128,188,248].flatMap((x,i) => [296,336,376].map((y,j) => <rect key={`${i}${j}`} x={x} y={y} width={36} height={26} rx="2" stroke="currentColor" strokeWidth="5" fill="none"/>))}
      <line x1="382" y1="78" x2="382" y2="440" stroke="currentColor" strokeWidth="14" strokeLinecap="round"/>
      <line x1="198" y1="98" x2="462" y2="98" stroke="currentColor" strokeWidth="12" strokeLinecap="round"/>
      <rect x="187" y="88" width="42" height="32" rx="4" stroke="currentColor" strokeWidth="8" fill="none"/>
      <line x1="342" y1="98" x2="342" y2="198" stroke="currentColor" strokeWidth="6" strokeDasharray="8 6"/>
      <path d="M328 198 Q320 218 342 224 Q362 230 352 198" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round"/>
      <line x1="382" y1="98" x2="302" y2="198" stroke="currentColor" strokeWidth="6" opacity="0.48"/>
      <line x1="382" y1="98" x2="462" y2="178" stroke="currentColor" strokeWidth="6" opacity="0.48"/>
    </svg>
  ),

  // ── ARCHITECTURE ─────────────────────────────────────────────────────────
  architecture: (
    <svg viewBox="0 0 500 500" fill="none">
      {[98,158,218,278,338,398].map((x,i) => <line key={`v${i}`} x1={x} y1={78} x2={x} y2={442} stroke="currentColor" strokeWidth="4" opacity="0.18"/>)}
      {[78,138,198,258,318,378,438].map((y,i) => <line key={`h${i}`} x1={78} y1={y} x2={422} y2={y} stroke="currentColor" strokeWidth="4" opacity="0.18"/>)}
      <circle cx="312" cy="178" r="82" stroke="currentColor" strokeWidth="8" fill="none"/>
      <line x1="312" y1="96" x2="312" y2="260" stroke="currentColor" strokeWidth="6" opacity="0.48"/>
      <line x1="230" y1="178" x2="394" y2="178" stroke="currentColor" strokeWidth="6" opacity="0.48"/>
      <circle cx="312" cy="178" r="12" stroke="currentColor" strokeWidth="7" fill="none"/>
      <path d="M118 382 L118 198 L282 382 Z" stroke="currentColor" strokeWidth="10" fill="none" strokeLinejoin="round"/>
      {[220,240,260,280,300,320,340,360].map((y,i) => <line key={i} x1={111} y1={y} x2={125} y2={y} stroke="currentColor" strokeWidth="5"/>)}
    </svg>
  ),

  // ── EDUCATION ────────────────────────────────────────────────────────────
  education: (
    <svg viewBox="0 0 500 500" fill="none">
      <path d="M250 98 L58 192 L250 282 L442 192 Z" stroke="currentColor" strokeWidth="12" fill="none" strokeLinejoin="round"/>
      <rect x="208" y="62" width="84" height="42" rx="4" stroke="currentColor" strokeWidth="10" fill="none"/>
      <line x1="412" y1="192" x2="442" y2="302" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
      <circle cx="442" cy="318" r="17" stroke="currentColor" strokeWidth="6" fill="none"/>
      <path d="M98 352 L250 322 L402 352 L402 452 L250 422 L98 452 Z" stroke="currentColor" strokeWidth="10" fill="none" strokeLinejoin="round"/>
      <line x1="250" y1="322" x2="250" y2="422" stroke="currentColor" strokeWidth="8"/>
      {[347,362,377,392,407].map((y,i) => <line key={i} x1={118} y1={y} x2={232} y2={y-5} stroke="currentColor" strokeWidth="4" opacity="0.45"/>)}
      {[347,362,377,392,407].map((y,i) => <line key={i} x1={268} y1={y} x2={382} y2={y+5} stroke="currentColor" strokeWidth="4" opacity="0.45"/>)}
    </svg>
  ),

  // ── GOVERNMENT ───────────────────────────────────────────────────────────
  government: (
    <svg viewBox="0 0 500 500" fill="none">
      <path d="M148 252 Q148 78 250 58 Q352 78 352 252" stroke="currentColor" strokeWidth="12" fill="none"/>
      <rect x="138" y="240" width="224" height="42" stroke="currentColor" strokeWidth="10" fill="none"/>
      <rect x="228" y="38" width="44" height="32" rx="3" stroke="currentColor" strokeWidth="7" fill="none"/>
      <line x1="250" y1="38" x2="250" y2="18" stroke="currentColor" strokeWidth="7" strokeLinecap="round"/>
      <circle cx="250" cy="13" r="7" stroke="currentColor" strokeWidth="5" fill="none"/>
      <rect x="98" y="282" width="304" height="42" stroke="currentColor" strokeWidth="10" fill="none"/>
      {[128,180,232,284,336,370].map((x,i) => <rect key={i} x={x-10} y={324} width={20} height={142} stroke="currentColor" strokeWidth="8" fill="none" rx="2"/>)}
      <rect x="88" y="466" width="324" height="18" stroke="currentColor" strokeWidth="7" fill="none"/>
    </svg>
  ),

  // ── EMERGENCY ────────────────────────────────────────────────────────────
  emergency: (
    <svg viewBox="0 0 500 500" fill="none">
      <path d="M250 48 L422 125 L422 278 Q422 402 250 462 Q78 402 78 278 L78 125 Z" stroke="currentColor" strokeWidth="14" fill="none" strokeLinejoin="round"/>
      <path d="M250 402 Q198 342 208 280 Q218 218 178 158 Q220 198 230 158 Q240 118 250 98 Q260 128 256 178 Q266 148 282 118 Q297 198 270 250 Q302 210 312 168 Q332 242 302 302 Q292 362 250 402 Z" stroke="currentColor" strokeWidth="8" fill="none" opacity="0.68" strokeLinejoin="round"/>
    </svg>
  ),

  // ── POLICE ───────────────────────────────────────────────────────────────
  police: (
    <svg viewBox="0 0 500 500" fill="none">
      <path d="M250 58 L402 132 L402 302 Q402 412 250 462 Q98 412 98 302 L98 132 Z" stroke="currentColor" strokeWidth="14" fill="none" strokeLinejoin="round"/>
      <polygon points="250,138 274,212 352,212 290,258 312,332 250,285 188,332 210,258 148,212 226,212" stroke="currentColor" strokeWidth="10" fill="none"/>
      <line x1="188" y1="352" x2="312" y2="352" stroke="currentColor" strokeWidth="7" opacity="0.48"/>
      <line x1="202" y1="372" x2="298" y2="372" stroke="currentColor" strokeWidth="7" opacity="0.48"/>
      {[[148,162],[352,162],[148,282],[352,282]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r="11" stroke="currentColor" strokeWidth="6" fill="none"/>)}
    </svg>
  ),

  // ── MILITARY ─────────────────────────────────────────────────────────────
  military: (
    <svg viewBox="0 0 500 500" fill="none">
      <polygon points="250,78 280,178 378,178 300,235 328,328 250,272 172,328 200,235 122,178 220,178" stroke="currentColor" strokeWidth="12" fill="none"/>
      <path d="M128 382 L250 320 L372 382" stroke="currentColor" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M128 422 L250 360 L372 422" stroke="currentColor" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M128 462 L250 400 L372 462" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M118 202 Q78 262 98 332" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.48"/>
      <path d="M382 202 Q422 262 402 332" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.48"/>
    </svg>
  ),

  // ── FILM ─────────────────────────────────────────────────────────────────
  film: (
    <svg viewBox="0 0 500 500" fill="none">
      <rect x="78" y="168" width="344" height="284" rx="8" stroke="currentColor" strokeWidth="14" fill="none"/>
      <rect x="78" y="108" width="344" height="72" rx="8" stroke="currentColor" strokeWidth="12" fill="none"/>
      {[162,234,306,378].map((x,i) => <line key={i} x1={x} y1="108" x2={x} y2="180" stroke="currentColor" strokeWidth="8"/>)}
      <line x1="113" y1="232" x2="387" y2="232" stroke="currentColor" strokeWidth="7" opacity="0.38"/>
      <line x1="113" y1="274" x2="302" y2="274" stroke="currentColor" strokeWidth="7" opacity="0.38"/>
      <circle cx="338" cy="342" r="82" stroke="currentColor" strokeWidth="10" fill="none"/>
      <circle cx="338" cy="342" r="28" stroke="currentColor" strokeWidth="7" fill="none"/>
      {[0,60,120,180,240,300].map((a,i) => <line key={i} x1={338+28*Math.cos(a*Math.PI/180)} y1={342+28*Math.sin(a*Math.PI/180)} x2={338+82*Math.cos(a*Math.PI/180)} y2={342+82*Math.sin(a*Math.PI/180)} stroke="currentColor" strokeWidth="7" opacity="0.48"/>)}
    </svg>
  ),

  // ── MUSIC ────────────────────────────────────────────────────────────────
  music: (
    <svg viewBox="0 0 500 500" fill="none">
      <path d="M148 118 Q148 78 185 78 Q227 78 227 130 Q227 182 148 202 Q78 222 78 302 Q78 382 188 382 Q242 382 262 330 Q278 268 257 202 L257 78" stroke="currentColor" strokeWidth="12" strokeLinecap="round" fill="none"/>
      <circle cx="352" cy="178" r="24" stroke="currentColor" strokeWidth="10" fill="none"/>
      <line x1="376" y1="178" x2="376" y2="78" stroke="currentColor" strokeWidth="10"/>
      <path d="M376 78 L422 93 L422 108 L376 93 Z" stroke="currentColor" strokeWidth="6" fill="currentColor" opacity="0.55"/>
      <circle cx="372" cy="322" r="24" stroke="currentColor" strokeWidth="10" fill="none"/>
      <line x1="396" y1="322" x2="396" y2="218" stroke="currentColor" strokeWidth="10"/>
      <path d="M78 422 Q120 372 162 422 Q202 472 242 422 Q282 372 322 422 Q362 472 402 422 Q442 372 462 422" stroke="currentColor" strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.48"/>
    </svg>
  ),

  // ── GAMING ───────────────────────────────────────────────────────────────
  gaming: (
    <svg viewBox="0 0 500 500" fill="none">
      <path d="M118 178 Q78 230 68 312 Q58 392 118 402 Q168 412 200 362 L300 362 Q332 412 382 402 Q442 392 432 312 Q422 230 382 178 Z" stroke="currentColor" strokeWidth="14" fill="none" strokeLinejoin="round"/>
      <line x1="158" y1="258" x2="158" y2="322" stroke="currentColor" strokeWidth="12" strokeLinecap="round"/>
      <line x1="127" y1="290" x2="189" y2="290" stroke="currentColor" strokeWidth="12" strokeLinecap="round"/>
      {[[321,258],[352,290],[321,322],[290,290]].map(([cx,cy],i) => <circle key={i} cx={cx} cy={cy} r="15" stroke="currentColor" strokeWidth="8" fill="none"/>)}
      <circle cx="250" cy="258" r="21" stroke="currentColor" strokeWidth="7" fill="none"/>
      <circle cx="188" cy="342" r="23" stroke="currentColor" strokeWidth="8" fill="none"/>
      <circle cx="312" cy="342" r="23" stroke="currentColor" strokeWidth="8" fill="none"/>
    </svg>
  ),

  // ── EVENTS ───────────────────────────────────────────────────────────────
  events: (
    <svg viewBox="0 0 500 500" fill="none">
      <path d="M250 58 L78 442 L422 442 Z" stroke="currentColor" strokeWidth="8" fill="none" strokeLinejoin="round" opacity="0.48"/>
      <line x1="250" y1="58" x2="163" y2="442" stroke="currentColor" strokeWidth="4" opacity="0.28"/>
      <line x1="250" y1="58" x2="208" y2="442" stroke="currentColor" strokeWidth="4" opacity="0.28"/>
      <line x1="250" y1="58" x2="292" y2="442" stroke="currentColor" strokeWidth="4" opacity="0.28"/>
      <line x1="250" y1="58" x2="337" y2="442" stroke="currentColor" strokeWidth="4" opacity="0.28"/>
      <ellipse cx="250" cy="58" rx="52" ry="31" stroke="currentColor" strokeWidth="12" fill="none"/>
      <rect x="220" y="28" width="60" height="32" rx="4" stroke="currentColor" strokeWidth="8" fill="none"/>
      <line x1="250" y1="28" x2="250" y2="-2" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
      {[[78,98],[422,88],[58,302],[442,292]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r="9" fill="currentColor" opacity="0.48"/>)}
    </svg>
  ),

  // ── PUBLISHING ───────────────────────────────────────────────────────────
  publishing: (
    <svg viewBox="0 0 500 500" fill="none">
      <path d="M78 148 L250 118 L422 148 L422 402 L250 372 L78 402 Z" stroke="currentColor" strokeWidth="12" fill="none" strokeLinejoin="round"/>
      <line x1="250" y1="118" x2="250" y2="372" stroke="currentColor" strokeWidth="10"/>
      <path d="M250 118 Q234 245 250 372" stroke="currentColor" strokeWidth="6" opacity="0.48" fill="none"/>
      {[172,202,232,262,292,322,352].map((y,i) => <line key={i} x1={98} y1={y} x2={232} y2={y-4} stroke="currentColor" strokeWidth="5" opacity="0.38"/>)}
      {[172,202,232,262,292,322,352].map((y,i) => <line key={i} x1={268} y1={y} x2={402} y2={y+4} stroke="currentColor" strokeWidth="5" opacity="0.38"/>)}
      <path d="M382 98 Q350 202 288 322" stroke="currentColor" strokeWidth="10" strokeLinecap="round" fill="none"/>
      <path d="M382 98 Q422 58 452 38 Q430 92 408 122 Q388 152 382 98 Z" stroke="currentColor" strokeWidth="7" fill="none" opacity="0.55"/>
    </svg>
  ),

  // ── SPORTS ───────────────────────────────────────────────────────────────
  sports: (
    <svg viewBox="0 0 500 500" fill="none">
      <path d="M158 78 L342 78 L322 282 Q312 362 250 382 Q188 362 178 282 Z" stroke="currentColor" strokeWidth="14" fill="none" strokeLinejoin="round"/>
      <path d="M158 118 Q88 140 93 222 Q98 282 178 272" stroke="currentColor" strokeWidth="12" strokeLinecap="round" fill="none"/>
      <path d="M342 118 Q412 140 407 222 Q402 282 322 272" stroke="currentColor" strokeWidth="12" strokeLinecap="round" fill="none"/>
      <rect x="203" y="382" width="94" height="42" stroke="currentColor" strokeWidth="10" fill="none" rx="2"/>
      <rect x="163" y="424" width="174" height="32" stroke="currentColor" strokeWidth="10" fill="none" rx="2"/>
      <polygon points="250,138 266,185 315,185 276,210 290,257 250,232 210,257 224,210 185,185 234,185" stroke="currentColor" strokeWidth="8" fill="none"/>
    </svg>
  ),

  // ── VENUE ────────────────────────────────────────────────────────────────
  venue: (
    <svg viewBox="0 0 500 500" fill="none">
      <ellipse cx="250" cy="282" rx="202" ry="122" stroke="currentColor" strokeWidth="12" fill="none"/>
      <ellipse cx="250" cy="282" rx="142" ry="82" stroke="currentColor" strokeWidth="8" strokeDasharray="12 8" fill="none" opacity="0.48"/>
      <ellipse cx="250" cy="282" rx="172" ry="102" stroke="currentColor" strokeWidth="5" fill="none" opacity="0.32"/>
      <line x1="250" y1="200" x2="250" y2="118" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
      <line x1="218" y1="138" x2="282" y2="138" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
      <line x1="218" y1="138" x2="218" y2="108" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
      <line x1="282" y1="138" x2="282" y2="108" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
      <path d="M48 282 Q48 98 250 78 Q452 98 452 282" stroke="currentColor" strokeWidth="10" strokeDasharray="16 10" fill="none" opacity="0.38"/>
    </svg>
  ),

  // ── FITNESS ──────────────────────────────────────────────────────────────
  fitness: (
    <svg viewBox="0 0 500 500" fill="none">
      <line x1="98" y1="250" x2="402" y2="250" stroke="currentColor" strokeWidth="16" strokeLinecap="round"/>
      <rect x="68" y="178" width="52" height="144" rx="6" stroke="currentColor" strokeWidth="12" fill="none"/>
      <rect x="48" y="198" width="32" height="104" rx="6" stroke="currentColor" strokeWidth="10" fill="none"/>
      <rect x="380" y="178" width="52" height="144" rx="6" stroke="currentColor" strokeWidth="12" fill="none"/>
      <rect x="420" y="198" width="32" height="104" rx="6" stroke="currentColor" strokeWidth="10" fill="none"/>
      <path d="M78 392 L140 392 L172 340 L202 432 L226 358 L252 392 L422 392" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.48"/>
    </svg>
  ),

  // ── LEGAL ────────────────────────────────────────────────────────────────
  legal: (
    <svg viewBox="0 0 500 500" fill="none">
      <line x1="250" y1="58" x2="250" y2="442" stroke="currentColor" strokeWidth="12" strokeLinecap="round"/>
      <line x1="88" y1="158" x2="412" y2="158" stroke="currentColor" strokeWidth="12" strokeLinecap="round"/>
      <circle cx="250" cy="58" r="19" stroke="currentColor" strokeWidth="8" fill="none"/>
      <line x1="118" y1="158" x2="98" y2="302" stroke="currentColor" strokeWidth="8"/>
      <line x1="88" y1="158" x2="98" y2="302" stroke="currentColor" strokeWidth="8"/>
      <path d="M68 302 Q98 344 128 302" stroke="currentColor" strokeWidth="10" strokeLinecap="round" fill="none"/>
      <line x1="382" y1="158" x2="402" y2="322" stroke="currentColor" strokeWidth="8"/>
      <line x1="412" y1="158" x2="402" y2="322" stroke="currentColor" strokeWidth="8"/>
      <path d="M372 322 Q402 364 432 322" stroke="currentColor" strokeWidth="10" strokeLinecap="round" fill="none"/>
      <rect x="208" y="437" width="84" height="22" rx="4" stroke="currentColor" strokeWidth="7" fill="none"/>
      <line x1="158" y1="459" x2="342" y2="459" stroke="currentColor" strokeWidth="7" strokeLinecap="round"/>
    </svg>
  ),

  // ── HR ───────────────────────────────────────────────────────────────────
  hr: (
    <svg viewBox="0 0 500 500" fill="none">
      <circle cx="250" cy="138" r="50" stroke="currentColor" strokeWidth="12" fill="none"/>
      <path d="M138 342 Q159 240 250 228 Q341 240 362 342 L362 402 L138 402 Z" stroke="currentColor" strokeWidth="12" fill="none" strokeLinejoin="round"/>
      <circle cx="108" cy="178" r="36" stroke="currentColor" strokeWidth="10" fill="none"/>
      <path d="M48 362 Q64 288 108 278 Q152 288 162 342" stroke="currentColor" strokeWidth="10" fill="none" strokeLinecap="round"/>
      <circle cx="392" cy="178" r="36" stroke="currentColor" strokeWidth="10" fill="none"/>
      <path d="M452 362 Q436 288 392 278 Q348 288 338 342" stroke="currentColor" strokeWidth="10" fill="none" strokeLinecap="round"/>
      <line x1="157" y1="158" x2="202" y2="153" stroke="currentColor" strokeWidth="7" strokeDasharray="8 6" opacity="0.48"/>
      <line x1="298" y1="153" x2="343" y2="158" stroke="currentColor" strokeWidth="7" strokeDasharray="8 6" opacity="0.48"/>
    </svg>
  ),

  // ── STAFFING ─────────────────────────────────────────────────────────────
  staffing: (
    <svg viewBox="0 0 500 500" fill="none">
      <path d="M58 282 L148 220 L196 230 L242 250" stroke="currentColor" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M442 282 L352 220 L304 230 L258 250" stroke="currentColor" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M242 250 Q250 240 258 250 L292 272 Q312 282 302 302 Q292 322 272 312 L242 297 Q222 287 232 267 Z" stroke="currentColor" strokeWidth="12" fill="none"/>
      <line x1="196" y1="230" x2="222" y2="262" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
      <line x1="214" y1="225" x2="238" y2="257" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
      <line x1="304" y1="230" x2="278" y2="262" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
      <line x1="286" y1="225" x2="262" y2="257" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
      <rect x="48" y="322" width="62" height="47" rx="4" stroke="currentColor" strokeWidth="8" fill="none"/>
      <path d="M66 322 L66 312 Q79 304 92 312 L92 322" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round"/>
      <rect x="390" y="322" width="62" height="47" rx="4" stroke="currentColor" strokeWidth="8" fill="none"/>
      <path d="M408 322 L408 312 Q421 304 434 312 L434 322" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round"/>
    </svg>
  ),

  // ── MARKETING ────────────────────────────────────────────────────────────
  marketing: (
    <svg viewBox="0 0 500 500" fill="none">
      <path d="M78 192 L78 312 L202 372 L382 442 L382 58 L202 132 Z" stroke="currentColor" strokeWidth="12" fill="none" strokeLinejoin="round"/>
      <line x1="202" y1="132" x2="202" y2="372" stroke="currentColor" strokeWidth="8"/>
      <path d="M402 182 Q442 232 442 282 Q442 332 402 372" stroke="currentColor" strokeWidth="10" strokeLinecap="round" fill="none"/>
      <path d="M417 162 Q467 222 467 282 Q467 342 417 382" stroke="currentColor" strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.48"/>
      <circle cx="128" cy="382" r="62" stroke="currentColor" strokeWidth="10" fill="none"/>
      <circle cx="128" cy="382" r="40" stroke="currentColor" strokeWidth="7" fill="none" opacity="0.55"/>
      <circle cx="128" cy="382" r="17" stroke="currentColor" strokeWidth="8" fill="none"/>
    </svg>
  ),

  // ── DIGITAL MARKETING ────────────────────────────────────────────────────
  digital: (
    <svg viewBox="0 0 500 500" fill="none">
      <rect x="78" y="302" width="62" height="142" stroke="currentColor" strokeWidth="10" fill="none"/>
      <rect x="174" y="222" width="62" height="222" stroke="currentColor" strokeWidth="10" fill="none"/>
      <rect x="270" y="162" width="62" height="282" stroke="currentColor" strokeWidth="10" fill="none"/>
      <rect x="366" y="98" width="62" height="346" stroke="currentColor" strokeWidth="10" fill="none"/>
      <path d="M109 302 L205 222 L301 162 L397 98" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeDasharray="10 6" fill="none" opacity="0.55"/>
      <line x1="58" y1="444" x2="452" y2="444" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
      <line x1="58" y1="78" x2="58" y2="444" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
      <path d="M372 352 L372 444" stroke="currentColor" strokeWidth="14" strokeLinecap="round" opacity="0.55"/>
      <path d="M398 320 L432 352 L402 408 L412 444 L422 438 L412 402 L444 344 L420 320 Z" stroke="currentColor" strokeWidth="7" fill="none" strokeLinejoin="round" opacity="0.55"/>
    </svg>
  ),

  // ── NONPROFIT ────────────────────────────────────────────────────────────
  nonprofit: (
    <svg viewBox="0 0 500 500" fill="none">
      <path d="M250 382 Q118 282 118 178 Q118 98 196 98 Q232 98 250 128 Q268 98 304 98 Q382 98 382 178 Q382 282 250 382 Z" stroke="currentColor" strokeWidth="14" fill="none" strokeLinejoin="round"/>
      <path d="M58 352 Q78 278 128 268 L180 278 L180 342 Q150 382 118 402 Q88 422 58 402 Z" stroke="currentColor" strokeWidth="10" fill="none" strokeLinejoin="round" opacity="0.55"/>
      <path d="M442 352 Q422 278 372 268 L320 278 L320 342 Q350 382 382 402 Q412 422 442 402 Z" stroke="currentColor" strokeWidth="10" fill="none" strokeLinejoin="round" opacity="0.55"/>
    </svg>
  ),

  // ── SOCIAL CARE ──────────────────────────────────────────────────────────
  social_care: (
    <svg viewBox="0 0 500 500" fill="none">
      <path d="M250 442 Q148 402 118 302 L118 198 Q118 168 148 168 L158 242 Q158 160 168 128 Q168 98 198 98 L198 232 Q201 118 228 118 Q254 118 254 232 Q260 118 284 128 Q312 142 308 232 Q316 158 344 173 Q372 198 356 282 L340 382 Q320 432 250 442 Z" stroke="currentColor" strokeWidth="10" fill="none" strokeLinejoin="round"/>
      <path d="M250 312 Q203 276 203 240 Q203 213 224 213 Q239 213 250 228 Q261 213 276 213 Q297 213 297 240 Q297 276 250 312 Z" stroke="currentColor" strokeWidth="8" fill="none"/>
    </svg>
  ),

  // ── AGRICULTURE ──────────────────────────────────────────────────────────
  agriculture: (
    <svg viewBox="0 0 500 500" fill="none">
      <line x1="250" y1="462" x2="250" y2="78" stroke="currentColor" strokeWidth="12" strokeLinecap="round"/>
      {[118,158,198,238,278,318].map((y,i) => <>
        <ellipse key={`L${i}`} cx={218-(i%2)*8} cy={y} rx={30} ry={17} stroke="currentColor" strokeWidth="8" fill="none" transform={`rotate(-30 ${218-(i%2)*8} ${y})`}/>
        <line key={`CL${i}`} x1="250" y1={y} x2={222} y2={y} stroke="currentColor" strokeWidth="6" opacity="0.48"/>
      </>)}
      {[128,168,208,248,288,328].map((y,i) => <>
        <ellipse key={`R${i}`} cx={282+(i%2)*8} cy={y} rx={30} ry={17} stroke="currentColor" strokeWidth="8" fill="none" transform={`rotate(30 ${282+(i%2)*8} ${y})`}/>
        <line key={`CR${i}`} x1="250" y1={y} x2={280} y2={y} stroke="currentColor" strokeWidth="6" opacity="0.48"/>
      </>)}
      <ellipse cx="250" cy="88" rx="23" ry="42" stroke="currentColor" strokeWidth="10" fill="none"/>
    </svg>
  ),

  // ── AQUACULTURE ──────────────────────────────────────────────────────────
  aquaculture: (
    <svg viewBox="0 0 500 500" fill="none">
      <path d="M48 302 Q124 272 200 302 Q276 332 352 302 Q428 272 482 302" stroke="currentColor" strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.48"/>
      <path d="M48 342 Q124 312 200 342 Q276 372 352 342 Q428 312 482 342" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.32"/>
      <path d="M98 202 Q200 142 342 192 Q382 202 402 202 Q382 212 342 222 Q200 272 98 202 Z" stroke="currentColor" strokeWidth="12" fill="none"/>
      <path d="M98 202 L58 166 L79 202 L58 238 Z" stroke="currentColor" strokeWidth="10" fill="none" strokeLinejoin="round"/>
      <circle cx="312" cy="197" r="11" stroke="currentColor" strokeWidth="6" fill="none"/>
      <path d="M200 118 Q262 98 312 118 Q272 138 200 118 Z" stroke="currentColor" strokeWidth="8" fill="none"/>
      <path d="M200 118 L174 103 L184 118 L174 133 Z" stroke="currentColor" strokeWidth="7" fill="none"/>
      {[58,118,178,238,298,358,418].map((x,i) => <line key={i} x1={x} y1="362" x2={x} y2="482" stroke="currentColor" strokeWidth="5" opacity="0.28"/>)}
      <line x1="48" y1="382" x2="462" y2="382" stroke="currentColor" strokeWidth="5" opacity="0.28"/>
      <line x1="48" y1="422" x2="462" y2="422" stroke="currentColor" strokeWidth="5" opacity="0.28"/>
    </svg>
  ),

  // ── ENERGY ───────────────────────────────────────────────────────────────
  energy: (
    <svg viewBox="0 0 500 500" fill="none">
      <path d="M250 78 L198 222 L220 222 L178 322 L202 322 L158 442 L252 362 L342 442 L298 322 L322 322 L280 222 L302 222 Z" stroke="currentColor" strokeWidth="8" fill="none" strokeLinejoin="round" opacity="0.68"/>
      <path d="M305 98 L268 222 L310 222 L233 382 L282 382 L260 462" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.55"/>
      <path d="M58 182 Q156 202 252 182 Q348 162 452 182" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.38"/>
      <path d="M58 202 Q156 222 252 202 Q348 182 452 202" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.28"/>
    </svg>
  ),

  // ── OIL ──────────────────────────────────────────────────────────────────
  oil: (
    <svg viewBox="0 0 500 500" fill="none">
      <path d="M250 58 L98 422 L402 422 Z" stroke="currentColor" strokeWidth="10" fill="none" strokeLinejoin="round"/>
      <line x1="138" y1="302" x2="362" y2="302" stroke="currentColor" strokeWidth="8"/>
      <line x1="160" y1="362" x2="340" y2="362" stroke="currentColor" strokeWidth="8"/>
      <line x1="118" y1="242" x2="178" y2="302" stroke="currentColor" strokeWidth="6" opacity="0.48"/>
      <line x1="382" y1="242" x2="322" y2="302" stroke="currentColor" strokeWidth="6" opacity="0.48"/>
      <rect x="223" y="46" width="54" height="30" rx="4" stroke="currentColor" strokeWidth="8" fill="none"/>
      <line x1="250" y1="76" x2="250" y2="422" stroke="currentColor" strokeWidth="6" strokeDasharray="12 8" opacity="0.45"/>
      <rect x="78" y="422" width="344" height="32" rx="4" stroke="currentColor" strokeWidth="10" fill="none"/>
      <path d="M88 58 Q88 38 98 54 Q108 38 108 58 Q108 74 98 74 Q88 74 88 58 Z" stroke="currentColor" strokeWidth="6" fill="none" opacity="0.48"/>
      <path d="M392 78 Q392 58 402 74 Q412 58 412 78 Q412 94 402 94 Q392 94 392 78 Z" stroke="currentColor" strokeWidth="6" fill="none" opacity="0.48"/>
    </svg>
  ),

  // ── RAIL ─────────────────────────────────────────────────────────────────
  rail: (
    <svg viewBox="0 0 500 500" fill="none">
      <rect x="78" y="158" width="302" height="182" rx="16" stroke="currentColor" strokeWidth="14" fill="none"/>
      <path d="M380 198 L442 218 L442 322 L380 342" stroke="currentColor" strokeWidth="12" fill="none" strokeLinejoin="round"/>
      <path d="M384 208 L384 194 Q420 210 440 242 Z" stroke="currentColor" strokeWidth="7" fill="none" opacity="0.48"/>
      <rect x="108" y="194" width="62" height="52" rx="6" stroke="currentColor" strokeWidth="8" fill="none"/>
      <rect x="194" y="194" width="62" height="52" rx="6" stroke="currentColor" strokeWidth="8" fill="none"/>
      <rect x="280" y="194" width="62" height="52" rx="6" stroke="currentColor" strokeWidth="8" fill="none"/>
      <rect x="400" y="208" width="32" height="42" rx="4" stroke="currentColor" strokeWidth="7" fill="none"/>
      {[[128,372,36],[228,372,36],[328,372,36],[422,372,28]].map(([cx,cy,r],i) => <>
        <circle key={`o${i}`} cx={cx} cy={cy} r={r} stroke="currentColor" strokeWidth={i===3?8:11} fill="none"/>
        <circle key={`i${i}`} cx={cx} cy={cy} r={i===3?10:16} stroke="currentColor" strokeWidth={7} fill="none"/>
      </>)}
      <line x1="28" y1="408" x2="472" y2="408" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
      <line x1="28" y1="426" x2="472" y2="426" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
      {[58,118,178,238,298,358,418].map((x,i) => <line key={i} x1={x} y1="404" x2={x} y2="430" stroke="currentColor" strokeWidth="8"/>)}
    </svg>
  ),

  // ── MARITIME ─────────────────────────────────────────────────────────────
  maritime: (
    <svg viewBox="0 0 500 500" fill="none">
      <path d="M58 312 L58 238 L442 238 L442 312 Q422 382 250 392 Q78 382 58 312 Z" stroke="currentColor" strokeWidth="14" fill="none" strokeLinejoin="round"/>
      {[[88,168,82,72],[186,168,82,72],[284,168,82,72]].map(([x,y,w,h],i) => <rect key={i} x={x} y={y} width={w} height={h} rx="3" stroke="currentColor" strokeWidth="9" fill="none"/>)}
      {[[88,98,82,72],[186,98,82,72],[284,98,72,72]].map(([x,y,w,h],i) => <rect key={i} x={x} y={y} width={w} height={h} rx="3" stroke="currentColor" strokeWidth="7" fill="none" opacity="0.68"/>)}
      <rect x="377" y="138" width="62" height="100" rx="4" stroke="currentColor" strokeWidth="9" fill="none"/>
      <rect x="382" y="98" width="52" height="46" rx="4" stroke="currentColor" strokeWidth="7" fill="none"/>
      <rect x="397" y="58" width="22" height="46" stroke="currentColor" strokeWidth="7" fill="none" rx="2"/>
      <path d="M48 392 Q124 372 200 392 Q276 412 352 392 Q428 372 462 392" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.48"/>
    </svg>
  ),

  // ── CONSULTING ───────────────────────────────────────────────────────────
  consulting: (
    <svg viewBox="0 0 500 500" fill="none">
      <circle cx="250" cy="250" r="44" stroke="currentColor" strokeWidth="12" fill="none"/>
      {[[250,78],[412,162],[432,332],[250,432],[68,332],[88,162]].map(([x,y],i) => <>
        <circle key={`n${i}`} cx={x} cy={y} r="30" stroke="currentColor" strokeWidth="9" fill="none"/>
        <line key={`l${i}`} x1="250" y1="250" x2={x} y2={y} stroke="currentColor" strokeWidth="7" opacity="0.55"/>
      </>)}
      <line x1="250" y1="78" x2="412" y2="162" stroke="currentColor" strokeWidth="5" opacity="0.32"/>
      <line x1="412" y1="162" x2="432" y2="332" stroke="currentColor" strokeWidth="5" opacity="0.32"/>
      <line x1="432" y1="332" x2="250" y2="432" stroke="currentColor" strokeWidth="5" opacity="0.32"/>
      <line x1="250" y1="432" x2="68" y2="332" stroke="currentColor" strokeWidth="5" opacity="0.32"/>
      <line x1="68" y1="332" x2="88" y2="162" stroke="currentColor" strokeWidth="5" opacity="0.32"/>
      <line x1="88" y1="162" x2="250" y2="78" stroke="currentColor" strokeWidth="5" opacity="0.32"/>
    </svg>
  ),

  // ── ENGINEERING ──────────────────────────────────────────────────────────
  engineering: (
    <svg viewBox="0 0 500 500" fill="none">
      {gearTeeth(218,218,92,12,20,14)}
      <circle cx="218" cy="218" r="92" stroke="currentColor" strokeWidth="12" fill="none"/>
      <circle cx="218" cy="218" r="36" stroke="currentColor" strokeWidth="9" fill="none"/>
      <path d="M342 98 Q382 78 402 118 Q422 158 392 190 L278 342 Q262 362 242 352 Q222 342 232 322 L352 190 Q312 160 342 98 Z" stroke="currentColor" strokeWidth="10" fill="none"/>
      <circle cx="372" cy="128" r="26" stroke="currentColor" strokeWidth="9" fill="none"/>
      <rect x="226" y="330" width="26" height="32" rx="4" stroke="currentColor" strokeWidth="7" fill="none" transform="rotate(-45 239 346)"/>
    </svg>
  ),

  // ── RESEARCH ─────────────────────────────────────────────────────────────
  research: (
    <svg viewBox="0 0 500 500" fill="none">
      <path d="M168 58 Q228 118 168 178 Q108 238 168 298 Q228 358 168 418 Q228 478 168 478" stroke="currentColor" strokeWidth="12" strokeLinecap="round" fill="none"/>
      <path d="M332 58 Q272 118 332 178 Q392 238 332 298 Q272 358 332 418 Q272 478 332 478" stroke="currentColor" strokeWidth="12" strokeLinecap="round" fill="none"/>
      {[78,138,198,258,318,378,438].map((y,i) => <line key={i} x1={168} y1={y} x2={332} y2={y} stroke="currentColor" strokeWidth="8" strokeLinecap="round" opacity={0.7-i*0.05}/>)}
      {[58,118,178,238,298,358,418,478].map((y,i) => <>
        <circle key={`L${i}`} cx={168} cy={y} r="9" stroke="currentColor" strokeWidth="6" fill="none"/>
        <circle key={`R${i}`} cx={332} cy={y} r="9" stroke="currentColor" strokeWidth="6" fill="none"/>
      </>)}
    </svg>
  ),

  // ── CLINICAL ─────────────────────────────────────────────────────────────
  clinical: (
    <svg viewBox="0 0 500 500" fill="none">
      <rect x="98" y="118" width="304" height="364" rx="10" stroke="currentColor" strokeWidth="13" fill="none"/>
      <rect x="178" y="98" width="144" height="52" rx="8" stroke="currentColor" strokeWidth="10" fill="none"/>
      {[178,214,250,286,322,358,394].map((y,i) => <line key={i} x1={128} y1={y} x2={372} y2={y} stroke="currentColor" strokeWidth="6" opacity="0.38"/>)}
      <rect x="128" y="166" width="24" height="24" rx="3" stroke="currentColor" strokeWidth="6" fill="none"/>
      <path d="M133 178 L141 186 L156 172" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round"/>
      <rect x="128" y="202" width="24" height="24" rx="3" stroke="currentColor" strokeWidth="6" fill="none"/>
      <rect x="128" y="238" width="24" height="24" rx="3" stroke="currentColor" strokeWidth="6" fill="none"/>
      <circle cx="338" cy="198" r="23" stroke="currentColor" strokeWidth="7" fill="none"/>
      <circle cx="368" cy="234" r="17" stroke="currentColor" strokeWidth="6" fill="none"/>
      <circle cx="308" cy="234" r="17" stroke="currentColor" strokeWidth="6" fill="none"/>
      <line x1="316" y1="217" x2="330" y2="217" stroke="currentColor" strokeWidth="5"/>
      <line x1="346" y1="217" x2="361" y2="217" stroke="currentColor" strokeWidth="5"/>
    </svg>
  ),

  // ── REAL ESTATE ──────────────────────────────────────────────────────────
  realestate: (
    <svg viewBox="0 0 500 500" fill="none">
      <path d="M250 78 L58 252 L100 252 L100 442 L402 442 L402 252 L442 252 Z" stroke="currentColor" strokeWidth="14" fill="none" strokeLinejoin="round"/>
      <rect x="198" y="322" width="104" height="120" rx="4" stroke="currentColor" strokeWidth="10" fill="none"/>
      <circle cx="283" cy="384" r="9" stroke="currentColor" strokeWidth="6" fill="none"/>
      <rect x="118" y="282" width="72" height="67" rx="4" stroke="currentColor" strokeWidth="8" fill="none"/>
      <rect x="310" y="282" width="72" height="67" rx="4" stroke="currentColor" strokeWidth="8" fill="none"/>
      <rect x="307" y="103" width="47" height="82" stroke="currentColor" strokeWidth="8" fill="none" rx="2"/>
      <circle cx="98" cy="118" r="38" stroke="currentColor" strokeWidth="10" fill="none"/>
      <circle cx="98" cy="118" r="15" stroke="currentColor" strokeWidth="7" fill="none"/>
      <line x1="136" y1="118" x2="242" y2="118" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
      <line x1="212" y1="118" x2="212" y2="144" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
      <line x1="232" y1="118" x2="232" y2="140" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
    </svg>
  ),

  // ── PROJECT MANAGEMENT ───────────────────────────────────────────────────
  project_mgmt: (
    <svg viewBox="0 0 500 500" fill="none">
      {[78,158,238,318,398].map((x,i) => <line key={i} x1={x} y1={78} x2={x} y2={452} stroke="currentColor" strokeWidth="4" opacity="0.18"/>)}
      <line x1="58" y1="78" x2="442" y2="78" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
      {[[78,320,'bar1'],[118,202,'bar2'],[158,402,'bar3'],[198,242,'bar4'],[238,322,'bar5'],[278,242,'bar6'],[318,402,'bar7']].map(([y,w,k],i) => <rect key={k} x={78+(i%3)*32} y={y as number} width={w as number} height={42} rx="6" stroke="currentColor" strokeWidth="8" fill="none" opacity={1-i*0.07}/>)}
      {[[238,128],[318,198],[398,128]].map(([x,y],i) => <rect key={i} x={x-15} y={y-15} width={30} height={30} stroke="currentColor" strokeWidth="8" fill="none" transform={`rotate(45 ${x} ${y})`} opacity="0.68"/>)}
      <path d="M318 148 L318 198 L362 198" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeDasharray="8 5" fill="none" opacity="0.48"/>
    </svg>
  ),

  // ── CREATIVE ─────────────────────────────────────────────────────────────
  creative: (
    <svg viewBox="0 0 500 500" fill="none">
      <path d="M118 402 L78 442 L128 432 Z" stroke="currentColor" strokeWidth="8" fill="currentColor" opacity="0.38"/>
      <path d="M128 432 L352 138 L310 98 L118 402 Z" stroke="currentColor" strokeWidth="10" fill="none" strokeLinejoin="round"/>
      <line x1="113" y1="417" x2="340" y2="123" stroke="currentColor" strokeWidth="5" opacity="0.38"/>
      <rect x="294" y="88" width="42" height="32" rx="4" stroke="currentColor" strokeWidth="8" fill="none" transform="rotate(-45 315 104)"/>
      <ellipse cx="382" cy="322" rx="92" ry="112" stroke="currentColor" strokeWidth="10" fill="none"/>
      {[[360,280],[407,302],[422,347],[402,387],[356,397]].map(([cx,cy],i) => <circle key={i} cx={cx} cy={cy} r="15" stroke="currentColor" strokeWidth="7" fill="none"/>)}
      <circle cx="348" cy="350" r="25" stroke="currentColor" strokeWidth="8" fill="none"/>
    </svg>
  ),

  // ── DEFAULT ───────────────────────────────────────────────────────────────
  default: (
    <svg viewBox="0 0 500 500" fill="none">
      {[[250,250],[174,206],[326,206],[250,162],[174,294],[326,294],[250,338],[98,250],[402,250]].map(([cx,cy],i) => (
        <polygon key={i} points={[0,60,120,180,240,300].map(a => { const r=a*Math.PI/180; return `${cx+42*Math.cos(r)},${cy+42*Math.sin(r)}` }).join(' ')} stroke="currentColor" strokeWidth="7" fill="none" opacity={0.82-i*0.07}/>
      ))}
    </svg>
  ),
}

export function IndustryWatermark({ group, size = 420 }: Props) {
  const svg = W[group] ?? W.default
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed', bottom: -40, right: -40,
        width: size, height: size,
        color: 'var(--brand, #0176D3)',
        opacity: 0.038,
        pointerEvents: 'none', userSelect: 'none', zIndex: 0,
      }}
    >
      {svg}
    </div>
  )
}
