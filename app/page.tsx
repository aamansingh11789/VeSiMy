'use client'
// @ts-nocheck
// ── app/page.tsx — VeSiMy Homepage ───────────────────────────────────────────

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { VLogoMark, VeSiMyWordmark, VesimyLogo } from '@/components/ui/Logo'
import { PLANS } from '@/lib/stripe'
import { CheckIcon, ArrowRightIcon } from '@/components/ui/Icons'

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

// ── Inline 3D VSM step box ────────────────────────────────────────────────────



// ── IndustryLoop — large cycling industry names below headline ───────────────
const INDUSTRIES = ['Automotive','Aerospace','Food & Beverage','Medical Devices','Logistics','Electronics','Pharmaceuticals','Industrial']

function IndustryLoop() {
  const [idx, setIdx] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setIdx(i => (i + 1) % INDUSTRIES.length)
        setFading(false)
      }, 320)
    }, 2200)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{ height: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 28, gap: 4 }}>
      <span style={{ fontSize: 11, color: 'rgba(248,247,245,0.3)', letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'monospace' }}>Built for</span>
      <span style={{
        fontSize: 'clamp(22px,3.5vw,34px)',
        fontWeight: 700,
        color: '#C49B2E',
        letterSpacing: -0.3,
        fontFamily: serif,
        opacity: fading ? 0 : 1,
        transform: fading ? 'translateY(6px)' : 'translateY(0)',
        transition: 'opacity 0.32s ease, transform 0.32s ease',
        display: 'block',
        minHeight: '1.2em',
      }}>
        {INDUSTRIES[idx]}
      </span>
    </div>
  )
}


// ── Tool Showcase ─────────────────────────────────────────────────────────────

const _G='#C49B2E',_R='#C0402A',_GR='#2A9E82',_V='#6426A0',_ST='#3070B8'

