'use client'
import React from 'react'
// @ts-nocheck
// ── app/page.tsx — VeSiMy Homepage ───────────────────────────────────────────

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { VLogoMark, VeSiMyWordmark, VesimyLogo } from '@/components/ui/Logo'
import { PLANS } from '@/lib/stripe'
import { CheckIcon, ArrowRightIcon } from '@/components/ui/Icons'

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

// ── Inline 3D VSM step box ────────────────────────────────────────────────────



// ── AudienceLine — static audience statement ─────────────────────────────────
function IndustryLoop() {
  const [idx, setIdx] = useState(0)
  const lines = [
    'Manufacturing · Logistics · Healthcare · Real Estate · Legal · Financial Services',
    'For lean engineers · CI coordinators · operations managers · quality teams',
    'Any process. Any industry. Any team size.',
  ]
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % lines.length), 3200)
    return () => clearInterval(t)
  }, [])
  return (
    <div style={{ marginBottom: 20, height: 18, overflow: 'hidden' }}>
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <span key={idx} style={{ fontSize: 11, color: 'rgba(1,118,211,0.7)', letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: 'monospace', fontWeight: 700, animation: 'slideUp 0.4s ease both', display: 'block' }}>
        {lines[idx]}
      </span>
    </div>
  )
}


// ── Tool Showcase ─────────────────────────────────────────────────────────────

const _G='#0176D3',_R='#C0402A',_GR='#2A9E82',_V='#6426A0',_ST='#3070B8'


// ── App-accurate popup HTML helpers ──────────────────────────────────────────
// Each popup mimics the actual VeSiMy app UI: exact colors, fonts, components.
// Screenshots can replace these <img> tags once captured.

const SHOWCASE_TOOLS=[
  {
    name:'Value Stream Map',short:'VSM',color:_ST,
    tag:'Core',tagBg:'#EEF4FB',tagTxt:'#1A4F8A',
    headline:'See your entire process at once',
    popup:`<div style="font-family:'Inter',sans-serif;background:#F8F6F0;min-height:200px">
      <div style="background:#242220;padding:8px 14px;display:flex;align-items:center;gap:8px;border-bottom:1px solid #353330">
        <div style="display:flex;gap:4px"><div style="width:8px;height:8px;border-radius:50%;background:#C0402A;opacity:.7"></div><div style="width:8px;height:8px;border-radius:50%;background:#0176D3;opacity:.7"></div><div style="width:8px;height:8px;border-radius:50%;background:#1DD1A1;opacity:.7"></div></div>
        <span style="font-size:10px;color:#8E8A82;font-family:monospace;flex:1;text-align:center">VSM Builder · Seat Assembly Line 4 · Current State</span>
        <span style="font-size:8px;font-weight:700;padding:2px 6px;border-radius:4px;background:#EEF4FB;color:#1A4F8A;font-family:monospace">ISO 22468</span>
      </div>
      <div style="display:flex;gap:0;padding:10px 12px 6px;border-bottom:1px solid #D8D5CE;background:#fff">
        <div style="flex:1;text-align:center;border-right:1px solid #E8E5E0;padding:0 8px"><div style="font-size:7px;color:#8E8A82;letter-spacing:.8px;font-family:monospace">TOTAL CT</div><div style="font-size:13px;font-weight:700;color:#0176D3;margin-top:2px">8m 14s</div></div>
        <div style="flex:1;text-align:center;border-right:1px solid #E8E5E0;padding:0 8px"><div style="font-size:7px;color:#8E8A82;letter-spacing:.8px;font-family:monospace">LEAD TIME</div><div style="font-size:13px;font-weight:700;color:#6B6760;margin-top:2px">14m 40s</div></div>
        <div style="flex:1;text-align:center;border-right:1px solid #E8E5E0;padding:0 8px"><div style="font-size:7px;color:#8E8A82;letter-spacing:.8px;font-family:monospace">TAKT</div><div style="font-size:13px;font-weight:700;color:#0176D3;margin-top:2px">2m 00s</div></div>
        <div style="flex:1;text-align:center;border-right:1px solid #E8E5E0;padding:0 8px"><div style="font-size:7px;color:#8E8A82;letter-spacing:.8px;font-family:monospace">PCE</div><div style="font-size:13px;font-weight:700;color:#C0402A;margin-top:2px">34%</div></div>
        <div style="flex:1.4;text-align:center;padding:0 8px"><div style="font-size:7px;color:#8E8A82;letter-spacing:.8px;font-family:monospace">BOTTLENECK</div><div style="font-size:11px;font-weight:700;color:#C0402A;margin-top:2px">Foam &amp; Fabric</div></div>
      </div>
      <div style="padding:10px 12px;overflow-x:auto">
        <svg viewBox="0 0 500 148" style="min-width:460px;display:block;background:#fff;border:1px solid #D8D5CE;border-radius:8px">
          <defs><marker id="vp" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto"><polygon points="0 0,5 2,0 4" fill="#374151"/></marker></defs>
          <rect x="8" y="8" width="40" height="30" fill="#5B7FA6" stroke="#3A5A7C" stroke-width="1" rx="1"/>
          <polygon points="8,17 28,8 48,17" fill="#4A6A8F"/>
          <text x="28" y="48" text-anchor="middle" fill="#1F2937" font-size="6" font-weight="700" font-family="sans-serif">Supplier</text>
          <line x1="48" y1="23" x2="63" y2="23" stroke="#374151" stroke-width="1" marker-end="url(#vp)"/>
          <g><rect x="64" y="8" width="60" height="40" fill="#CCFBF1" stroke="#0D9488" stroke-width="1" rx="1"/><text x="94" y="18" text-anchor="middle" fill="#065F46" font-size="7" font-weight="700">Staging</text><circle cx="78" cy="37" r="3.5" fill="#fff" stroke="#0D9488" stroke-width="0.8"/><circle cx="78" cy="34" r="2" fill="#0D9488"/><rect x="64" y="48" width="60" height="36" fill="#fff" stroke="#0D9488" stroke-width="1"/><text x="68" y="60" fill="#6B7280" font-size="6" font-family="monospace">C/T = 45s</text><text x="68" y="71" fill="#6B7280" font-size="6" font-family="monospace">C/O = 0s</text><text x="68" y="82" fill="#6B7280" font-size="6" font-family="monospace">Up = 95%</text></g>
          <polygon points="128,16 134,8 140,16" fill="#FEF3C7" stroke="#D97706" stroke-width="1"/><text x="134" y="14" text-anchor="middle" fill="#92400E" font-size="5" font-weight="700">12</text>
          <line x1="124" y1="28" x2="146" y2="28" stroke="#374151" stroke-width="1" marker-end="url(#vp)"/>
          <g><rect x="148" y="8" width="62" height="40" fill="#CCFBF1" stroke="#0D9488" stroke-width="1" rx="1"/><text x="179" y="18" text-anchor="middle" fill="#065F46" font-size="7" font-weight="700">Frame Asm</text><circle cx="162" cy="37" r="3.5" fill="#fff" stroke="#0D9488" stroke-width="0.8"/><circle cx="162" cy="34" r="2" fill="#0D9488"/><circle cx="172" cy="37" r="3.5" fill="#fff" stroke="#0D9488" stroke-width="0.8"/><circle cx="172" cy="34" r="2" fill="#0D9488"/><rect x="148" y="48" width="62" height="36" fill="#fff" stroke="#0D9488" stroke-width="1"/><text x="152" y="60" fill="#6B7280" font-size="6" font-family="monospace">C/T = 98s</text><text x="152" y="71" fill="#6B7280" font-size="6" font-family="monospace">C/O = 300s</text><text x="152" y="82" fill="#6B7280" font-size="6" font-family="monospace">Up = 92%</text></g>
          <polygon points="214,16 220,8 226,16" fill="#FEF3C7" stroke="#D97706" stroke-width="1"/><text x="220" y="14" text-anchor="middle" fill="#92400E" font-size="5" font-weight="700">6</text>
          <line x1="210" y1="28" x2="232" y2="28" stroke="#374151" stroke-width="1" marker-end="url(#vp)"/>
          <g><rect x="234" y="8" width="64" height="40" fill="#FEE2E2" stroke="#DC2626" stroke-width="2" rx="1"/><text x="266" y="17" text-anchor="middle" fill="#7F1D1D" font-size="6.5" font-weight="700">Foam &amp;</text><text x="266" y="25" text-anchor="middle" fill="#7F1D1D" font-size="6.5" font-weight="700">Fabric</text><text x="294" y="17" text-anchor="end" fill="#DC2626" font-size="5.5" font-weight="700">▲TAKT</text><circle cx="248" cy="37" r="3.5" fill="#fff" stroke="#DC2626" stroke-width="0.8"/><circle cx="248" cy="34" r="2" fill="#DC2626"/><circle cx="258" cy="37" r="3.5" fill="#fff" stroke="#DC2626" stroke-width="0.8"/><circle cx="258" cy="34" r="2" fill="#DC2626"/><circle cx="268" cy="37" r="3.5" fill="#fff" stroke="#DC2626" stroke-width="0.8"/><circle cx="268" cy="34" r="2" fill="#DC2626"/><rect x="234" y="48" width="64" height="36" fill="#fff" stroke="#DC2626" stroke-width="1"/><text x="238" y="60" fill="#6B7280" font-size="6" font-family="monospace">C/T =</text><text x="260" y="60" fill="#DC2626" font-size="6" font-weight="700" font-family="monospace">145s</text><text x="238" y="71" fill="#6B7280" font-size="6" font-family="monospace">C/O = 600s</text><text x="238" y="82" fill="#6B7280" font-size="6" font-family="monospace">Up = 88%</text></g>
          <polygon points="302,16 308,8 314,16" fill="#FEE2E2" stroke="#DC2626" stroke-width="1"/><text x="308" y="14" text-anchor="middle" fill="#7F1D1D" font-size="5" font-weight="700">18</text>
          <line x1="298" y1="28" x2="320" y2="28" stroke="#374151" stroke-width="1" marker-end="url(#vp)"/>
          <g><rect x="322" y="8" width="58" height="40" fill="#CCFBF1" stroke="#0D9488" stroke-width="1" rx="1"/><text x="351" y="18" text-anchor="middle" fill="#065F46" font-size="7" font-weight="700">Electrical</text><circle cx="336" cy="37" r="3.5" fill="#fff" stroke="#0D9488" stroke-width="0.8"/><circle cx="336" cy="34" r="2" fill="#0D9488"/><rect x="322" y="48" width="58" height="36" fill="#fff" stroke="#0D9488" stroke-width="1"/><text x="326" y="60" fill="#6B7280" font-size="6" font-family="monospace">C/T = 88s</text><text x="326" y="71" fill="#6B7280" font-size="6" font-family="monospace">C/O = 0s</text><text x="326" y="82" fill="#6B7280" font-size="6" font-family="monospace">Up = 99%</text></g>
          <line x1="380" y1="28" x2="398" y2="28" stroke="#374151" stroke-width="1" marker-end="url(#vp)"/>
          <g><rect x="400" y="8" width="52" height="40" fill="#CCFBF1" stroke="#0D9488" stroke-width="1" rx="1"/><text x="426" y="18" text-anchor="middle" fill="#065F46" font-size="7" font-weight="700">Final QC</text><circle cx="414" cy="37" r="3.5" fill="#fff" stroke="#0D9488" stroke-width="0.8"/><circle cx="414" cy="34" r="2" fill="#0D9488"/><rect x="400" y="48" width="52" height="36" fill="#fff" stroke="#0D9488" stroke-width="1"/><text x="404" y="60" fill="#6B7280" font-size="6" font-family="monospace">C/T = 72s</text><text x="404" y="71" fill="#6B7280" font-size="6" font-family="monospace">C/O = 0s</text><text x="404" y="82" fill="#6B7280" font-size="6" font-family="monospace">Up = 100%</text></g>
          <line x1="452" y1="28" x2="472" y2="28" stroke="#374151" stroke-width="1" marker-end="url(#vp)"/>
          <rect x="474" y="8" width="16" height="30" fill="#5B7FA6" stroke="#3A5A7C" stroke-width="1" rx="1"/>
          <text x="482" y="48" text-anchor="middle" fill="#1F2937" font-size="6" font-weight="700">Cust.</text>
          <line x1="94" y1="84" x2="94" y2="100"/><line x1="179" y1="84" x2="179" y2="100"/><line x1="266" y1="84" x2="266" y2="100"/><line x1="351" y1="84" x2="351" y2="100"/><line x1="426" y1="84" x2="426" y2="100"/>
          <line x1="58" y1="100" x2="94" y2="100" stroke="#0176D3" stroke-width="5" opacity=".7"/><text x="76" y="113" text-anchor="middle" fill="#8E8A82" font-size="5.5" font-family="monospace">45s</text>
          <line x1="94" y1="100" x2="148" y2="100" stroke="#8E8A82" stroke-width="2" opacity=".4"/>
          <line x1="148" y1="100" x2="179" y2="100" stroke="#0176D3" stroke-width="5" opacity=".7"/><text x="163" y="113" text-anchor="middle" fill="#8E8A82" font-size="5.5" font-family="monospace">98s</text>
          <line x1="179" y1="100" x2="234" y2="100" stroke="#8E8A82" stroke-width="2" opacity=".4"/>
          <line x1="234" y1="100" x2="266" y2="100" stroke="#DC2626" stroke-width="5" opacity=".7"/><text x="250" y="113" text-anchor="middle" fill="#DC2626" font-size="5.5" font-family="monospace" font-weight="700">145s</text>
          <line x1="266" y1="100" x2="322" y2="100" stroke="#8E8A82" stroke-width="2" opacity=".4"/>
          <line x1="322" y1="100" x2="351" y2="100" stroke="#0176D3" stroke-width="5" opacity=".7"/><text x="336" y="113" text-anchor="middle" fill="#8E8A82" font-size="5.5" font-family="monospace">88s</text>
          <line x1="351" y1="100" x2="400" y2="100" stroke="#8E8A82" stroke-width="2" opacity=".4"/>
          <line x1="400" y1="100" x2="426" y2="100" stroke="#0176D3" stroke-width="5" opacity=".7"/><text x="413" y="113" text-anchor="middle" fill="#8E8A82" font-size="5.5" font-family="monospace">72s</text>
          <line x1="426" y1="100" x2="460" y2="100" stroke="#0176D3" stroke-width="1"/>
          <line x1="58" y1="118" x2="460" y2="118" stroke="#C0402A" stroke-width="1" stroke-dasharray="4,3" opacity=".5"/>
          <text x="456" y="116" text-anchor="end" fill="#C0402A" font-size="5.5" font-family="monospace">TAKT=120s</text>
          <text x="250" y="136" text-anchor="middle" fill="#8E8A82" font-size="6" font-family="monospace">VA: 448s  |  Wait: 372s  |  PCE: 34%  |  Lead Time: 14m 40s</text>
        </svg>
      </div>
    </div>`,
    cardContent:`<div style="padding:8px 10px">
      <div style="font-size:7px;color:#8E8A82;font-family:monospace;letter-spacing:.8px;margin-bottom:5px">CURRENT STATE · 5 STEPS</div>
      <div style="display:flex;flex-direction:column;gap:3px">
        ${['Staging 45s','Frame Asm 98s','Foam/Fabric 145s ▲','Electrical 88s','Final QC 72s'].map((n,i)=>
          `<div style="display:flex;align-items:center;gap:4px"><div style="width:${[45,98,145,88,72][i]/1.8}px;height:8px;border-radius:2px;background:${i===2?'#C0402A':'#3070B8'};opacity:${i===2?1:.7}"></div><span style="font-size:7px;color:${i===2?'#C0402A':'#4E4B45'};font-family:monospace;font-weight:${i===2?700:400}">${n}</span></div>`
        ).join('')}
      </div>
      <div style="margin-top:6px;padding-top:5px;border-top:1px solid #E8E5E0;display:flex;gap:8px">
        <span style="font-size:7px;font-family:monospace;color:#C0402A;font-weight:700">PCE 34%</span>
        <span style="font-size:7px;font-family:monospace;color:#8E8A82">Takt 120s</span>
      </div>
    </div>`,
  },
  {
    name:'Time Study',short:'TIME',color:_GR,
    tag:'Free',tagBg:'#E6F7F3',tagTxt:'#0F6E56',
    headline:'Measure before you manage',
    popup:`<div style="font-family:'Inter',sans-serif;background:#F8F6F0">
      <div style="background:#242220;padding:8px 14px;display:flex;align-items:center;gap:8px;border-bottom:1px solid #353330">
        <div style="display:flex;gap:4px"><div style="width:8px;height:8px;border-radius:50%;background:#C0402A;opacity:.7"></div><div style="width:8px;height:8px;border-radius:50%;background:#0176D3;opacity:.7"></div><div style="width:8px;height:8px;border-radius:50%;background:#1DD1A1;opacity:.7"></div></div>
        <span style="font-size:10px;color:#8E8A82;font-family:monospace;flex:1;text-align:center">Time Study · Foam &amp; Fabric Install · Step 3</span>
      </div>
      <div style="padding:10px 14px">
        <div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:10px">
          <div style="flex:1">
            <div style="font-size:9px;color:#8E8A82;font-family:monospace;letter-spacing:.8px;margin-bottom:4px">LAP TIMES (seconds)</div>
            <div style="display:flex;flex-wrap:wrap;gap:4px">
              ${[142,148,145,150,143,146,144,149,145,147].map((v,i)=>`<div style="padding:3px 6px;border-radius:4px;background:${v>148?'rgba(192,64,42,.1)':'rgba(42,158,130,.1)'};border:1px solid ${v>148?'rgba(192,64,42,.3)':'rgba(42,158,130,.3)'};font-size:9px;font-weight:700;color:${v>148?'#C0402A':'#2A9E82'};font-family:monospace">${v}s</div>`).join('')}
            </div>
          </div>
          <div style="background:#fff;border:1px solid #D8D5CE;border-radius:8px;padding:8px 12px;text-align:center;min-width:80px">
            <div style="font-size:7px;color:#8E8A82;font-family:monospace;letter-spacing:.8px">MEAN CT</div>
            <div style="font-size:24px;font-weight:700;color:#C0402A;font-family:'Palatino Linotype',serif;line-height:1.1">145s</div>
            <div style="font-size:7px;color:#C0402A;font-weight:700;font-family:monospace">▲ 25s over Takt</div>
          </div>
        </div>
        <div style="background:#fff;border:1px solid #D8D5CE;border-radius:8px;overflow:hidden">
          <div style="padding:6px 10px;border-bottom:1px solid #E8E5E0;display:flex;gap:16px">
            <div><span style="font-size:7px;color:#8E8A82;font-family:monospace">BASELINE </span><span style="font-size:9px;font-weight:700;color:#6B6760;font-family:monospace">160s</span></div>
            <div><span style="font-size:7px;color:#8E8A82;font-family:monospace">TARGET </span><span style="font-size:9px;font-weight:700;color:#2A9E82;font-family:monospace">110s</span></div>
            <div><span style="font-size:7px;color:#8E8A82;font-family:monospace">STD DEV </span><span style="font-size:9px;font-weight:700;color:#4E4B45;font-family:monospace">2.4s</span></div>
            <div><span style="font-size:7px;color:#8E8A82;font-family:monospace">LAPS </span><span style="font-size:9px;font-weight:700;color:#4E4B45;font-family:monospace">10</span></div>
          </div>
          <div style="padding:8px 10px">
            <div style="display:flex;align-items:flex-end;gap:2px;height:40px">
              ${[142,148,145,150,143,146,144,149,145,147].map(v=>`<div style="flex:1;background:${v>148?'#C0402A':'#2A9E82'};opacity:.75;height:${(v-138)*4}px;border-radius:2px 2px 0 0;min-height:4px"></div>`).join('')}
            </div>
            <div style="height:1px;background:#C0402A;opacity:.4;margin:2px 0;position:relative"><span style="position:absolute;right:0;top:-10px;font-size:6px;color:#C0402A;font-family:monospace">Takt 120s</span></div>
          </div>
        </div>
      </div>
    </div>`,
    cardContent:`<div style="padding:8px 10px;font-family:monospace">
      <div style="font-size:7px;color:#8E8A82;letter-spacing:.8px;margin-bottom:6px">FOAM &amp; FABRIC — 10 LAPS</div>
      <div style="display:flex;align-items:flex-end;gap:2px;height:32px;margin-bottom:4px">
        ${[142,148,145,150,143,146,144,149,145,147].map(v=>`<div style="flex:1;background:${v>148?'#C0402A':'#2A9E82'};opacity:.7;height:${(v-138)*2.2}px;border-radius:1px 1px 0 0"></div>`).join('')}
      </div>
      <div style="display:flex;justify-content:space-between">
        <span style="font-size:8px;color:#C0402A;font-weight:700">Mean: 145s</span>
        <span style="font-size:8px;color:#8E8A82">Takt: 120s</span>
      </div>
    </div>`,
  },
  {
    name:'5 Why Analysis',short:'5WHY',color:_V,
    tag:'Free',tagBg:'#F0EEFE',tagTxt:'#6426A0',
    headline:'Find the root. Fix it once.',
    popup:`<div style="font-family:'Inter',sans-serif;background:#F8F6F0">
      <div style="background:#242220;padding:8px 14px;display:flex;align-items:center;gap:8px;border-bottom:1px solid #353330">
        <div style="display:flex;gap:4px"><div style="width:8px;height:8px;border-radius:50%;background:#C0402A;opacity:.7"></div><div style="width:8px;height:8px;border-radius:50%;background:#0176D3;opacity:.7"></div><div style="width:8px;height:8px;border-radius:50%;background:#1DD1A1;opacity:.7"></div></div>
        <span style="font-size:10px;color:#8E8A82;font-family:monospace;flex:1;text-align:center">5 Why Analysis · Foam &amp; Fabric · CT 25s over Takt</span>
      </div>
      <div style="padding:10px 14px">
        <div style="background:#F0EEFE;border:1px solid #C9A8F7;border-radius:8px;padding:8px 12px;margin-bottom:8px">
          <div style="font-size:7px;color:#6426A0;font-weight:700;font-family:monospace;letter-spacing:.8px;margin-bottom:3px">PROBLEM STATEMENT</div>
          <div style="font-size:11px;font-weight:600;color:#2A1A4E">Foam &amp; Fabric Install CT 145s is 25s over Takt time</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:0">
          ${[
            ['1','Why is CT 25s over Takt?','Operator walks 4m to foam rack (16s NVA) and waits 13s for partner every cycle.'],
            ['2','Why is the foam rack 4m away?','Line was laid out 3 years ago when foam was less frequently used. Never updated.'],
            ['3','Why was the layout never updated?','No formal process exists to review line-side storage when takt time changes.'],
            ['4','Why is there no formal review process?','Manufacturing Engineering is not part of the takt-time review cycle.'],
            ['5','Why is MFG Engineering excluded?','ROOT CAUSE: PFMEA gate does not require a material flow audit on takt revision.'],
          ].map(([n,q,a])=>`
          <div style="display:flex;gap:0;margin-bottom:0">
            <div style="display:flex;flex-direction:column;align-items:center;width:24px;flex-shrink:0">
              <div style="width:20px;height:20px;border-radius:50%;background:${n==='5'?'#C0402A':'#6426A0'};display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#fff;flex-shrink:0;margin-top:6px">${n}</div>
              ${n!=='5'?'<div style="width:2px;flex:1;background:#C9A8F7;min-height:8px;opacity:.5"></div>':''}
            </div>
            <div style="flex:1;padding:6px 8px;margin-bottom:4px;background:#fff;border:1px solid ${n==='5'?'rgba(192,64,42,.3)':'#E8E5E0'};border-radius:6px;margin-left:4px">
              <div style="font-size:8px;font-weight:700;color:#242220;margin-bottom:2px">${q}</div>
              <div style="font-size:9px;color:${n==='5'?'#C0402A':'#6B6760'};line-height:1.4;font-weight:${n==='5'?700:400}">${a}</div>
            </div>
          </div>`).join('')}
        </div>
        <div style="margin-top:6px;padding:8px 10px;background:rgba(192,64,42,.06);border:1px solid rgba(192,64,42,.2);border-radius:8px">
          <div style="font-size:7px;color:#C0402A;font-weight:700;font-family:monospace;letter-spacing:.8px;margin-bottom:3px">COUNTERMEASURE</div>
          <div style="font-size:9px;color:#242220">1. Update PFMEA to include material flow audit on takt revision. 2. Relocate foam rack within 0.5m immediately.</div>
          <div style="display:flex;gap:8px;margin-top:5px">
            <span style="font-size:8px;color:#6B6760;font-family:monospace">Owner: Manufacturing Engineering</span>
            <span style="font-size:8px;color:#C0402A;font-family:monospace">Due: April 15</span>
          </div>
        </div>
      </div>
    </div>`,
    cardContent:`<div style="padding:8px 10px">
      <div style="font-size:7px;color:#8E8A82;font-family:monospace;letter-spacing:.8px;margin-bottom:5px">5 WHY CHAIN</div>
      <div style="display:flex;flex-direction:column;gap:3px">
        ${['Walk to foam rack 16s NVA','Rack laid out 3 years ago','No layout review process','MFG Eng excluded from reviews','PFMEA gap — root cause ✓'].map((t,i)=>`
        <div style="display:flex;align-items:center;gap:4px">
          <div style="width:14px;height:14px;border-radius:50%;background:${i===4?'#C0402A':'#6426A0'};opacity:${1-i*0.15};display:flex;align-items:center;justify-content:center;font-size:6px;color:#fff;font-weight:700;flex-shrink:0">${i+1}</div>
          <span style="font-size:7px;color:${i===4?'#C0402A':'#4E4B45'};font-weight:${i===4?700:400};line-height:1.3">${t}</span>
        </div>`).join('')}
      </div>
    </div>`,
  },
  {
    name:'Fishbone Diagram',short:'FISH',color:_G,
    tag:'Free',tagBg:'#FDF5E0',tagTxt:'#8A6300',
    headline:'Every cause, every category',
    popup:`<div style="font-family:'Inter',sans-serif;background:#F8F6F0">
      <div style="background:#242220;padding:8px 14px;display:flex;align-items:center;gap:8px;border-bottom:1px solid #353330">
        <div style="display:flex;gap:4px"><div style="width:8px;height:8px;border-radius:50%;background:#C0402A;opacity:.7"></div><div style="width:8px;height:8px;border-radius:50%;background:#0176D3;opacity:.7"></div><div style="width:8px;height:8px;border-radius:50%;background:#1DD1A1;opacity:.7"></div></div>
        <span style="font-size:10px;color:#8E8A82;font-family:monospace;flex:1;text-align:center">Fishbone · Foam &amp; Fabric · 6M Framework</span>
      </div>
      <div style="padding:10px 14px">
        <div style="background:rgba(192,64,42,.06);border:1px solid rgba(192,64,42,.2);border-radius:6px;padding:6px 10px;margin-bottom:8px;text-align:center">
          <span style="font-size:7px;color:#C0402A;font-weight:700;font-family:monospace;letter-spacing:.8px">EFFECT: </span>
          <span style="font-size:9px;font-weight:600;color:#242220">Foam &amp; Fabric CT 145s exceeds Takt 120s — 3 seats/shift shortfall</span>
        </div>
        <svg viewBox="0 0 480 190" style="width:100%;display:block;background:#fff;border:1px solid #D8D5CE;border-radius:8px">
          <!-- spine -->
          <line x1="60" y1="95" x2="418" y2="95" stroke="#374151" stroke-width="2.5"/>
          <polygon points="414,91 424,95 414,99" fill="#374151"/>
          <!-- effect box -->
          <rect x="424" y="82" width="52" height="26" fill="#FEE2E2" stroke="#DC2626" stroke-width="1.5" rx="3"/>
          <text x="450" y="95" text-anchor="middle" fill="#7F1D1D" font-size="7" font-weight="700" font-family="system-ui,sans-serif">EFFECT</text>
          <!-- top category bones -->
          <line x1="80" y1="62" x2="80" y2="95" stroke="#0176D3" stroke-width="1.5" opacity=".8"/>
          <line x1="190" y1="62" x2="190" y2="95" stroke="#0176D3" stroke-width="1.5" opacity=".8"/>
          <line x1="300" y1="62" x2="300" y2="95" stroke="#0176D3" stroke-width="1.5" opacity=".8"/>
          <!-- bottom category bones -->
          <line x1="80" y1="95" x2="80" y2="128" stroke="#0176D3" stroke-width="1.5" opacity=".8"/>
          <line x1="190" y1="95" x2="190" y2="128" stroke="#0176D3" stroke-width="1.5" opacity=".8"/>
          <line x1="300" y1="95" x2="300" y2="128" stroke="#0176D3" stroke-width="1.5" opacity=".8"/>
          <!-- category labels -->
          <text x="80" y="55" text-anchor="middle" fill="#8A6300" font-size="7.5" font-weight="700" font-family="system-ui,sans-serif">Machine</text>
          <text x="190" y="55" text-anchor="middle" fill="#8A6300" font-size="7.5" font-weight="700" font-family="system-ui,sans-serif">Method</text>
          <text x="300" y="55" text-anchor="middle" fill="#8A6300" font-size="7.5" font-weight="700" font-family="system-ui,sans-serif">Material</text>
          <text x="80" y="143" text-anchor="middle" fill="#8A6300" font-size="7.5" font-weight="700" font-family="system-ui,sans-serif">Manpower</text>
          <text x="190" y="143" text-anchor="middle" fill="#8A6300" font-size="7.5" font-weight="700" font-family="system-ui,sans-serif">Measurement</text>
          <text x="300" y="143" text-anchor="middle" fill="#8A6300" font-size="7.5" font-weight="700" font-family="system-ui,sans-serif">Environment</text>
          <!-- top sub-causes -->
          <line x1="55" y1="68" x2="80" y2="68" stroke="#D4D0C8" stroke-width="1"/><text x="53" y="71" text-anchor="end" fill="#4E4B45" font-size="5.5" font-family="system-ui,sans-serif">No powered assist</text>
          <line x1="55" y1="78" x2="80" y2="78" stroke="#D4D0C8" stroke-width="1"/><text x="53" y="81" text-anchor="end" fill="#4E4B45" font-size="5.5" font-family="system-ui,sans-serif">Jig loosens</text>
          <line x1="165" y1="68" x2="190" y2="68" stroke="#D4D0C8" stroke-width="1"/><text x="163" y="71" text-anchor="end" fill="#4E4B45" font-size="5.5" font-family="system-ui,sans-serif">Rack 4m away</text>
          <line x1="165" y1="78" x2="190" y2="78" stroke="#D4D0C8" stroke-width="1"/><text x="163" y="81" text-anchor="end" fill="#C0402A" font-size="5.5" font-weight="700" font-family="system-ui,sans-serif">No SWS</text>
          <line x1="275" y1="68" x2="300" y2="68" stroke="#D4D0C8" stroke-width="1"/><text x="273" y="71" text-anchor="end" fill="#4E4B45" font-size="5.5" font-family="system-ui,sans-serif">Cover tight</text>
          <line x1="275" y1="78" x2="300" y2="78" stroke="#D4D0C8" stroke-width="1"/><text x="273" y="81" text-anchor="end" fill="#4E4B45" font-size="5.5" font-family="system-ui,sans-serif">Density varies</text>
          <!-- bottom sub-causes -->
          <line x1="55" y1="108" x2="80" y2="108" stroke="#D4D0C8" stroke-width="1"/><text x="53" y="111" text-anchor="end" fill="#4E4B45" font-size="5.5" font-family="system-ui,sans-serif">New ops 20% slower</text>
          <line x1="55" y1="118" x2="80" y2="118" stroke="#D4D0C8" stroke-width="1"/><text x="53" y="121" text-anchor="end" fill="#4E4B45" font-size="5.5" font-family="system-ui,sans-serif">LH/RH wait</text>
          <line x1="165" y1="108" x2="190" y2="108" stroke="#D4D0C8" stroke-width="1"/><text x="163" y="111" text-anchor="end" fill="#4E4B45" font-size="5.5" font-family="system-ui,sans-serif">No in-process CT</text>
          <line x1="165" y1="118" x2="190" y2="118" stroke="#D4D0C8" stroke-width="1"/><text x="163" y="121" text-anchor="end" fill="#4E4B45" font-size="5.5" font-family="system-ui,sans-serif">End-of-shift only</text>
          <line x1="275" y1="108" x2="300" y2="108" stroke="#D4D0C8" stroke-width="1"/><text x="273" y="111" text-anchor="end" fill="#4E4B45" font-size="5.5" font-family="system-ui,sans-serif">Cold stiffens foam</text>
          <line x1="275" y1="118" x2="300" y2="118" stroke="#D4D0C8" stroke-width="1"/><text x="273" y="121" text-anchor="end" fill="#4E4B45" font-size="5.5" font-family="system-ui,sans-serif">Seasonal variation</text>
        </svg>
      </div>
    </div>`,
    cardContent:`<div style="padding:8px 10px">
      <div style="font-size:7px;color:#8E8A82;font-family:monospace;letter-spacing:.8px;margin-bottom:4px">6M CAUSES MAPPED</div>
      <svg viewBox="0 0 180 80" style="width:100%;display:block">
        <line x1="20" y1="40" x2="160" y2="40" stroke="#374151" stroke-width="2"/>
        <polygon points="157,37 163,40 157,43" fill="#374151"/>
        ${[['Machine',40,1],['Method',90,1],['Material',135,1],['Manpower',40,-1],['Measure',90,-1],['Env',135,-1]].map(([n,x,d])=>`
        <line x1="${x}" y1="${40-(d as number)*14}" x2="${x}" y2="40" stroke="#0176D3" stroke-width="1.2" opacity=".8"/>
        <text x="${x}" y="${40-(d as number)*18}" text-anchor="middle" fill="#8A6300" font-size="5.5" font-weight="700">${n}</text>`).join('')}
      </svg>
      <div style="font-size:8px;color:#4E4B45;margin-top:3px;text-align:center">11 causes identified across 6M</div>
    </div>`,
  },
  {
    name:'Waste Identification',short:'WASTE',color:_R,
    tag:'Free',tagBg:'#FEF0ED',tagTxt:'#8A2A1A',
    headline:'Name it. Quantify it. Eliminate it.',
    popup:`<div style="font-family:'Inter',sans-serif;background:#F8F6F0">
      <div style="background:#242220;padding:8px 14px;display:flex;align-items:center;gap:8px;border-bottom:1px solid #353330">
        <div style="display:flex;gap:4px"><div style="width:8px;height:8px;border-radius:50%;background:#C0402A;opacity:.7"></div><div style="width:8px;height:8px;border-radius:50%;background:#0176D3;opacity:.7"></div><div style="width:8px;height:8px;border-radius:50%;background:#1DD1A1;opacity:.7"></div></div>
        <span style="font-size:10px;color:#8E8A82;font-family:monospace;flex:1;text-align:center">Waste ID · DOWNTIME · All Steps</span>
      </div>
      <div style="padding:10px 14px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
          ${[
            ['D','Defects','2.1% fabric mis-clip — rework 8 min avg','#C0402A'],
            ['O','Overproduction','—','#8E8A82'],
            ['W','Waiting','Operator waits 13s for LH/RH partner','#0176D3'],
            ['N','Non-Utilisation','No SWS — new ops 20% slower','#6426A0'],
            ['T','Transport','—','#8E8A82'],
            ['I','Inventory','WIP 8 units avg vs target 3','#1090D4'],
            ['M','Motion','4m walk to foam rack = 16s NVA','#C0402A'],
            ['E','Extra-Processing','Dual mutual check = 13s NNVA','#0176D3'],
          ].map(([l,name,desc,color])=>`
          <div style="padding:6px 8px;background:#fff;border:1px solid ${desc==='—'?'#E8E5E0':color+'33'};border-radius:6px">
            <div style="display:flex;align-items:center;gap:5px;margin-bottom:3px">
              <div style="width:16px;height:16px;border-radius:4px;background:${color};display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:800;color:#fff;flex-shrink:0">${l}</div>
              <span style="font-size:8px;font-weight:700;color:#242220">${name}</span>
            </div>
            <div style="font-size:7.5px;color:${desc==='—'?'#8E8A82':color};font-weight:${desc==='—'?400:500}">${desc}</div>
          </div>`).join('')}
        </div>
      </div>
    </div>`,
    cardContent:`<div style="padding:8px 10px">
      <div style="font-size:7px;color:#8E8A82;font-family:monospace;letter-spacing:.8px;margin-bottom:5px">DOWNTIME WASTE REGISTER</div>
      <div style="display:flex;flex-wrap:wrap;gap:3px">
        ${['D','O','W','N','T','I','M','E'].map((l,i)=>{const active=[0,2,3,6,7].includes(i);return`<div style="width:22px;height:22px;border-radius:4px;background:${active?'#C0402A':'#E8E5E0'};display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;color:${active?'#fff':'#B8B5AD'}">${l}</div>`}).join('')}
      </div>
      <div style="font-size:7.5px;color:#C0402A;font-weight:600;margin-top:5px">4 waste types active across 6 steps</div>
    </div>`,
  },
  {
    name:'Kaizen Events',short:'KAIZEN',color:_G,
    tag:'Free',tagBg:'#FDF5E0',tagTxt:'#8A6300',
    headline:'Track every improvement action',
    popup:`<div style="font-family:'Inter',sans-serif;background:#F8F6F0">
      <div style="background:#242220;padding:8px 14px;display:flex;align-items:center;gap:8px;border-bottom:1px solid #353330">
        <div style="display:flex;gap:4px"><div style="width:8px;height:8px;border-radius:50%;background:#C0402A;opacity:.7"></div><div style="width:8px;height:8px;border-radius:50%;background:#0176D3;opacity:.7"></div><div style="width:8px;height:8px;border-radius:50%;background:#1DD1A1;opacity:.7"></div></div>
        <span style="font-size:10px;color:#8E8A82;font-family:monospace;flex:1;text-align:center">Kaizen Events · Seat Assembly Line 4 · 4 open</span>
      </div>
      <div style="padding:10px 14px;display:flex;flex-direction:column;gap:6px">
        ${[
          ['KZ-001','Relocate foam rack to point of use','J. Patel','April 1','critical','in-progress'],
          ['KZ-002','Poka-yoke fabric clip alignment jig','S. Ahmed','May 1','high','open'],
          ['KZ-003','Create Standard Work Sheet for new operators','Team Lead','Mar 15','medium','complete'],
          ['KZ-004','Eliminate manual MES entry — auto-close on scan','IT / Quality','June 1','medium','open'],
        ].map(([id,title,owner,due,prio,status])=>`
        <div style="background:#fff;border:1px solid #D8D5CE;border-radius:8px;padding:8px 10px">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
            <span style="font-size:8px;font-weight:700;font-family:monospace;color:#8E8A82">${id}</span>
            <div style="flex:1;font-size:9px;font-weight:600;color:#242220">${title}</div>
            <div style="padding:2px 6px;border-radius:4px;font-size:7px;font-weight:700;font-family:monospace;background:${status==='complete'?'rgba(42,158,130,.12)':status==='in-progress'?'rgba(1,118,211,.12)':'rgba(108,185,252,.12)'};color:${status==='complete'?'#2A9E82':status==='in-progress'?'#0176D3':'#1A4F8A'}">${status.toUpperCase()}</div>
          </div>
          <div style="display:flex;gap:10px">
            <span style="font-size:7.5px;color:#8E8A82">Owner: ${owner}</span>
            <span style="font-size:7.5px;color:#8E8A82">Due: ${due}</span>
            <span style="font-size:7.5px;color:${prio==='critical'?'#C0402A':prio==='high'?'#0176D3':'#6B6760'};font-weight:${prio==='critical'?700:400}">${prio.toUpperCase()}</span>
          </div>
        </div>`).join('')}
      </div>
    </div>`,
    cardContent:`<div style="padding:8px 10px;display:flex;flex-direction:column;gap:4px">
      <div style="font-size:7px;color:#8E8A82;font-family:monospace;letter-spacing:.8px;margin-bottom:2px">4 EVENTS · 1 COMPLETE</div>
      ${[['KZ-001','Relocate foam rack','critical','in-progress'],['KZ-002','Clip poka-yoke jig','high','open'],['KZ-003','Standard Work Sheet','medium','complete'],['KZ-004','Auto-close MES entry','medium','open']].map(([id,t,p,s])=>`
      <div style="display:flex;align-items:center;gap:5px;padding:4px 6px;background:${s==='complete'?'rgba(42,158,130,.06)':'rgba(255,255,255,.8)'};border:1px solid ${s==='complete'?'rgba(42,158,130,.2)':'#E8E5E0'};border-radius:5px">
        <div style="width:6px;height:6px;border-radius:50%;background:${p==='critical'?'#C0402A':p==='high'?'#0176D3':'#8E8A82'};flex-shrink:0"></div>
        <span style="font-size:7px;color:#4E4B45;flex:1">${t}</span>
        <span style="font-size:6px;font-weight:700;color:${s==='complete'?'#2A9E82':s==='in-progress'?'#0176D3':'#8E8A82'};font-family:monospace">${s==='complete'?'DONE':s==='in-progress'?'WIP':'OPEN'}</span>
      </div>`).join('')}
    </div>`,
  },
  {
    name:'Yamazumi Chart',short:'YAM',color:'#1090D4',
    tag:'Free',tagBg:'#E6F3FB',tagTxt:'#0A5A8A',
    headline:'See every operator against Takt',
    popup:`<div style="font-family:'Inter',sans-serif;background:#F8F6F0">
      <div style="background:#242220;padding:8px 14px;display:flex;align-items:center;gap:8px;border-bottom:1px solid #353330">
        <div style="display:flex;gap:4px"><div style="width:8px;height:8px;border-radius:50%;background:#C0402A;opacity:.7"></div><div style="width:8px;height:8px;border-radius:50%;background:#0176D3;opacity:.7"></div><div style="width:8px;height:8px;border-radius:50%;background:#1DD1A1;opacity:.7"></div></div>
        <span style="font-size:10px;color:#8E8A82;font-family:monospace;flex:1;text-align:center">Yamazumi · Operator Balance Chart · Takt: 120s</span>
      </div>
      <div style="padding:10px 14px">
        <svg viewBox="0 0 460 180" style="width:100%;display:block;background:#fff;border:1px solid #D8D5CE;border-radius:8px">
          <line x1="40" y1="10" x2="40" y2="155" stroke="#D8D5CE" stroke-width="1"/>
          <line x1="40" y1="155" x2="450" y2="155" stroke="#D8D5CE" stroke-width="1"/>
          <line x1="40" y1="50" x2="450" y2="50" stroke="#C0402A" stroke-width="1.2" stroke-dasharray="5,4" opacity=".7"/>
          <text x="445" y="48" text-anchor="end" fill="#C0402A" font-size="7" font-weight="700" font-family="monospace">TAKT 120s</text>
          ${[10,20,30,10,20,30,10,20,30,10,20,30].map((v,i)=>`<text x="36" y="${155-i*10}" text-anchor="end" fill="#8E8A82" font-size="5.5" font-family="monospace">${i*10}</text>`).join('')}
          ${[
            {name:'Staging',va:35,nnva:7,nva:3,ct:45},
            {name:'Frame Asm',va:78,nnva:14,nva:6,ct:98},
            {name:'Foam/Fabric',va:98,nnva:28,nva:19,ct:145},
            {name:'Electrical',va:72,nnva:10,nva:6,ct:88},
            {name:'Final QC',va:58,nnva:10,nva:4,ct:72},
          ].map(({name,va,nnva,nva,ct},i)=>{
            const x=58+i*78, scale=1.05;
            const vaH=va*scale, nnvaH=nnva*scale, nvaH=nva*scale;
            const isOver=ct>120;
            return `
          <g>
            <rect x="${x}" y="${155-vaH}" width="54" height="${vaH}" fill="#1DD1A1" opacity=".75" rx="2"/>
            <rect x="${x}" y="${155-vaH-nnvaH}" width="54" height="${nnvaH}" fill="#0176D3" opacity=".75"/>
            <rect x="${x}" y="${155-vaH-nnvaH-nvaH}" width="54" height="${nvaH}" fill="#C0402A" opacity="${isOver?.9:.75}"/>
            ${isOver?`<rect x="${x}" y="${155-vaH-nnvaH-nvaH-4}" width="54" height="4" fill="#FF4444" opacity=".6" rx="1"/>
            <text x="${x+27}" y="${155-vaH-nnvaH-nvaH-6}" text-anchor="middle" fill="#C0402A" font-size="6.5" font-weight="700">▲ OVER</text>`:''}
            <text x="${x+27}" y="164" text-anchor="middle" fill="#4E4B45" font-size="6.5" font-weight="600">${name}</text>
            <text x="${x+27}" y="172" text-anchor="middle" fill="${isOver?'#C0402A':'#8E8A82'}" font-size="6" font-family="monospace" font-weight="${isOver?700:400}">${ct}s</text>
          </g>`;
          }).join('')}
          <rect x="300" y="15" width="8" height="8" fill="#1DD1A1" opacity=".75" rx="1"/><text x="312" y="22" fill="#4E4B45" font-size="6.5">Value-Add</text>
          <rect x="300" y="27" width="8" height="8" fill="#0176D3" opacity=".75" rx="1"/><text x="312" y="34" fill="#4E4B45" font-size="6.5">Necessary NVA</text>
          <rect x="300" y="39" width="8" height="8" fill="#C0402A" opacity=".75" rx="1"/><text x="312" y="46" fill="#4E4B45" font-size="6.5">Waste / NVA</text>
        </svg>
      </div>
    </div>`,
    cardContent:`<div style="padding:8px 10px">
      <div style="font-size:7px;color:#8E8A82;font-family:monospace;letter-spacing:.8px;margin-bottom:6px">OPERATOR BALANCE · TAKT 120s</div>
      <svg viewBox="0 0 200 72" style="width:100%;display:block">
        <line x1="10" y1="10" x2="10" y2="60" stroke="#D8D5CE" stroke-width="1"/>
        <line x1="10" y1="60" x2="198" y2="60" stroke="#D8D5CE" stroke-width="1"/>
        <line x1="10" y1="20" x2="198" y2="20" stroke="#C0402A" stroke-width="1" stroke-dasharray="3,2" opacity=".6"/>
        <text x="196" y="18" text-anchor="end" fill="#C0402A" font-size="5" font-family="monospace">TAKT</text>
        ${[{ct:45},{ct:98},{ct:145},{ct:88},{ct:72}].map(({ct},i)=>`
        <rect x="${18+i*36}" y="${60-ct*.3}" width="26" height="${ct*.3}" fill="${ct>120?'#C0402A':'#1090D4'}" opacity=".7" rx="1"/>
        <text x="${31+i*36}" y="67" text-anchor="middle" fill="${ct>120?'#C0402A':'#8E8A82'}" font-size="5" font-family="monospace" font-weight="${ct>120?700:400}">${ct}s</text>`).join('')}
      </svg>
    </div>`,
  },
  {
    name:'Gap Analysis',short:'GAP',color:'#6426A0',
    tag:'AI · Pro',tagBg:'#F0EEFE',tagTxt:'#6426A0',
    headline:'AI reads your data. You get the fix.',
    popup:`<div style="font-family:'Inter',sans-serif;background:#F8F6F0">
      <div style="background:#242220;padding:8px 14px;display:flex;align-items:center;gap:8px;border-bottom:1px solid #353330">
        <div style="display:flex;gap:4px"><div style="width:8px;height:8px;border-radius:50%;background:#C0402A;opacity:.7"></div><div style="width:8px;height:8px;border-radius:50%;background:#0176D3;opacity:.7"></div><div style="width:8px;height:8px;border-radius:50%;background:#1DD1A1;opacity:.7"></div></div>
        <span style="font-size:10px;color:#8E8A82;font-family:monospace;flex:1;text-align:center">Supe AI · Gap Analysis · Seat Assembly Line 4</span>
        <span style="font-size:8px;font-weight:700;padding:2px 6px;border-radius:4px;background:#F0EEFE;color:#6426A0;font-family:monospace">PRO</span>
      </div>
      <div style="padding:10px 14px">
        <div style="background:#F0EEFE;border:1px solid #C9A8F7;border-radius:8px;padding:8px 12px;margin-bottom:8px;display:flex;gap:8px;align-items:flex-start">
          <div style="width:28px;height:28px;border-radius:8px;background:#6426A0;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;color:#fff;font-family:monospace;flex-shrink:0">AI</div>
          <div>
            <div style="font-size:7px;color:#6426A0;font-weight:700;font-family:monospace;letter-spacing:.8px;margin-bottom:3px">SUPE — AI ANALYSIS</div>
            <div style="font-size:9px;color:#2A1A4E;line-height:1.5">Foam &amp; Fabric is 21% over Takt with 3 open Kaizen events and a confirmed root cause. Eliminate the 16s NVA foam rack walk <strong>before</strong> adding capacity — KZ-001 closes the gap without equipment spend. Projected CT after KZ-001: 129s. After KZ-002: 116s (within Takt).</div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px">
          ${[
            ['CRITICAL','Foam &amp; Fabric CT 145s — 21% over Takt','KZ-001 in progress. Root cause confirmed.'],
            ['WARNING','PCE 34% — world-class target is 95%','16 highest-priority NVA minutes identified'],
            ['WARNING','4 open Kaizen actions — 2 past due date','Assign owners and close KZ-002 first'],
            ['INFO','Material Staging CT at 45s has 40% NVA','Point-of-use improvement available Q2'],
          ].map(([sev,title,note])=>`
          <div style="background:#fff;border:1px solid ${sev==='CRITICAL'?'rgba(192,64,42,.3)':sev==='WARNING'?'rgba(1,118,211,.3)':'#E8E5E0'};border-radius:6px;padding:6px 10px">
            <div style="display:flex;align-items:center;gap:6px">
              <span style="font-size:7px;font-weight:700;font-family:monospace;color:${sev==='CRITICAL'?'#C0402A':sev==='WARNING'?'#0176D3':'#1A4F8A'};padding:1px 4px;border-radius:3px;background:${sev==='CRITICAL'?'rgba(192,64,42,.1)':sev==='WARNING'?'rgba(1,118,211,.1)':'rgba(26,79,138,.1)'}">${sev}</span>
              <span style="font-size:8.5px;font-weight:600;color:#242220;flex:1">${title}</span>
            </div>
            <div style="font-size:7.5px;color:#6B6760;margin-top:3px">${note}</div>
          </div>`).join('')}
        </div>
      </div>
    </div>`,
    cardContent:`<div style="padding:8px 10px;display:flex;flex-direction:column;gap:4px">
      <div style="font-size:7px;color:#8E8A82;font-family:monospace;letter-spacing:.8px;margin-bottom:2px">SUPE AI · 4 FINDINGS</div>
      ${[['CRITICAL','CT 145s — 21% over Takt'],['WARNING','PCE 34% vs 95% target'],['WARNING','4 open Kaizen actions'],['INFO','NVA reduction available']].map(([s,t])=>`
      <div style="display:flex;align-items:center;gap:4px;padding:3px 6px;background:#fff;border:1px solid ${s==='CRITICAL'?'rgba(192,64,42,.25)':s==='WARNING'?'rgba(1,118,211,.25)':'#E8E5E0'};border-radius:4px">
        <div style="width:5px;height:5px;border-radius:50%;background:${s==='CRITICAL'?'#C0402A':s==='WARNING'?'#0176D3':'#1090D4'};flex-shrink:0"></div>
        <span style="font-size:7px;color:#4E4B45">${t}</span>
      </div>`).join('')}
    </div>`,
  },
  {
    name:'A3 Report',short:'A3',color:'#2A9E82',
    tag:'Free',tagBg:'#E6F7F3',tagTxt:'#0F6E56',
    headline:'Export in one click',
    popup:`<div style="font-family:'Inter',sans-serif;background:#F8F6F0">
      <div style="background:#242220;padding:8px 14px;display:flex;align-items:center;gap:8px;border-bottom:1px solid #353330">
        <div style="display:flex;gap:4px"><div style="width:8px;height:8px;border-radius:50%;background:#C0402A;opacity:.7"></div><div style="width:8px;height:8px;border-radius:50%;background:#0176D3;opacity:.7"></div><div style="width:8px;height:8px;border-radius:50%;background:#1DD1A1;opacity:.7"></div></div>
        <span style="font-size:10px;color:#8E8A82;font-family:monospace;flex:1;text-align:center">A3 Report · Seat Assembly Line 4 · PDF Ready</span>
      </div>
      <div style="padding:10px 12px">
        <div style="background:#fff;border:1px solid #D8D5CE;border-radius:8px;overflow:hidden">
          <div style="background:#242220;padding:8px 12px;display:flex;justify-content:space-between;align-items:center">
            <div>
              <div style="font-size:9px;font-weight:700;color:#F8F7F5;font-family:'Palatino Linotype',serif">PROCESS IMPROVEMENT REPORT — A3</div>
              <div style="font-size:7px;color:#8E8A82;font-family:monospace;margin-top:2px">Seat Assembly Line 4 · Current State Analysis · March 2026</div>
            </div>
            <div style="font-size:7px;font-weight:700;color:#0176D3;font-family:monospace;padding:2px 6px;border:1px solid rgba(1,118,211,.4);border-radius:4px">ISO 9001:2015</div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0">
            <div style="padding:8px 10px;border-right:1px solid #E8E5E0;border-bottom:1px solid #E8E5E0">
              <div style="font-size:7px;color:#8E8A82;font-family:monospace;letter-spacing:.8px;margin-bottom:4px">BACKGROUND / PROBLEM</div>
              <div style="font-size:7.5px;color:#4E4B45;line-height:1.5">Foam &amp; Fabric Install CT 145s exceeds Takt 120s. Line producing 3 seats/shift below target. PCE 34% indicates significant waste opportunity.</div>
            </div>
            <div style="padding:8px 10px;border-bottom:1px solid #E8E5E0">
              <div style="font-size:7px;color:#8E8A82;font-family:monospace;letter-spacing:.8px;margin-bottom:4px">CURRENT CONDITION</div>
              <div style="display:flex;flex-direction:column;gap:2px">
                ${[['CT Bottleneck','145s (Takt 120s)','#C0402A'],['PCE','34%','#C0402A'],['Open Kaizen','4 events','#0176D3'],['Root Cause','PFMEA gap','#6426A0']].map(([k,v,c])=>`<div style="display:flex;justify-content:space-between"><span style="font-size:7.5px;color:#6B6760">${k}</span><span style="font-size:7.5px;font-weight:700;color:${c};font-family:monospace">${v}</span></div>`).join('')}
              </div>
            </div>
            <div style="padding:8px 10px;border-right:1px solid #E8E5E0;border-bottom:1px solid #E8E5E0">
              <div style="font-size:7px;color:#8E8A82;font-family:monospace;letter-spacing:.8px;margin-bottom:4px">ROOT CAUSE</div>
              <div style="font-size:7.5px;color:#4E4B45;line-height:1.5">PFMEA review gate does not mandate material flow audit on takt revision. Foam rack never relocated when CT/takt ratio deteriorated.</div>
            </div>
            <div style="padding:8px 10px;border-bottom:1px solid #E8E5E0">
              <div style="font-size:7px;color:#8E8A82;font-family:monospace;letter-spacing:.8px;margin-bottom:4px">COUNTERMEASURES</div>
              <div style="display:flex;flex-direction:column;gap:2px">
                ${['KZ-001: Relocate foam rack (Apr 1)','KZ-002: Clip poka-yoke jig (May 1)','Update PFMEA procedure (Apr 15)'].map((t,i)=>`<div style="display:flex;align-items:center;gap:4px"><div style="width:4px;height:4px;border-radius:50%;background:#2A9E82;flex-shrink:0"></div><span style="font-size:7.5px;color:#4E4B45">${t}</span></div>`).join('')}
              </div>
            </div>
            <div style="padding:8px 10px;grid-column:span 2">
              <div style="font-size:7px;color:#8E8A82;font-family:monospace;letter-spacing:.8px;margin-bottom:4px">TARGET vs ACTUAL</div>
              <div style="display:flex;gap:16px">
                ${[['CT Target','≤ 120s','145s','#C0402A'],['PCE Target','≥ 70%','34%','#C0402A'],['Kaizen Close','Apr 15','In progress','#0176D3']].map(([k,t,a,c])=>`<div><div style="font-size:7px;color:#8E8A82">${k}</div><div style="font-size:8px;color:#2A9E82;font-weight:700">${t}</div><div style="font-size:7.5px;color:${c}">${a}</div></div>`).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`,
    cardContent:`<div style="padding:8px 10px">
      <div style="font-size:7px;color:#8E8A82;font-family:monospace;letter-spacing:.8px;margin-bottom:5px">A3 REPORT — PDF READY</div>
      <div style="background:#242220;border-radius:6px;padding:6px 8px;margin-bottom:5px">
        <div style="font-size:7.5px;font-weight:700;color:#F8F7F5;font-family:'Palatino Linotype',serif;margin-bottom:3px">PROCESS IMPROVEMENT REPORT</div>
        <div style="display:flex;flex-direction:column;gap:2px">
          ${[['Background','Foam CT > Takt by 25s'],['Root Cause','PFMEA gap (5 Why)'],['Actions','4 Kaizen events'],['Target','CT ≤ 120s by May 1']].map(([k,v])=>`<div style="display:flex;justify-content:space-between"><span style="font-size:6px;color:#8E8A82;font-family:monospace">${k}</span><span style="font-size:6px;color:#C8C4BC;font-family:monospace">${v}</span></div>`).join('')}
        </div>
      </div>
      <div style="display:flex;gap:4px">
        <div style="flex:1;padding:3px 5px;background:rgba(42,158,130,.08);border:1px solid rgba(42,158,130,.2);border-radius:4px;text-align:center;font-size:7px;color:#2A9E82;font-weight:700">PDF</div>
        <div style="flex:1;padding:3px 5px;background:rgba(1,118,211,.08);border:1px solid rgba(1,118,211,.2);border-radius:4px;text-align:center;font-size:7px;color:#0176D3;font-weight:700">PRINT</div>
        <div style="flex:1;padding:3px 5px;background:rgba(108,185,252,.08);border:1px solid rgba(108,185,252,.2);border-radius:4px;text-align:center;font-size:7px;color:#1A4F8A;font-weight:700">SHARE</div>
      </div>
    </div>`,
  },
  {
    name:'PDCA Tracker',short:'PDCA',color:'#1DD1A1',
    tag:'Free',tagBg:'#E6FBF5',tagTxt:'#0F6E56',
    headline:'Plan. Do. Check. Act.',
    popup:`<div style="font-family:'Inter',sans-serif;background:#F8F6F0">
      <div style="background:#242220;padding:8px 14px;display:flex;align-items:center;gap:8px;border-bottom:1px solid #353330">
        <div style="display:flex;gap:4px"><div style="width:8px;height:8px;border-radius:50%;background:#C0402A;opacity:.7"></div><div style="width:8px;height:8px;border-radius:50%;background:#0176D3;opacity:.7"></div><div style="width:8px;height:8px;border-radius:50%;background:#1DD1A1;opacity:.7"></div></div>
        <span style="font-size:10px;color:#8E8A82;font-family:monospace;flex:1;text-align:center">PDCA Tracker · KZ-001 Foam Rack Relocation</span>
      </div>
      <div style="padding:10px 14px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
          ${[
            ['PLAN','Planning complete','Objective: CT ≤ 120s by relocating foam rack within 0.5m. Resources: 1 tech, 2 hrs. Target date: April 1.','#1090D4','DONE'],
            ['DO','Implementation in progress','Rack location marked, facilities relocation booked. Standard work updated. Operator briefing scheduled.','#0176D3','IN PROGRESS'],
            ['CHECK','Not started','Measure CT over 20 cycles post-relocation. Compare to 145s baseline. Check for secondary NVA.','#8E8A82','PENDING'],
            ['ACT','Not started','If CT ≤ 120s: update SOP and PFMEA. Replicate to Branch B foam station. Close KZ-001.','#8E8A82','PENDING'],
          ].map(([phase,sub,desc,color,status])=>`
          <div style="background:#fff;border:1px solid ${status==='DONE'?'rgba(16,144,212,.2)':status==='IN PROGRESS'?'rgba(1,118,211,.3)':'#E8E5E0'};border-radius:8px;padding:8px 10px">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px">
              <div style="width:28px;height:28px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;color:#fff">${phase}</div>
              <span style="font-size:7px;font-weight:700;font-family:monospace;color:${status==='DONE'?'#1090D4':status==='IN PROGRESS'?'#0176D3':'#8E8A82'};padding:1px 5px;border-radius:4px;background:${status==='DONE'?'rgba(16,144,212,.1)':status==='IN PROGRESS'?'rgba(1,118,211,.1)':'rgba(142,138,130,.1)'}">${status}</span>
            </div>
            <div style="font-size:8px;font-weight:700;color:#242220;margin-bottom:3px">${sub}</div>
            <div style="font-size:7.5px;color:#6B6760;line-height:1.4">${desc}</div>
          </div>`).join('')}
        </div>
      </div>
    </div>`,
    cardContent:`<div style="padding:8px 10px">
      <div style="font-size:7px;color:#8E8A82;font-family:monospace;letter-spacing:.8px;margin-bottom:6px">PDCA CYCLE STATUS</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">
        ${[['P','PLAN','#1090D4','DONE'],['D','DO','#0176D3','IN PROG'],['C','CHECK','#8E8A82','PENDING'],['A','ACT','#8E8A82','PENDING']].map(([l,name,c,s])=>`
        <div style="padding:5px 6px;background:${s==='DONE'?'rgba(16,144,212,.08)':s==='IN PROG'?'rgba(1,118,211,.08)':'rgba(255,255,255,.5)'};border:1px solid ${s==='DONE'?'rgba(16,144,212,.2)':s==='IN PROG'?'rgba(1,118,211,.2)':'#E8E5E0'};border-radius:6px">
          <div style="display:flex;align-items:center;gap:4px;margin-bottom:2px">
            <div style="width:14px;height:14px;border-radius:50%;background:${c};display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:800;color:#fff">${l}</div>
            <span style="font-size:7px;font-weight:700;color:#242220">${name}</span>
          </div>
          <span style="font-size:6px;font-weight:700;font-family:monospace;color:${c}">${s}</span>
        </div>`).join('')}
      </div>
    </div>`,
  },
]