const SHOWCASE_TOOLS=[
  {
    name:'Value Stream Map',short:'VSM',color:_ST,
    tag:'Core',tagBg:'#EEF4FB',tagTxt:'#1A4F8A',
    headline:'See your entire process at once',
    body:'Map every step, every wait, every handoff. Bottleneck steps flag red automatically against your Takt Time. PCE calculates live. Export as A3 ISO\u00a022468:2020 with full data boxes, WIP triangles, and timeline.',
    cardContent:`<div style="padding:0;font-family:sans-serif;overflow:hidden">
      <svg viewBox="0 0 420 200" style="width:100%;display:block">
        <rect width="420" height="200" fill="#FFFFFF"/>
        <text x="210" y="13" text-anchor="middle" fill="#1F2937" font-size="7.5" font-weight="700" font-family="sans-serif">Current-State Value Stream Map — Seat Assembly Line 4</text>
        <rect x="155" y="18" width="110" height="32" fill="#A7F3D0" stroke="#059669" stroke-width="1.2" rx="3"/>
        <text x="210" y="30" text-anchor="middle" fill="#065F46" font-size="7" font-weight="700" font-family="sans-serif">Production</text>
        <text x="210" y="40" text-anchor="middle" fill="#065F46" font-size="7" font-weight="700" font-family="sans-serif">Control</text>
        <rect x="8" y="48" width="48" height="42" fill="#5B7FA6" stroke="#3A5A7C" stroke-width="1" rx="2"/>
        <polygon points="8,60 32,48 56,60" fill="#4A6A8F" stroke="#3A5A7C" stroke-width="1"/>
        <rect x="14" y="64" width="7" height="7" fill="#C8DCF0" rx="1"/>
        <rect x="24" y="64" width="7" height="7" fill="#C8DCF0" rx="1"/>
        <rect x="34" y="64" width="7" height="7" fill="#C8DCF0" rx="1"/>
        <rect x="28" y="78" width="8" height="12" fill="#3A5A7C" rx="1"/>
        <text x="32" y="102" text-anchor="middle" fill="#1F2937" font-size="7" font-weight="700" font-family="sans-serif">Supplier</text>
        <rect x="364" y="48" width="48" height="42" fill="#5B7FA6" stroke="#3A5A7C" stroke-width="1" rx="2"/>
        <polygon points="364,60 388,48 412,60" fill="#4A6A8F" stroke="#3A5A7C" stroke-width="1"/>
        <rect x="370" y="64" width="7" height="7" fill="#C8DCF0" rx="1"/>
        <rect x="380" y="64" width="7" height="7" fill="#C8DCF0" rx="1"/>
        <rect x="390" y="64" width="7" height="7" fill="#C8DCF0" rx="1"/>
        <rect x="384" y="78" width="8" height="12" fill="#3A5A7C" rx="1"/>
        <text x="388" y="102" text-anchor="middle" fill="#1F2937" font-size="7" font-weight="700" font-family="sans-serif">Customer</text>
        <line x1="155" y1="34" x2="60" y2="72" stroke="#0EA5E9" stroke-width="1" stroke-dasharray="3,2" marker-end="url(#ia)" opacity="0.7"/>
        <line x1="265" y1="34" x2="360" y2="72" stroke="#0EA5E9" stroke-width="1" stroke-dasharray="3,2" marker-end="url(#ia)" opacity="0.7"/>
        <defs><marker id="ia" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto"><polygon points="0 0,5 2,0 4" fill="#0EA5E9"/></marker><marker id="ma" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto"><polygon points="0 0,5 2,0 4" fill="#374151"/></marker></defs>
        <g>
          <rect x="62" y="108" width="52" height="38" fill="#CCFBF1" stroke="#0D9488" stroke-width="1" rx="1"/>
          <text x="88" y="118" text-anchor="middle" fill="#065F46" font-size="6.5" font-weight="700" font-family="sans-serif">Staging</text>
          <circle cx="74" cy="138" r="4" fill="#fff" stroke="#0D9488" stroke-width="0.8"/>
          <circle cx="74" cy="134" r="2.5" fill="#0D9488"/>
          <rect x="62" y="146" width="52" height="40" fill="#FFFFFF" stroke="#0D9488" stroke-width="1"/>
          <line x1="62" y1="159" x2="114" y2="159" stroke="#E5E7EB" stroke-width="0.6"/>
          <line x1="62" y1="172" x2="114" y2="172" stroke="#E5E7EB" stroke-width="0.6"/>
          <text x="66" y="157" fill="#6B7280" font-size="5.5" font-family="monospace">C/T =</text><text x="88" y="157" fill="#0D9488" font-size="6" font-weight="700" font-family="monospace">45s</text>
          <text x="66" y="170" fill="#6B7280" font-size="5.5" font-family="monospace">C/O =</text><text x="88" y="170" fill="#374151" font-size="6" font-family="monospace">0s</text>
          <text x="66" y="183" fill="#6B7280" font-size="5.5" font-family="monospace">Uptime</text><text x="90" y="183" fill="#374151" font-size="6" font-family="monospace">95%</text>
        </g>
        <polygon points="118,118 125,108 132,118" fill="#FEF3C7" stroke="#D97706" stroke-width="1"/>
        <text x="125" y="116" text-anchor="middle" fill="#92400E" font-size="5.5" font-weight="700" font-family="sans-serif">12</text>
        <line x1="114" y1="127" x2="131" y2="127" stroke="#374151" stroke-width="1" marker-end="url(#ma)"/>
        <text x="120" y="122" fill="#374151" font-size="5" font-family="sans-serif">push</text>
        <g>
          <rect x="134" y="108" width="52" height="38" fill="#CCFBF1" stroke="#0D9488" stroke-width="1" rx="1"/>
          <text x="160" y="118" text-anchor="middle" fill="#065F46" font-size="6.5" font-weight="700" font-family="sans-serif">Frame Asm</text>
          <circle cx="146" cy="138" r="4" fill="#fff" stroke="#0D9488" stroke-width="0.8"/>
          <circle cx="146" cy="134" r="2.5" fill="#0D9488"/>
          <circle cx="156" cy="138" r="4" fill="#fff" stroke="#0D9488" stroke-width="0.8"/>
          <circle cx="156" cy="134" r="2.5" fill="#0D9488"/>
          <rect x="134" y="146" width="52" height="40" fill="#FFFFFF" stroke="#0D9488" stroke-width="1"/>
          <line x1="134" y1="159" x2="186" y2="159" stroke="#E5E7EB" stroke-width="0.6"/>
          <line x1="134" y1="172" x2="186" y2="172" stroke="#E5E7EB" stroke-width="0.6"/>
          <text x="138" y="157" fill="#6B7280" font-size="5.5" font-family="monospace">C/T =</text><text x="160" y="157" fill="#0D9488" font-size="6" font-weight="700" font-family="monospace">98s</text>
          <text x="138" y="170" fill="#6B7280" font-size="5.5" font-family="monospace">C/O =</text><text x="160" y="170" fill="#374151" font-size="6" font-family="monospace">300s</text>
          <text x="138" y="183" fill="#6B7280" font-size="5.5" font-family="monospace">Uptime</text><text x="162" y="183" fill="#374151" font-size="6" font-family="monospace">92%</text>
        </g>
        <polygon points="190,118 197,108 204,118" fill="#FEF3C7" stroke="#D97706" stroke-width="1"/>
        <text x="197" y="116" text-anchor="middle" fill="#92400E" font-size="5.5" font-weight="700" font-family="sans-serif">6</text>
        <line x1="186" y1="127" x2="203" y2="127" stroke="#374151" stroke-width="1" marker-end="url(#ma)"/>
        <g>
          <rect x="206" y="108" width="52" height="38" fill="#FEE2E2" stroke="#DC2626" stroke-width="1.5" rx="1"/>
          <text x="232" y="116" text-anchor="middle" fill="#7F1D1D" font-size="6" font-weight="700" font-family="sans-serif">Foam &amp;</text>
          <text x="232" y="124" text-anchor="middle" fill="#7F1D1D" font-size="6" font-weight="700" font-family="sans-serif">Fabric</text>
          <text x="254" y="117" text-anchor="end" fill="#DC2626" font-size="5.5" font-weight="700" font-family="sans-serif">▲TAKT</text>
          <circle cx="218" cy="138" r="4" fill="#fff" stroke="#DC2626" stroke-width="0.8"/>
          <circle cx="218" cy="134" r="2.5" fill="#DC2626"/>
          <circle cx="228" cy="138" r="4" fill="#fff" stroke="#DC2626" stroke-width="0.8"/>
          <circle cx="228" cy="134" r="2.5" fill="#DC2626"/>
          <circle cx="238" cy="138" r="4" fill="#fff" stroke="#DC2626" stroke-width="0.8"/>
          <circle cx="238" cy="134" r="2.5" fill="#DC2626"/>
          <rect x="206" y="146" width="52" height="40" fill="#FFFFFF" stroke="#DC2626" stroke-width="1"/>
          <line x1="206" y1="159" x2="258" y2="159" stroke="#E5E7EB" stroke-width="0.6"/>
          <line x1="206" y1="172" x2="258" y2="172" stroke="#E5E7EB" stroke-width="0.6"/>
          <text x="210" y="157" fill="#6B7280" font-size="5.5" font-family="monospace">C/T =</text><text x="232" y="157" fill="#DC2626" font-size="6" font-weight="700" font-family="monospace">145s</text>
          <text x="210" y="170" fill="#6B7280" font-size="5.5" font-family="monospace">C/O =</text><text x="232" y="170" fill="#374151" font-size="6" font-family="monospace">600s</text>
          <text x="210" y="183" fill="#6B7280" font-size="5.5" font-family="monospace">Uptime</text><text x="234" y="183" fill="#374151" font-size="6" font-family="monospace">88%</text>
          <polygon points="250,105 256,96 262,105" fill="#DC2626" opacity="0.9"/>
          <polygon points="253,104 256,99 259,104" fill="#FF8888"/>
        </g>
        <polygon points="262,118 269,108 276,118" fill="#FEE2E2" stroke="#DC2626" stroke-width="1"/>
        <text x="269" y="116" text-anchor="middle" fill="#7F1D1D" font-size="5.5" font-weight="700" font-family="sans-serif">18</text>
        <line x1="258" y1="127" x2="275" y2="127" stroke="#374151" stroke-width="1" marker-end="url(#ma)"/>
        <g>
          <rect x="278" y="108" width="52" height="38" fill="#CCFBF1" stroke="#0D9488" stroke-width="1" rx="1"/>
          <text x="304" y="118" text-anchor="middle" fill="#065F46" font-size="6.5" font-weight="700" font-family="sans-serif">Electrical</text>
          <circle cx="290" cy="138" r="4" fill="#fff" stroke="#0D9488" stroke-width="0.8"/>
          <circle cx="290" cy="134" r="2.5" fill="#0D9488"/>
          <circle cx="300" cy="138" r="4" fill="#fff" stroke="#0D9488" stroke-width="0.8"/>
          <circle cx="300" cy="134" r="2.5" fill="#0D9488"/>
          <rect x="278" y="146" width="52" height="40" fill="#FFFFFF" stroke="#0D9488" stroke-width="1"/>
          <line x1="278" y1="159" x2="330" y2="159" stroke="#E5E7EB" stroke-width="0.6"/>
          <line x1="278" y1="172" x2="330" y2="172" stroke="#E5E7EB" stroke-width="0.6"/>
          <text x="282" y="157" fill="#6B7280" font-size="5.5" font-family="monospace">C/T =</text><text x="304" y="157" fill="#0D9488" font-size="6" font-weight="700" font-family="monospace">88s</text>
          <text x="282" y="170" fill="#6B7280" font-size="5.5" font-family="monospace">C/O =</text><text x="304" y="170" fill="#374151" font-size="6" font-family="monospace">0s</text>
          <text x="282" y="183" fill="#6B7280" font-size="5.5" font-family="monospace">Uptime</text><text x="306" y="183" fill="#374151" font-size="6" font-family="monospace">99%</text>
        </g>
        <line x1="330" y1="127" x2="347" y2="127" stroke="#374151" stroke-width="1" marker-end="url(#ma)"/>
        <g>
          <rect x="350" y="108" width="48" height="38" fill="#CCFBF1" stroke="#0D9488" stroke-width="1" rx="1"/>
          <text x="374" y="118" text-anchor="middle" fill="#065F46" font-size="6.5" font-weight="700" font-family="sans-serif">Final QC</text>
          <circle cx="362" cy="138" r="4" fill="#fff" stroke="#0D9488" stroke-width="0.8"/>
          <circle cx="362" cy="134" r="2.5" fill="#0D9488"/>
          <rect x="350" y="146" width="48" height="40" fill="#FFFFFF" stroke="#0D9488" stroke-width="1"/>
          <line x1="350" y1="159" x2="398" y2="159" stroke="#E5E7EB" stroke-width="0.6"/>
          <line x1="350" y1="172" x2="398" y2="172" stroke="#E5E7EB" stroke-width="0.6"/>
          <text x="354" y="157" fill="#6B7280" font-size="5.5" font-family="monospace">C/T =</text><text x="376" y="157" fill="#0D9488" font-size="6" font-weight="700" font-family="monospace">72s</text>
          <text x="354" y="170" fill="#6B7280" font-size="5.5" font-family="monospace">C/O =</text><text x="376" y="170" fill="#374151" font-size="6" font-family="monospace">0s</text>
          <text x="354" y="183" fill="#6B7280" font-size="5.5" font-family="monospace">Uptime</text><text x="378" y="183" fill="#374151" font-size="6" font-family="monospace">100%</text>
        </g>
        <line x1="56" y1="72" x2="62" y2="108" stroke="#374151" stroke-width="1" marker-end="url(#ma)"/>
        <line x1="398" y1="108" x2="400" y2="90" stroke="#374151" stroke-width="1"/>
        <line x1="400" y1="90" x2="364" y2="72" stroke="#374151" stroke-width="1" marker-end="url(#ma)"/>
      </svg>
    </div>`,
    popup:`
      <div style="background:#F5F5F8;border-bottom:1px solid #D8D5CE;padding:10px 14px;display:flex;align-items:center;gap:7px">
        <div style="display:flex;gap:3px"><div style="width:8px;height:8px;border-radius:50%;background:#FF6B6B"></div><div style="width:8px;height:8px;border-radius:50%;background:#F4A623"></div><div style="width:8px;height:8px;border-radius:50%;background:#1DD1A1"></div></div>
        <span style="font-size:10px;color:#8E8A82;font-family:monospace;flex:1;text-align:center">VSM Map · Seat Assembly Line 4 · Current State</span>
        <span style="font-size:8px;font-weight:700;padding:2px 6px;border-radius:4px;background:#EEF4FB;color:#1A4F8A;font-family:monospace">ISO 22468</span>
      </div>
      <div style="padding:12px">
        <div style="display:flex;gap:2px;margin-bottom:10px">
          <div style="flex:1;padding:6px 4px;text-align:center;border-right:1px solid #D8D5CE"><div style="font-size:7px;color:#8E8A82;letter-spacing:.8px;font-family:monospace;margin-bottom:2px">TOTAL CT</div><div style="font-size:10px;font-weight:700;color:#C49B2E">8m 14s</div></div>
          <div style="flex:1;padding:6px 4px;text-align:center;border-right:1px solid #D8D5CE"><div style="font-size:7px;color:#8E8A82;letter-spacing:.8px;font-family:monospace;margin-bottom:2px">WAIT</div><div style="font-size:10px;font-weight:700;color:#8E8A82">6m 12s</div></div>
          <div style="flex:1;padding:6px 4px;text-align:center;border-right:1px solid #D8D5CE"><div style="font-size:7px;color:#8E8A82;letter-spacing:.8px;font-family:monospace;margin-bottom:2px">TAKT</div><div style="font-size:10px;font-weight:700;color:#C49B2E">2m 00s</div></div>
          <div style="flex:1;padding:6px 4px;text-align:center;border-right:1px solid #D8D5CE"><div style="font-size:7px;color:#8E8A82;letter-spacing:.8px;font-family:monospace;margin-bottom:2px">PCE</div><div style="font-size:10px;font-weight:700;color:#C0402A">34%</div></div>
          <div style="flex:1.4;padding:6px 4px;text-align:center"><div style="font-size:7px;color:#8E8A82;letter-spacing:.8px;font-family:monospace;margin-bottom:2px">BOTTLENECK</div><div style="font-size:9px;font-weight:700;color:#C0402A">Foam & Fabric</div></div>
        </div>
        <div style="overflow-x:auto;border:1px solid #D8D5CE;border-radius:8px">
          <svg viewBox="0 0 500 148" style="min-width:500px;display:block;background:#fff">
            <defs><marker id="vp" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto"><polygon points="0 0,5 2,0 4" fill="#374151"/></marker></defs>
            <rect x="8" y="8" width="40" height="32" fill="#5B7FA6" stroke="#3A5A7C" stroke-width="1" rx="1"/>
            <polygon points="8,17 28,8 48,17" fill="#4A6A8F"/>
            <rect x="22" y="24" width="5" height="5" fill="#C8DCF0"/>
            <text x="28" y="50" text-anchor="middle" fill="#1F2937" font-size="6" font-weight="700">Supplier</text>
            <line x1="48" y1="24" x2="63" y2="24" stroke="#374151" stroke-width="1" marker-end="url(#vp)"/>
            <g><rect x="64" y="8" width="64" height="42" fill="#CCFBF1" stroke="#0D9488" stroke-width="1" rx="1"/><text x="96" y="18" text-anchor="middle" fill="#065F46" font-size="7" font-weight="700">Staging</text><circle cx="78" cy="38" r="3.5" fill="#fff" stroke="#0D9488" stroke-width="0.8"/><circle cx="78" cy="35" r="2" fill="#0D9488"/><rect x="64" y="50" width="64" height="38" fill="#fff" stroke="#0D9488" stroke-width="1"/><text x="68" y="62" fill="#6B7280" font-size="6" font-family="monospace">C/T = 45s</text><text x="68" y="74" fill="#6B7280" font-size="6" font-family="monospace">C/O = 0s</text><text x="68" y="86" fill="#6B7280" font-size="6" font-family="monospace">Up= 95%</text></g>
            <polygon points="131,16 137,8 143,16" fill="#FEF3C7" stroke="#D97706" stroke-width="1"/><text x="137" y="14" text-anchor="middle" fill="#92400E" font-size="5" font-weight="700">12</text>
            <line x1="128" y1="29" x2="150" y2="29" stroke="#374151" stroke-width="1" marker-end="url(#vp)"/>
            <g><rect x="152" y="8" width="64" height="42" fill="#CCFBF1" stroke="#0D9488" stroke-width="1" rx="1"/><text x="184" y="18" text-anchor="middle" fill="#065F46" font-size="7" font-weight="700">Frame Asm</text><circle cx="166" cy="38" r="3.5" fill="#fff" stroke="#0D9488" stroke-width="0.8"/><circle cx="166" cy="35" r="2" fill="#0D9488"/><circle cx="176" cy="38" r="3.5" fill="#fff" stroke="#0D9488" stroke-width="0.8"/><circle cx="176" cy="35" r="2" fill="#0D9488"/><rect x="152" y="50" width="64" height="38" fill="#fff" stroke="#0D9488" stroke-width="1"/><text x="156" y="62" fill="#6B7280" font-size="6" font-family="monospace">C/T = 98s</text><text x="156" y="74" fill="#6B7280" font-size="6" font-family="monospace">C/O = 300s</text><text x="156" y="86" fill="#6B7280" font-size="6" font-family="monospace">Up= 92%</text></g>
            <polygon points="219,16 225,8 231,16" fill="#FEF3C7" stroke="#D97706" stroke-width="1"/><text x="225" y="14" text-anchor="middle" fill="#92400E" font-size="5" font-weight="700">6</text>
            <line x1="216" y1="29" x2="238" y2="29" stroke="#374151" stroke-width="1" marker-end="url(#vp)"/>
            <g><rect x="240" y="8" width="64" height="42" fill="#FEE2E2" stroke="#DC2626" stroke-width="1.5" rx="1"/><text x="272" y="17" text-anchor="middle" fill="#7F1D1D" font-size="6.5" font-weight="700">Foam &amp;</text><text x="272" y="25" text-anchor="middle" fill="#7F1D1D" font-size="6.5" font-weight="700">Fabric</text><text x="300" y="17" text-anchor="end" fill="#DC2626" font-size="5.5" font-weight="700">▲TAKT</text><circle cx="254" cy="38" r="3.5" fill="#fff" stroke="#DC2626" stroke-width="0.8"/><circle cx="254" cy="35" r="2" fill="#DC2626"/><circle cx="264" cy="38" r="3.5" fill="#fff" stroke="#DC2626" stroke-width="0.8"/><circle cx="264" cy="35" r="2" fill="#DC2626"/><circle cx="274" cy="38" r="3.5" fill="#fff" stroke="#DC2626" stroke-width="0.8"/><circle cx="274" cy="35" r="2" fill="#DC2626"/><rect x="240" y="50" width="64" height="38" fill="#fff" stroke="#DC2626" stroke-width="1"/><text x="244" y="62" fill="#6B7280" font-size="6" font-family="monospace">C/T =</text><text x="266" y="62" fill="#DC2626" font-size="6" font-weight="700" font-family="monospace">145s</text><text x="244" y="74" fill="#6B7280" font-size="6" font-family="monospace">C/O = 600s</text><text x="244" y="86" fill="#6B7280" font-size="6" font-family="monospace">Up= 88%</text><polygon points="296,4 302,0 308,4" fill="#DC2626" opacity="0.9"/><polygon points="298,4 302,1 306,4" fill="#FF8888"/></g>
            <polygon points="307,16 313,8 319,16" fill="#FEE2E2" stroke="#DC2626" stroke-width="1"/><text x="313" y="14" text-anchor="middle" fill="#7F1D1D" font-size="5" font-weight="700">18</text>
            <line x1="304" y1="29" x2="326" y2="29" stroke="#374151" stroke-width="1" marker-end="url(#vp)"/>
            <g><rect x="328" y="8" width="60" height="42" fill="#CCFBF1" stroke="#0D9488" stroke-width="1" rx="1"/><text x="358" y="18" text-anchor="middle" fill="#065F46" font-size="7" font-weight="700">Electrical</text><circle cx="342" cy="38" r="3.5" fill="#fff" stroke="#0D9488" stroke-width="0.8"/><circle cx="342" cy="35" r="2" fill="#0D9488"/><circle cx="352" cy="38" r="3.5" fill="#fff" stroke="#0D9488" stroke-width="0.8"/><circle cx="352" cy="35" r="2" fill="#0D9488"/><rect x="328" y="50" width="60" height="38" fill="#fff" stroke="#0D9488" stroke-width="1"/><text x="332" y="62" fill="#6B7280" font-size="6" font-family="monospace">C/T = 88s</text><text x="332" y="74" fill="#6B7280" font-size="6" font-family="monospace">C/O = 0s</text><text x="332" y="86" fill="#6B7280" font-size="6" font-family="monospace">Up= 99%</text></g>
            <line x1="388" y1="29" x2="406" y2="29" stroke="#374151" stroke-width="1" marker-end="url(#vp)"/>
            <g><rect x="408" y="8" width="52" height="42" fill="#CCFBF1" stroke="#0D9488" stroke-width="1" rx="1"/><text x="434" y="18" text-anchor="middle" fill="#065F46" font-size="7" font-weight="700">Final QC</text><circle cx="422" cy="38" r="3.5" fill="#fff" stroke="#0D9488" stroke-width="0.8"/><circle cx="422" cy="35" r="2" fill="#0D9488"/><rect x="408" y="50" width="52" height="38" fill="#fff" stroke="#0D9488" stroke-width="1"/><text x="412" y="62" fill="#6B7280" font-size="6" font-family="monospace">C/T = 72s</text><text x="412" y="74" fill="#6B7280" font-size="6" font-family="monospace">C/O = 0s</text><text x="412" y="86" fill="#6B7280" font-size="6" font-family="monospace">Up=100%</text></g>
            <line x1="460" y1="29" x2="476" y2="29" stroke="#374151" stroke-width="1" marker-end="url(#vp)"/>
            <rect x="478" y="8" width="16" height="32" fill="#5B7FA6" stroke="#3A5A7C" stroke-width="1" rx="1"/><text x="486" y="50" text-anchor="middle" fill="#1F2937" font-size="6" font-weight="700">Cust.</text>
            <line x1="96" y1="88" x2="96" y2="102" stroke="#0D9488" stroke-width="1"/>
            <line x1="96" y1="102" x2="110" y2="102" stroke="#0D9488" stroke-width="1"/>
            <line x1="184" y1="88" x2="184" y2="102" stroke="#0D9488" stroke-width="1"/>
            <line x1="110" y1="102" x2="152" y2="102" stroke="#C49B2E" stroke-width="5" opacity="0.8"/>
            <text x="131" y="115" text-anchor="middle" fill="#8E8A82" font-size="5.5" font-family="monospace">45s</text>
            <line x1="152" y1="102" x2="184" y2="102" stroke="#8E8A82" stroke-width="2" opacity="0.5"/>
            <line x1="272" y1="88" x2="272" y2="102" stroke="#DC2626" stroke-width="1"/>
            <line x1="184" y1="102" x2="240" y2="102" stroke="#C49B2E" stroke-width="5" opacity="0.8"/>
            <text x="212" y="115" text-anchor="middle" fill="#8E8A82" font-size="5.5" font-family="monospace">98s</text>
            <line x1="240" y1="102" x2="272" y2="102" stroke="#8E8A82" stroke-width="2" opacity="0.5"/>
            <line x1="358" y1="88" x2="358" y2="102" stroke="#0D9488" stroke-width="1"/>
            <line x1="272" y1="102" x2="328" y2="102" stroke="#DC2626" stroke-width="5" opacity="0.8"/>
            <text x="300" y="115" text-anchor="middle" fill="#DC2626" font-size="5.5" font-family="monospace" font-weight="700">145s</text>
            <line x1="328" y1="102" x2="358" y2="102" stroke="#8E8A82" stroke-width="2" opacity="0.5"/>
            <line x1="434" y1="88" x2="434" y2="102" stroke="#0D9488" stroke-width="1"/>
            <line x1="358" y1="102" x2="408" y2="102" stroke="#C49B2E" stroke-width="5" opacity="0.8"/>
            <text x="383" y="115" text-anchor="middle" fill="#8E8A82" font-size="5.5" font-family="monospace">88s</text>
            <line x1="408" y1="102" x2="434" y2="102" stroke="#8E8A82" stroke-width="2" opacity="0.5"/>
            <line x1="434" y1="102" x2="460" y2="102" stroke="#C49B2E" stroke-width="5" opacity="0.8"/>
            <text x="447" y="115" text-anchor="middle" fill="#8E8A82" font-size="5.5" font-family="monospace">72s</text>
            <line x1="60" y1="102" x2="96" y2="102" stroke="#C49B2E" stroke-width="5" opacity="0.8"/>
            <text x="78" y="115" text-anchor="middle" fill="#8E8A82" font-size="5.5" font-family="monospace">—</text>
            <line x1="60" y1="102" x2="60" y2="88" stroke="#C49B2E" stroke-width="1"/>
            <line x1="460" y1="102" x2="460" y2="88" stroke="#C49B2E" stroke-width="1"/>
            <line x1="60" y1="128" x2="460" y2="128" stroke="#E5E7EB" stroke-width="0.5"/>
            <line x1="60" y1="120" x2="460" y2="120" stroke="#C0402A" stroke-width="1" stroke-dasharray="4,3" opacity="0.6"/>
            <text x="456" y="118" text-anchor="end" fill="#C0402A" font-size="5.5" font-family="monospace">TAKT=120s</text>
            <text x="210" y="139" text-anchor="middle" fill="#8E8A82" font-size="6" font-family="monospace">VA: 448s  |  Wait: 372s  |  PCE: 34%  |  Lead Time: 14m 40s</text>
          </svg>
        </div>
      </div>`,
  },
  {
    name:'Time Study',short:'TIME',color:_GR,
    tag:'Free',tagBg:'#E6F7F3',tagTxt:'#0F6E56',
    headline:'Measure before you manage',
    body:'Built-in stopwatch with lap recording. Calculates mean CT, flags outliers for exclusion. Pushes the validated cycle time directly to your VSM.',
    cardContent:`<div style="padding:8px 10px;font-family:monospace">
      <div style="text-align:center;padding:8px 0 6px;border-bottom:1px solid #D8D5CE;margin-bottom:7px">
        <div style="font-size:28px;font-weight:800;color:#242220;letter-spacing:2px">1:38.4</div>
        <div style="font-size:8px;color:#8E8A82;margin-top:2px">Obs. 7 / 10</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;margin-bottom:7px">
        <div style="background:#ECEAE6;border-radius:5px;padding:4px;text-align:center"><div style="font-size:7px;color:#8E8A82">Mean</div><div style="font-size:11px;font-weight:700;color:#C49B2E">98.4s</div></div>
        <div style="background:#ECEAE6;border-radius:5px;padding:4px;text-align:center"><div style="font-size:7px;color:#8E8A82">Min</div><div style="font-size:11px;font-weight:700;color:#2A9E82">82s</div></div>
        <div style="background:#ECEAE6;border-radius:5px;padding:4px;text-align:center"><div style="font-size:7px;color:#8E8A82">Max</div><div style="font-size:11px;font-weight:700;color:#C0402A">141s</div></div>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:3px">
        <div style="padding:2px 6px;border-radius:3px;font-size:8px;font-weight:600;background:rgba(42,158,130,.1);color:#2A9E82">#1 82s</div>
        <div style="padding:2px 6px;border-radius:3px;font-size:8px;font-weight:600;background:rgba(42,158,130,.1);color:#2A9E82">#2 95s</div>
        <div style="padding:2px 6px;border-radius:3px;font-size:8px;font-weight:600;background:rgba(42,158,130,.1);color:#2A9E82">#3 91s</div>
        <div style="padding:2px 6px;border-radius:3px;font-size:8px;font-weight:600;background:rgba(42,158,130,.1);color:#2A9E82">#4 110s</div>
        <div style="padding:2px 6px;border-radius:3px;font-size:8px;font-weight:600;background:rgba(192,64,42,.1);color:#C0402A;text-decoration:line-through">#6 141s</div>
      </div>
    </div>`,
    popup:`
      <div style="background:#F5F5F8;border-bottom:1px solid #D8D5CE;padding:10px 14px;display:flex;align-items:center;gap:7px">
        <div style="display:flex;gap:3px"><div style="width:8px;height:8px;border-radius:50%;background:#FF6B6B"></div><div style="width:8px;height:8px;border-radius:50%;background:#F4A623"></div><div style="width:8px;height:8px;border-radius:50%;background:#1DD1A1"></div></div>
        <span style="font-size:10px;color:#8E8A82;font-family:monospace;flex:1;text-align:center">⏱ Time Study — Foam & Fabric</span>
      </div>
      <div style="padding:14px;display:flex;flex-direction:column;gap:10px">
        <div style="text-align:center;padding:16px;background:#F8F7F5;border-radius:12px;border:1px solid #D8D5CE">
          <div style="font-size:44px;font-weight:700;color:#242220;font-family:monospace;letter-spacing:3px;line-height:1.1">1:38.4</div>
          <div style="font-size:11px;color:#8E8A82;margin-top:4px">Observation 7 of 10</div>
          <div style="display:flex;gap:8px;justify-content:center;margin-top:12px">
            <button style="display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:6px 14px;font-size:11px;font-weight:600;border-radius:10px;border:none;background:#C0402A;color:#fff;cursor:pointer">⏹ Stop</button>
            <button style="display:inline-flex;align-items:center;justify-content:center;padding:6px 12px;font-size:11px;font-weight:600;border-radius:10px;border:1px solid #D8D5CE;background:#fff;color:#4E4B45;cursor:pointer">⏱ Lap</button>
            <button style="display:inline-flex;align-items:center;justify-content:center;padding:6px 12px;font-size:11px;font-weight:600;border-radius:10px;border:1px solid #D8D5CE;background:#fff;color:#4E4B45;cursor:pointer">↺ Reset</button>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px">
          <div style="background:#F8F7F5;border:1px solid #D8D5CE;border-radius:10px;padding:10px;text-align:center"><div style="font-size:9px;color:#8E8A82;letter-spacing:.8px;text-transform:uppercase;margin-bottom:4px">Mean</div><div style="font-size:18px;font-weight:700;color:#C49B2E;font-family:monospace">98.4s</div></div>
          <div style="background:#F8F7F5;border:1px solid #D8D5CE;border-radius:10px;padding:10px;text-align:center"><div style="font-size:9px;color:#8E8A82;letter-spacing:.8px;text-transform:uppercase;margin-bottom:4px">Min</div><div style="font-size:18px;font-weight:700;color:#2A9E82;font-family:monospace">82.0s</div></div>
          <div style="background:#F8F7F5;border:1px solid #D8D5CE;border-radius:10px;padding:10px;text-align:center"><div style="font-size:9px;color:#8E8A82;letter-spacing:.8px;text-transform:uppercase;margin-bottom:4px">Max</div><div style="font-size:18px;font-weight:700;color:#C0402A;font-family:monospace">141.0s</div></div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:5px">
          <div style="padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600;font-family:monospace;background:rgba(42,158,130,.08);color:#2A9E82;border:1px solid rgba(42,158,130,.25)">#1 82s</div>
          <div style="padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600;font-family:monospace;background:rgba(42,158,130,.08);color:#2A9E82;border:1px solid rgba(42,158,130,.25)">#2 95s</div>
          <div style="padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600;font-family:monospace;background:rgba(42,158,130,.08);color:#2A9E82;border:1px solid rgba(42,158,130,.25)">#3 91s</div>
          <div style="padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600;font-family:monospace;background:rgba(42,158,130,.08);color:#2A9E82;border:1px solid rgba(42,158,130,.25)">#4 110s</div>
          <div style="padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600;font-family:monospace;background:rgba(42,158,130,.08);color:#2A9E82;border:1px solid rgba(42,158,130,.25)">#5 88s</div>
          <div style="padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600;font-family:monospace;background:rgba(192,64,42,.08);color:#C0402A;border:1px solid rgba(192,64,42,.3);text-decoration:line-through">#6 141s</div>
          <div style="padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600;font-family:monospace;background:rgba(42,158,130,.08);color:#2A9E82;border:1px solid rgba(42,158,130,.25)">#7 97s</div>
          <div style="padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600;font-family:monospace;background:rgba(42,158,130,.08);color:#2A9E82;border:1px solid rgba(42,158,130,.25)">#8 84s</div>
          <div style="padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600;font-family:monospace;background:rgba(42,158,130,.08);color:#2A9E82;border:1px solid rgba(42,158,130,.25)">#9 102s</div>
          <div style="padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600;font-family:monospace;background:rgba(42,158,130,.08);color:#2A9E82;border:1px solid rgba(42,158,130,.25)">#10 99s</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <div><div style="font-size:9px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:#8E8A82;margin-bottom:5px">Baseline CT (sec)</div><input style="width:100%;padding:8px 11px;font-size:12px;border-radius:8px;border:1px solid #D8D5CE;background:#fff;color:#242220" value="180" type="number" /></div>
          <div><div style="font-size:9px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:#8E8A82;margin-bottom:5px">Manual CT override</div><input style="width:100%;padding:8px 11px;font-size:12px;border-radius:8px;border:1px solid #D8D5CE;background:#fff;color:#242220" placeholder="Enter if known" /></div>
        </div>
      </div>`,
  },
  {
    name:'5 Why Analysis',short:'5WHY',color:_V,
    tag:'Free',tagBg:'#F0EEFE',tagTxt:_V,
    headline:'Stop fixing symptoms',
    body:'Ask why five times and reach the real root cause. Assign a countermeasure, owner and due date — stays attached to the step it came from.',
    cardContent:`<div style="padding:8px 10px">
      <div style="padding:5px 7px;background:#FEF9EE;border-radius:4px;margin-bottom:7px;font-size:8px;color:#5A3A00;font-weight:600">Problem: Weld defect rate 3.2% at Station 4</div>
      <div style="display:flex;gap:5px;margin-bottom:4px;align-items:flex-start"><div style="width:13px;height:13px;border-radius:3px;background:rgba(100,38,160,.1);border:1px solid rgba(100,38,160,.22);display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:700;color:#6426A0;flex-shrink:0">1</div><div style="font-size:8px;color:#4E4B45;line-height:1.4">Weld joint gaps inconsistent</div></div>
      <div style="display:flex;gap:5px;margin-bottom:4px;align-items:flex-start"><div style="width:13px;height:13px;border-radius:3px;background:rgba(100,38,160,.1);border:1px solid rgba(100,38,160,.22);display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:700;color:#6426A0;flex-shrink:0">2</div><div style="font-size:8px;color:#4E4B45;line-height:1.4">Fixture wear not caught</div></div>
      <div style="display:flex;gap:5px;margin-bottom:4px;align-items:flex-start"><div style="width:13px;height:13px;border-radius:3px;background:rgba(100,38,160,.1);border:1px solid rgba(100,38,160,.22);display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:700;color:#6426A0;flex-shrink:0">3</div><div style="font-size:8px;color:#4E4B45;line-height:1.4">No retraining after update</div></div>
      <div style="display:flex;gap:5px;margin-bottom:4px;align-items:flex-start"><div style="width:13px;height:13px;border-radius:3px;background:rgba(100,38,160,.1);border:1px solid rgba(100,38,160,.22);display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:700;color:#6426A0;flex-shrink:0">4</div><div style="font-size:8px;color:#4E4B45;line-height:1.4">No trigger on change</div></div>
      <div style="display:flex;gap:5px;margin-bottom:4px;align-items:flex-start"><div style="width:13px;height:13px;border-radius:3px;background:rgba(100,38,160,.1);border:1px solid rgba(100,38,160,.22);display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:700;color:#6426A0;flex-shrink:0">5</div><div style="font-size:8px;color:#4E4B45;line-height:1.4">Change mgmt missing notify step</div></div>
      <div style="padding:4px 7px;background:#E6F7F3;border-radius:4px;font-size:7px;color:#2A9E82;font-weight:700;margin-top:4px">✓ Root cause found</div>
    </div>`,
    popup:`
      <div style="background:#F5F5F8;border-bottom:1px solid #D8D5CE;padding:10px 14px;display:flex;align-items:center;gap:7px">
        <div style="display:flex;gap:3px"><div style="width:8px;height:8px;border-radius:50%;background:#FF6B6B"></div><div style="width:8px;height:8px;border-radius:50%;background:#F4A623"></div><div style="width:8px;height:8px;border-radius:50%;background:#1DD1A1"></div></div>
        <span style="font-size:10px;color:#8E8A82;font-family:monospace;flex:1;text-align:center">❓ 5 Why Analysis — Foam & Fabric</span>
      </div>
      <div style="padding:14px;display:flex;flex-direction:column;gap:8px">
        <div><div style="font-size:9px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:#8E8A82;margin-bottom:5px">Problem statement *</div><textarea style="width:100%;padding:9px 11px;font-size:12px;border-radius:8px;border:1px solid #D8D5CE;background:#fff;color:#242220;resize:none;font-family:inherit" rows="2">Weld defect rate at Station 4 is 3.2% — target is 0.5%</textarea></div>
        <div style="display:flex;gap:8px;align-items:flex-start"><div style="width:22px;height:22px;border-radius:5px;background:rgba(100,38,160,.1);border:1px solid rgba(100,38,160,.22);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#6426A0;flex-shrink:0;margin-top:2px">1</div><div style="flex:1"><div style="font-size:8px;color:#8E8A82;font-family:monospace;letter-spacing:.6px;margin-bottom:3px">Why did this happen?</div><input style="width:100%;padding:8px 11px;font-size:12px;border-radius:8px;border:1px solid #D8D5CE;background:#fff;color:#242220" value="Weld joint gaps are inconsistent between parts" /></div></div>
        <div style="display:flex;gap:8px;align-items:flex-start"><div style="width:22px;height:22px;border-radius:5px;background:rgba(100,38,160,.1);border:1px solid rgba(100,38,160,.22);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#6426A0;flex-shrink:0;margin-top:2px">2</div><div style="flex:1"><div style="font-size:8px;color:#8E8A82;font-family:monospace;letter-spacing:.6px;margin-bottom:3px">Why are gaps inconsistent?</div><input style="width:100%;padding:8px 11px;font-size:12px;border-radius:8px;border:1px solid #D8D5CE;background:#fff;color:#242220" value="Fixture wear not caught in pre-shift checks" /></div></div>
        <div style="display:flex;gap:8px;align-items:flex-start"><div style="width:22px;height:22px;border-radius:5px;background:rgba(100,38,160,.1);border:1px solid rgba(100,38,160,.22);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#6426A0;flex-shrink:0;margin-top:2px">3</div><div style="flex:1"><div style="font-size:8px;color:#8E8A82;font-family:monospace;letter-spacing:.6px;margin-bottom:3px">Why not caught?</div><input style="width:100%;padding:8px 11px;font-size:12px;border-radius:8px;border:1px solid #D8D5CE;background:#fff;color:#242220" value="Checklist updated but operators not retrained" /></div></div>
        <div style="display:flex;gap:8px;align-items:flex-start"><div style="width:22px;height:22px;border-radius:5px;background:rgba(100,38,160,.1);border:1px solid rgba(100,38,160,.22);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#6426A0;flex-shrink:0;margin-top:2px">4</div><div style="flex:1"><div style="font-size:8px;color:#8E8A82;font-family:monospace;letter-spacing:.6px;margin-bottom:3px">Why not retrained?</div><input style="width:100%;padding:8px 11px;font-size:12px;border-radius:8px;border:1px solid #D8D5CE;background:#fff;color:#242220" value="No retraining trigger when checklists are revised" /></div></div>
        <div style="display:flex;gap:8px;align-items:flex-start"><div style="width:22px;height:22px;border-radius:5px;background:rgba(100,38,160,.1);border:1px solid rgba(100,38,160,.22);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#6426A0;flex-shrink:0;margin-top:2px">5</div><div style="flex:1"><div style="font-size:8px;color:#8E8A82;font-family:monospace;letter-spacing:.6px;margin-bottom:3px">Why no trigger?</div><input style="width:100%;padding:8px 11px;font-size:12px;border-radius:8px;border:1px solid #D8D5CE;background:#fff;color:#242220" value="Change management has no mandatory notification step" /></div></div>
        <div style="background:#E6F7F3;border:1px solid rgba(42,158,130,.3);border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px">
          <div><div style="font-size:9px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:#2A9E82;margin-bottom:5px">Root cause</div><input style="width:100%;padding:8px 11px;font-size:12px;border-radius:8px;border:1px solid rgba(42,158,130,.3);background:#fff;color:#242220" value="Change management process has no mandatory notification step" /></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            <div><div style="font-size:9px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:#8E8A82;margin-bottom:5px">Owner</div><input style="width:100%;padding:8px 11px;font-size:12px;border-radius:8px;border:1px solid #D8D5CE;background:#fff;color:#242220" value="J. Torres" /></div>
            <div><div style="font-size:9px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:#8E8A82;margin-bottom:5px">Due date</div><input style="width:100%;padding:8px 11px;font-size:12px;border-radius:8px;border:1px solid #D8D5CE;background:#fff;color:#242220" value="2026-04-15" type="date" /></div>
          </div>
        </div>
      </div>`,
  },
  {
    name:'Fishbone Diagram',short:'FISH',color:_G,
    tag:'Free',tagBg:'#FEF9EE',tagTxt:'#854F0B',
    headline:'Map all causes before you fix anything',
    body:'6M Manufacturing, 8P Service, 4S or Custom. Add causes across every category. Full picture first — then connect to 5 Why.',
    cardContent:`<div style="padding:8px 10px">
      <div style="text-align:center;padding:4px 8px;background:#FEF2F0;border-radius:4px;font-size:7px;color:#C0402A;font-weight:600;margin-bottom:7px">Effect: High defect rate — Weld Station 4</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">
        <div style="background:#EEF4FB;border:1px solid rgba(48,112,184,.2);border-radius:5px;padding:5px"><div style="font-size:7px;font-weight:700;color:#3070B8;margin-bottom:3px">Machine</div><div style="font-size:7px;color:#4E4B45">› Fixture worn</div><div style="font-size:7px;color:#4E4B45">› Cal. overdue</div></div>
        <div style="background:#E6F7F3;border:1px solid rgba(42,158,130,.2);border-radius:5px;padding:5px"><div style="font-size:7px;font-weight:700;color:#2A9E82;margin-bottom:3px">Method</div><div style="font-size:7px;color:#4E4B45">› Seq. varies</div><div style="font-size:7px;color:#4E4B45">› No std tack</div></div>
        <div style="background:#FEF9EE;border:1px solid rgba(196,155,46,.2);border-radius:5px;padding:5px"><div style="font-size:7px;font-weight:700;color:#C49B2E;margin-bottom:3px">Material</div><div style="font-size:7px;color:#4E4B45">› Batch var.</div><div style="font-size:7px;color:#4E4B45">› Humidity</div></div>
        <div style="background:#F0EEFE;border:1px solid rgba(100,38,160,.2);border-radius:5px;padding:5px"><div style="font-size:7px;font-weight:700;color:#6426A0;margin-bottom:3px">Manpower</div><div style="font-size:7px;color:#4E4B45">› 2/5 trained</div><div style="font-size:7px;color:#4E4B45">› Handover</div></div>
      </div>
    </div>`,
    popup:`
      <div style="background:#F5F5F8;border-bottom:1px solid #D8D5CE;padding:10px 14px;display:flex;align-items:center;gap:7px">
        <div style="display:flex;gap:3px"><div style="width:8px;height:8px;border-radius:50%;background:#FF6B6B"></div><div style="width:8px;height:8px;border-radius:50%;background:#F4A623"></div><div style="width:8px;height:8px;border-radius:50%;background:#1DD1A1"></div></div>
        <span style="font-size:10px;color:#8E8A82;font-family:monospace;flex:1;text-align:center">🐟 Fishbone Diagram — Foam & Fabric</span>
      </div>
      <div style="padding:14px;display:flex;flex-direction:column;gap:8px">
        <div style="display:grid;grid-template-columns:1fr auto;gap:8px">
          <div><div style="font-size:9px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:#8E8A82;margin-bottom:5px">Problem / Effect *</div><input style="width:100%;padding:8px 11px;font-size:12px;border-radius:8px;border:1px solid #D8D5CE;background:#fff;color:#242220" value="High weld defect rate at Station 4 — 3.2% vs 0.5% target" /></div>
          <div><div style="font-size:9px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:#8E8A82;margin-bottom:5px">Framework</div><select style="width:148px;padding:8px 11px;font-size:12px;border-radius:8px;border:1px solid #D8D5CE;background:#fff;color:#242220"><option>6M Manufacturing</option><option>8P Service</option><option>4S</option></select></div>
        </div>
        <div style="padding:8px 12px;background:rgba(196,155,46,.05);border:1px solid rgba(196,155,46,.2);border-radius:8px;font-size:11px;color:#4E4B45">🎯 Effect: <strong style="color:#242220">High weld defect rate at Station 4</strong></div>
        <div style="display:grid;gap:6px">
          <details open style="background:#F8F7F5;border:1px solid #D8D5CE;border-radius:10px;padding:8px 10px"><summary style="cursor:pointer;font-size:11px;font-weight:700;color:#3070B8;margin-bottom:6px">Machine</summary><div style="display:grid;gap:6px;margin-top:6px"><div style="display:grid;grid-template-columns:1fr 28px;gap:6px;align-items:center;padding:6px 8px;border-radius:7px;border:1px solid #D8D5CE"><span style="font-size:11px;color:#4E4B45">Fixture worn — 0.3mm play</span><button style="background:none;border:none;color:#8E8A82;cursor:pointer;font-size:15px">×</button></div><div style="display:grid;grid-template-columns:1fr 28px;gap:6px;align-items:center;padding:6px 8px;border-radius:7px;border:1px solid #D8D5CE"><span style="font-size:11px;color:#4E4B45">Calibration overdue Q3</span><button style="background:none;border:none;color:#8E8A82;cursor:pointer;font-size:15px">×</button></div><div style="display:grid;grid-template-columns:1fr 36px;gap:6px"><input style="width:100%;padding:5px 8px;font-size:11px;border-radius:8px;border:1px solid #D8D5CE;background:#fff;color:#242220" placeholder="Add cause…" /><button style="background:rgba(196,155,46,.15);border:1px solid rgba(196,155,46,.3);color:#C49B2E;border-radius:7px;cursor:pointer;font-size:16px;min-height:34px">+</button></div></div></details>
          <details style="background:#F8F7F5;border:1px solid #D8D5CE;border-radius:10px;padding:8px 10px"><summary style="cursor:pointer;font-size:11px;font-weight:700;color:#2A9E82;margin-bottom:6px">Method</summary><div style="display:grid;gap:6px;margin-top:6px"><div style="display:grid;grid-template-columns:1fr 28px;gap:6px;align-items:center;padding:6px 8px;border-radius:7px;border:1px solid #D8D5CE"><span style="font-size:11px;color:#4E4B45">Sequence varies by operator</span><button style="background:none;border:none;color:#8E8A82;cursor:pointer;font-size:15px">×</button></div><div style="display:grid;grid-template-columns:1fr 36px;gap:6px"><input style="width:100%;padding:5px 8px;font-size:11px;border-radius:8px;border:1px solid #D8D5CE;background:#fff;color:#242220" placeholder="Add cause…" /><button style="background:rgba(196,155,46,.15);border:1px solid rgba(196,155,46,.3);color:#C49B2E;border-radius:7px;cursor:pointer;font-size:16px;min-height:34px">+</button></div></div></details>
        </div>
      </div>`,
  },
  {
    name:'Waste Identification',short:'WASTE',color:_R,
    tag:'Free',tagBg:'#FEF2F0',tagTxt:'#993C1D',
    headline:'See all 8 wastes. Act on the worst.',
    body:'Walk through DOWNTIME wastes per step. Select and note what you observe. Rolls up to your Report as a prioritised backlog automatically.',
    cardContent:`<div style="padding:8px 10px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">
        <div><div style="display:flex;align-items:center;gap:4px;padding:4px 6px;border-radius:4px;background:#F8F7F5;border:1px solid #D8D5CE"><div style="width:10px;height:10px;border-radius:2px;background:#EEE;flex-shrink:0"></div><span style="font-size:8px;color:#8E8A82">Transport</span></div></div>
        <div><div style="display:flex;align-items:center;gap:4px;padding:4px 6px;border-radius:4px;background:rgba(192,64,42,.06);border:1px solid rgba(192,64,42,.3)"><div style="width:10px;height:10px;border-radius:2px;background:#C0402A;flex-shrink:0;display:flex;align-items:center;justify-content:center"><div style="width:4px;height:4px;background:#fff;border-radius:1px"></div></div><span style="font-size:8px;font-weight:600;color:#C0402A">Inventory</span></div><div style="font-size:7px;color:#C0402A;padding:1px 5px;border-left:1.5px solid #C0402A;margin-top:1px">18 units queued</div></div>
        <div><div style="display:flex;align-items:center;gap:4px;padding:4px 6px;border-radius:4px;background:#F8F7F5;border:1px solid #D8D5CE"><div style="width:10px;height:10px;border-radius:2px;background:#EEE;flex-shrink:0"></div><span style="font-size:8px;color:#8E8A82">Motion</span></div></div>
        <div><div style="display:flex;align-items:center;gap:4px;padding:4px 6px;border-radius:4px;background:rgba(192,64,42,.06);border:1px solid rgba(192,64,42,.3)"><div style="width:10px;height:10px;border-radius:2px;background:#C0402A;flex-shrink:0;display:flex;align-items:center;justify-content:center"><div style="width:4px;height:4px;background:#fff;border-radius:1px"></div></div><span style="font-size:8px;font-weight:600;color:#C0402A">Waiting</span></div><div style="font-size:7px;color:#C0402A;padding:1px 5px;border-left:1.5px solid #C0402A;margin-top:1px">4.2 min avg idle</div></div>
        <div><div style="display:flex;align-items:center;gap:4px;padding:4px 6px;border-radius:4px;background:#F8F7F5;border:1px solid #D8D5CE"><div style="width:10px;height:10px;border-radius:2px;background:#EEE;flex-shrink:0"></div><span style="font-size:8px;color:#8E8A82">Overprod.</span></div></div>
        <div><div style="display:flex;align-items:center;gap:4px;padding:4px 6px;border-radius:4px;background:rgba(192,64,42,.06);border:1px solid rgba(192,64,42,.3)"><div style="width:10px;height:10px;border-radius:2px;background:#C0402A;flex-shrink:0;display:flex;align-items:center;justify-content:center"><div style="width:4px;height:4px;background:#fff;border-radius:1px"></div></div><span style="font-size:8px;font-weight:600;color:#C0402A">Defects</span></div><div style="font-size:7px;color:#C0402A;padding:1px 5px;border-left:1.5px solid #C0402A;margin-top:1px">3.2% rework</div></div>
      </div>
      <div style="margin-top:6px;padding:4px 7px;background:#FEF2F0;border-radius:4px;font-size:8px;color:#C0402A;font-weight:600;text-align:center">3 wastes identified</div>
    </div>`,
    popup:`
      <div style="background:#F5F5F8;border-bottom:1px solid #D8D5CE;padding:10px 14px;display:flex;align-items:center;gap:7px">
        <div style="display:flex;gap:3px"><div style="width:8px;height:8px;border-radius:50%;background:#FF6B6B"></div><div style="width:8px;height:8px;border-radius:50%;background:#F4A623"></div><div style="width:8px;height:8px;border-radius:50%;background:#1DD1A1"></div></div>
        <span style="font-size:10px;color:#8E8A82;font-family:monospace;flex:1;text-align:center">⚠️ Waste Identification — Foam & Fabric</span>
      </div>
      <div style="padding:14px">
        <div style="font-size:12px;color:#4E4B45;line-height:1.65;padding:10px 12px;border-radius:10px;background:rgba(255,107,107,0.05);border:1px solid rgba(255,107,107,0.15);margin-bottom:12px">Select all wastes present at this step. This feeds your kaizen prioritization and reporting.</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <div><button type="button" style="width:100%;padding:12px;border-radius:10px;cursor:pointer;background:#F8F7F5;border:1px solid #D8D5CE;display:flex;align-items:flex-start;gap:8px;text-align:left"><span style="font-size:18px;flex-shrink:0;margin-top:1px">🚛</span><div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:6px"><span style="font-weight:700;font-size:12px;color:#242220">Transport</span><span style="font-size:9px;font-family:monospace;color:#8E8A82;background:#fff;padding:1px 4px;border-radius:3px">T</span></div><div style="font-size:10px;color:#8E8A82;margin-top:3px;line-height:1.4">Unnecessary movement of materials</div></div></button></div>
          <div><button type="button" style="width:100%;padding:12px;border-radius:10px;cursor:pointer;background:rgba(192,64,42,.05);border:1px solid rgba(192,64,42,.35);display:flex;align-items:flex-start;gap:8px;text-align:left"><span style="font-size:18px;flex-shrink:0;margin-top:1px">📦</span><div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:6px"><span style="font-weight:700;font-size:12px;color:#C0402A">Inventory</span><span style="font-size:9px;font-family:monospace;color:#8E8A82;background:#fff;padding:1px 4px;border-radius:3px">I</span><span style="margin-left:auto;font-size:13px;color:#C0402A">✓</span></div><div style="font-size:10px;color:#8E8A82;margin-top:3px;line-height:1.4">Excess stock, WIP, finished goods</div></div></button><input style="width:100%;padding:5px 9px;font-size:11px;border-radius:0 0 8px 8px;border:1px solid rgba(192,64,42,.25);border-top:none;background:#fff;color:#C0402A" value="18 units queued upstream" /></div>
          <div><button type="button" style="width:100%;padding:12px;border-radius:10px;cursor:pointer;background:#F8F7F5;border:1px solid #D8D5CE;display:flex;align-items:flex-start;gap:8px;text-align:left"><span style="font-size:18px;flex-shrink:0;margin-top:1px">🏃</span><div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:6px"><span style="font-weight:700;font-size:12px;color:#242220">Motion</span><span style="font-size:9px;font-family:monospace;color:#8E8A82;background:#fff;padding:1px 4px;border-radius:3px">M</span></div><div style="font-size:10px;color:#8E8A82;margin-top:3px;line-height:1.4">Unnecessary movement of people</div></div></button></div>
          <div><button type="button" style="width:100%;padding:12px;border-radius:10px;cursor:pointer;background:rgba(192,64,42,.05);border:1px solid rgba(192,64,42,.35);display:flex;align-items:flex-start;gap:8px;text-align:left"><span style="font-size:18px;flex-shrink:0;margin-top:1px">⏳</span><div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:6px"><span style="font-weight:700;font-size:12px;color:#C0402A">Waiting</span><span style="font-size:9px;font-family:monospace;color:#8E8A82;background:#fff;padding:1px 4px;border-radius:3px">W</span><span style="margin-left:auto;font-size:13px;color:#C0402A">✓</span></div><div style="font-size:10px;color:#8E8A82;margin-top:3px;line-height:1.4">Idle time, waiting for approvals</div></div></button><input style="width:100%;padding:5px 9px;font-size:11px;border-radius:0 0 8px 8px;border:1px solid rgba(192,64,42,.25);border-top:none;background:#fff;color:#C0402A" value="4.2 min avg idle between batches" /></div>
        </div>
      </div>`,
  },
  {
    name:'Kaizen Events',short:'KAIZEN',color:_G,
    tag:'Free',tagBg:'#FEF9EE',tagTxt:'#854F0B',
    headline:'Every improvement gets an owner',
    body:'Log Kaizen events on the step where the problem lives. Owner, due date, status, priority. Open events show as burst markers on your VSM map.',
    cardContent:`<div style="padding:8px 10px;display:flex;flex-direction:column;gap:4px">
      <div style="background:#fff;border:0.5px solid #D8D5CE;border-radius:6px;padding:6px 8px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px"><span style="font-size:7px;color:#8E8A82;font-family:monospace">KZ-001</span><span style="font-size:7px;padding:1px 5px;border-radius:100px;background:rgba(196,155,46,.15);color:#C49B2E;font-weight:700">in-progress</span></div><div style="font-size:8px;font-weight:600;color:#242220;line-height:1.3;margin-bottom:3px">SMED — changeover 38→18 min</div><div style="font-size:7px;color:#8E8A82">👤 J.Torres · 📅 Apr 15</div></div>
      <div style="background:#fff;border:0.5px solid #D8D5CE;border-radius:6px;padding:6px 8px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px"><span style="font-size:7px;color:#8E8A82;font-family:monospace">KZ-002</span><span style="font-size:7px;padding:1px 5px;border-radius:100px;background:rgba(42,158,130,.15);color:#2A9E82;font-weight:700">complete</span></div><div style="font-size:8px;font-weight:600;color:#242220;line-height:1.3;margin-bottom:3px">Fixture check to pre-shift list</div><div style="font-size:7px;color:#8E8A82">👤 R.Singh · 📅 Apr 3</div></div>
      <div style="background:#fff;border:0.5px solid #D8D5CE;border-radius:6px;padding:6px 8px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px"><span style="font-size:7px;color:#8E8A82;font-family:monospace">KZ-003</span><span style="font-size:7px;padding:1px 5px;border-radius:100px;background:rgba(142,138,130,.12);color:#8E8A82;font-weight:700">open</span></div><div style="font-size:8px;font-weight:600;color:#242220;line-height:1.3;margin-bottom:3px">5S audit weld consumables</div><div style="font-size:7px;color:#8E8A82">👤 T.Nakamura · 📅 Apr 22</div></div>
    </div>`,
    popup:`
      <div style="background:#F5F5F8;border-bottom:1px solid #D8D5CE;padding:10px 14px;display:flex;align-items:center;gap:7px">
        <div style="display:flex;gap:3px"><div style="width:8px;height:8px;border-radius:50%;background:#FF6B6B"></div><div style="width:8px;height:8px;border-radius:50%;background:#F4A623"></div><div style="width:8px;height:8px;border-radius:50%;background:#1DD1A1"></div></div>
        <span style="font-size:10px;color:#8E8A82;font-family:monospace;flex:1;text-align:center">⚡ Kaizen Events — Foam & Fabric</span>
      </div>
      <div style="padding:14px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:6px">
          <div style="display:flex;gap:5px;flex-wrap:wrap"><span style="font-size:10px;padding:3px 9px;border-radius:100px;background:rgba(142,138,130,.12);color:#8E8A82;border:1px solid rgba(142,138,130,.25)">Open (2)</span><span style="font-size:10px;padding:3px 9px;border-radius:100px;background:rgba(196,155,46,.12);color:#C49B2E;border:1px solid rgba(196,155,46,.25)">In Progress (1)</span><span style="font-size:10px;padding:3px 9px;border-radius:100px;background:rgba(42,158,130,.12);color:#2A9E82;border:1px solid rgba(42,158,130,.25)">Complete (1)</span></div>
          <button style="display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:6px 12px;font-size:11px;font-weight:600;border-radius:10px;border:none;background:#C49B2E;color:#fff;cursor:pointer">+ New Event</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:7px">
          <div style="background:#fff;border:1px solid #D8D5CE;border-radius:10px;overflow:hidden"><div style="padding:10px 12px;display:flex;align-items:center;gap:7px"><span style="font-size:9px;color:#8E8A82;font-family:monospace;flex-shrink:0">KZ-001</span><span style="flex:1;font-size:11px;font-weight:600;color:#242220;line-height:1.3">SMED event — reduce changeover from 38 min to 18 min</span><span style="font-size:9px;padding:2px 7px;border-radius:100px;background:rgba(196,155,46,.15);color:#C49B2E;font-weight:700;flex-shrink:0">In Progress</span><span style="font-size:9px;padding:2px 6px;border-radius:100px;background:rgba(196,155,46,.12);color:#C49B2E;flex-shrink:0">high</span></div><div style="padding:0 12px 8px;display:flex;gap:10px;font-size:9px;color:#8E8A82"><span>📁 Delivery</span><span>👤 J.Torres</span><span>📅 Apr 15</span></div></div>
          <div style="background:#fff;border:1px solid #D8D5CE;border-radius:10px;overflow:hidden"><div style="padding:10px 12px;display:flex;align-items:center;gap:7px"><span style="font-size:9px;color:#8E8A82;font-family:monospace;flex-shrink:0">KZ-002</span><span style="flex:1;font-size:11px;font-weight:600;color:#242220;line-height:1.3">Add fixture inspection to pre-shift checklist</span><span style="font-size:9px;padding:2px 7px;border-radius:100px;background:rgba(42,158,130,.15);color:#2A9E82;font-weight:700;flex-shrink:0">Complete</span><span style="font-size:9px;padding:2px 6px;border-radius:100px;background:rgba(192,64,42,.12);color:#C0402A;flex-shrink:0">critical</span></div><div style="padding:0 12px 8px;display:flex;gap:10px;font-size:9px;color:#8E8A82"><span>📁 Quality</span><span>👤 R.Singh</span><span>📅 Apr 3</span></div></div>
        </div>
      </div>`,
  },
  {
    name:'Yamazumi Chart',short:'YAM',color:'#1090D4',
    tag:'Free',tagBg:'#E6F1FB',tagTxt:'#1A4F8A',
    headline:'Balance your operators against takt',
    body:'Stacked bar chart showing each operator\'s workload split by VA, NNVA, and NVA time. See at a glance who is overloaded, who has capacity, and where to rebalance work elements.',
    cardContent:`<div style="padding:8px 10px">
      <div style="font-size:8px;color:#8E8A82;margin-bottom:6px;font-family:monospace">Operator workload vs Takt (120s)</div>
      <div style="display:flex;align-items:flex-end;gap:6px;height:80px;position:relative;border-bottom:1px solid #D8D5CE;margin-bottom:4px">
        <div style="position:absolute;left:0;right:0;bottom:38px;border-top:1.5px dashed #C0402A;opacity:.6"></div>
        <div style="position:absolute;right:2px;bottom:40px;font-size:6px;color:#C0402A;font-family:monospace">TAKT 120s</div>
        <div style="display:flex;flex-direction:column;width:28px">
          <div style="height:18px;background:#FF6B6B;border-radius:2px 2px 0 0;opacity:.75"></div>
          <div style="height:20px;background:#D4A208"></div>
          <div style="height:32px;background:#1DD1A1"></div>
        </div>
        <div style="display:flex;flex-direction:column;width:28px">
          <div style="height:10px;background:#FF6B6B;border-radius:2px 2px 0 0;opacity:.75"></div>
          <div style="height:14px;background:#D4A208"></div>
          <div style="height:40px;background:#1DD1A1"></div>
        </div>
        <div style="display:flex;flex-direction:column;width:28px">
          <div style="height:30px;background:#FF6B6B;border-radius:2px 2px 0 0;opacity:.75"></div>
          <div style="height:22px;background:#D4A208"></div>
          <div style="height:28px;background:#1DD1A1"></div>
        </div>
        <div style="display:flex;flex-direction:column;width:28px">
          <div style="height:8px;background:#FF6B6B;border-radius:2px 2px 0 0;opacity:.75"></div>
          <div style="height:12px;background:#D4A208"></div>
          <div style="height:25px;background:#1DD1A1"></div>
        </div>
        <div style="display:flex;flex-direction:column;width:28px">
          <div style="height:12px;background:#FF6B6B;border-radius:2px 2px 0 0;opacity:.75"></div>
          <div style="height:18px;background:#D4A208"></div>
          <div style="height:22px;background:#1DD1A1"></div>
        </div>
      </div>
      <div style="display:flex;gap:2px;font-size:7px;color:#8E8A82;text-align:center">
        <div style="width:28px">Op 1</div><div style="width:28px">Op 2</div><div style="width:28px">Op 3</div><div style="width:28px">Op 4</div><div style="width:28px">Op 5</div>
      </div>
      <div style="display:flex;gap:8px;margin-top:6px;font-size:7px">
        <div style="display:flex;align-items:center;gap:3px"><div style="width:8px;height:8px;background:#1DD1A1;border-radius:1px"></div><span style="color:#8E8A82">VA</span></div>
        <div style="display:flex;align-items:center;gap:3px"><div style="width:8px;height:8px;background:#D4A208;border-radius:1px"></div><span style="color:#8E8A82">NNVA</span></div>
        <div style="display:flex;align-items:center;gap:3px"><div style="width:8px;height:8px;background:#FF6B6B;border-radius:1px;opacity:.75"></div><span style="color:#8E8A82">NVA</span></div>
      </div>
    </div>`,
    popup:`
      <div style="background:#F5F5F8;border-bottom:1px solid #D8D5CE;padding:10px 14px;display:flex;align-items:center;gap:7px">
        <div style="display:flex;gap:3px"><div style="width:8px;height:8px;border-radius:50%;background:#FF6B6B"></div><div style="width:8px;height:8px;border-radius:50%;background:#F4A623"></div><div style="width:8px;height:8px;border-radius:50%;background:#1DD1A1"></div></div>
        <span style="font-size:10px;color:#8E8A82;font-family:monospace;flex:1;text-align:center">📊 Yamazumi Chart — Operator Balance</span>
      </div>
      <div style="padding:14px">
        <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-bottom:14px">
          <div style="background:#F8F7F5;border:1px solid #D8D5CE;border-radius:10px;padding:10px;text-align:center"><div style="font-size:9px;color:#8E8A82;letter-spacing:.8px;text-transform:uppercase;margin-bottom:4px">Takt</div><div style="font-size:16px;font-weight:700;color:#C49B2E;font-family:monospace">120s</div></div>
          <div style="background:#F8F7F5;border:1px solid #D8D5CE;border-radius:10px;padding:10px;text-align:center"><div style="font-size:9px;color:#8E8A82;letter-spacing:.8px;text-transform:uppercase;margin-bottom:4px">Operators</div><div style="font-size:16px;font-weight:700;color:#1090D4;font-family:monospace">5</div></div>
          <div style="background:#F8F7F5;border:1px solid #D8D5CE;border-radius:10px;padding:10px;text-align:center"><div style="font-size:9px;color:#8E8A82;letter-spacing:.8px;text-transform:uppercase;margin-bottom:4px">VA %</div><div style="font-size:16px;font-weight:700;color:#1DD1A1;font-family:monospace">58%</div></div>
          <div style="background:#FEF2F0;border:1px solid rgba(192,64,42,.25);border-radius:10px;padding:10px;text-align:center"><div style="font-size:9px;color:#8E8A82;letter-spacing:.8px;text-transform:uppercase;margin-bottom:4px">Overloaded</div><div style="font-size:16px;font-weight:700;color:#C0402A;font-family:monospace">Op 3</div></div>
        </div>
        <div style="position:relative;height:160px;border-left:1px solid #D8D5CE;border-bottom:1px solid #D8D5CE;margin-bottom:8px;padding-left:8px">
          <div style="position:absolute;left:8px;right:0;bottom:64px;border-top:1.5px dashed #C0402A;opacity:.5"></div>
          <div style="position:absolute;right:4px;bottom:66px;font-size:9px;color:#C0402A;font-family:monospace;font-weight:700">TAKT 120s</div>
          <div style="display:flex;align-items:flex-end;gap:12px;height:100%;padding-top:8px">
            ${[['Op 1',[32,36,57],'ok'],['Op 2',[18,25,64],'ok'],['Op 3',[54,40,45],'over'],['Op 4',[14,22,40],'ok'],['Op 5',[22,32,35],'ok']].map(([name,bars,status])=>`<div style="display:flex;flex-direction:column;align-items:center;gap:0;flex:1">
              <div style="display:flex;flex-direction:column;width:100%;border:${status==='over'?'1.5px solid rgba(192,64,42,.4)':'none'};border-radius:3px 3px 0 0;overflow:hidden">
                <div style="height:${bars[0]}px;background:#FF6B6B;opacity:.8"></div>
                <div style="height:${bars[1]}px;background:#D4A208"></div>
                <div style="height:${bars[2]}px;background:#1DD1A1"></div>
              </div>
            </div>`).join('')}
          </div>
        </div>
        <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-bottom:10px">
          ${[['Op 1','ok'],['Op 2','ok'],['Op 3','over'],['Op 4','ok'],['Op 5','ok']].map(([n,s])=>`<span style="font-size:10px;padding:2px 10px;border-radius:100px;background:${s==='over'?'rgba(192,64,42,.1)':'rgba(29,209,161,.1)'};color:${s==='over'?'#C0402A':'#2A9E82'};border:1px solid ${s==='over'?'rgba(192,64,42,.3)':'rgba(29,209,161,.3)'}">${n}</span>`).join('')}
        </div>
        <div style="padding:10px 12px;background:#FEF2F0;border:1px solid rgba(192,64,42,.2);border-radius:8px;font-size:12px;color:#4E4B45">⚠ Op 3 is 25s over takt. Move NVA elements to Op 4 (45s available capacity) to rebalance.</div>
      </div>`,
  },
  {
    name:'Gap Analysis',short:'GAP',color:'#6426A0',
    tag:'AI',tagBg:'#F0EEFE',tagTxt:'#6426A0',
    headline:'Find every gap between now and world-class',
    body:'Automatically analyzes your entire value stream against lean best-practice targets. Surfaces critical bottlenecks, PCE gaps, waste density, and specific actionable fixes — sorted by severity.',
    cardContent:`<div style="padding:8px 10px;display:flex;flex-direction:column;gap:5px">
      <div style="font-size:8px;color:#8E8A82;margin-bottom:2px;font-family:monospace">3 critical · 2 warning · 1 info</div>
      <div style="background:#FEF2F0;border:1px solid rgba(192,64,42,.25);border-radius:6px;padding:7px 8px">
        <div style="font-size:7px;color:#C0402A;font-weight:700;font-family:monospace;margin-bottom:2px">🔴 CRITICAL</div>
        <div style="font-size:8px;color:#4E4B45;font-weight:600;margin-bottom:2px">Foam & Fabric is 25s over takt</div>
        <div style="font-size:7px;color:#8E8A82;line-height:1.4">Will cause upstream queue buildup. Run SMED or operator rebalance.</div>
      </div>
      <div style="background:#FEF9EE;border:1px solid rgba(196,155,46,.25);border-radius:6px;padding:7px 8px">
        <div style="font-size:7px;color:#C49B2E;font-weight:700;font-family:monospace;margin-bottom:2px">🟡 WARNING</div>
        <div style="font-size:8px;color:#4E4B45;font-weight:600;margin-bottom:2px">PCE is 34% — target 95%+</div>
        <div style="font-size:7px;color:#8E8A82;line-height:1.4">66% of lead time is non-value-adding wait.</div>
      </div>
      <div style="background:#EEF4FB;border:1px solid rgba(48,112,184,.2);border-radius:6px;padding:7px 8px">
        <div style="font-size:7px;color:#3070B8;font-weight:700;font-family:monospace;margin-bottom:2px">🔵 INFO</div>
        <div style="font-size:8px;color:#4E4B45;font-weight:600;margin-bottom:2px">3 steps have no time study data</div>
        <div style="font-size:7px;color:#8E8A82;line-height:1.4">Run observations to improve VSM accuracy.</div>
      </div>
    </div>`,
    popup:`
      <div style="background:#F5F5F8;border-bottom:1px solid #D8D5CE;padding:10px 14px;display:flex;align-items:center;gap:7px">
        <div style="display:flex;gap:3px"><div style="width:8px;height:8px;border-radius:50%;background:#FF6B6B"></div><div style="width:8px;height:8px;border-radius:50%;background:#F4A623"></div><div style="width:8px;height:8px;border-radius:50%;background:#1DD1A1"></div></div>
        <span style="font-size:10px;color:#8E8A82;font-family:monospace;flex:1;text-align:center">🎯 Gap Analysis — Seat Assembly Line 4</span>
        <span style="font-size:8px;font-weight:700;padding:2px 6px;border-radius:4px;background:#F0EEFE;color:#6426A0;font-family:monospace">AI</span>
      </div>
      <div style="padding:14px">
        <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-bottom:14px">
          <div style="background:#FEF2F0;border:1px solid rgba(192,64,42,.25);border-radius:10px;padding:10px;text-align:center"><div style="font-size:9px;color:#8E8A82;letter-spacing:.8px;text-transform:uppercase;margin-bottom:4px">Critical</div><div style="font-size:22px;font-weight:700;color:#C0402A;font-family:monospace">3</div></div>
          <div style="background:#FEF9EE;border:1px solid rgba(196,155,46,.25);border-radius:10px;padding:10px;text-align:center"><div style="font-size:9px;color:#8E8A82;letter-spacing:.8px;text-transform:uppercase;margin-bottom:4px">Warning</div><div style="font-size:22px;font-weight:700;color:#C49B2E;font-family:monospace">2</div></div>
          <div style="background:#EEF4FB;border:1px solid rgba(48,112,184,.2);border-radius:10px;padding:10px;text-align:center"><div style="font-size:9px;color:#8E8A82;letter-spacing:.8px;text-transform:uppercase;margin-bottom:4px">Info</div><div style="font-size:22px;font-weight:700;color:#3070B8;font-family:monospace">1</div></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">
          <div style="background:#fff;border:1px solid rgba(192,64,42,.3);border-radius:10px;overflow:hidden">
            <div style="padding:10px 12px;border-left:3px solid #C0402A">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><span style="font-size:9px;padding:2px 8px;border-radius:100px;background:rgba(192,64,42,.1);color:#C0402A;font-weight:700;font-family:monospace">CRITICAL</span><span style="font-size:10px;color:#8E8A82;font-family:monospace">Bottleneck</span></div>
              <div style="font-size:12px;font-weight:700;color:#242220;margin-bottom:6px">"Foam & Fabric" is 25s over takt time</div>
              <div style="font-size:11px;color:#4E4B45;line-height:1.6;margin-bottom:8px">Cycle time is 145s vs takt of 120s. This step cannot keep pace with customer demand and will cause queue buildup upstream. Everything feeding into this step will stall.</div>
              <div style="padding:8px 10px;background:#FEF2F0;border-radius:7px;font-size:11px;color:#C0402A">→ Run a 5 Why on this step. Decompose tasks using Operator Steps — identify NVA elements to eliminate. Consider splitting across 2 operators or adding a parallel station.</div>
            </div>
          </div>
          <div style="background:#fff;border:1px solid rgba(196,155,46,.3);border-radius:10px;overflow:hidden">
            <div style="padding:10px 12px;border-left:3px solid #C49B2E">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><span style="font-size:9px;padding:2px 8px;border-radius:100px;background:rgba(196,155,46,.12);color:#C49B2E;font-weight:700;font-family:monospace">WARNING</span><span style="font-size:10px;color:#8E8A82;font-family:monospace">Process Efficiency</span></div>
              <div style="font-size:12px;font-weight:700;color:#242220;margin-bottom:6px">PCE is 34% — target is 95%+</div>
              <div style="font-size:11px;color:#4E4B45;line-height:1.6;margin-bottom:8px">66% of total lead time is non-value-adding wait. World-class VSMs run at 90–95% PCE. The gap represents working capital tied up in WIP and delayed customer responsiveness.</div>
              <div style="padding:8px 10px;background:#FEF9EE;border-radius:7px;font-size:11px;color:#C49B2E">→ Focus kaizen on the largest WIP triangles between steps. Target the queue before Foam & Fabric first — 18 units sitting idle.</div>
            </div>
          </div>
        </div>
      </div>`,
  },
  {
    name:'A3 Report',short:'A3',color:'#2A9E82',
    tag:'Export',tagBg:'#E6F7F3',tagTxt:'#0F6E56',
    headline:'One report. Every metric. Print-ready.',
    body:'Generates a complete A3 improvement report from your VSM data — process overview, bottleneck analysis, waste register, root cause summary, Kaizen tracker, and before/after results. Opens in a new tab ready to print or PDF.',
    cardContent:`<div style="padding:8px 10px">
      <div style="background:#fff;border:1px solid #D8D5CE;border-radius:6px;overflow:hidden;font-family:sans-serif">
        <div style="background:#242220;padding:6px 10px;display:flex;align-items:center;justify-content:space-between">
          <div style="font-size:8px;color:#D4A208;font-weight:700;letter-spacing:1px">VESIMY · PROCESS INTELLIGENCE REPORT</div>
          <div style="font-size:7px;color:#8E8A82">ISO 9001:2015</div>
        </div>
        <div style="padding:8px 10px">
          <div style="font-size:9px;font-weight:700;color:#242220;margin-bottom:5px">Seat Assembly Line 4 — Current State Analysis</div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:3px;margin-bottom:6px">
            <div style="background:#F8F7F5;border-radius:3px;padding:3px 4px;text-align:center"><div style="font-size:6px;color:#8E8A82">PCE</div><div style="font-size:10px;font-weight:700;color:#C0402A">34%</div></div>
            <div style="background:#F8F7F5;border-radius:3px;padding:3px 4px;text-align:center"><div style="font-size:6px;color:#8E8A82">Lead Time</div><div style="font-size:10px;font-weight:700;color:#C49B2E">14m40s</div></div>
            <div style="background:#F8F7F5;border-radius:3px;padding:3px 4px;text-align:center"><div style="font-size:6px;color:#8E8A82">Takt</div><div style="font-size:10px;font-weight:700;color:#C49B2E">2m00s</div></div>
            <div style="background:#FEF2F0;border-radius:3px;padding:3px 4px;text-align:center"><div style="font-size:6px;color:#8E8A82">BN Step</div><div style="font-size:9px;font-weight:700;color:#C0402A">Foam</div></div>
          </div>
          <div style="border-top:1px solid #EEE;padding-top:5px">
            <div style="font-size:7px;font-weight:700;color:#242220;margin-bottom:3px">Open Kaizen Events</div>
            <div style="display:flex;gap:3px">
              <span style="font-size:7px;padding:1px 5px;border-radius:100px;background:rgba(196,155,46,.15);color:#C49B2E">In Progress (1)</span>
              <span style="font-size:7px;padding:1px 5px;border-radius:100px;background:rgba(142,138,130,.12);color:#8E8A82">Open (2)</span>
              <span style="font-size:7px;padding:1px 5px;border-radius:100px;background:rgba(42,158,130,.15);color:#2A9E82">Done (1)</span>
            </div>
          </div>
        </div>
      </div>
    </div>`,
    popup:`
      <div style="background:#F5F5F8;border-bottom:1px solid #D8D5CE;padding:10px 14px;display:flex;align-items:center;gap:7px">
        <div style="display:flex;gap:3px"><div style="width:8px;height:8px;border-radius:50%;background:#FF6B6B"></div><div style="width:8px;height:8px;border-radius:50%;background:#F4A623"></div><div style="width:8px;height:8px;border-radius:50%;background:#1DD1A1"></div></div>
        <span style="font-size:10px;color:#8E8A82;font-family:monospace;flex:1;text-align:center">📄 A3 Report — Seat Assembly Line 4</span>
      </div>
      <div style="background:#242220;padding:14px 18px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;flex-wrap:wrap;gap:8px">
          <div>
            <div style="font-size:8px;color:#D4A208;letter-spacing:2px;font-family:monospace;margin-bottom:4px">VESIMY · PROCESS INTELLIGENCE REPORT</div>
            <div style="font-size:16px;font-weight:700;color:#EAE8F4;font-family:Palatino Linotype,serif">Seat Assembly Line 4</div>
            <div style="font-size:11px;color:#7070A0;margin-top:2px">Current State Analysis · March 2026</div>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <span style="font-size:8px;padding:3px 8px;border-radius:4px;background:rgba(212,162,8,.12);color:#D4A208;border:1px solid rgba(212,162,8,.25);font-family:monospace">ISO 9001:2015</span>
            <span style="font-size:8px;padding:3px 8px;border-radius:4px;background:rgba(48,112,184,.12);color:#6CB9FC;border:1px solid rgba(48,112,184,.25);font-family:monospace">ISO 22468:2020</span>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-bottom:14px">
          <div style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:10px;text-align:center"><div style="font-size:8px;color:#7070A0;letter-spacing:1px;font-family:monospace;margin-bottom:4px">PCE</div><div style="font-size:20px;font-weight:700;color:#FF6B6B;font-family:monospace">34%</div><div style="font-size:8px;color:#38385C">Target: 95%+</div></div>
          <div style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:10px;text-align:center"><div style="font-size:8px;color:#7070A0;letter-spacing:1px;font-family:monospace;margin-bottom:4px">LEAD TIME</div><div style="font-size:16px;font-weight:700;color:#D4A208;font-family:monospace">14m 40s</div><div style="font-size:8px;color:#38385C">VA: 8m 14s</div></div>
          <div style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:10px;text-align:center"><div style="font-size:8px;color:#7070A0;letter-spacing:1px;font-family:monospace;margin-bottom:4px">TAKT TIME</div><div style="font-size:16px;font-weight:700;color:#D4A208;font-family:monospace">2m 00s</div><div style="font-size:8px;color:#38385C">120 units/day</div></div>
          <div style="background:rgba(192,64,42,.12);border:1px solid rgba(192,64,42,.3);border-radius:8px;padding:10px;text-align:center"><div style="font-size:8px;color:#7070A0;letter-spacing:1px;font-family:monospace;margin-bottom:4px">BOTTLENECK</div><div style="font-size:12px;font-weight:700;color:#FF6B6B">Foam & Fabric</div><div style="font-size:8px;color:#38385C">145s vs 120s takt</div></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
          <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:12px">
            <div style="font-size:9px;color:#D4A208;letter-spacing:1.5px;font-family:monospace;margin-bottom:8px">WASTE REGISTER</div>
            <div style="display:flex;flex-direction:column;gap:4px">
              <div style="display:flex;justify-content:space-between;font-size:10px"><span style="color:#7070A0">Inventory</span><span style="color:#FF6B6B;font-weight:700">47 units WIP</span></div>
              <div style="display:flex;justify-content:space-between;font-size:10px"><span style="color:#7070A0">Waiting</span><span style="color:#FF6B6B;font-weight:700">6m 12s total</span></div>
              <div style="display:flex;justify-content:space-between;font-size:10px"><span style="color:#7070A0">Defects</span><span style="color:#D4A208;font-weight:700">3.2% rework</span></div>
            </div>
          </div>
          <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:12px">
            <div style="font-size:9px;color:#D4A208;letter-spacing:1.5px;font-family:monospace;margin-bottom:8px">KAIZEN TRACKER</div>
            <div style="display:flex;flex-direction:column;gap:4px">
              <div style="display:flex;justify-content:space-between;font-size:10px"><span style="color:#7070A0">KZ-001 SMED event</span><span style="color:#D4A208;font-weight:700">In Progress</span></div>
              <div style="display:flex;justify-content:space-between;font-size:10px"><span style="color:#7070A0">KZ-002 Fixture check</span><span style="color:#1DD1A1;font-weight:700">Complete</span></div>
              <div style="display:flex;justify-content:space-between;font-size:10px"><span style="color:#7070A0">KZ-003 5S audit</span><span style="color:#7070A0;font-weight:700">Open</span></div>
            </div>
          </div>
        </div>
        <button style="width:100%;padding:11px;background:linear-gradient(135deg,#C49510,#D4A208);border:none;border-radius:10px;color:#03030D;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">📄 Download Full A3 Report (PDF)</button>
      </div>`,
  },
]