// ── MultiDemoShowcase — 5 demo cards right + tool popup left ─────────────────
// Shows real app popup content for each industry demo.
// Clicking a demo card switches the main popup. Tool tabs switch tool views.

const DEMO_SHOWCASE = [
  {
    id:'mfg', code:'MFG', industry:'MANUFACTURING', color:'#3070B8',
    headline:'Seat Assembly Line 4',
    metric:'PCE 34%', metricLabel:'CURRENT STATE', metricColor:'#C0402A',
    chromTitle:'VSM Builder · Seat Assembly Line 4 · Current State',
    badge:'ISO 22468',
    tools:['VSM','TIME','5WHY','FISH','WASTE','KAIZEN','YAM','GAP','A3','PDCA'],
  },
  {
    id:'health', code:'HC', industry:'HEALTHCARE', color:'#2A9E82',
    headline:'Urgent Care Patient Flow',
    metric:'3.2 hr', metricLabel:'DOOR-TO-DISCHARGE', metricColor:'#C0402A',
    chromTitle:'VSM · Urgent Care Patient Flow · Current State',
    badge:'7 Steps',
    tools:['VSM','5WHY','WASTE','KAIZEN','GAP'],
  },
  {
    id:'re', code:'RE', industry:'REAL ESTATE', color:'#0176D3',
    headline:'Transaction Flow',
    metric:'28%', metricLabel:'DOC KICKBACK RATE', metricColor:'#C0402A',
    chromTitle:'VSM · Real Estate Transaction Flow · Current State',
    badge:'7 Steps',
    tools:['VSM','5WHY','WASTE','KAIZEN'],
  },
  {
    id:'brew', code:'CBR', industry:'CRAFT BREWERY', color:'#C0402A',
    headline:'Batch Production — 10 bbl',
    metric:'4→5', metricLabel:'BATCHES/WEEK GAP', metricColor:'#C0402A',
    chromTitle:'VSM · Craft Brewery Batch Production · 10bbl',
    badge:'8 Steps',
    tools:['VSM','5WHY','WASTE','KAIZEN'],
  },
  {
    id:'wine', code:'WIN', industry:'WINERY', color:'#6426A0',
    headline:'Boutique Wine Production',
    metric:'6%', metricLabel:'BARREL DEFECT RATE', metricColor:'#C0402A',
    chromTitle:'VSM · Boutique Winery · 2,000 cases/yr',
    badge:'8 Steps',
    tools:['VSM','5WHY','KAIZEN'],
  },
]

// Popup HTML per demo+tool — real app data
function getDemoPopup(demoId: string, tool: string): string {
  // Manufacturing uses the full SHOWCASE_TOOLS data
  if (demoId === 'mfg') {
    const t = SHOWCASE_TOOLS.find(t => t.short === tool) || SHOWCASE_TOOLS[0]
    return t.popup
  }
  // Healthcare
  if (demoId === 'health') {
    if (tool === 'VSM') return `<div style="font-family:'Inter',sans-serif;background:#F8F6F0"><div style="background:#242220;padding:8px 14px;display:flex;align-items:center;gap:8px;border-bottom:1px solid #353330"><div style="display:flex;gap:4px"><div style="width:8px;height:8px;border-radius:50%;background:#C0402A;opacity:.7"></div><div style="width:8px;height:8px;border-radius:50%;background:#0176D3;opacity:.7"></div><div style="width:8px;height:8px;border-radius:50%;background:#1DD1A1;opacity:.7"></div></div><span style="font-size:10px;color:#8E8A82;font-family:monospace;flex:1;text-align:center">VSM · Urgent Care Patient Flow</span></div><div style="display:flex;gap:0;padding:8px 10px;border-bottom:1px solid #D8D5CE;background:#fff"><div style="flex:1;text-align:center;border-right:1px solid #E8E5E0;padding:0 6px"><div style="font-size:7px;color:#8E8A82;letter-spacing:.8px;font-family:monospace">TAKT</div><div style="font-size:12px;font-weight:700;color:#0176D3;margin-top:2px">45 min</div></div><div style="flex:1;text-align:center;border-right:1px solid #E8E5E0;padding:0 6px"><div style="font-size:7px;color:#8E8A82;letter-spacing:.8px;font-family:monospace">LEAD TIME</div><div style="font-size:12px;font-weight:700;color:#C0402A;margin-top:2px">192 min</div></div><div style="flex:1.4;text-align:center;padding:0 6px"><div style="font-size:7px;color:#8E8A82;letter-spacing:.8px;font-family:monospace">BOTTLENECK</div><div style="font-size:10px;font-weight:700;color:#C0402A;margin-top:2px">Treatment 52 min</div></div></div><div style="padding:8px 10px">${[['Patient Arrival','8 min','480 min',false],['Triage & Acuity','6 min','18 min',false],['Vitals & Assessment','12 min','25 min',false],['Physician Assessment','18 min','35 min',false],['Diagnostics — Lab','45 min','30 min',false],['Treatment','52 min','15 min',true],['Discharge & Docs','18 min','22 min',false]].map(([n,ct,wt,bad])=>`<div style="display:flex;align-items:center;gap:8px;padding:4px 8px;margin-bottom:3px;background:${bad?'rgba(192,64,42,.06)':'#fff'};border:1px solid ${bad?'rgba(192,64,42,.3)':'#E8E5E0'};border-radius:6px"><span style="font-size:8px;color:#4E4B45;flex:1;font-weight:${bad?700:400}">${n}</span><span style="font-size:8px;font-weight:700;color:${bad?'#C0402A':'#2A9E82'};font-family:monospace">CT: ${ct}</span><span style="font-size:8px;color:#8E8A82;font-family:monospace">Wait: ${wt}</span></div>`).join('')}</div></div>`
    if (tool === 'GAP') return `<div style="font-family:'Inter',sans-serif;background:#F8F6F0"><div style="background:#242220;padding:8px 14px;display:flex;align-items:center;gap:8px;border-bottom:1px solid #353330"><div style="display:flex;gap:4px"><div style="width:8px;height:8px;border-radius:50%;background:#C0402A;opacity:.7"></div><div style="width:8px;height:8px;border-radius:50%;background:#0176D3;opacity:.7"></div><div style="width:8px;height:8px;border-radius:50%;background:#1DD1A1;opacity:.7"></div></div><span style="font-size:10px;color:#8E8A82;font-family:monospace;flex:1;text-align:center">Supe AI · Urgent Care Patient Flow</span><span style="font-size:8px;font-weight:700;padding:2px 6px;border-radius:4px;background:#F0EEFE;color:#6426A0;font-family:monospace">PRO</span></div><div style="padding:10px 14px"><div style="background:#F0EEFE;border:1px solid #C9A8F7;border-radius:8px;padding:8px 12px;margin-bottom:8px;display:flex;gap:8px"><div style="width:26px;height:26px;border-radius:8px;background:#6426A0;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:800;color:#fff;font-family:monospace;flex-shrink:0">AI</div><div><div style="font-size:7px;color:#6426A0;font-weight:700;font-family:monospace;margin-bottom:3px">SUPE — AI ANALYSIS</div><div style="font-size:9px;color:#2A1A4E;line-height:1.5">Door-to-discharge averages 3.2 hours — 1.2 hrs over target. Root cause: demand-matched staffing gaps on Mon/Fri 4-8pm surges. Staff observe the problem daily but no data mechanism exists to escalate it.</div></div></div>${[['CRITICAL','Treatment CT 52 min vs 45-min Takt','Point-of-care medication saves 8 min. Concurrent discharge docs saves 22 min.'],['CRITICAL','Physician wait 35 min during surge hours','Mon/Fri 4-8pm surge not reflected in staffing schedule'],['WARNING','72-hour return rate 8%','Discharge documentation quality — missed instructions'],['INFO','Lab turnaround 35–90 min variation','CT scanner backlog peaks on high-volume days']].map(([s,t,n])=>`<div style="background:#fff;border:1px solid ${s==='CRITICAL'?'rgba(192,64,42,.3)':s==='WARNING'?'rgba(1,118,211,.3)':'#E8E5E0'};border-radius:6px;padding:6px 10px;margin-bottom:4px"><div style="display:flex;align-items:center;gap:6px"><span style="font-size:7px;font-weight:700;font-family:monospace;color:${s==='CRITICAL'?'#C0402A':s==='WARNING'?'#0176D3':'#1A4F8A'};padding:1px 4px;border-radius:3px;background:${s==='CRITICAL'?'rgba(192,64,42,.1)':s==='WARNING'?'rgba(1,118,211,.1)':'rgba(26,79,138,.1)'}">${s}</span><span style="font-size:8.5px;font-weight:600;color:#242220;flex:1">${t}</span></div><div style="font-size:7.5px;color:#6B6760;margin-top:3px">${n}</div></div>`).join('')}</div></div>`
  }
  // Real Estate
  if (demoId === 're') {
    if (tool === 'VSM') return `<div style="font-family:'Inter',sans-serif;background:#F8F6F0"><div style="background:#242220;padding:8px 14px;display:flex;align-items:center;gap:8px;border-bottom:1px solid #353330"><div style="display:flex;gap:4px"><div style="width:8px;height:8px;border-radius:50%;background:#C0402A;opacity:.7"></div><div style="width:8px;height:8px;border-radius:50%;background:#0176D3;opacity:.7"></div><div style="width:8px;height:8px;border-radius:50%;background:#1DD1A1;opacity:.7"></div></div><span style="font-size:10px;color:#8E8A82;font-family:monospace;flex:1;text-align:center">VSM · Real Estate Transaction Flow</span></div><div style="display:flex;gap:0;padding:8px 10px;border-bottom:1px solid #D8D5CE;background:#fff"><div style="flex:1;text-align:center;border-right:1px solid #E8E5E0;padding:0 6px"><div style="font-size:7px;color:#8E8A82;letter-spacing:.8px;font-family:monospace">LEAD TIME</div><div style="font-size:12px;font-weight:700;color:#C0402A;margin-top:2px">~45 days</div></div><div style="flex:1;text-align:center;border-right:1px solid #E8E5E0;padding:0 6px"><div style="font-size:7px;color:#8E8A82;letter-spacing:.8px;font-family:monospace">KICKBACK RATE</div><div style="font-size:12px;font-weight:700;color:#C0402A;margin-top:2px">28%</div></div><div style="flex:1.4;text-align:center;padding:0 6px"><div style="font-size:7px;color:#8E8A82;letter-spacing:.8px;font-family:monospace">BOTTLENECK</div><div style="font-size:10px;font-weight:700;color:#C0402A;margin-top:2px">Financing 10+ days</div></div></div><div style="padding:8px 10px">${[['Lead Inquiry','25 min','8 hr','0%',false],['Qualify & Consult','90 min','2 days','15% unqualif.',false],['Property Search','8 hrs','1 day','—',false],['Offer & Negotiation','2 hrs','2 days','35% rejected',false],['Inspection & Appraisal','4 hrs','5 days','22% renegotiate',false],['Financing & Underwriting','10 hrs','10 days','28% kickback',true],['Closing & Handover','3 hrs','2 days','5% fall-through',false]].map(([n,ct,wt,d,bad])=>`<div style="display:flex;align-items:center;gap:8px;padding:4px 8px;margin-bottom:3px;background:${bad?'rgba(192,64,42,.06)':'#fff'};border:1px solid ${bad?'rgba(192,64,42,.3)':'#E8E5E0'};border-radius:6px"><span style="font-size:8px;color:#4E4B45;flex:1;font-weight:${bad?700:400}">${n}</span><span style="font-size:8px;font-weight:700;color:${bad?'#C0402A':'#2A9E82'};font-family:monospace">CT: ${ct}</span><span style="font-size:7px;color:#C0402A;font-family:monospace">${d}</span></div>`).join('')}</div></div>`
    if (tool === '5WHY') return `<div style="font-family:'Inter',sans-serif;background:#F8F6F0"><div style="background:#242220;padding:8px 14px;display:flex;align-items:center;gap:8px;border-bottom:1px solid #353330"><div style="display:flex;gap:4px"><div style="width:8px;height:8px;border-radius:50%;background:#C0402A;opacity:.7"></div><div style="width:8px;height:8px;border-radius:50%;background:#0176D3;opacity:.7"></div><div style="width:8px;height:8px;border-radius:50%;background:#1DD1A1;opacity:.7"></div></div><span style="font-size:10px;color:#8E8A82;font-family:monospace;flex:1;text-align:center">5 Why · 28% Document Kickback Rate</span></div><div style="padding:10px 14px"><div style="background:#FDF5E0;border:1px solid rgba(1,118,211,.4);border-radius:8px;padding:8px 12px;margin-bottom:8px"><div style="font-size:7px;color:#8A6300;font-weight:700;font-family:monospace;margin-bottom:3px">PROBLEM STATEMENT</div><div style="font-size:11px;font-weight:600;color:#4A3000">28% of financing files kicked back — adds 3-5 days per transaction</div></div>${[['1','Why are 28% of files kicked back?','Files submitted before all required documents collected and verified.'],['2','Why before complete?','No standardised pre-submission checklist. Each agent assembles files differently.'],['3','Why no checklist?','Lender requirements vary by loan type — no master checklist built per type.'],['4','Why no master checklist?','No formal process owner for transaction coordination workflows.'],['5','Why no process owner?','ROOT CAUSE: The brokerage treats every transaction as one-off agent work. No standard work exists.']].map(([n,q,a])=>`<div style="display:flex;gap:0;margin-bottom:0"><div style="display:flex;flex-direction:column;align-items:center;width:24px;flex-shrink:0"><div style="width:20px;height:20px;border-radius:50%;background:${n==='5'?'#C0402A':'#0176D3'};display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#fff;flex-shrink:0;margin-top:6px">${n}</div>${n!=='5'?'<div style="width:2px;flex:1;background:rgba(1,118,211,.4);min-height:8px"></div>':''}</div><div style="flex:1;padding:6px 8px;margin-bottom:4px;background:#fff;border:1px solid ${n==='5'?'rgba(192,64,42,.3)':'#E8E5E0'};border-radius:6px;margin-left:4px"><div style="font-size:8px;font-weight:700;color:#242220;margin-bottom:2px">${q}</div><div style="font-size:9px;color:${n==='5'?'#C0402A':'#6B6760'};line-height:1.4;font-weight:${n==='5'?700:400}">${a}</div></div></div>`).join('')}</div></div>`
  }
  // Brewery
  if (demoId === 'brew') {
    if (tool === 'VSM') return `<div style="font-family:'Inter',sans-serif;background:#F8F6F0"><div style="background:#242220;padding:8px 14px;display:flex;align-items:center;gap:8px;border-bottom:1px solid #353330"><div style="display:flex;gap:4px"><div style="width:8px;height:8px;border-radius:50%;background:#C0402A;opacity:.7"></div><div style="width:8px;height:8px;border-radius:50%;background:#0176D3;opacity:.7"></div><div style="width:8px;height:8px;border-radius:50%;background:#1DD1A1;opacity:.7"></div></div><span style="font-size:10px;color:#8E8A82;font-family:monospace;flex:1;text-align:center">VSM · Craft Brewery Batch Production — 10bbl</span></div><div style="display:flex;gap:0;padding:8px 10px;border-bottom:1px solid #D8D5CE;background:#fff"><div style="flex:1;text-align:center;border-right:1px solid #E8E5E0;padding:0 6px"><div style="font-size:7px;color:#8E8A82;letter-spacing:.8px;font-family:monospace">THROUGHPUT</div><div style="font-size:12px;font-weight:700;color:#C0402A;margin-top:2px">4 batch/wk</div></div><div style="flex:1;text-align:center;border-right:1px solid #E8E5E0;padding:0 6px"><div style="font-size:7px;color:#8E8A82;letter-spacing:.8px;font-family:monospace">TARGET</div><div style="font-size:12px;font-weight:700;color:#2A9E82;margin-top:2px">5 batch/wk</div></div><div style="flex:1.4;text-align:center;padding:0 6px"><div style="font-size:7px;color:#8E8A82;letter-spacing:.8px;font-family:monospace">CONSTRAINT</div><div style="font-size:10px;font-weight:700;color:#C0402A;margin-top:2px">6 Fermenters — 6 day</div></div></div><div style="padding:8px 10px">${[['Grain Receiving & Milling','90 min','1,440 min','1% moisture reject',false],['Mashing & Lautering','120 min','30 min','3% stuck sparge',false],['Boil & Hop Addition','75 min','15 min','2% hop adjust',false],['Whirlpool, Chill & Transfer','45 min','10 min','',false],['Fermentation','6 days','—','4% off-flavour',true],['Conditioning & Dry Hop','3 days','—','2% extended',false],['Packaging — Can/Keg','4 hrs','60 min','3% underfill — seamer',false]].map(([n,ct,wt,d,bad])=>`<div style="display:flex;align-items:center;gap:8px;padding:4px 8px;margin-bottom:3px;background:${bad?'rgba(192,64,42,.06)':'#fff'};border:1px solid ${bad?'rgba(192,64,42,.3)':'#E8E5E0'};border-radius:6px"><span style="font-size:8px;color:#4E4B45;flex:1;font-weight:${bad?700:400}">${n}</span><span style="font-size:8px;font-weight:700;color:${bad?'#C0402A':'#2A9E82'};font-family:monospace">${ct}</span><span style="font-size:7px;color:#C0402A;font-family:monospace">${d}</span></div>`).join('')}</div></div>`
    if (tool === '5WHY') return `<div style="font-family:'Inter',sans-serif;background:#F8F6F0"><div style="background:#242220;padding:8px 14px;display:flex;align-items:center;gap:8px;border-bottom:1px solid #353330"><div style="display:flex;gap:4px"><div style="width:8px;height:8px;border-radius:50%;background:#C0402A;opacity:.7"></div><div style="width:8px;height:8px;border-radius:50%;background:#0176D3;opacity:.7"></div><div style="width:8px;height:8px;border-radius:50%;background:#1DD1A1;opacity:.7"></div></div><span style="font-size:10px;color:#8E8A82;font-family:monospace;flex:1;text-align:center">5 Why · 3% Stuck Sparge — Rye &amp; Wheat Batches</span></div><div style="padding:10px 14px"><div style="background:#FEF0ED;border:1px solid rgba(192,64,42,.3);border-radius:8px;padding:8px 12px;margin-bottom:8px"><div style="font-size:7px;color:#8A2A1A;font-weight:700;font-family:monospace;margin-bottom:3px">PROBLEM STATEMENT</div><div style="font-size:11px;font-weight:600;color:#4A1200">3% of batches stuck sparge — adds 45 min rework, delays downstream schedule</div></div>${[['1','Why do batches get stuck sparge?','High-adjunct grain bills (rye, oats, wheat) create dense grain bed restricting wort flow.'],['2','Why do high-adjunct bills restrict flow?','Rice hulls not added to these grists. Recipe sheet does not specify rice hull addition.'],['3','Why don\'t recipe sheets specify rice hulls?','Recipes were written for the 3-barrel system. Equipment changed to 10-barrel but recipes weren\'t updated.'],['4','Why weren\'t recipes updated?','No formal recipe scale-up review. Head brewer carried the adjustment in memory only.'],['5','Why not documented?','ROOT CAUSE: No recipe management system with equipment-specific parameters. Recipes in Google Docs with no version control.']].map(([n,q,a])=>`<div style="display:flex;gap:0;margin-bottom:0"><div style="display:flex;flex-direction:column;align-items:center;width:24px;flex-shrink:0"><div style="width:20px;height:20px;border-radius:50%;background:${n==='5'?'#C0402A':'#0176D3'};display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#fff;flex-shrink:0;margin-top:6px">${n}</div>${n!=='5'?'<div style="width:2px;flex:1;background:rgba(1,118,211,.4);min-height:8px"></div>':''}</div><div style="flex:1;padding:6px 8px;margin-bottom:4px;background:#fff;border:1px solid ${n==='5'?'rgba(192,64,42,.3)':'#E8E5E0'};border-radius:6px;margin-left:4px"><div style="font-size:8px;font-weight:700;color:#242220;margin-bottom:2px">${q}</div><div style="font-size:9px;color:${n==='5'?'#C0402A':'#6B6760'};line-height:1.4;font-weight:${n==='5'?700:400}">${a}</div></div></div>`).join('')}</div></div>`
  }
  // Winery
  if (demoId === 'wine') {
    if (tool === 'VSM') return `<div style="font-family:'Inter',sans-serif;background:#F8F6F0"><div style="background:#242220;padding:8px 14px;display:flex;align-items:center;gap:8px;border-bottom:1px solid #353330"><div style="display:flex;gap:4px"><div style="width:8px;height:8px;border-radius:50%;background:#C0402A;opacity:.7"></div><div style="width:8px;height:8px;border-radius:50%;background:#0176D3;opacity:.7"></div><div style="width:8px;height:8px;border-radius:50%;background:#1DD1A1;opacity:.7"></div></div><span style="font-size:10px;color:#8E8A82;font-family:monospace;flex:1;text-align:center">VSM · Boutique Winery · 2,000 cases/year</span></div><div style="display:flex;gap:0;padding:8px 10px;border-bottom:1px solid #D8D5CE;background:#fff"><div style="flex:1;text-align:center;border-right:1px solid #E8E5E0;padding:0 6px"><div style="font-size:7px;color:#8E8A82;letter-spacing:.8px;font-family:monospace">LEAD TIME</div><div style="font-size:12px;font-weight:700;color:#C0402A;margin-top:2px">~18 months</div></div><div style="flex:1;text-align:center;border-right:1px solid #E8E5E0;padding:0 6px"><div style="font-size:7px;color:#8E8A82;letter-spacing:.8px;font-family:monospace">BARRELS</div><div style="font-size:12px;font-weight:700;color:#0176D3;margin-top:2px">80 — full</div></div><div style="flex:1.4;text-align:center;padding:0 6px"><div style="font-size:7px;color:#8E8A82;letter-spacing:.8px;font-family:monospace">DEFECT RATE</div><div style="font-size:10px;font-weight:700;color:#C0402A;margin-top:2px">6% TCA/high VA</div></div></div><div style="padding:8px 10px">${[['Harvest & Vineyard Receiving','8 hrs','24 hrs','8% fruit rejected',false],['Destemming & Crush','2 hrs','2 hrs','2% SO₂ error',false],['Primary Alcoholic Fermentation','20 days','—','5% off-aromas',false],['Pressing & Free-Run Sep.','3 hrs','12 hrs','3% blend error',false],['Malolactic Fermentation','45 days','—','8% incomplete ML',false],['Barrel Ageing & Topping','15 months','—','6% TCA/high VA',true],['Blending & Filtration','4 hrs','30 days','4% reformulation',false],['Bottling & Labelling','6 hrs','48 hrs','4% label errors',false]].map(([n,ct,wt,d,bad])=>`<div style="display:flex;align-items:center;gap:8px;padding:4px 8px;margin-bottom:3px;background:${bad?'rgba(100,38,160,.06)':'#fff'};border:1px solid ${bad?'rgba(100,38,160,.3)':'#E8E5E0'};border-radius:6px"><span style="font-size:8px;color:#4E4B45;flex:1;font-weight:${bad?700:400}">${n}</span><span style="font-size:8px;font-weight:700;color:${bad?'#6426A0':'#2A9E82'};font-family:monospace">${ct}</span><span style="font-size:7px;color:#C0402A;font-family:monospace">${d}</span></div>`).join('')}</div></div>`
    if (tool === '5WHY') return `<div style="font-family:'Inter',sans-serif;background:#F8F6F0"><div style="background:#242220;padding:8px 14px;display:flex;align-items:center;gap:8px;border-bottom:1px solid #353330"><div style="display:flex;gap:4px"><div style="width:8px;height:8px;border-radius:50%;background:#C0402A;opacity:.7"></div><div style="width:8px;height:8px;border-radius:50%;background:#0176D3;opacity:.7"></div><div style="width:8px;height:8px;border-radius:50%;background:#1DD1A1;opacity:.7"></div></div><span style="font-size:10px;color:#8E8A82;font-family:monospace;flex:1;text-align:center">5 Why · 6% Barrel Defect Rate — TCA &amp; High VA</span></div><div style="padding:10px 14px"><div style="background:#F0EEFE;border:1px solid rgba(100,38,160,.3);border-radius:8px;padding:8px 12px;margin-bottom:8px"><div style="font-size:7px;color:#6426A0;font-weight:700;font-family:monospace;margin-bottom:3px">PROBLEM STATEMENT</div><div style="font-size:11px;font-weight:600;color:#2A1A4E">6% of barrels develop TCA or excessive volatile acidity — avg $4,200 loss per barrel</div></div>${[['1','Why do 6% develop TCA or high VA?','TCA from cork contact. High VA from insufficient topping — oxygen exposure.'],['2','Why insufficient topping?','Schedule managed from memory. No documented topping log. Back barrels missed for 3-4 weeks.'],['3','Why no topping log?','No barrel tracking system. Each barrel identified by chalk marker only.'],['4','Why no tracking system?','Winery grew from 400 to 2,000 cases without updating record-keeping practices.'],['5','Why not updated as winery grew?','ROOT CAUSE: No formal operations review as the winery scaled. Production processes never systematically reviewed for scalability.']].map(([n,q,a])=>`<div style="display:flex;gap:0;margin-bottom:0"><div style="display:flex;flex-direction:column;align-items:center;width:24px;flex-shrink:0"><div style="width:20px;height:20px;border-radius:50%;background:${n==='5'?'#C0402A':'#6426A0'};display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#fff;flex-shrink:0;margin-top:6px">${n}</div>${n!=='5'?'<div style="width:2px;flex:1;background:rgba(100,38,160,.3);min-height:8px"></div>':''}</div><div style="flex:1;padding:6px 8px;margin-bottom:4px;background:#fff;border:1px solid ${n==='5'?'rgba(192,64,42,.3)':'#E8E5E0'};border-radius:6px;margin-left:4px"><div style="font-size:8px;font-weight:700;color:#242220;margin-bottom:2px">${q}</div><div style="font-size:9px;color:${n==='5'?'#C0402A':'#6B6760'};line-height:1.4;font-weight:${n==='5'?700:400}">${a}</div></div></div>`).join('')}</div></div>`
  }
  return `<div style="padding:24px;text-align:center;color:#8E8A82;font-family:monospace;font-size:11px">Select a demo to explore</div>`
}