// ── InlineToolShowcase — embedded in hero right column ───────────────────────
function InlineToolShowcase() {
  const [active, setActive] = useState(0)
  const wrapRef = useRef<HTMLDivElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const lastNav = useRef(0)
  const tool = SHOWCASE_TOOLS[active]

  // ── Desktop: mouse wheel on the wrapper (skip if scrolling inside popup) ──
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      // If the scroll target is inside the popup, let popup scroll naturally
      if (popupRef.current && popupRef.current.contains(e.target as Node)) {
        const pop = popupRef.current
        const atTop = pop.scrollTop === 0
        const atBot = pop.scrollTop + pop.clientHeight >= pop.scrollHeight - 2
        if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBot)) {
          // At boundary — advance tool
        } else {
          return // let popup scroll
        }
      }
      const now = Date.now()
      if (now - lastNav.current < 500) return
      if (Math.abs(e.deltaY) < 20) return
      e.preventDefault()
      lastNav.current = now
      if (e.deltaY > 0) setActive(t => Math.min(t + 1, SHOWCASE_TOOLS.length - 1))
      else              setActive(t => Math.max(t - 1, 0))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [active])

  // ── Desktop: arrow keys when focused ──────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown')
        setActive(t => Math.min(t + 1, SHOWCASE_TOOLS.length - 1))
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
        setActive(t => Math.max(t - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ── Mobile: horizontal touch swipe ────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = touchStartX.current - e.changedTouches[0].clientX
    const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY)
    if (Math.abs(dx) < 40 || dy > Math.abs(dx)) return
    const now = Date.now()
    if (now - lastNav.current < 400) return
    lastNav.current = now
    if (dx > 0) setActive(t => Math.min(t + 1, SHOWCASE_TOOLS.length - 1))
    else        setActive(t => Math.max(t - 1, 0))
  }

  return (
    <div ref={wrapRef} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
      style={{ userSelect: 'none', outline: 'none' }}>
      <style>{`
        @keyframes inlineReveal{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes inlineRevealX{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:translateX(0)}}
        /* mobile rules now in main style block */
      `}</style>

      {/* Tool header row — tag pill + name + nav hint */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="hero-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 100, background: 'rgba(255,255,255,0.12)', border: `1px solid ${tool.color}55` }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: tool.color, letterSpacing: '.5px', fontFamily: 'monospace' }}>{tool.tag}</span>
          </div>
          <span key={active} style={{ fontSize: 13, fontWeight: 700, color: '#F8F7F5', fontFamily: serif, animation: 'inlineRevealX 0.2s ease both' }}>{tool.headline}</span>
        </div>
        <span style={{ fontSize: 10, color: 'rgba(248,247,245,0.3)', fontFamily: 'monospace', letterSpacing: 0.8 }}>
          {active + 1} / {SHOWCASE_TOOLS.length} · scroll or use ‹ ›
        </span>
      </div>

      {/* Tool popup preview */}
      <div ref={popupRef} key={active} className="inline-popup" style={{ background: '#FFFFFF', border: '0.5px solid #D8D5CE', borderRadius: 14, overflow: 'hidden', boxShadow: '0 4px 28px rgba(0,0,0,0.22)', maxHeight: 400, overflowY: 'auto', marginBottom: 16, animation: 'inlineReveal 0.25s ease both' }}
        dangerouslySetInnerHTML={{ __html: tool.popup + `
          <div style="padding:8px 14px;border-top:1px solid #D8D5CE;background:#F5F5F8;display:flex;align-items:center;justify-content:space-between">
            <span style="font-size:9px;font-weight:700;color:#8E8A82;font-family:Palatino Linotype,serif">VeSiMy</span>
            <a href="/auth/signup" style="padding:5px 12px;font-size:11px;font-weight:700;border-radius:8px;border:none;background:#C49B2E;color:#fff;text-decoration:none">Try free →</a>
          </div>` }}
      />

      {/* Mini 3D stack */}
      <div className="inline-stack-wrap" style={{ height: 'min(320px, 55vw)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <div style={{ perspective: '900px', perspectiveOrigin: '68% 46%', flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="inline-3d" style={{ position: 'relative', width: 260, height: 280, transformStyle: 'preserve-3d', transform: 'rotateY(20deg) rotateX(6deg) rotateZ(1.5deg)' }}>
            {SHOWCASE_TOOLS.map((t, i) => {
              const off = i - active
              const isA = i === active
              return (
                <div key={t.short} onClick={() => !isA && setActive(i)} style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                  borderRadius: 12,
                  background: `rgba(255,255,255,${isA ? .97 : Math.max(.4, .8 - Math.abs(off) * .09)})`,
                  border: `1.5px solid ${isA ? t.color + '55' : 'rgba(215,213,206,.6)'}`,
                  boxShadow: isA ? `0 14px 40px rgba(0,0,0,.12),0 0 0 1px ${t.color}18` : '0 2px 8px rgba(0,0,0,.05)',
                  transform: `translateY(${off * 13}px) translateZ(${isA ? 40 : -Math.abs(off) * 14}px) scale(${isA ? 1 : Math.max(.85, .97 - Math.abs(off) * .025)})`,
                  transition: 'all .42s cubic-bezier(.34,1.15,.64,1)',
                  overflow: 'hidden', display: 'flex', flexDirection: 'column',
                  cursor: isA ? 'default' : 'pointer',
                }}>
                  <div style={{ padding: '10px 12px 7px', borderBottom: '1px solid rgba(0,0,0,.05)', flexShrink: 0, background: 'rgba(255,255,255,.5)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 24, height: 24, borderRadius: 6, background: `${t.color}12`, border: `1px solid ${t.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, fontWeight: 800, color: t.color, fontFamily: 'monospace', flexShrink: 0 }}>{t.short}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#242220' }}>{t.name}</div>
                        <div style={{ fontSize: 7, color: '#8E8A82', marginTop: 1 }}>{t.headline}</div>
                      </div>
                      {isA && <div style={{ width: 5, height: 5, borderRadius: '50%', background: t.color, flexShrink: 0 }} />}
                    </div>
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden', opacity: isA ? 1 : Math.max(.1, .6 - Math.abs(off) * .18), transform: `scale(${isA ? 1 : .84})`, transformOrigin: 'top left', transition: 'opacity .4s,transform .4s', pointerEvents: 'none' }}
                    dangerouslySetInnerHTML={{ __html: t.cardContent }}
                  />
                  {isA && <div style={{ padding: '0 12px 8px', flexShrink: 0 }}><div style={{ height: 2, borderRadius: 2, background: `linear-gradient(90deg,${t.color},${t.color}18)` }} /></div>}
                </div>
              )
            })}
          </div>
        </div>

        {/* Dots + prev/next */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => setActive(t => Math.max(t-1, 0))} disabled={active===0}
            style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)', color: active===0 ? 'rgba(255,255,255,0.2)' : '#F8F7F5', fontSize: 13, cursor: active===0 ? 'default' : 'pointer', fontWeight: 600, transition: 'all .15s' }}>‹ Prev</button>
          <div style={{ display: 'flex', gap: 5, flex: 1, justifyContent: 'center' }}>
            {SHOWCASE_TOOLS.map((t,i) => (
              <div key={i} onClick={() => setActive(i)} style={{ width: i===active?18:6, height: 6, borderRadius: 100, background: i===active ? t.color : 'rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'all .25s' }} />
            ))}
          </div>
          <button onClick={() => setActive(t => Math.min(t+1, SHOWCASE_TOOLS.length-1))} disabled={active===SHOWCASE_TOOLS.length-1}
            style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)', color: active===SHOWCASE_TOOLS.length-1 ? 'rgba(255,255,255,0.2)' : '#F8F7F5', fontSize: 13, cursor: active===SHOWCASE_TOOLS.length-1 ? 'default' : 'pointer', fontWeight: 600, transition: 'all .15s' }}>Next ›</button>
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
    { name: 'VeSiMy', color: '#C49B2E', bg: 'rgba(196,155,46,0.06)', border: 'rgba(196,155,46,0.3)', highlight: true, scores: [true,true,true,true,true,true,true,true,true,true,true,true] },
    { name: 'Excel / Sheets', color: '#6B6760', bg: '#FAFAFA', border: '#E0E0E0', highlight: false, scores: [false,false,false,false,false,false,false,false,false,false,false,true] },
    { name: 'Visio / Lucidchart', color: '#1A4F8A', bg: '#FAFAFA', border: '#E0E0E0', highlight: false, scores: [true,false,false,false,false,false,false,false,false,false,false,false] },
    { name: 'Minitab', color: '#534AB7', bg: '#FAFAFA', border: '#E0E0E0', highlight: false, scores: [false,false,false,false,false,false,false,false,false,false,false,false] },
    { name: 'Generic PM Tool', color: '#6B6760', bg: '#FAFAFA', border: '#E0E0E0', highlight: false, scores: [false,false,false,false,false,true,false,false,false,false,false,true] },
  ]

  return (
    <section style={{ padding: 'clamp(48px,6vw,80px) clamp(16px,4vw,48px)', background: '#1A1714', borderTop: '1px solid rgba(255,255,255,0.09)', borderBottom: '1px solid rgba(255,255,255,0.09)' }}>
      <div style={{ maxWidth: 1060, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 11, color: '#C49B2E', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8, fontFamily: 'monospace' }}>Why VeSiMy</div>
          <h2 style={{ fontSize: 'clamp(22px,3vw,34px)', fontWeight: 700, color: '#F8F7F5', marginBottom: 10, fontFamily: serif }}>
            Why CI teams are replacing their current setup
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(248,247,245,0.5)', maxWidth: 520, margin: '0 auto', lineHeight: 1.75 }}>
            Your current CI workflow probably lives across 4–6 disconnected tools. VeSiMy replaces all of them — and adds AI that reads your real data.
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
                        ? <span style={{ fontSize: 14, color: t.highlight ? '#C49B2E' : '#2A9E82' }}>✓</span>
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
          <Link href="/auth/signup" style={{ padding: '12px 28px', background: '#C49B2E', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Switch to VeSiMy — free to start <ArrowRightIcon size={13} color="#fff" />
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
            <p style={{ fontSize: 13, color: '#6B6760', lineHeight: 1.8, marginBottom: 20 }}>{tool.body}</p>

            <div className="showcase-popup" style={{ background: '#FFFFFF', border: '0.5px solid #D8D5CE', borderRadius: 14, overflow: 'hidden', boxShadow: '0 4px 28px rgba(0,0,0,0.09)', maxHeight: 500, overflowY: 'auto' }}
              dangerouslySetInnerHTML={{ __html: tool.popup + `
                <div style="padding:9px 14px;border-top:1px solid #D8D5CE;background:#F5F5F8;display:flex;align-items:center;justify-content:space-between">
                  <div style="display:flex;align-items:center;gap:4px;padding:2px 7px;background:rgba(196,155,46,.12);border:1px solid rgba(196,155,46,.25);border-radius:4px">
                    <span style="font-size:9px;font-weight:700;color:#8E8A82;font-family:Palatino Linotype,serif">VeSiMy</span>
                  </div>
                  <a href="/auth/signup" style="display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:6px 14px;font-size:11px;font-weight:700;border-radius:10px;border:none;background:#C49B2E;color:#fff;text-decoration:none;cursor:pointer">Try free →</a>
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
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .reveal { opacity:0; animation: fadeUp 0.7s ease forwards; }
        .r1 { animation-delay:0.05s } .r2 { animation-delay:0.18s }
        .r3 { animation-delay:0.30s } .r4 { animation-delay:0.44s }
        .r5 { animation-delay:0.56s }
        @keyframes logoFloat {
          0%,100% { transform: translateY(0px) rotate(-1deg); }
          50%      { transform: translateY(-7px) rotate(1deg); }
        }
        @keyframes logoGlow {
          0%,100% { filter: drop-shadow(0 4px 18px rgba(196,155,46,0.22)) drop-shadow(0 0 0px rgba(140,68,204,0)); }
          50%     { filter: drop-shadow(0 8px 32px rgba(196,155,46,0.45)) drop-shadow(0 0 18px rgba(140,68,204,0.25)); }
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
        .nav-link { color:rgba(248,247,245,0.55); text-decoration:none; font-size:13px; transition:color 0.15s; }
        .nav-link:hover { color:#F8F7F5; }

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
          .showcase-stack-col{position:relative!important;top:auto!important;height:auto!important;padding:0 16px 16px!important;}
          .showcase-detail-col{padding:0 16px!important;}
          .showcase-3d{transform:rotateY(0deg) rotateX(4deg) rotateZ(0deg)!important;width:240px!important;height:300px!important;}
          .showcase-popup{max-height:320px!important;}
          .showcase-swipe-hint{display:flex!important;}
          .comp-table-wrap{overflow-x:auto!important;-webkit-overflow-scrolling:touch;}
          .hero-tools-grid{gap:20px!important;}
          .footer-links{justify-content:center!important;}
          .footer-wrap{justify-content:center!important;text-align:center;}
          .stats-bar-grid{grid-template-columns:1fr 1fr!important;gap:14px!important;}
          .pricing-card-lifetime{display:none!important;}
        }
        @media(max-width:500px){
          .inline-popup{max-height:260px!important;}
          .inline-stack-wrap{height:240px!important;}
          .inline-3d{width:180px!important;height:220px!important;}
          .inline-swipe{display:flex!important;}
          .hero-pill{font-size:9px!important;padding:3px 8px!important;}
          .nav-sign-in{display:none!important;}
          .hero-cta-row a{font-size:13px!important;padding:11px 18px!important;}
          .stats-bar-grid{grid-template-columns:1fr 1fr!important;gap:12px!important;}
          .feat-grid>div{padding:20px 16px!important;}
        }
        .inline-swipe{display:none;}
        .showcase-swipe-hint{display:none;}
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav className="nav-pad" style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 60, background: 'rgba(26,23,20,0.96)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.09)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <VLogoMark size={30} />
          <VeSiMyWordmark size={19} />
        </div>
        <div className="hide-mobile" style={{ display: 'flex', gap: 28 }}>
          {[['Tools', '#tools'], ['Pricing', '#pricing'], ['Blog', '/blog'], ['Learn', '/learn']].map(([l, h]) => (
            <a key={l} href={h} className="nav-link">{l}</a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link href="/auth/login" className="nav-sign-in" style={{ padding: '7px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 8, fontSize: 13, color: 'rgba(248,247,245,0.6)', textDecoration: 'none' }}>
            Sign in
          </Link>
          <Link href="/auth/signup" style={{ padding: '7px 18px', background: '#C49B2E', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, color: '#0D0C0A', textDecoration: 'none' }}>
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
              <stop offset="0%" stopColor="#C49B2E" stopOpacity="0.18"/>
              <stop offset="100%" stopColor="#C49B2E" stopOpacity="0"/>
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
              stroke="#C49B2E" strokeWidth={i < 10 ? "0.7" : "0.45"}
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
              fill="#C49B2E"
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
              fill="#C49B2E" opacity={op as number}/>
          ))}
        </svg>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', padding: 'clamp(28px,5vw,72px) clamp(16px,4vw,48px)' }}>
          <div className="hero-tools-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 'clamp(24px,4vw,64px)', alignItems: 'start' }}>

            {/* ── LEFT: Branding + copy ── */}
            <div className="hero-tools-left" style={{ paddingTop: 'clamp(8px,2vw,32px)' }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                <div className="logo-mark-anim"><VLogoMark size={72} /></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div className="wordmark-anim"><VeSiMyWordmark size={42} onDark /></div>
                  <span className="tagline-anim" style={{ fontSize: 10, letterSpacing: 2.5, fontFamily: 'monospace', textTransform: 'uppercase', color: 'rgba(248,247,245,0.45)', fontWeight: 600 }}>AI · Continuous Improvement</span>
                </div>
              </div>

              <IndustryLoop />

              <h1 className="reveal r2" style={{ fontSize: 'clamp(28px,3.6vw,48px)', lineHeight: 1.1, fontWeight: 700, color: '#F8F7F5', marginBottom: 16, letterSpacing: -0.5, fontFamily: serif }}>
                Your entire improvement<br />process —<br /><span style={{ color: '#C49B2E' }}>one place.</span>
              </h1>

              <p className="reveal r3" style={{ fontSize: 14, color: 'rgba(248,247,245,0.62)', lineHeight: 1.85, marginBottom: 20, maxWidth: 400 }}>
                VeSiMy connects your time studies, root cause analyses, Kaizen logs, and value stream maps — so nothing gets lost between the whiteboard and the report. Built by lean practitioners, for lean practitioners.
              </p>

              <div className="reveal r3 hero-mission" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 24, padding: '12px 16px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderLeft: '3px solid #C49B2E', borderRadius: '0 10px 10px 0', maxWidth: 380 }}>
                <span style={{ fontSize: 26, fontWeight: 800, color: '#C49B2E', fontFamily: serif, lineHeight: 1, flexShrink: 0 }}>V</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#F8F7F5', lineHeight: 1.3 }}>Built by lean practitioners — for lean practitioners</div>
                  <div style={{ fontSize: 11, color: 'rgba(248,247,245,0.65)', marginTop: 2, lineHeight: 1.5 }}>12+ years on real production floors at Tesla, Philips Electronics, LSG Sky Chefs</div>
                </div>
              </div>

              <div className="reveal r4 hero-cta-row" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                <Link href="/auth/signup" style={{ padding: '12px 24px', background: '#C49B2E', color: '#0D0C0A', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                  Start free — no card needed <ArrowRightIcon size={13} color="#0D0C0A" />
                </Link>
                <Link href="/auth/signup" style={{ padding: '12px 18px', background: 'transparent', color: 'rgba(248,247,245,0.7)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 10, fontSize: 13, textDecoration: 'none' }}>
                  See demo →
                </Link>
              </div>
              <p className="reveal r5" style={{ fontSize: 10, color: 'rgba(248,247,245,0.25)', fontFamily: 'monospace' }}>Unlimited projects · Free forever · No credit card</p>
            </div>

            {/* ── RIGHT: Inline tool showcase ── */}
            <InlineToolShowcase />

          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────────── */}
      <div style={{ background: '#231F1B', padding: '18px clamp(16px,4vw,48px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="stats-bar-grid" style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
          {[
            ['12+', 'Years manufacturing experience'],
            ['ISO 22468', 'Compliant VSM standard'],
            ['9', 'CI tools, all connected'],
            ['Free', 'Unlimited projects forever'],
          ].map(([v,l]) => (
            <div key={l} style={{ textAlign: 'center', padding: '4px 8px' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 700, color: '#C49B2E' }}>{v}</div>
              <div style={{ fontSize: 10, color: 'rgba(248,247,245,0.35)', marginTop: 2, letterSpacing: '0.2px', lineHeight: 1.4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ────────────────────────────────────────────────────────── */}
      <div className="feat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2, background: '#C8C5BC', borderTop: '0.5px solid #C8C5BC' }}>
        {[
          { icon: '📊', bg: '#EDF9F5', title: 'One map. All your data.', body: 'Your time study, root cause findings, and Kaizen log all feed the same VSM automatically. Change a cycle time — the map updates. Nothing to copy, nothing gets out of sync.' },
          { icon: '🔗', bg: '#FAEEDA', title: '9 tools. All connected.', body: 'Time Study, 5 Why, Fishbone, Waste ID, Kaizen, Yamazumi, Standard Work, PDCA, Gap Analysis — linked to every step, feeding one A3 report in one click.' },
          { icon: '🆓', bg: '#EEEDFE', title: 'Free forever. No clock.', body: 'Unlimited projects, all 9 CI tools — free forever. No time limits, no project caps. Upgrade to Pro only when you want Supe AI and process simulation.' },
        ].map(f => (
          <div key={f.title} style={{ background: '#EDE9E0', padding: '28px 24px' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 12 }}>{f.icon}</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#242220', marginBottom: 7 }}>{f.title}</div>
            <div style={{ fontSize: 13, color: '#6B6760', lineHeight: 1.7 }}>{f.body}</div>
          </div>
        ))}
      </div>

      {/* ── PROBLEM SECTION ─────────────────────────────────────────────────── */}
      <section style={{ background: '#FFFFFF', padding: 'clamp(48px,6vw,72px) clamp(16px,4vw,48px)', borderTop: '0.5px solid #D8D5CE', borderBottom: '0.5px solid #D8D5CE' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px,5vw,72px)', alignItems: 'center' }} className="problem-grid">
          <div>
            <div style={{ fontSize: 11, color: '#C49B2E', letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 10, fontWeight: 700 }}>The problem</div>
            <h2 style={{ fontFamily: '"Palatino Linotype",Georgia,serif', fontSize: 'clamp(22px,3vw,34px)', fontWeight: 700, color: '#242220', lineHeight: 1.2, marginBottom: 20 }}>
              Right now, your CI process looks like this.
            </h2>
            {[
              ['A VSM on the whiteboard', 'Updated manually every time anything changes'],
              ['Cycle times in a spreadsheet', 'Disconnected from the map — already out of date'],
              ['Root cause in a Word doc', 'No connection to the step where the problem lives'],
              ['Kaizen log that nobody updates', 'Actions get lost between meetings'],
              ['A report that takes a day to compile', 'And is outdated by the time anyone reads it'],
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
          <div style={{ background: '#F8F6F0', borderRadius: 16, padding: 'clamp(20px,3vw,32px)', border: '0.5px solid #D8D5CE' }}>
            <div style={{ fontSize: 11, color: '#1A7A5E', letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 10, fontWeight: 700 }}>With VeSiMy</div>
            <p style={{ fontFamily: '"Palatino Linotype",Georgia,serif', fontSize: 'clamp(16px,2vw,20px)', fontWeight: 500, color: '#242220', lineHeight: 1.6, marginBottom: 20 }}>
              When you run a time study, that cycle time <em>is</em> the cycle time on the VSM. When you open a Kaizen, it appears on the map. When you complete a 5 Why, the root cause stays attached to the step where the problem lives.
            </p>
            <p style={{ fontSize: 13, color: '#4E4B45', lineHeight: 1.75, marginBottom: 20 }}>
              Nothing needs to be copied. Nothing gets out of sync. And when you need to know what to fix next, Supe reads your actual process data and tells you — specifically.
            </p>
            <div style={{ background: 'rgba(196,155,46,0.08)', border: '1px solid rgba(196,155,46,0.25)', borderRadius: 10, padding: '12px 16px' }}>
              <div style={{ fontSize: 11, color: '#8E8A82', fontFamily: 'monospace', marginBottom: 6 }}>⚡ SUPE — AI Gap Analysis</div>
              <p style={{ fontSize: 12, color: '#4E4B45', lineHeight: 1.65, fontStyle: 'italic', margin: 0 }}>
                "Foam & Fabric is 21% over Takt with 3 open Kaizen events. Eliminate the 14s of NVA before adding capacity — that closes the gap without equipment spend."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPETITOR COMPARISON ─────────────────────────────────────────────── */}
      <CompetitorTable />

      {/* ── QUOTE ───────────────────────────────────────────────────────────── */}
      <div style={{ padding: 'clamp(40px,5vw,64px) clamp(16px,4vw,48px)', textAlign: 'center', background: '#F8F6F0', borderTop: '3px solid #C49B2E' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <p style={{ fontSize: 'clamp(18px,2.5vw,24px)', fontWeight: 500, color: '#242220', lineHeight: 1.55, marginBottom: 14, fontFamily: serif }}>
            "The ability to add individual steps per operator with times is exactly what we needed. The designator for value-add and non value-add per operator step and the Yamazumi — that's the workflow."
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#C49B2E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#0D0C0A' }}>CI</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#242220' }}>Continuous Improvement Practitioner</div>
              <div style={{ fontSize: 11, color: '#8E8A82' }}>Lean manufacturing professional, early user feedback</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── PRICING ─────────────────────────────────────────────────────────── */}
      <section id="pricing" className="sec-pad" style={{ padding: 'clamp(48px,6vw,72px) clamp(16px,4vw,48px)', background: '#EDE9E0' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 11, color: '#8E8A82', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8, fontFamily: 'monospace' }}>Pricing</div>
            <h2 style={{ fontSize: 'clamp(24px,3vw,34px)', fontWeight: 700, color: '#242220', marginBottom: 10, fontFamily: serif }}>Simple, honest pricing.</h2>
            <p style={{ fontSize: 15, color: '#6B6760', maxWidth: 480, margin: '0 auto' }}>Unlimited projects free forever. Pro adds Supe AI, process simulation, and the A3 export — with a free trial on your first upgrade.</p>
          </div>

          <div className="plan-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(240px,100%),1fr))', gap: 16 }}>
            {(Object.entries(PLANS) as any[]).map(([key, plan]) => {
              const isPro = key === 'pro'
              const isLife = key === 'lifetime'
              const isEnt = key === 'enterprise'
              return (
                <div key={key} className={isLife ? 'pricing-card-lifetime' : ''} style={{ background: '#FFFFFF', border: isPro || isLife ? '1.5px solid rgba(196,155,46,0.4)' : '0.5px solid #D8D5CE', borderRadius: 16, padding: '26px 22px', position: 'relative' }}>
                  {(isPro || isLife) && (
                    <div style={{ display: 'inline-flex', background: '#C49B2E', color: '#fff', fontSize: 9, fontWeight: 700, padding: '3px 14px', borderRadius: 999, letterSpacing: 1.5, marginBottom: 12 }}>
                      {isLife ? '👑 BEST VALUE' : 'MOST POPULAR'}
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: '#C49B2E', letterSpacing: 2, fontWeight: 700, marginBottom: 6, fontFamily: 'monospace', textTransform: 'uppercase' }}>{plan.name}</div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: '#242220', marginBottom: 6, lineHeight: 1, fontFamily: serif }}>
                    {isEnt ? 'Custom' : plan.price === 0 ? 'Free' : `$${plan.price}`}
                    {!isEnt && plan.price !== null && Number(plan.price) > 0 && (
                      <span style={{ fontSize: 13, fontWeight: 400, color: '#8E8A82', marginLeft: 4 }}>{isLife ? ' once' : '/mo'}</span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: '#6B6760', marginBottom: 18, lineHeight: 1.65, minHeight: 40 }}>{plan.description}</p>
                  <ul style={{ listStyle: 'none', marginBottom: 22, display: 'flex', flexDirection: 'column', gap: 9 }}>
                    {plan.features.map((f: string) => (
                      <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 13, color: '#4E4B45', lineHeight: 1.5 }}>
                        <CheckIcon size={13} color="#C49B2E" style={{ marginTop: 3, flexShrink: 0 }} /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={isEnt ? '/enterprise' : isLife ? '/beta' : plan.price === 0 ? '/auth/signup' : `/auth/signup?plan=${key}`}
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '11px 20px', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none', background: isPro || isLife ? '#C49B2E' : 'transparent', color: isPro || isLife ? '#fff' : '#4E4B45', border: isPro || isLife ? 'none' : '1px solid #D8D5CE' }}
                  >
                    {plan.cta}
                  </Link>
                  {isLife && (
                    <p style={{ textAlign: 'center', fontSize: 11, color: '#C49B2E', marginTop: 10 }}>
                      Launch Week open → <Link href="/beta" style={{ color: '#C49B2E' }}>Claim Gold Standard</Link>
                    </p>
                  )}
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
          Your next improvement project<br />shouldn't start in <span style={{ color: '#C49B2E' }}>Excel.</span>
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(248,246,240,0.35)', marginBottom: 24 }}>Free forever. Unlimited projects. No credit card. No trial clock.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/auth/signup" style={{ padding: '14px 38px', background: '#C49B2E', color: '#0D0C0A', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
            Start free — no card needed
          </Link>
          <Link href="/auth/signup" style={{ padding: '14px 24px', background: 'transparent', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 10, fontSize: 15, textDecoration: 'none' }}>
            Load reference project →
          </Link>
        </div>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)', marginTop: 16 }}>
          ISO 9001:2015 · ISO 22468:2020 · IATF 16949 aligned
        </p>
      </div>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="footer-wrap" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: 'clamp(20px,3vw,28px) clamp(16px,4vw,48px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, background: '#1A1714' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <VLogoMark size={28} />
          <VeSiMyWordmark size={16} />
        </div>
        <div className="footer-links" style={{ display: 'flex', gap: 22, fontSize: 12, color: 'rgba(248,247,245,0.4)', flexWrap: 'wrap' }}>
          {[['About', '/about'], ['Blog', '/blog'], ['Changelog', '/changelog'], ['Pricing', '/pricing'], ['Privacy', '/privacy'], ['Terms', '/terms'], ['Contact', 'mailto:founder@vesimy.com']].map(([l, h]) => (
            <Link key={l} href={h} style={{ color: 'inherit', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C49B2E')}
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