function InlineToolShowcase() {
  const [activeDemo, setActiveDemo] = useState(0)
  const [activeTool, setActiveTool] = useState('VSM')

  const demo = DEMO_SHOWCASE[activeDemo]

  // When switching demos, reset to VSM or first available tool
  function switchDemo(idx: number) {
    setActiveDemo(idx)
    setActiveTool(DEMO_SHOWCASE[idx].tools[0])
  }

  const popupHtml = getDemoPopup(demo.id, activeTool)

  return (
    <div style={{ userSelect:'none' }}>
      <style>{`
        @keyframes popIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .demo-stack-card{
          cursor:pointer;border-radius:11px;padding:10px 9px;
          border-top:1px solid rgba(255,255,255,0.1);
          border-left:1px solid rgba(255,255,255,0.06);
          border-right:1px solid rgba(0,0,0,0.3);
          border-bottom:1px solid rgba(0,0,0,0.4);
          background:linear-gradient(155deg,rgba(42,38,32,0.95),rgba(26,23,19,0.98));
          box-shadow:inset 0 1px 0 rgba(255,255,255,0.06),0 4px 12px rgba(0,0,0,0.4),0 2px 4px rgba(0,0,0,0.3);
          transition:transform .22s cubic-bezier(.34,1.56,.64,1),box-shadow .22s ease;
          position:relative;overflow:hidden;
        }
        .demo-stack-card:hover{
          transform:translateY(-3px);
          box-shadow:inset 0 1px 0 rgba(255,255,255,0.06),0 10px 24px rgba(0,0,0,0.5),0 4px 8px rgba(0,0,0,0.3);
        }
        .demo-stack-card.dsc-active{
          background:linear-gradient(155deg,rgba(52,46,34,0.97),rgba(34,30,20,0.99));
          border-top:1px solid rgba(255,255,255,0.14);
          box-shadow:inset 0 1px 0 rgba(255,255,255,0.08),0 8px 20px rgba(0,0,0,0.45),0 0 0 1px rgba(1,118,211,0.12);
        }
        .tool-tab{padding:4px 9px;border-radius:5px;font-size:9px;font-weight:700;font-family:monospace;cursor:pointer;border:1px solid rgba(255,255,255,0.08);color:rgba(248,247,245,0.4);background:transparent;transition:all .15s;}
        .tool-tab:hover{background:rgba(255,255,255,0.07);color:rgba(248,247,245,0.7);}
        .tool-tab.tt-active{color:#0176D3;border-color:rgba(1,118,211,0.4);background:rgba(1,118,211,0.08);}
        .showcase-popup-body{max-height:440px;overflow-y:auto;background:#F8F6F0;border-radius:0 0 8px 8px;}
        /* Sharp subpixel text inside popup */
        .showcase-popup-body *{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;}
        .showcase-popup-body::-webkit-scrollbar{width:4px}
        .showcase-popup-body::-webkit-scrollbar-thumb{background:rgba(1,118,211,0.3);border-radius:2px}
      `}</style>

      {/* Outer frame with glow border */}
      <div style={{ position:'relative', borderRadius:20, padding:1, background:'linear-gradient(135deg,rgba(1,118,211,0.22),rgba(100,38,160,0.08),rgba(48,112,184,0.12))' }}>
        <div style={{ borderRadius:19, background:'rgba(26,23,20,0.98)', padding:14, display:'flex', gap:10, boxShadow:'0 32px 64px rgba(0,0,0,0.55),0 12px 24px rgba(0,0,0,0.3)' }}>

          {/* LEFT: chrome + popup + tool tabs */}
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ background:'linear-gradient(180deg,#2A2620,#1E1B17)', borderRadius:12, overflow:'hidden', border:'1px solid rgba(255,255,255,0.07)', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.05),inset 0 -1px 0 rgba(0,0,0,0.4)', transform:'translateZ(0)', WebkitFontSmoothing:'antialiased' }}>
              {/* Chrome bar */}
              <div style={{ padding:'9px 14px', display:'flex', alignItems:'center', gap:8, background:'linear-gradient(180deg,rgba(40,37,33,0.96),rgba(30,27,23,0.96))', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display:'flex', gap:5 }}>
                  <div style={{ width:9, height:9, borderRadius:'50%', background:'#C0402A' }} />
                  <div style={{ width:9, height:9, borderRadius:'50%', background:'#0176D3' }} />
                  <div style={{ width:9, height:9, borderRadius:'50%', background:'#2A9E82' }} />
                </div>
                <div style={{ flex:1, textAlign:'center', fontSize:10, color:'rgba(248,247,245,0.28)', fontFamily:'monospace', letterSpacing:'.8px' }}>{demo.chromTitle}</div>
                <div style={{ fontSize:8, fontWeight:700, padding:'2px 7px', borderRadius:3, background:'rgba(48,112,184,0.15)', color:'rgba(96,160,240,0.8)', border:'1px solid rgba(48,112,184,0.2)', fontFamily:'monospace' }}>{demo.badge}</div>
              </div>
              {/* Popup content */}
              <div key={`${activeDemo}-${activeTool}`} className="showcase-popup-body" style={{ animation:'popIn 0.2s ease both' }} dangerouslySetInnerHTML={{ __html: popupHtml }} />
              {/* Tool tabs */}
              <div style={{ display:'flex', gap:4, padding:'6px 12px 8px', background:'rgba(22,19,16,0.85)', borderTop:'1px solid rgba(255,255,255,0.06)', flexWrap:'wrap', alignItems:'center' }}>
                <span style={{ fontSize:7, color:'rgba(248,247,245,0.2)', fontFamily:'monospace', letterSpacing:1, textTransform:'uppercase', marginRight:4, flexShrink:0 }}>Tool:</span>
                {demo.tools.map(t => (
                  <button key={t} className={`tool-tab${t===activeTool?' tt-active':''}`} onClick={() => setActiveTool(t)}>{t}</button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: demo stack */}
          <div style={{ width:130, flexShrink:0, display:'flex', flexDirection:'column', gap:6 }}>
            <div style={{ fontSize:8, color:'rgba(248,247,245,0.25)', fontFamily:'monospace', letterSpacing:1.5, textTransform:'uppercase', marginBottom:2, paddingLeft:2 }}>Select demo</div>
            {DEMO_SHOWCASE.map((d, i) => (
              <div key={d.id} className={`demo-stack-card${i===activeDemo?' dsc-active':''}`} onClick={() => switchDemo(i)}>
                {/* Color stripe */}
                <div style={{ position:'absolute', top:0, left:0, right:0, height:2, borderRadius:'11px 11px 0 0', background:d.color, opacity:i===activeDemo?.9:.35 }} />
                <div style={{ fontSize:9, fontWeight:800, fontFamily:'monospace', letterSpacing:1, color:d.color, marginBottom:5, padding:'2px 6px', background:`${d.color}18`, border:`1px solid ${d.color}35`, borderRadius:4, display:'inline-block' }}>{d.code}</div>
                <div style={{ fontSize:9, fontWeight:700, fontFamily:'monospace', letterSpacing:'.7px', color:d.color, marginBottom:2 }}>{d.industry}</div>
                <div style={{ fontSize:9, color:'rgba(248,247,245,0.42)', lineHeight:1.4 }}>{d.headline}</div>
                <div style={{ marginTop:6, paddingTop:5, borderTop:'1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize:7, color:'rgba(248,247,245,0.25)', fontFamily:'monospace', letterSpacing:'.5px' }}>{d.metricLabel}</div>
                  <div style={{ fontSize:11, fontWeight:700, fontFamily:'monospace', color:d.metricColor }}>{d.metric}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

// ── CompetitorTable — VeSiMy vs spreadsheets, Visio, Lucidchart, Minitab ─────
function CompetitorTable() {
  const features = [
    'Value Stream Mapping (ISO 22468)',
    'Built-in Time Study / Stopwatch',
    '5 Why Root Cause Analysis',
    'Fishbone (Ishikawa) Diagram',
    'DOWNTIME Waste Identification',
    'Kaizen Event Tracker',
    'Yamazumi / Operator Balance Chart',
    'Gap Analysis (AI-powered)',
    'A3 / PDCA / 8D Export',
    'All tools connected to VSM',
    'AI Gap Analysis (built-in)',
    'Free to start',
  ]
  const tools = [
    { name: 'VeSiMy', color: '#0176D3', bg: 'rgba(1,118,211,0.06)', border: 'rgba(1,118,211,0.3)', highlight: true, scores: [true,true,true,true,true,true,true,true,true,true,true,true] },
    { name: 'Excel / Sheets', color: '#6B6760', bg: '#FAFAFA', border: '#E0E0E0', highlight: false, scores: [false,false,false,false,false,false,false,false,false,false,false,true] },
    { name: 'Visio / Lucidchart', color: '#1A4F8A', bg: '#FAFAFA', border: '#E0E0E0', highlight: false, scores: [true,false,false,false,false,false,false,false,false,false,false,false] },
    { name: 'Minitab', color: '#534AB7', bg: '#FAFAFA', border: '#E0E0E0', highlight: false, scores: [false,false,false,false,false,false,false,false,false,false,false,false] },
    { name: 'Generic PM Tool', color: '#6B6760', bg: '#FAFAFA', border: '#E0E0E0', highlight: false, scores: [false,false,false,false,false,true,false,false,false,false,false,true] },
  ]

  return (
    <section style={{ padding: 'clamp(48px,6vw,80px) clamp(16px,4vw,48px)', background: '#1A1714', borderTop: '1px solid rgba(255,255,255,0.09)', borderBottom: '1px solid rgba(255,255,255,0.09)' }}>
      <div style={{ maxWidth: 1060, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 11, color: '#0176D3', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8, fontFamily: 'monospace' }}>Why VeSiMy</div>
          <h2 className="h2-dark-shadow" style={{ fontSize: 'clamp(22px,3vw,36px)', fontWeight: 700, color: '#F8F7F5', marginBottom: 10, fontFamily: serif, letterSpacing: -.5 }}>
            Why process teams are replacing their current setup
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(248,247,245,0.5)', maxWidth: 520, margin: '0 auto', lineHeight: 1.75 }}>
            Most teams manage their processes across 4 to 6 disconnected tools. VeSiMy replaces all of them and adds AI that reads your actual data — in any industry.
          </p>
        </div>

        <div className="comp-table-wrap" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
            <thead>
              <tr>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, color: 'rgba(248,247,245,0.3)', fontWeight: 500, letterSpacing: 0.5, borderBottom: '1px solid rgba(255,255,255,0.08)', width: '32%' }}>Feature</th>
                {tools.map(t => (
                  <th key={t.name} style={{ padding: '10px 10px', textAlign: 'center', fontSize: 11, fontWeight: 700, letterSpacing: 0.3, borderBottom: t.highlight ? `2px solid ${t.color}` : '1px solid rgba(255,255,255,0.08)', color: t.highlight ? t.color : 'rgba(248,247,245,0.4)', background: t.highlight ? t.bg : 'transparent', borderRadius: t.highlight ? '8px 8px 0 0' : 0 }}>
                    {t.name}{t.highlight && <span style={{ display: 'block', fontSize: 8, marginTop: 2, fontWeight: 400, opacity: 0.8 }}>← YOU ARE HERE</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((f, fi) => (
                <tr key={f} style={{ background: fi % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                  <td style={{ padding: '9px 14px', fontSize: 12, color: 'rgba(248,247,245,0.6)', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 400 }}>{f}</td>
                  {tools.map(t => (
                    <td key={t.name} style={{ padding: '9px 10px', textAlign: 'center', borderBottom: '0.5px solid #ECEAE6', background: t.highlight ? t.bg : 'transparent' }}>
                      {t.scores[fi]
                        ? <span style={{ fontSize: 14, color: t.highlight ? '#0176D3' : '#2A9E82' }}>✓</span>
                        : <span style={{ fontSize: 12, color: '#D8D5CE' }}>—</span>
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <Link href="/auth/signup" style={{ padding: '12px 28px', background: '#0176D3', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Switch to VeSiMy. Free to start. <ArrowRightIcon size={13} color="#fff" />
          </Link>
        </div>
      </div>
    </section>
  )
}


function ToolShowcase() {
  const [activeTool, setActiveTool] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const lastWheelTime = useRef(0)
  const touchStartY = useRef(0)
  const touchStartX = useRef(0)
  const lastTouchTime = useRef(0)
  const tool = SHOWCASE_TOOLS[activeTool]

  // ── Desktop: wheel scroll ──────────────────────────────────────────────────
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      const rect = el.getBoundingClientRect()
      const inView = rect.top < window.innerHeight * 0.6 && rect.bottom > window.innerHeight * 0.4
      if (!inView) return
      const now = Date.now()
      if (now - lastWheelTime.current < 600) return
      if (Math.abs(e.deltaY) < 30) return
      if (e.deltaY > 0 && activeTool < SHOWCASE_TOOLS.length - 1) {
        e.preventDefault()
        lastWheelTime.current = now
        setActiveTool(t => t + 1)
      } else if (e.deltaY < 0 && activeTool > 0) {
        e.preventDefault()
        lastWheelTime.current = now
        setActiveTool(t => t - 1)
      }
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [activeTool])

  // ── Mobile: touch swipe ────────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const dy = touchStartY.current - e.changedTouches[0].clientY
    const dx = Math.abs(touchStartX.current - e.changedTouches[0].clientX)
    if (Math.abs(dy) < 40 || dx > Math.abs(dy)) return  // too small or horizontal swipe
    const now = Date.now()
    if (now - lastTouchTime.current < 500) return
    lastTouchTime.current = now
    if (dy > 0) setActiveTool(t => Math.min(t + 1, SHOWCASE_TOOLS.length - 1))
    else        setActiveTool(t => Math.max(t - 1, 0))
  }

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <section id="tools" ref={sectionRef}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{ padding: 'clamp(48px,6vw,80px) 0 clamp(56px,7vw,100px)', background: '#F8F7F5', borderTop: '0.5px solid #D8D5CE', borderBottom: '0.5px solid #D8D5CE' }}>
      <style>{`
        @keyframes showcaseReveal{from{opacity:0;transform:translateX(-14px)}to{opacity:1;transform:translateX(0)}}
        @keyframes showcaseRevealUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @media(max-width:767px){
          .showcase-grid{grid-template-columns:1fr!important;gap:0!important;}
          .showcase-stack-col{position:relative!important;top:auto!important;height:auto!important;padding:0 20px 8px!important;}
          .showcase-detail-col{padding:0 20px 0!important;}
          .showcase-stack-inner{width:100%!important;max-width:340px!important;margin:0 auto!important;}
          .showcase-3d{transform:rotateY(0deg) rotateX(4deg) rotateZ(0deg)!important;width:280px!important;height:340px!important;}
          .showcase-popup{max-height:380px!important;}
          .showcase-swipe-hint{display:flex!important;}
        }
        .showcase-swipe-hint{display:none;}
      `}</style>

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 clamp(16px,4vw,40px)' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px,5vw,52px)' }}>
          <div style={{ fontSize: 11, color: '#8E8A82', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8, fontFamily: 'monospace' }}>What's inside</div>
          <h2 style={{ fontSize: 'clamp(24px,3vw,38px)', fontWeight: 700, color: '#242220', marginBottom: 10, fontFamily: serif }}>Every tool a lean team needs</h2>
          <p style={{ fontSize: 15, color: '#6B6760', maxWidth: 500, margin: '0 auto', lineHeight: 1.75 }}>
            All connected to your value stream. Swipe or tap the dots to explore.
          </p>
        </div>

        {/* Swipe hint — mobile only */}
        <div className="showcase-swipe-hint" style={{ alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 16, color: '#B8B4AC', fontSize: 11, fontFamily: 'monospace', letterSpacing: 1 }}>
          <span>↑↓</span><span>swipe to navigate</span>
        </div>

        {/* Two-column grid — stacks to 1 col on mobile */}
        <div className="showcase-grid" style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 56, alignItems: 'start' }}>

          {/* LEFT (top on mobile): Detail + real popup */}
          <div className="showcase-detail-col" key={activeTool} style={{ paddingTop: 4, animation: 'showcaseReveal 0.3s ease both' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: '100px', background: tool.tagBg, border: `1px solid ${tool.color}30`, marginBottom: 14 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: tool.tagTxt, letterSpacing: '.5px', fontFamily: 'monospace' }}>{tool.tag}</span>
            </div>
            <h3 style={{ fontFamily: serif, fontSize: 'clamp(18px,2.5vw,24px)', fontWeight: 700, color: '#242220', lineHeight: 1.2, marginBottom: 8 }}>{tool.headline}</h3>
            <p style={{ fontSize: 13, color: '#6B6760', lineHeight: 1.8, marginBottom: 20 }}>{tool.headline}</p>

            <div className="showcase-popup" style={{ background: '#FFFFFF', border: '0.5px solid #D8D5CE', borderRadius: 14, overflow: 'hidden', boxShadow: '0 4px 28px rgba(0,0,0,0.09)', maxHeight: 500, overflowY: 'auto' }}
              dangerouslySetInnerHTML={{ __html: tool.popup + `
                <div style="padding:9px 14px;border-top:1px solid #D8D5CE;background:#F5F5F8;display:flex;align-items:center;justify-content:space-between">
                  <div style="display:flex;align-items:center;gap:4px;padding:2px 7px;background:rgba(1,118,211,.12);border:1px solid rgba(1,118,211,.25);border-radius:4px">
                    <span style="font-size:9px;font-weight:700;color:#8E8A82;font-family:Palatino Linotype,serif">VeSiMy</span>
                  </div>
                  <a href="/auth/signup" style="display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:6px 14px;font-size:11px;font-weight:700;border-radius:10px;border:none;background:#0176D3;color:#fff;text-decoration:none;cursor:pointer">Try free →</a>
                </div>` }}
            />
          </div>

          {/* RIGHT (bottom on mobile): 3D stack + dots */}
          <div className="showcase-stack-col" style={{ position: 'sticky', top: 28, height: 540, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
            <div className="showcase-stack-inner" style={{ perspective: '1100px', perspectiveOrigin: '72% 48%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
              <div className="showcase-3d" style={{ position: 'relative', width: 290, height: 420, transformStyle: 'preserve-3d', transform: 'rotateY(22deg) rotateX(7deg) rotateZ(2deg)' }}>
                {SHOWCASE_TOOLS.map((t, i) => {
                  const off = i - activeTool
                  const isA = i === activeTool
                  return (
                    <div key={t.short} onClick={() => !isA && setActiveTool(i)} style={{
                      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                      borderRadius: 14,
                      background: `rgba(255,255,255,${isA ? .97 : Math.max(.45, .82 - Math.abs(off) * .09)})`,
                      border: `1.5px solid ${isA ? t.color + '55' : 'rgba(215,213,206,.65)'}`,
                      boxShadow: isA ? `0 18px 50px rgba(0,0,0,.13),0 0 0 1px ${t.color}22` : '0 2px 10px rgba(0,0,0,.05)',
                      transform: `translateY(${off * 16}px) translateZ(${isA ? 48 : -Math.abs(off) * 16}px) scale(${isA ? 1 : Math.max(.86, .97 - Math.abs(off) * .025)})`,
                      transition: 'all .45s cubic-bezier(.34,1.15,.64,1)',
                      overflow: 'hidden', display: 'flex', flexDirection: 'column',
                      cursor: isA ? 'default' : 'pointer',
                    }}>
                      <div style={{ padding: '12px 14px 8px', borderBottom: '1px solid rgba(0,0,0,.05)', flexShrink: 0, background: 'rgba(255,255,255,.5)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <div style={{ width: 28, height: 28, borderRadius: 7, background: `${t.color}12`, border: `1px solid ${t.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 800, color: t.color, fontFamily: 'monospace', flexShrink: 0 }}>{t.short}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#242220' }}>{t.name}</div>
                            <div style={{ fontSize: 8, color: '#8E8A82', marginTop: 1 }}>{t.headline}</div>
                          </div>
                          {isA && <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.color, flexShrink: 0 }} />}
                        </div>
                      </div>
                      <div style={{ flex: 1, overflow: 'hidden', opacity: isA ? 1 : Math.max(.12, .62 - Math.abs(off) * .18), transform: `scale(${isA ? 1 : .86})`, transformOrigin: 'top left', transition: 'opacity .4s,transform .4s', pointerEvents: 'none' }}
                        dangerouslySetInnerHTML={{ __html: t.cardContent }}
                      />
                      {isA && <div style={{ padding: '0 14px 10px', flexShrink: 0 }}><div style={{ height: 2, borderRadius: 2, background: `linear-gradient(90deg,${t.color},${t.color}22)` }} /></div>}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Dots — bigger tap targets on mobile */}
            <div style={{ display: 'flex', gap: 8, padding: '8px 0' }}>
              {SHOWCASE_TOOLS.map((t, i) => (
                <div key={i} onClick={() => setActiveTool(i)} style={{
                  width: i === activeTool ? 22 : 8,
                  height: 8,
                  borderRadius: 100,
                  background: i === activeTool ? t.color : '#D8D5CE',
                  cursor: 'pointer',
                  transition: 'all .3s',
                  minWidth: 8,
                  // Larger invisible tap area on mobile
                  position: 'relative',
                }} />
              ))}
            </div>

            {/* Prev/Next arrows — visible on mobile */}
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <button
                onClick={() => setActiveTool(t => Math.max(t - 1, 0))}
                disabled={activeTool === 0}
                style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #D8D5CE', background: '#fff', color: activeTool === 0 ? '#D8D5CE' : '#4E4B45', fontSize: 13, cursor: activeTool === 0 ? 'default' : 'pointer', fontWeight: 600, transition: 'all .15s' }}>
                ← Prev
              </button>
              <button
                onClick={() => setActiveTool(t => Math.min(t + 1, SHOWCASE_TOOLS.length - 1))}
                disabled={activeTool === SHOWCASE_TOOLS.length - 1}
                style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #D8D5CE', background: '#fff', color: activeTool === SHOWCASE_TOOLS.length - 1 ? '#D8D5CE' : '#4E4B45', fontSize: 13, cursor: activeTool === SHOWCASE_TOOLS.length - 1 ? 'default' : 'pointer', fontWeight: 600, transition: 'all .15s' }}>
                Next →
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}


export default function HomePage() {
  const [pce, setPce] = useState(36)
  const [bnVis, setBnVis] = useState(true)
  const dir = useRef(1)

  useEffect(() => {
    const t1 = setInterval(() => {
      setPce(p => {
        const next = p + dir.current * 0.4
        if (next > 40 || next < 33) dir.current *= -1
        return next
      })
    }, 100)
    const t2 = setInterval(() => setBnVis(v => !v), 950)
    return () => { clearInterval(t1); clearInterval(t2) }
  }, [])

  return (
    <div style={{ background: '#F8F7F5', color: '#242220', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif', overflowX: 'hidden' }}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes mq { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        
        /* Reveal — text is ALWAYS visible; animation just adds the fade-in */
        .reveal { opacity:1; }
        .r1{}.r2{}.r3{}.r4{}.r5{}
        /* Prefers-reduced-motion: skip animation entirely, keep text visible */
        @media(prefers-reduced-motion:reduce){
          .reveal,.logo-mark-anim,.wordmark-anim,.tagline-anim{
            animation:none!important;opacity:1!important;transform:none!important;
            letter-spacing:inherit!important;
          }
        }
        @keyframes logoFloat {
          0%,100% { transform: translateY(0px) rotate(-1deg); }
          50%      { transform: translateY(-7px) rotate(1deg); }
        }
        @keyframes logoGlow {
          0%,100% { filter: drop-shadow(0 4px 18px rgba(1,118,211,0.22)) drop-shadow(0 0 0px rgba(140,68,204,0)); }
          50%     { filter: drop-shadow(0 8px 32px rgba(1,118,211,0.45)) drop-shadow(0 0 18px rgba(140,68,204,0.25)); }
        }
        @keyframes wordmarkIn {
          from { opacity:0; transform: translateX(-12px) skewX(-4deg); }
          to   { opacity:1; transform: translateX(0)     skewX(0deg); }
        }
        @keyframes taglineIn {
          from { opacity:0; letter-spacing: 6px; }
          to   { opacity:1; letter-spacing: 3px; }
        }
        @keyframes shimmerSweep {
          0%   { background-position: -200% center; }
          100% { background-position: 300% center; }
        }
        .logo-mark-anim {
          animation: logoFloat 4.2s ease-in-out infinite, logoGlow 4.2s ease-in-out infinite;
        }
        .wordmark-anim {
          opacity:0;
          animation: wordmarkIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.25s forwards;
        }
        .tagline-anim {
          opacity:0;
          animation: taglineIn 0.9s ease 0.6s forwards;
        }
        .h1-3d{
          color:#F8F7F5;
          text-shadow:
            0 1px 0 rgba(255,255,255,0.12),
            0 2px 0 rgba(0,0,0,0.65),
            0 3px 0 rgba(0,0,0,0.55),
            0 4px 0 rgba(0,0,0,0.45),
            0 5px 0 rgba(0,0,0,0.35),
            0 6px 0 rgba(0,0,0,0.25),
            0 7px 1px rgba(0,0,0,0.12),
            0 10px 18px rgba(0,0,0,0.55),
            0 20px 36px rgba(0,0,0,0.28);
        }
        .gold-3d{
          color:#0176D3;
          text-shadow:
            0 1px 0 #8B6010,
            0 2px 0 #7A5510,
            0 3px 0 #6A480C,
            0 4px 2px rgba(0,0,0,0.45),
            0 6px 10px rgba(0,0,0,0.35),
            0 12px 22px rgba(0,0,0,0.2);
        }
        .nav-link { color:rgba(248,247,245,0.55); text-decoration:none; font-size:13px; transition:color 0.15s; }
        .nav-link:hover { color:#F8F7F5; }

        /* ── 3D CARD SYSTEM ── */
        .card-dk{
          border-radius:15px;position:relative;
          background:linear-gradient(155deg,rgba(44,40,34,0.96),rgba(26,23,19,0.99));
          border-top:1px solid rgba(255,255,255,0.1);
          border-left:1px solid rgba(255,255,255,0.06);
          border-right:1px solid rgba(0,0,0,0.25);
          border-bottom:1px solid rgba(0,0,0,0.4);
          box-shadow:inset 0 1px 0 rgba(255,255,255,0.07),inset 0 -2px 0 rgba(0,0,0,0.45),0 6px 14px rgba(0,0,0,0.45),0 14px 32px rgba(0,0,0,0.3);
          transition:transform .28s cubic-bezier(.34,1.56,.64,1),box-shadow .28s ease;
        }
        .card-dk:hover{
          transform:translateY(-7px) perspective(900px) rotateX(2.5deg) rotateY(-.5deg);
          box-shadow:inset 0 1px 0 rgba(255,255,255,0.07),inset 0 -2px 0 rgba(0,0,0,0.45),0 16px 48px rgba(0,0,0,0.55),0 28px 56px rgba(0,0,0,0.3),0 0 40px rgba(1,118,211,0.07);
        }
        .card-lt{
          border-radius:15px;position:relative;
          background:linear-gradient(155deg,#FFFFFF,#F6F3EC 55%,#EDE9E0);
          border-top:1px solid rgba(255,255,255,0.95);
          border-left:1px solid rgba(255,255,255,0.7);
          border-right:1px solid rgba(0,0,0,0.07);
          border-bottom:1px solid rgba(0,0,0,0.12);
          box-shadow:inset 0 2px 0 rgba(255,255,255,0.85),inset 0 -1px 0 rgba(0,0,0,0.06),0 6px 16px rgba(0,0,0,0.1),0 14px 36px rgba(0,0,0,0.07);
          transition:transform .28s cubic-bezier(.34,1.56,.64,1),box-shadow .28s ease;
        }
        .card-lt:hover{
          transform:translateY(-7px) perspective(900px) rotateX(2deg) rotateY(-.4deg);
          box-shadow:inset 0 2px 0 rgba(255,255,255,0.85),inset 0 -1px 0 rgba(0,0,0,0.06),0 18px 48px rgba(0,0,0,0.14),0 28px 60px rgba(0,0,0,0.08),0 0 36px rgba(1,118,211,0.09);
        }
        .card-stripe{position:absolute;top:0;left:0;right:0;height:2px;border-radius:15px 15px 0 0;opacity:.75}
        /* ── CONSTELLATION ON LIGHT SECTIONS ── */
        .constell-section{position:relative;overflow:hidden}
        .constell-canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0}
        .constell-section>*:not(.constell-canvas){position:relative;z-index:1}
        /* ── TEXT SHADOWS ── */
        .h2-dark-shadow{
          text-shadow:
            0 1px 0 rgba(255,255,255,0.08),
            0 2px 0 rgba(0,0,0,0.65),
            0 3px 0 rgba(0,0,0,0.5),
            0 4px 0 rgba(0,0,0,0.38),
            0 5px 1px rgba(0,0,0,0.2),
            0 8px 14px rgba(0,0,0,0.5),
            0 16px 28px rgba(0,0,0,0.25)
        }
        .h2-light-shadow{
          text-shadow:
            0 1px 0 rgba(255,255,255,0.92),
            0 2px 0 rgba(185,170,145,0.7),
            0 3px 0 rgba(165,150,125,0.45),
            0 4px 2px rgba(0,0,0,0.18),
            0 7px 12px rgba(0,0,0,0.12)
        }
        /* ── GLASS PANEL (problem right) ── */
        .glass-panel{
          background:linear-gradient(145deg,rgba(255,255,255,0.88),rgba(248,246,240,0.94));
          border-radius:18px;
          border-top:1px solid rgba(255,255,255,0.95);
          border-left:1px solid rgba(255,255,255,0.7);
          border-right:1px solid rgba(0,0,0,0.05);
          border-bottom:1px solid rgba(0,0,0,0.1);
          box-shadow:inset 0 2px 0 rgba(255,255,255,0.8),0 24px 64px rgba(0,0,0,0.12),0 8px 24px rgba(0,0,0,0.07),0 0 0 1px rgba(1,118,211,0.06);
          transform:perspective(1200px) rotateY(-3deg) rotateX(1deg);
          transition:transform .4s ease;
          position:relative;overflow:hidden;
        }
        .glass-panel:hover{transform:perspective(1200px) rotateY(-1deg) rotateX(.5deg)}
        .glass-panel::before{content:'';position:absolute;top:0;left:0;right:0;height:42%;background:linear-gradient(180deg,rgba(255,255,255,0.5),transparent);border-radius:18px 18px 0 0;pointer-events:none}

        /* ── Unified mobile breakpoints ── */
        @media(max-width:900px){
          .hero-tools-grid{grid-template-columns:1fr!important;gap:20px!important;}
          .hero-tools-left{padding-top:0!important;text-align:center;}
          .hero-tools-left .reveal{text-align:center;}
          .hero-tools-left h1{text-align:center;}
          .hero-tools-left p{margin-left:auto!important;margin-right:auto!important;max-width:480px!important;}
          .hero-cta-row{justify-content:center!important;}
          .hero-mission{margin-left:auto!important;margin-right:auto!important;text-align:left;}
          .hero-industry-loop{justify-content:center!important;}
          .stats-bar-grid{gap:20px 32px!important;}
          /* Flatten 3D rotation at tablet */
          .showcase-mini-3d{transform:rotateY(0deg) rotateX(3deg) rotateZ(0deg)!important;}
        }
        @media(max-width:768px){
          .feat-grid{grid-template-columns:1fr!important;}
          .tools-grid{grid-template-columns:1fr 1fr!important;}
          .plan-grid{grid-template-columns:1fr!important;}
          .problem-grid{grid-template-columns:1fr!important;}
          .hide-mobile{display:none!important;}
          .nav-pad{padding:0 16px!important;}
          .sec-pad{padding:40px 20px!important;}
          .showcase-grid{grid-template-columns:1fr!important;gap:0!important;}
          .showcase-3d{transform:rotateY(0deg) rotateX(4deg) rotateZ(0deg)!important;width:240px!important;height:300px!important;}
          .showcase-popup{max-height:320px!important;}
          .comp-table-wrap{overflow-x:auto!important;-webkit-overflow-scrolling:touch;}
          .footer-links{justify-content:center!important;}
          .footer-wrap{justify-content:center!important;text-align:center;}
          .stats-bar-grid{grid-template-columns:1fr 1fr!important;gap:14px!important;}
          .pricing-card-lifetime{display:none!important;}
          /* On mobile: hide the stack, full-width preview, show mobile nav */
          .showcase-stack-panel{display:none!important;}
          .showcase-row{flex-direction:column!important;}
          .showcase-mobile-nav{display:flex!important;}
        }
        @media(max-width:500px){
          .hero-pill{font-size:9px!important;padding:3px 8px!important;}
          .nav-sign-in{display:none!important;}
          .hero-cta-row a{font-size:13px!important;padding:11px 18px!important;}
          .stats-bar-grid{grid-template-columns:1fr 1fr!important;gap:10px!important;}
          .feat-grid>div{padding:18px 14px!important;}
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav className="nav-pad" style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 60, background: 'rgba(26,23,20,0.96)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.09)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <VLogoMark size={30} />
          <VeSiMyWordmark size={19} />
        </div>
        <div className="hide-mobile" style={{ display: 'flex', gap: 28 }}>
          {[['Tools', '#tools'], ['Demos', '/demos'], ['Pricing', '#pricing'], ['Blog', '/blog'], ['Learn', '/learn']].map(([l, h]) => (
            <a key={l} href={h} className="nav-link">{l}</a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link href="/auth/login" className="nav-sign-in" style={{ padding: '7px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 8, fontSize: 13, color: 'rgba(248,247,245,0.6)', textDecoration: 'none' }}>
            Sign in
          </Link>
          <Link href="/auth/signup" style={{ padding: '7px 18px', background: '#0176D3', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, color: '#0D0C0A', textDecoration: 'none' }}>
            Start free
          </Link>
        </div>
      </nav>

      {/* ── HERO + TOOLS (merged top section) ─────────────────────────────── */}
      <section style={{ position: 'relative', background: '#1A1714', overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,0.09)' }}>

        {/* ── Constellation background — enhanced ── */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} viewBox="0 0 1400 720" preserveAspectRatio="xMidYMid slice">
          <defs>
            {/* Soft radial glow around key nodes */}
            <radialGradient id="ng1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0176D3" stopOpacity="0.18"/>
              <stop offset="100%" stopColor="#0176D3" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="ng2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#8C44CC" stopOpacity="0.12"/>
              <stop offset="100%" stopColor="#8C44CC" stopOpacity="0"/>
            </radialGradient>
            {/* Pulsing animation on select nodes */}
            <style>{`
              @keyframes cPulse { 0%,100%{opacity:.22;r:3} 50%{opacity:.5;r:4.5} }
              @keyframes cPulse2 { 0%,100%{opacity:.18;r:2.5} 50%{opacity:.4;r:4} }
              .cn-pulse { animation: cPulse 3.2s ease-in-out infinite }
              .cn-pulse2 { animation: cPulse2 4.1s ease-in-out infinite }
              .cn-pulse3 { animation: cPulse 5s ease-in-out infinite 1.5s }
            `}</style>
          </defs>

          {/* Ambient glow pools */}
          <ellipse cx="200" cy="160" rx="180" ry="120" fill="url(#ng1)" opacity="0.6"/>
          <ellipse cx="1100" cy="200" rx="160" ry="110" fill="url(#ng2)" opacity="0.5"/>
          <ellipse cx="700" cy="500" rx="140" ry="90" fill="url(#ng1)" opacity="0.4"/>

          {/* Constellation lines — extended network */}
          {[
            [80,60,200,140],[200,140,340,90],[340,90,480,180],[480,180,560,80],[560,80,700,150],
            [700,150,820,60],[820,60,960,140],[960,140,1100,80],[1100,80,1300,60],[1300,60,1380,200],
            [80,60,120,200],[120,200,200,140],[340,90,300,220],[300,220,480,180],
            [560,80,520,240],[520,240,700,150],[820,60,780,220],[780,220,960,140],
            [120,200,80,340],[80,340,200,420],[200,420,300,340],[300,340,300,220],
            [520,240,480,380],[480,380,620,420],[620,420,700,340],[700,340,700,150],
            [780,220,820,360],[820,360,960,420],[960,420,1060,320],[1060,320,960,140],
            [200,420,340,500],[340,500,480,380],[620,420,700,540],[700,540,820,480],
            [820,480,960,420],[960,420,1060,540],[1060,540,1200,460],[1200,460,1380,400],
            [80,340,60,500],[60,500,200,560],[200,560,200,420],[340,500,280,620],
            [700,540,780,640],[780,640,820,480],[1060,540,1140,640],[1140,640,1200,560],
            [400,160,480,180],[900,280,960,140],[650,580,700,540],[1200,200,1100,80],
          ].map(([x1,y1,x2,y2],i) => (
            <line key={i} x1={x1 as number} y1={y1 as number} x2={x2 as number} y2={y2 as number}
              stroke="#0176D3" strokeWidth={i < 10 ? "0.7" : "0.45"}
              opacity={i < 10 ? 0.16 : 0.09}/>
          ))}

          {/* Constellation nodes */}
          {[
            [80,60,true],[200,140,false],[340,90,false],[480,180,true],[560,80,false],
            [700,150,true],[820,60,false],[960,140,false],[1100,80,true],[1300,60,false],
            [120,200,false],[300,220,false],[520,240,false],[780,220,false],[1060,320,true],
            [80,340,false],[300,340,false],[480,380,false],[700,340,false],[820,360,false],
            [960,420,true],[1060,540,false],[200,420,false],[340,500,false],[620,420,false],
            [820,480,false],[60,500,false],[200,560,false],[280,620,false],[700,540,true],
            [1140,460,false],[400,160,false],[900,280,false],[650,580,false],[1200,200,false],
            [1380,400,false],[780,640,false],[1060,640,false],
          ].map(([cx,cy,bright],i) => (
            <circle key={i} cx={cx as number} cy={cy as number}
              r={(bright as boolean) ? 2.8 : 1.6}
              fill="#0176D3"
              className={(bright as boolean) && i%3===0 ? 'cn-pulse' : (bright as boolean) && i%3===1 ? 'cn-pulse2' : (bright as boolean) ? 'cn-pulse3' : ''}
              opacity={(bright as boolean) ? 0.28 : 0.13}/>
          ))}

          {/* VeSiMy V watermarks — scattered, more visible */}
          {[
            [22,55,0.06],[1240,22,0.05],[1310,260,0.06],[22,380,0.045],
            [1050,460,0.05],[520,580,0.04],[850,30,0.04],[140,560,0.04],
          ].map(([x,y,op],i) => (
            <path key={i}
              d={`M${x} ${y} H${+x+16} L${+x+26} ${+y+46} L${+x+36} ${+y+28} L${+x+46} ${+y+46} L${+x+56} ${y} H${+x+72} L${+x+46} ${+y+58} L${+x+26} ${+y+34} L${+x+6} ${+y+58} Z`}
              fill="#0176D3" opacity={op as number}/>
          ))}
        </svg>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', padding: 'clamp(56px,7vw,96px) clamp(16px,4vw,48px) 0' }}>

          {/* ── Centered hero text ── */}
          <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>
            <IndustryLoop />

            <h1 className="reveal r2 h1-3d" style={{ fontSize: 'clamp(38px,5.5vw,68px)', lineHeight: 1.08, fontWeight: 700, color: '#F8F7F5', marginBottom: 20, letterSpacing: -1.5, fontFamily: serif }}>
              Map any process.<br />Find the waste.<br /><span style={{ color: '#0176D3', textShadow: '0 0 40px rgba(1,118,211,0.45),0 2px 8px rgba(0,0,0,0.5)' }}>Fix the bottleneck.</span>
            </h1>

            <p className="reveal r3" style={{ fontSize: 16, color: 'rgba(248,247,245,0.52)', lineHeight: 1.82, marginBottom: 32, maxWidth: 520, margin: '0 auto 32px' }}>
              For every employee with a target to reach. Map your process, find the waste, fix it — and build a record of every improvement you make.
            </p>

            <div className="reveal r4 hero-cta-row" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14, justifyContent: 'center' }}>
              <Link href="/auth/signup" style={{ padding: '13px 26px', background: '#0176D3', color: '#FFFFFF', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 7, boxShadow: '0 4px 14px rgba(1,118,211,0.40)' }}>
                Start free — no card needed <ArrowRightIcon size={14} color="#FFFFFF" />
              </Link>
              <Link href="/auth/signup?ref=1" style={{ padding: '13px 20px', background: 'rgba(255,255,255,0.05)', color: 'rgba(248,247,245,0.65)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 11, fontSize: 13, textDecoration: 'none', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }}>
                Explore sample project →
              </Link>
              <Link href="/demos" style={{ padding: '13px 20px', background: 'rgba(255,255,255,0.03)', color: 'rgba(248,247,245,0.45)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 11, fontSize: 13, textDecoration: 'none' }}>
                View all demos →
              </Link>
            </div>
            <p className="reveal r5" style={{ fontSize: 10, color: 'rgba(248,247,245,0.18)', fontFamily: 'monospace' }}>Runs in your browser · Your process data is private · No advertising trackers</p>
          </div>

          {/* ── Showcase below text: preview left + demo stack right ── */}
          <div style={{ marginTop: 48 }}>
            <InlineToolShowcase />
          </div>

        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────────── */}
      <div style={{ background: '#231F1B', padding: '18px clamp(16px,4vw,48px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="stats-bar-grid" style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
          {[
            ['Any industry', 'Manufacturing to healthcare to real estate'],
            ['9', 'Process tools, all connected'],
            ['ISO 22468', 'Compliant VSM standard'],
            ['Free', 'Unlimited projects forever'],
          ].map(([v,l]) => (
            <div key={l} style={{ textAlign: 'center', padding: '4px 8px' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 700, color: '#0176D3', textShadow: '0 0 20px rgba(1,118,211,0.4),0 2px 4px rgba(0,0,0,0.4)' }}>{v}</div>
              <div style={{ fontSize: 10, color: 'rgba(248,247,245,0.35)', marginTop: 2, letterSpacing: '0.2px', lineHeight: 1.4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ────────────────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(180deg,#1F1C18,#1A1714)', padding: 'clamp(56px,7vh,80px) clamp(16px,4vw,48px)' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <div style={{ fontSize: 10, color: 'rgba(1,118,211,0.75)', letterSpacing: 2.5, textTransform: 'uppercase', fontFamily: 'monospace', fontWeight: 700, marginBottom: 12, padding: '4px 12px', background: 'rgba(1,118,211,0.07)', border: '1px solid rgba(1,118,211,0.15)', borderRadius: 4, display: 'inline-block' }}>How it works</div>
            <h2 className="h2-dark-shadow" style={{ fontFamily: serif, fontSize: 'clamp(26px,3.5vw,42px)', fontWeight: 700, color: '#F8F7F5', lineHeight: 1.15, marginBottom: 14, letterSpacing: -.5 }}>
              Everything connected<br/>to the same steps.
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(248,247,245,0.42)', lineHeight: 1.82, maxWidth: 520, margin: '0 auto' }}>Change a cycle time and the map updates. Log a kaizen and it appears on the VSM. Close a 5 Why and the root cause stays on the step.</p>
          </div>
          <div className="feat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {([
              { color:'#3070B8', title:'Map every step of your process', body:'Value Stream Mapping with ISO 22468:2020 compliance. Bottleneck steps flag automatically. PCE and lead time calculate live as you add data.', svg:'<rect x="2" y="9" width="5" height="6" rx="1"/><rect x="9.5" y="9" width="5" height="6" rx="1"/><rect x="17" y="9" width="5" height="6" rx="1"/><path d="M7 12h2.5M14.5 12H17"/>' },
              { color:'#2A9E82', title:'Measure before you manage', body:'Built-in stopwatch with lap recording. Mean CT, outlier detection, standard deviation — calculated automatically. Times push directly to your VSM.', svg:'<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/>' },
              { color:'#6426A0', title:'Find the root. Fix it once.', body:'5 Why chains stay attached to the step where the problem lives. Root cause, countermeasure, and owner — never in a separate document.', svg:'<circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="10" y2="12"/><line x1="10" y1="12" x2="8.5" y2="15.5"/><circle cx="12" cy="8" r=".8" fill="#6426A0"/>' },
              { color:'#C0402A', title:'Name the waste. Own the fix.', body:'8 DOWNTIME waste categories on every step. Daily cost estimate, VA/NNVA/NVA classification, and a direct path to a kaizen action.', svg:'<polyline points="3 6 5 6 21 6"/><path d="M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2"/><polyline points="19 6 18 20 6 20 5 6"/>' },
              { color:'#0176D3', title:'Supe — your AI lean mentor', body:'Reads your actual project data and tells you what to fix first. Gap analysis, root cause hypothesis, and executive summary from live numbers — not templates.', svg:'<polygon points="12 2 15 9 22 9 16 14 18 21 12 17 6 21 8 14 2 9 9 9"/>' },
              { color:'#1090D4', title:'One-click A3 export', body:'ISO 9001:2015 compliant A3 report generated from your live data. VSM summary, gap findings, countermeasures — formatted and ready to present.', svg:'<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>' },
            ] as any[]).map((f:any) => (
              <div key={f.title} className="card-dk" style={{ padding: '30px 26px' }}>
                <div className="card-stripe" style={{ background: `linear-gradient(90deg,transparent,${f.color},transparent)` }} />
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${f.color}22`, border: `1px solid ${f.color}38`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.1)' }}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={f.color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: f.svg }} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#F8F7F5', marginBottom: 10, lineHeight: 1.3, textShadow: '0 1px 5px rgba(0,0,0,0.55)' }}>{f.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(248,247,245,0.42)', lineHeight: 1.75 }}>{f.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PROBLEM SECTION ─────────────────────────────────────────────────── */}
      <section className="constell-section" style={{ background: '#F8F6F0', padding: 'clamp(56px,7vh,80px) clamp(16px,4vw,48px)', borderTop: '0.5px solid #D8D5CE', borderBottom: '0.5px solid #D8D5CE' }}>
        <canvas className="constell-canvas" data-dark="false" />
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px,5vw,72px)', alignItems: 'center' }} className="problem-grid">
          <div>
            <div style={{ display: 'inline-block', fontSize: 9, color: 'rgba(192,64,42,0.85)', letterSpacing: 2.5, textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 14, fontWeight: 700, padding: '4px 12px', background: 'rgba(192,64,42,0.07)', border: '1px solid rgba(192,64,42,0.15)', borderRadius: 4 }}>The problem</div>
            <h2 className="h2-light-shadow" style={{ fontFamily: '"Palatino Linotype",Georgia,serif', fontSize: 'clamp(22px,3vw,36px)', fontWeight: 700, color: '#1E1B17', lineHeight: 1.15, marginBottom: 24, letterSpacing: -.5 }}>
              Every business runs on processes.<br/>Most are broken the same way.
            </h2>
            {[
              ['Your process lives in your head', 'Or in a whiteboard photo nobody looks at again'],
              ['The bottleneck shifts every week', 'Because you\'re reacting, not measuring'],
              ['Root causes get found and forgotten', 'No connection between the problem and the fix'],
              ['Improvement actions die in spreadsheets', 'No owner. No deadline. Nothing gets closed.'],
              ['Every report takes a day to compile', 'And is outdated before anyone reads it'],
            ].map(([pain, detail]) => (
              <div key={pain} style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 13, color: '#C0402A', flexShrink: 0, marginTop: 3, lineHeight: 1 }}>✗</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#242220', lineHeight: 1.35 }}>{pain}</div>
                  <div style={{ fontSize: 12, color: '#6B6760', marginTop: 2, lineHeight: 1.5 }}>{detail}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="glass-panel" style={{ padding: 'clamp(24px,3vw,32px)' }}>
            <div style={{ fontSize: 9, color: '#2A9E82', fontFamily: 'monospace', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>With VeSiMy</div>
            <p style={{ fontFamily: '"Palatino Linotype",Georgia,serif', fontSize: 'clamp(15px,1.8vw,18px)', fontWeight: 600, color: '#1E1B17', lineHeight: 1.65, marginBottom: 14, textShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'relative', zIndex: 1 }}>
              Map your process once. Every measurement, every root cause, every improvement connects to the same step automatically.
            </p>
            <p style={{ fontSize: 13, color: '#6B6760', lineHeight: 1.75, marginBottom: 18, position: 'relative', zIndex: 1 }}>
              Whether you run a production line, a clinic, or a real estate team — the waste is visible, the bottleneck is flagged, and the fix is prioritised.
            </p>
            <div style={{ background: 'rgba(1,118,211,0.06)', border: '1px solid rgba(1,118,211,0.2)', borderRadius: 10, padding: '12px 16px', position: 'relative', zIndex: 1, boxShadow: '0 2px 8px rgba(1,118,211,0.08),inset 0 1px 0 rgba(1,118,211,0.1)' }}>
              <div style={{ fontSize: 9, color: 'rgba(1,118,211,0.7)', fontFamily: 'monospace', letterSpacing: 1, marginBottom: 6, fontWeight: 700 }}>SUPE — AI ANALYSIS</div>
              <p style={{ fontSize: 12, color: '#4E4B45', lineHeight: 1.65, fontStyle: 'italic', margin: 0 }}>
                "Foam & Fabric is 21% over Takt with 3 open Kaizen events. Eliminate the 16s NVA walk before adding capacity — that closes the gap without equipment spend."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES ──────────────────────────────────────────────────────── */}
      <section className="constell-section" style={{ background: '#F0EDE5', padding: 'clamp(56px,7vh,80px) clamp(16px,4vw,48px)', borderTop: '0.5px solid #D8D5CE', borderBottom: '0.5px solid #D8D5CE' }}>
        <canvas className="constell-canvas" data-dark="false" />
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-block', fontSize: 9, color: 'rgba(1,118,211,0.8)', letterSpacing: 2.5, textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 14, fontWeight: 700, padding: '4px 12px', background: 'rgba(1,118,211,0.07)', border: '1px solid rgba(1,118,211,0.15)', borderRadius: 4 }}>Every industry</div>
            <h2 className="h2-light-shadow" style={{ fontFamily: '"Palatino Linotype",Georgia,serif', fontSize: 'clamp(22px,3vw,38px)', fontWeight: 700, color: '#1E1B17', lineHeight: 1.15, marginBottom: 14, letterSpacing: -.5 }}>
              Every process has a target.<br/>Every target has a path.
            </h2>
            <p style={{ fontSize: 14, color: '#6B6760', maxWidth: 540, margin: '0 auto', lineHeight: 1.8 }}>
              The tools in VeSiMy were built on manufacturing floors. But a bottleneck in a law firm looks exactly like a bottleneck on a production line. A root cause in a real estate transaction is found the same way as one in a factory. The method is universal.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(280px,100%),1fr))', gap: 16 }}>
            {([
              { label: 'Manufacturing', color: '#3070B8', tagline: 'Where it all started.', demoHref: '/auth/signup?ref=1',
                desc: 'VSM, time study, and kaizen built on 12 years of real floor experience. ISO 22468:2020 compliant. Automotive, food and beverage, aerospace, electronics.',
                examples: ['Assembly line bottleneck analysis', 'OEE and uptime tracking', 'SMED changeover reduction'] },
              { label: 'Healthcare', color: '#2A9E82', tagline: 'Patient flow is a value stream.', demoHref: '/auth/signup?demo=healthcare',
                desc: 'Intake to discharge. Admissions to billing. Every wait, every handoff, every rework step is measurable. Supe finds the bottleneck that costs beds and time.',
                examples: ['Patient flow mapping', 'Appointment scheduling waste', 'Medication error root cause'] },
              { label: 'Real Estate', color: '#0176D3', tagline: 'Days on market is cycle time.', demoHref: '/auth/signup?demo=realestate',
                desc: 'Lead to close is a process with steps, handoffs, and waiting. Fall-through rate is a defect rate. Supe tells you where deals die and what to fix first.',
                examples: ['Lead to close value stream', 'Financing delay root cause', 'Offer process bottleneck'] },
              { label: 'Legal & Professional Services', color: '#6426A0', tagline: 'Billable hours lost to waste.',
                desc: 'Case intake to resolution. Proposal to invoice. Rework, approval delays, and duplicate data entry cost firms thousands per matter — invisible until mapped.',
                examples: ['Matter lifecycle mapping', 'Discovery bottleneck analysis', 'Client onboarding waste'] },
              { label: 'Construction & Trades', color: '#C0402A', tagline: 'Every handoff is a wait time.',
                desc: 'Permit to certificate of occupancy. Subcontractor handoffs, material delays, and punch list rework are pure waste. Make the delays quantified and the fixes owned.',
                examples: ['Trade sequencing analysis', 'Punch list defect rate', 'Permit process mapping'] },
              { label: 'Craft Brewery & Winery', color: '#C0402A', tagline: 'Fermentation time is cycle time.', demoHref: '/auth/signup?demo=brewery',
                desc: 'A stuck sparge, a canning line seamer head issue, a barrel with TCA contamination — every brewing and winemaking problem is a process problem. Map your production flow and find the constraint.',
                examples: ['Batch fermentation value stream', 'Packaging line uptime analysis', 'Stuck sparge root cause'] },
              { label: 'Logistics & Supply Chain', color: '#1090D4', tagline: 'Every node is a process step.',
                desc: 'Order receipt to last-mile delivery. Pick rates, dock scheduling, carrier handoffs, returns — all measurable, all improvable with the same structured method.',
                examples: ['Warehouse pick process VSM', 'Returns root cause analysis', 'Dock scheduling kaizen'] },
            ] as any[]).map((ind: any) => (
              <div key={ind.label} className="card-lt" style={{ padding: '24px 22px' }}>
                <div className="card-stripe" style={{ background: ind.color }} />
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1E1B17', textShadow: '0 1px 2px rgba(0,0,0,0.09)' }}>{ind.label}</div>
                  <div style={{ fontSize: 11, color: ind.color, fontWeight: 600, fontFamily: 'monospace' }}>{ind.tagline}</div>
                </div>
                <p style={{ fontSize: 12.5, color: '#6B6760', lineHeight: 1.7, marginBottom: 12 }}>{ind.desc}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {ind.examples.map((ex: string) => (
                    <div key={ex} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: ind.color, flexShrink: 0, opacity: 0.7 }} />
                      <span style={{ fontSize: 11, color: '#8E8A82' }}>{ex}</span>
                    </div>
                  ))}
                </div>
                {ind.demoHref && (
                  <div style={{ marginTop: 12, paddingTop: 10, borderTop: '0.5px solid #E8E5E0' }}>
                    <a href={ind.demoHref} style={{ fontSize: 11, fontWeight: 700, color: ind.color, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      Try this demo →
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <p style={{ fontSize: 13, color: '#8E8A82', marginBottom: 16 }}>Don't see your industry? If you have a process, VeSiMy works for you.</p>
            <a href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 24px', background: '#0176D3', color: '#0D0C0A', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              Start free — map your first process →
            </a>
          </div>
        </div>
      </section>

            {/* ── COMPETITOR COMPARISON ─────────────────────────────────────────────── */}
      <CompetitorTable />


      {/* ── CHANGELOG / WHAT'S NEW ──────────────────────────────────────────── */}
      <section style={{ background: '#FFFFFF', padding: 'clamp(56px,7vh,80px) clamp(16px,4vw,48px)', borderTop: '0.5px solid #D8D5CE', borderBottom: '0.5px solid #D8D5CE' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, marginBottom: 48, flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'inline-block', fontSize: 9, color: 'rgba(1,118,211,0.8)', letterSpacing: 2.5, textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 14, fontWeight: 700, padding: '4px 12px', background: 'rgba(1,118,211,0.07)', border: '1px solid rgba(1,118,211,0.15)', borderRadius: 4 }}>What's new — Version 3</div>
              <h2 className="h2-light-shadow" style={{ fontFamily: '"Palatino Linotype",Georgia,serif', fontSize: 'clamp(22px,3vw,38px)', fontWeight: 700, color: '#1E1B17', lineHeight: 1.15, marginBottom: 14, letterSpacing: -.5 }}>
                Built for your industry.<br/>Not adapted for it.
              </h2>
              <p style={{ fontSize: 14, color: '#6B6760', maxWidth: 480, lineHeight: 1.8 }}>
                VeSiMy v3 is the most significant update since launch. Every part of the product now adapts to the industry you work in — your language, your reference projects, your learning content.
              </p>
            </div>
            <a href="/changelog" style={{ fontSize: 12, color: 'var(--brand)', fontWeight: 600, textDecoration: 'none', flexShrink: 0, marginTop: 8 }}>Full changelog →</a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap: 20 }}>
            {([
              {
                tag: 'MAJOR',
                color: '#0176D3',
                title: '66-industry reference projects',
                date: 'March 2026',
                body: "Every supported industry now has a fully built reference project — populated with real bottleneck data, 5 Why root cause analysis, fishbone, kaizen events, improvement goals, and PDCA. You get a complete working example on day one, in your own industry's language.",
                items: ['All 9 CI tools populated: stopwatch, fishbone, 5 Why, waste ID, kaizen, PDCA, SMED, improvement goals', 'Real root causes, not placeholder text', 'Industry-specific process steps and terminology', 'Serves as a learning tool and a data template'],
              },
              {
                tag: 'MAJOR',
                color: '#2E844A',
                title: 'Industry language engine',
                date: 'March 2026',
                body: 'Your workspace now speaks the language of the field you selected at onboarding. A nurse never sees "WIP". A brewer never sees "takt time" without context. A lawyer never sees "operator". Every term — cycle time, defect, gemba, kaizen — adapts to your industry.',
                items: ['62 industries, 40+ adapted terms each', 'Applies across dashboard, tools, AI coaching, and learning center', 'No cross-industry terminology bleed', 'Fully reflected in Supe AI responses'],
              },
              {
                tag: 'MAJOR',
                color: '#8C44CC',
                title: 'Industry-aware onboarding',
                date: 'March 2026',
                body: 'New accounts are now guided through a 4-step onboarding wizard. Industry selection is the first and most important step — it determines everything else: reference projects loaded, language used, templates offered, and learning content shown. No generic start screen.',
                items: ['4-step wizard: Industry → Role → First Project → Launch', 'Industry-specific process templates (15+ industry groups)', 'Language preview before you confirm', 'Reference project seeded for your industry only — zero cross-industry projects'],
              },
              {
                tag: 'IMPROVEMENT',
                color: '#C0402A',
                title: 'Industry watermarks',
                date: 'March 2026',
                body: 'Each industry now has a unique SVG watermark displayed as a subtle background element in the workspace. Manufacturing gets interlocking gears. Healthcare gets a stethoscope. Aviation gets an aircraft silhouette. Real estate gets a house. 40+ unique watermarks — one per industry group.',
                items: ['40+ unique SVG watermarks — one per industry group', 'Fixed position, opacity 0.038 — visible but not distracting', 'Monochrome brand blue', 'Auto-switches when industry changes'],
              },
              {
                tag: 'IMPROVEMENT',
                color: '#0176D3',
                title: 'Industry-aware learning center',
                date: 'March 2026',
                body: 'The Learning Center now reads your industry and rewrites every explanation, example, and FAQ in your terminology. Takt Time becomes Length of Stay in healthcare. Process step becomes Trade Stage in construction. Defect becomes Adverse Event in clinical settings. Every concept, in your language.',
                items: ['Manual, Glossary, and FAQs all adapt to industry', 'Examples reference your actual process context', 'No manufacturing language in healthcare accounts', 'Glossary terms defined with industry-specific examples'],
              },
              {
                tag: 'IMPROVEMENT',
                color: '#2E844A',
                title: 'Account isolation by industry',
                date: 'March 2026',
                body: 'When you select an industry at onboarding, only the reference project for that exact industry is seeded. A brewery account never receives a law firm reference project. Every API call filters by industry. Cross-industry terminology is blocked throughout the account until explicitly overridden.',
                items: ['Reference projects filtered to your industry only', 'Cross-industry language eliminated', 'Separate projects can be created for other industries', 'Profile-level industry setting drives everything'],
              },
            ] as any[]).map((item: any) => (
              <div key={item.title} style={{ background: '#F8F6F0', border: '1px solid #E8E5E0', borderRadius: 14, padding: '22px 22px 20px', display: 'flex', flexDirection: 'column', gap: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, fontFamily: 'monospace', color: item.color, background: `${item.color}14`, border: `1px solid ${item.color}30`, borderRadius: 4, padding: '3px 8px' }}>{item.tag}</span>
                  <span style={{ fontSize: 10, color: '#8E8A82', fontFamily: 'monospace' }}>{item.date}</span>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1E1B17', marginBottom: 10, lineHeight: 1.3 }}>{item.title}</h3>
                <p style={{ fontSize: 12.5, color: '#6B6760', lineHeight: 1.75, marginBottom: 14 }}>{item.body}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 'auto' }}>
                  {item.items.map((pt: string) => (
                    <div key={pt} style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: item.color, flexShrink: 0, marginTop: 5, opacity: 0.7 }} />
                      <span style={{ fontSize: 11.5, color: '#514F4D', lineHeight: 1.5 }}>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUOTE ───────────────────────────────────────────────────────────── */}
      <div style={{ padding: 'clamp(40px,5vw,64px) clamp(16px,4vw,48px)', textAlign: 'center', background: '#F8F6F0', borderTop: '3px solid #0176D3' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <p style={{ fontSize: 'clamp(18px,2.5vw,24px)', fontWeight: 500, color: '#242220', lineHeight: 1.55, marginBottom: 14, fontFamily: serif }}>
            "The ability to add individual steps per operator with times is exactly what we needed. The designator for value-add and non value-add per operator step and the Yamazumi — that's the workflow."
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#0176D3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#0D0C0A' }}>CI</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#242220' }}>Continuous Improvement Practitioner</div>
              <div style={{ fontSize: 11, color: '#8E8A82' }}>Lean manufacturing professional, early user feedback</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── PRICING ─────────────────────────────────────────────────────────── */}
      <section id="pricing" className="sec-pad" style={{ padding: 'clamp(56px,7vh,80px) clamp(16px,4vw,48px)', background: 'radial-gradient(ellipse 70% 50% at 50% 0%,rgba(1,118,211,0.07),transparent 55%),linear-gradient(180deg,#1A1714,#131110)' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ display: 'inline-block', fontSize: 9, color: 'rgba(1,118,211,0.8)', letterSpacing: 2.5, textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 14, fontWeight: 700, padding: '4px 12px', background: 'rgba(1,118,211,0.07)', border: '1px solid rgba(1,118,211,0.15)', borderRadius: 4 }}>Pricing</div>
            <h2 className="h2-dark-shadow" style={{ fontSize: 'clamp(26px,3vw,42px)', fontWeight: 700, color: '#F8F7F5', marginBottom: 12, fontFamily: serif, letterSpacing: -.5 }}>Simple, honest pricing.</h2>
            <p style={{ fontSize: 14, color: 'rgba(248,247,245,0.42)', maxWidth: 480, margin: '0 auto', lineHeight: 1.8 }}>Free plan: unlimited projects, all 9 CI tools — no credit card, no expiry. Pro adds Supe AI, process simulation, and the A3 export. First upgrade includes a 14-day free trial.</p>
          </div>

          <div className="plan-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(240px,100%),1fr))', gap: 16 }}>
            {(Object.entries(PLANS) as any[]).map(([key, plan]) => {
              const isPro = key === 'pro'
              const isLife = key === 'lifetime'
              const isEnt = key === 'enterprise'
              return (
                <div key={key} className={`card-dk ${isLife ? 'pricing-card-lifetime' : ''}`} style={{ padding: '28px 24px', ...(isPro || isLife ? { background: 'linear-gradient(155deg,rgba(52,44,28,0.97),rgba(34,30,20,0.99))', borderTop: '1px solid rgba(1,118,211,0.3)', borderLeft: '1px solid rgba(1,118,211,0.15)' } : {}) }}>
                  {(isPro || isLife) && (
                    <div style={{ display: 'inline-flex', background: '#0176D3', color: '#fff', fontSize: 9, fontWeight: 700, padding: '3px 14px', borderRadius: 999, letterSpacing: 1.5, marginBottom: 12 }}>
                      {isLife ? 'BEST VALUE' : 'MOST POPULAR'}
                    </div>
                  )}
                  <div style={{ fontSize: 9, color: 'rgba(248,247,245,0.35)', letterSpacing: 2, fontWeight: 700, marginBottom: 10, fontFamily: 'monospace', textTransform: 'uppercase' }}>{plan.name}</div>
                  <div style={{ fontSize: 38, fontWeight: 700, color: '#F8F7F5', marginBottom: 6, lineHeight: 1, fontFamily: serif, textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                    {isEnt ? 'Custom' : plan.price === 0 ? 'Free' : `$${plan.price}`}
                    {!isEnt && plan.price !== null && Number(plan.price) > 0 && (
                      <span style={{ fontSize: 13, fontWeight: 400, color: '#8E8A82', marginLeft: 4 }}>{isLife ? ' once' : '/mo'}</span>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: 'rgba(248,247,245,0.38)', marginBottom: 18, lineHeight: 1.65, minHeight: 40 }}>{plan.description}</p>
                  <ul style={{ listStyle: 'none', marginBottom: 22, display: 'flex', flexDirection: 'column', gap: 9 }}>
                    {plan.features.map((f: string) => (
                      <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 13, color: '#4E4B45', lineHeight: 1.5 }}>
                        <CheckIcon size={13} color="#0176D3" style={{ marginTop: 3, flexShrink: 0 }} /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={isEnt ? '/enterprise' : plan.price === 0 ? '/auth/signup' : `/auth/signup?plan=${key}`}
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '11px 20px', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none', background: isPro || isLife ? '#0176D3' : 'transparent', color: isPro || isLife ? '#fff' : '#4E4B45', border: isPro || isLife ? 'none' : '1px solid #D8D5CE' }}
                  >
                    {plan.cta}
                  </Link>

                </div>
              )
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Link href="/pricing" style={{ fontSize: 13, color: '#8E8A82', textDecoration: 'none', borderBottom: '1px solid #D8D5CE', paddingBottom: 2 }}>
              View full pricing details →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────────────────── */}
      <div style={{ background: '#231F1B', padding: 'clamp(48px,6vw,72px) clamp(16px,4vw,48px)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 700, color: '#F8F6F0', fontFamily: serif, marginBottom: 10 }}>
          Your next kaizen event starts here —<br />not in a <span className="gold-3d">spreadsheet.</span>
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(248,246,240,0.35)', marginBottom: 24 }}>Free for every employee. Unlimited projects. No credit card.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/auth/signup" style={{ padding: '14px 38px', background: '#0176D3', color: '#0D0C0A', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
            Start free. No card needed.
          </Link>
          <Link href="/auth/signup?ref=1" style={{ padding: '14px 24px', background: 'transparent', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 10, fontSize: 15, textDecoration: 'none' }}>
            Explore a fully-built sample project →
          </Link>
        </div>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)', marginTop: 16 }}>
          ISO 9001:2015 · ISO 22468:2020 · IATF 16949 aligned
        </p>
      </div>

      {/* ── CONSTELLATION SCRIPT ─────────────────────────────────────────── */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function(){
          var canvases=document.querySelectorAll('.constell-canvas');
          canvases.forEach(function(cv){
            var dark=cv.getAttribute('data-dark')!=='false';
            var par=cv.parentElement,ctx=cv.getContext('2d');
            var W,H,ns=[],rf,f=0;
            var N=dark?55:38,MD=dark?160:125,AO=dark?.18:.05,NO=dark?.24:.07,V=dark?.15:.09;
            function init(){W=cv.width=par.offsetWidth;H=cv.height=par.offsetHeight;ns=[];for(var i=0;i<N;i++)ns.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*V,vy:(Math.random()-.5)*V,r:Math.random()>.82?(dark?2.5:1.7):(dark?1.1:.7),b:Math.random()>.72,ph:Math.random()*Math.PI*2,sp:.007+Math.random()*.012})}
            function tick(){ctx.clearRect(0,0,W,H);f++;
              ns.forEach(function(n){n.x+=n.vx;n.y+=n.vy;if(n.x<-30)n.x=W+30;if(n.x>W+30)n.x=-30;if(n.y<-30)n.y=H+30;if(n.y>H+30)n.y=-30});
              for(var i=0;i<ns.length;i++)for(var j=i+1;j<ns.length;j++){var dx=ns[i].x-ns[j].x,dy=ns[i].y-ns[j].y,d=Math.sqrt(dx*dx+dy*dy);if(d<MD){ctx.strokeStyle='rgba(1,118,211,'+((1-d/MD)*AO)+')';ctx.lineWidth=dark?.5:.3;ctx.beginPath();ctx.moveTo(ns[i].x,ns[i].y);ctx.lineTo(ns[j].x,ns[j].y);ctx.stroke()}}
              ns.forEach(function(n){var p=n.b?(NO*.7+Math.sin(f*n.sp+n.ph)*NO*.5):NO*.4;ctx.fillStyle='rgba(1,118,211,'+p+')';ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,Math.PI*2);ctx.fill()});
              rf=requestAnimationFrame(tick)}
            init();tick();
            window.addEventListener('resize',function(){cancelAnimationFrame(rf);init();tick()});
          });
        })();
      ` }} />

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="footer-wrap" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: 'clamp(20px,3vw,28px) clamp(16px,4vw,48px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, background: '#1A1714' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <VLogoMark size={28} />
          <VeSiMyWordmark size={16} />
        </div>
        <div className="footer-links" style={{ display: 'flex', gap: 22, fontSize: 12, color: 'rgba(248,247,245,0.4)', flexWrap: 'wrap' }}>
          {[['About', '/about'], ['Blog', '/blog'], ['Changelog', '/changelog'], ['Pricing', '/pricing'], ['Privacy', '/privacy'], ['Terms', '/terms'], ['Contact', 'mailto:founder@vesimy.com']].map(([l, h]) => (
            <Link key={l} href={h} style={{ color: 'inherit', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#0176D3')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(248,247,245,0.4)')}>
              {l}
            </Link>
          ))}
        </div>
        <span style={{ fontSize: 11, color: 'rgba(248,247,245,0.2)', letterSpacing: 1.5, fontFamily: 'monospace', textTransform: 'uppercase' }}>© 2026 VeSiMy</span>
      </footer>
    </div>
  )
}
