'use client'
// ── app/page.tsx — VeSiMy Homepage v7 ────────────────────────────────────────
// Refined Precision. Fixed atmospheric background, content scrolls over it.
// Real logo asset, real industrial render, live routes.

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const NAVY='#0B1D33', NAVY950='#071A2F', STEEL='#3A5A7D', SLATE700='#4F6174',
  SLATE600='#73879C', SLATE400='#A9B5C2', SLATE200='#DDE3EA',
  GOLD='#C9A66B', GOLDL='#D9C08A', GOLDD='#A8854F', SAND='#E8D8B5',
  PAPER='#F7F8FA', WHITE='#FFFFFF', SUCCESS='#2F8F6B', DANGER='#C94F4F'
const SERIF="'Instrument Serif',Georgia,serif"
const DISPLAY="'Sora','Inter',sans-serif"
const SANS="'Inter',system-ui,sans-serif"
const MONO="'JetBrains Mono',monospace"
const HAND="'Caveat',cursive"

const LOGO='/brand/vesimy-logo-mark.webp'
const HERO_BG='/brand/hero-bg.webp'

const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Caveat:wght@500;700&display=swap');
.hp *{box-sizing:border-box}
.hp{position:relative;background:${NAVY950};overflow-x:hidden}
.hp ::selection{background:rgba(201,166,107,.3);color:${NAVY}}
.fixed-bg{position:fixed;inset:0;z-index:0;background:${NAVY950}}
.fixed-bg-img{position:absolute;inset:0;background-image:url('${HERO_BG}');background-size:cover;background-position:center right;opacity:.92}
.fixed-bg-veil{position:absolute;inset:0;background:linear-gradient(100deg,rgba(7,26,47,.80) 0%,rgba(7,26,47,.38) 38%,rgba(7,26,47,.08) 60%,transparent 100%)}
.hp .nav,.hp header.hero,.hp .section,.hp .industries,.hp .final,.hp .footer{position:relative;z-index:2}
.floatpanel{position:relative;z-index:2;border-radius:28px;max-width:1500px;margin:32px auto;width:calc(100% - 80px);overflow:hidden;box-shadow:0 40px 100px -40px rgba(0,0,0,.6);border:1px solid rgba(255,255,255,.08)}
@media(max-width:760px){.floatpanel{width:calc(100% - 20px);margin:14px auto;border-radius:18px}}
.reveal{opacity:0;transform:translateY(40px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1)}
.reveal.in{opacity:1;transform:none}
.rd1{transition-delay:.1s}.rd2{transition-delay:.2s}.rd3{transition-delay:.3s}.rd4{transition-delay:.4s}
@keyframes hppulse{0%,100%{box-shadow:0 0 0 0 rgba(201,166,107,.4)}70%{box-shadow:0 0 0 14px rgba(201,166,107,0)}}
@keyframes hpword{to{opacity:1;transform:none}}
@keyframes hpfade{to{opacity:1}}
@keyframes hpscroll{0%{opacity:0;transform:translateY(-6px)}50%{opacity:1}100%{opacity:0;transform:translateY(8px)}}
@keyframes hpmarquee{to{transform:translateX(-50%)}}
@keyframes panelin{to{opacity:1;transform:perspective(1400px) rotateY(-4deg) translateY(0)}}
.hp a{text-decoration:none;color:inherit}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:9px;font-family:${SANS};font-weight:600;cursor:pointer;border:none;transition:all .2s cubic-bezier(.16,1,.3,1);white-space:nowrap}
.btn-navy{background:${NAVY};color:${WHITE};padding:11px 22px;font-size:14px;box-shadow:0 2px 10px rgba(11,29,51,.18)}
.btn-navy:hover{background:#0F2747;transform:translateY(-2px);box-shadow:0 10px 28px rgba(11,29,51,.28)}
.btn-gold{background:${GOLD};color:${NAVY};padding:14px 28px;font-size:15px;box-shadow:0 4px 16px rgba(201,166,107,.32)}
.btn-gold:hover{background:${GOLDL};transform:translateY(-2px);box-shadow:0 12px 32px rgba(201,166,107,.42)}
.btn-ghostL{background:rgba(255,255,255,.06);color:${WHITE};padding:13px 24px;font-size:14px;border:1px solid rgba(255,255,255,.18)}
.btn-ghostL:hover{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.4)}
.nav{position:fixed;top:0;left:0;right:0;z-index:1000;height:68px;display:flex;align-items:center;justify-content:space-between;padding:0 32px;transition:all .3s}
.nav.scrolled{background:rgba(7,26,47,.72);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,.08);height:60px}
.nav-word{font-family:${SERIF};font-size:23px;color:${WHITE};letter-spacing:-.02em}
.nav-links{display:flex;gap:34px;align-items:center}
.nav-link{font-size:13.5px;font-weight:500;color:${SLATE400};transition:color .15s;position:relative}
.nav-link:hover{color:${WHITE}}
.nav-signin{font-size:13.5px;font-weight:700;color:${GOLDL};padding:9px 18px;border:1.5px solid ${GOLD};border-radius:8px;transition:all .2s;background:rgba(201,166,107,.10)}
.nav-signin:hover{background:rgba(201,166,107,.22);color:#fff;border-color:${GOLDL}}
@media(max-width:900px){.nav-links{display:none}.nav{padding:0 20px}}
.eyebrow{display:inline-flex;align-items:center;gap:13px;margin-bottom:26px}
.eyebrow-line{width:30px;height:1px;background:${GOLD}}
.eyebrow-txt{font-family:${MONO};font-size:11px;letter-spacing:2.4px;text-transform:uppercase;font-weight:600}
.hero{position:relative;min-height:100vh;background:transparent;display:flex;align-items:center;padding:120px 32px 80px}
.hero-inner{position:relative;z-index:2;max-width:1280px;margin:0 auto;width:100%;display:grid;grid-template-columns:1.05fr .9fr;gap:48px;align-items:start;padding-top:8px}
.hero-h1{font-family:${SERIF};font-size:clamp(46px,6.4vw,86px);font-weight:400;color:${WHITE};line-height:.98;letter-spacing:-.025em;margin-bottom:28px}
.hero-h1 em{font-style:italic;color:${GOLD}}
.hero-h1 .word{display:inline-block;opacity:0;transform:translateY(30px) rotate(2deg);animation:hpword .9s cubic-bezier(.16,1,.3,1) forwards}
.hero-sub{font-size:18.5px;color:${SLATE400};line-height:1.6;max-width:480px;margin-bottom:36px;opacity:0;animation:hpfade 1s ease .7s forwards}
.hero-sub strong{color:${WHITE};font-weight:600}
.hero-actions{display:flex;gap:14px;flex-wrap:wrap;align-items:center;opacity:0;animation:hpfade 1s ease .9s forwards}
.hero-trust{margin-top:32px;display:flex;align-items:center;gap:14px;opacity:0;animation:hpfade 1s ease 1.1s forwards}
.hero-trust-txt{font-family:${MONO};font-size:11px;color:${SLATE600};letter-spacing:.5px;line-height:1.6}
.scene{position:relative;width:100%;height:360px;perspective:1500px;perspective-origin:50% 40%;display:flex;align-items:flex-start;justify-content:center;margin-top:-18px;opacity:0;animation:hpfade 1.1s ease .4s both;cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none}
.scene:active{cursor:grabbing}
.scene *{pointer-events:none}
.scene-hint{position:absolute;bottom:0;left:50%;transform:translateX(-50%);font-family:${MONO};font-size:9px;color:${SLATE600};letter-spacing:1.5px;text-transform:uppercase;display:flex;align-items:center;gap:7px;pointer-events:none;transition:opacity .4s}
.scene-hint svg{stroke:${GOLD}}
.cube3d{position:relative;width:300px;height:300px;transform-style:preserve-3d;transform:rotateX(-18deg) rotateY(24deg);will-change:transform}
.face{position:absolute;width:300px;height:300px;padding:24px;border-top:1px solid rgba(255,255,255,.14);border-left:1px solid rgba(255,255,255,.09);border-right:1px solid rgba(0,0,0,.5);border-bottom:1px solid rgba(0,0,0,.6);box-shadow:inset 0 2px 22px rgba(0,0,0,.4);backface-visibility:hidden;display:flex;flex-direction:column;overflow:hidden}
.face.front{transform:translateZ(150px);background:linear-gradient(155deg,#163A5F 0%,#0F2747 55%,#0A1F38 100%)}
.face.back{transform:rotateY(180deg) translateZ(150px);align-items:center;justify-content:center;background:linear-gradient(155deg,#16433F 0%,#0E2E33 55%,#091F26 100%)}
.face.right{transform:rotateY(90deg) translateZ(150px);background:linear-gradient(155deg,#3A2A3F 0%,#241A30 55%,#161024 100%)}
.face.left{transform:rotateY(-90deg) translateZ(150px);background:linear-gradient(155deg,#2E2A1C 0%,#221E12 55%,#15120A 100%)}
.face.top{transform:rotateX(90deg) translateZ(150px);align-items:center;justify-content:center;gap:12px;background:linear-gradient(155deg,#24507E,#143256)}
.face.bottom{transform:rotateX(-90deg) translateZ(150px);align-items:center;justify-content:center;background:linear-gradient(155deg,#1A3550 0%,#102740 55%,#0A1C30 100%)}
.face-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;position:relative;z-index:2}
.face-tag{font-family:${MONO};font-size:9px;color:${GOLD};letter-spacing:1.8px;font-weight:700}
.face-live{display:inline-flex;align-items:center;gap:5px;font-family:${MONO};font-size:8px;color:${SUCCESS};letter-spacing:1px}
.face-live i{width:6px;height:6px;border-radius:50%;background:${SUCCESS};box-shadow:0 0 7px ${SUCCESS};animation:hppulse 2s infinite}
.face-title{font-family:${SERIF};font-size:25px;color:#fff;letter-spacing:-.02em;margin-bottom:20px;position:relative;z-index:2}
.vsm-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:22px;position:relative;z-index:2}
.vsm-node{position:relative;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.18);padding:9px 6px;font-size:11px;font-weight:700;color:#fff;font-family:${DISPLAY};display:flex;flex-direction:column;align-items:center;gap:2px;min-width:48px}
.vsm-node small{font-family:${MONO};font-size:8px;color:${SLATE400};font-weight:400}
.vsm-node.bot{border-color:${DANGER};background:rgba(201,79,79,.18)}
.vsm-node.bot i{position:absolute;top:-8px;right:-8px;width:17px;height:17px;background:${DANGER};color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;font-style:normal}
.vsm-arr{flex:1;height:2px;background:linear-gradient(90deg,${GOLD},rgba(201,166,107,.3));margin:0 5px}
.face-kpis{display:flex;gap:9px;margin-top:auto;position:relative;z-index:2}
.fk{flex:1;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);padding:11px}
.fk span{display:block;font-family:${MONO};font-size:7.5px;color:${SLATE400};letter-spacing:.8px;margin-bottom:6px}
.fk b{font-family:${SERIF};font-size:26px;color:#fff;font-weight:400;letter-spacing:-.02em}
.fk b small{font-size:14px;color:${SLATE400}}
.donut-wrap{display:flex;align-items:center;justify-content:center;margin:6px 0;position:relative;z-index:2}
.face-legend{display:flex;flex-direction:column;gap:9px;margin-top:16px;position:relative;z-index:2}
.face-legend span{display:flex;align-items:center;gap:9px;font-size:13px;color:${SLATE200}}
.face-legend i{width:11px;height:11px}
.alert-big{font-family:${SERIF};font-size:88px;color:${DANGER};line-height:1;letter-spacing:-.03em;margin-top:6px;position:relative;z-index:2}
.alert-big small{font-size:36px;color:rgba(201,79,79,.55)}
.alert-label{font-size:13px;color:${SLATE200};margin-bottom:20px;position:relative;z-index:2}
.alert-bar{height:9px;background:rgba(255,255,255,.07);overflow:hidden;margin-bottom:18px;position:relative;z-index:2}
.alert-bar div{height:100%;background:linear-gradient(90deg,#C94F4F,#E59A9A)}
.alert-note{font-size:13px;color:${SLATE400};line-height:1.65;position:relative;z-index:2}
.supe-msg{font-size:14.5px;color:#E8EDF3;line-height:1.65;margin-bottom:20px;position:relative;z-index:2}
.supe-msg b{color:${GOLD}}
.supe-chips{display:flex;gap:9px;margin-top:auto;position:relative;z-index:2}
.supe-chips span{font-family:${MONO};font-size:10px;color:${NAVY};background:${GOLD};padding:7px 13px;font-weight:700}
.face.top img{display:block;position:relative;z-index:2}
.top-word{font-family:${SERIF};font-size:38px;color:#fff;letter-spacing:-.02em;position:relative;z-index:2}
.bottom-v{font-family:${SERIF};font-size:28px;color:${GOLD};letter-spacing:-.02em;margin-top:14px;position:relative;z-index:2}
@media(max-width:1000px){.hero-inner{grid-template-columns:1fr;gap:40px}.scene{height:320px;margin-top:8px}.cube3d{width:248px;height:248px}.face{width:248px;height:248px;padding:18px}.face.front{transform:translateZ(124px)}.face.back{transform:rotateY(180deg) translateZ(124px)}.face.right{transform:rotateY(90deg) translateZ(124px)}.face.left{transform:rotateY(-90deg) translateZ(124px)}.face.top{transform:rotateX(90deg) translateZ(124px)}.face.bottom{transform:rotateX(-90deg) translateZ(124px)}.alert-big{font-size:66px}.hero-h1{font-size:clamp(40px,11vw,64px)}}.scroll-cue{position:absolute;bottom:28px;left:50%;transform:translateX(-50%);z-index:3;display:flex;flex-direction:column;align-items:center;gap:8px}
.scroll-cue-txt{font-family:${MONO};font-size:9px;color:${SLATE600};letter-spacing:2px}
.scroll-cue-arrow{width:18px;height:18px;border-right:1.5px solid ${GOLD};border-bottom:1.5px solid ${GOLD};transform:rotate(45deg);animation:hpscroll 1.8s infinite}
.section{padding:120px 32px;position:relative}
.wrap{max-width:1280px;margin:0 auto}
.sec-head{max-width:760px;margin-bottom:64px}
.sec-h2{font-family:${SERIF};font-size:clamp(36px,5.2vw,62px);font-weight:400;color:${NAVY};line-height:1.02;letter-spacing:-.025em}
.sec-h2 em{font-style:italic;color:${GOLDD}}
.sec-lead{font-size:18px;color:${SLATE700};line-height:1.65;margin-top:22px;max-width:600px}
.problem{background:transparent;color:${WHITE};overflow:hidden;position:relative}
.problem .sec-h2,.problem .sec-h2 em{color:${WHITE}}
.problem-statement{font-family:${SERIF};font-size:clamp(30px,4.4vw,56px);line-height:1.18;color:${WHITE};letter-spacing:-.02em;max-width:1000px}
.problem-statement .w{color:rgba(255,255,255,.22);transition:color .5s,text-shadow .5s}
.problem-foot{margin-top:44px;font-family:${MONO};font-size:12px;color:${SLATE600};letter-spacing:1px;display:flex;align-items:center;gap:12px}
.problem-foot .ln{width:40px;height:1px;background:${GOLD}}
.demo{background:rgba(247,248,250,.975);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
.demo-stage{background:${WHITE};border:1px solid ${SLATE200};border-radius:22px;padding:38px;box-shadow:0 24px 60px -28px rgba(7,26,47,.18);position:relative;overflow:hidden}
.demo-hint{position:absolute;top:24px;right:28px;font-family:${HAND};font-size:22px;color:${GOLDD};transform:rotate(-4deg)}
.demo-canvas{display:flex;align-items:stretch;gap:0;margin:32px 0 8px;overflow-x:auto;padding:24px 4px}
.dstep{position:relative;flex:0 0 auto;width:150px;cursor:pointer;transition:transform .3s cubic-bezier(.16,1,.3,1)}
.dstep:hover{transform:translateY(-6px)}
.dstep-note{background:${SAND};border-radius:3px;padding:18px 14px 14px;box-shadow:0 10px 18px -6px rgba(0,0,0,.18);position:relative;min-height:130px;transition:all .3s}
.dstep.bot .dstep-note{background:#FCD9CE;box-shadow:0 0 0 2px ${DANGER},0 12px 24px -6px rgba(201,79,79,.4)}
.dstep-pin{position:absolute;top:-12px;left:50%;transform:translateX(-50%);width:22px;height:22px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#F0D9A8,${GOLD} 60%,${GOLDD});box-shadow:0 3px 6px rgba(0,0,0,.25)}
.dstep.bot .dstep-pin{background:radial-gradient(circle at 35% 30%,#F5B0A0,${DANGER} 60%,#A03030)}
.dstep-name{font-family:${HAND};font-size:20px;font-weight:700;color:${NAVY};margin-bottom:10px;line-height:1.1}
.dstep-metric{display:flex;justify-content:space-between;font-family:${MONO};font-size:10px;color:${SLATE700};margin-bottom:4px}
.dstep-metric b{color:${NAVY}}
.dstep-ct{font-family:${MONO};font-size:9px;text-align:center;margin-top:8px;color:${SLATE600}}
.dstep-arrow{display:flex;align-items:center;color:${SLATE400};font-size:20px;padding:0 2px;align-self:center}
.dstep-wait{position:absolute;bottom:-26px;left:50%;transform:translateX(-50%);font-family:${MONO};font-size:9px;color:${SLATE600};white-space:nowrap}
.dstep.bot .dstep-wait{color:${DANGER};font-weight:700}
.demo-readout{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:40px;padding-top:28px;border-top:1px solid ${SLATE200}}
.dro{text-align:center}
.dro-v{font-family:${SERIF};font-size:38px;color:${NAVY};line-height:1;letter-spacing:-.02em}
.dro-v.danger{color:${DANGER}}.dro-v.gold{color:${GOLDD}}
.dro-l{font-family:${MONO};font-size:10px;color:${SLATE600};letter-spacing:1px;text-transform:uppercase;margin-top:8px}
.demo-cta{text-align:center;margin-top:36px}
.demo-cta-txt{font-size:14px;color:${SLATE700};margin-bottom:18px}
@media(max-width:700px){.demo-readout{grid-template-columns:1fr 1fr;gap:24px 16px}.demo-stage{padding:22px}}
.pillars-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.pillar{background:${WHITE};border:1px solid ${SLATE200};border-radius:18px;padding:36px 30px;position:relative;overflow:hidden;transition:all .4s cubic-bezier(.16,1,.3,1)}
.pillar:hover{transform:translateY(-6px);box-shadow:0 24px 50px -24px rgba(7,26,47,.2);border-color:${GOLD}}
.pillar-n{font-family:${MONO};font-size:12px;color:${GOLDD};font-weight:700;letter-spacing:2px;margin-bottom:24px}
.pillar-ico{width:52px;height:52px;border-radius:13px;background:${NAVY};display:flex;align-items:center;justify-content:center;margin-bottom:22px;transition:all .4s}
.pillar:hover .pillar-ico{background:${GOLD};transform:rotate(-6deg) scale(1.08)}
.pillar:hover .pillar-ico svg{stroke:${NAVY}}
.pillar-ico svg{stroke:${GOLD};transition:stroke .4s}
.pillar-h{font-family:${DISPLAY};font-size:24px;font-weight:650;color:${NAVY};margin-bottom:13px;letter-spacing:-.01em}
.pillar-b{font-size:14.5px;color:${SLATE700};line-height:1.65}
@media(max-width:900px){.pillars-grid{grid-template-columns:1fr}}
.tools{background:transparent;color:${WHITE};overflow:hidden}
.tools .sec-h2,.tools .sec-h2 em{color:${WHITE}}
.tools .sec-lead{color:${SLATE400}}
.tools-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.tool{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.10);border-radius:14px;padding:22px;transition:all .35s cubic-bezier(.16,1,.3,1);backdrop-filter:blur(4px)}
.tool:hover{background:rgba(201,166,107,.12);border-color:rgba(201,166,107,.4);transform:translateY(-4px)}
.tool-ico{width:38px;height:38px;border-radius:9px;background:rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;margin-bottom:14px;transition:all .35s}
.tool:hover .tool-ico{background:${GOLD}}
.tool-ico svg{stroke:${GOLD};transition:stroke .35s}
.tool:hover .tool-ico svg{stroke:${NAVY}}
.tool-name{font-family:${DISPLAY};font-size:15px;font-weight:600;color:${WHITE};margin-bottom:5px}
.tool-desc{font-size:12px;color:${SLATE400};line-height:1.5}
@media(max-width:900px){.tools-grid{grid-template-columns:1fr 1fr}}
@media(max-width:520px){.tools-grid{grid-template-columns:1fr}}
.method{background:rgba(247,248,250,.975);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
.method-split{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center}
.method-visual{position:relative;aspect-ratio:1;display:flex;align-items:center;justify-content:center}
.method-ring{position:absolute;border-radius:50%;border:1px solid ${SLATE200}}
.method-badge{background:${WHITE};border:1px solid ${SLATE200};border-radius:18px;padding:30px;box-shadow:0 24px 50px -28px rgba(7,26,47,.2);text-align:center;position:relative;z-index:2;max-width:280px}
.method-iso{font-family:${MONO};font-size:12px;color:${GOLDD};letter-spacing:1.5px;font-weight:600;margin-bottom:14px}
.method-iso-big{font-family:${SERIF};font-size:48px;color:${NAVY};line-height:1;letter-spacing:-.02em;margin-bottom:12px}
.method-iso-sub{font-size:13px;color:${SLATE700};line-height:1.6}
.method-list{display:flex;flex-direction:column;gap:22px;margin-top:28px}
.method-item{display:flex;gap:16px;align-items:flex-start}
.method-check{flex-shrink:0;width:26px;height:26px;border-radius:7px;background:rgba(201,166,107,.12);border:1px solid rgba(201,166,107,.3);display:flex;align-items:center;justify-content:center;color:${GOLDD};font-size:13px;font-weight:700}
.method-item-h{font-family:${DISPLAY};font-size:15px;font-weight:600;color:${NAVY};margin-bottom:3px}
.method-item-b{font-size:13.5px;color:${SLATE700};line-height:1.55}
@media(max-width:900px){.method-split{grid-template-columns:1fr;gap:48px}.method-visual{aspect-ratio:1.4}}
.industries{background:rgba(255,255,255,.985);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);padding:56px 0;overflow:hidden}
.ind-label{text-align:center;font-family:${MONO};font-size:11px;color:${SLATE600};letter-spacing:2px;text-transform:uppercase;margin-bottom:30px;font-weight:600}
.marquee-row{overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)}
.marquee{display:flex;white-space:nowrap;width:max-content;animation:hpmarquee 32s linear infinite}
.ind-item{font-family:${SERIF};font-style:italic;font-size:30px;color:${SLATE700};padding:0 38px;display:flex;align-items:center;gap:38px}
.ind-item::after{content:'';width:6px;height:6px;border-radius:50%;background:${GOLD}}
.founder{background:transparent;color:${WHITE}}
.founder .eyebrow-txt{color:${GOLDD}}
.founder-card{display:grid;grid-template-columns:auto 1fr;gap:36px;align-items:start;max-width:900px}
.founder-photo{width:120px;height:120px;border-radius:20px;background:linear-gradient(140deg,${STEEL},#0F2747);display:flex;align-items:center;justify-content:center;font-family:${DISPLAY};font-size:42px;font-weight:700;color:${GOLD};flex-shrink:0;border:1px solid rgba(201,166,107,.2)}
.founder-quote{font-family:${SERIF};font-size:clamp(24px,3vw,34px);line-height:1.32;color:${WHITE};letter-spacing:-.01em;margin-bottom:24px}
.founder-quote em{font-style:italic;color:${GOLD}}
.founder-name{font-family:${DISPLAY};font-size:18px;font-weight:650;color:${WHITE}}
.founder-role{font-size:13px;color:${SLATE400};margin-top:3px}
.founder-creds{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}
.founder-cred{font-family:${MONO};font-size:10px;color:${GOLDL};letter-spacing:.5px;border:1px solid rgba(201,166,107,.24);border-radius:20px;padding:5px 12px}
@media(max-width:700px){.founder-card{grid-template-columns:1fr;gap:24px}}
.contrast{background:rgba(247,248,250,.975);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
.contrast-split{display:grid;grid-template-columns:1fr 1fr;gap:24px}
.cside{border-radius:20px;padding:38px 34px}
.cside-train{background:${WHITE};border:1px solid ${SLATE200}}
.cside-exec{background:${NAVY};color:${WHITE};position:relative;overflow:hidden}
.cside-exec::before{content:'';position:absolute;top:-60px;right:-60px;width:200px;height:200px;background:radial-gradient(circle,rgba(201,166,107,.16),transparent 70%)}
.cside-tag{font-family:${MONO};font-size:11px;letter-spacing:1.5px;text-transform:uppercase;font-weight:600;margin-bottom:18px}
.cside-train .cside-tag{color:${SLATE600}}.cside-exec .cside-tag{color:${GOLD}}
.cside-h{font-family:${SERIF};font-size:30px;line-height:1.1;margin-bottom:22px;letter-spacing:-.02em}
.cside-train .cside-h{color:${NAVY}}.cside-exec .cside-h{color:${WHITE}}
.cside-list{display:flex;flex-direction:column;gap:14px;position:relative;z-index:2}
.cside-li{display:flex;gap:12px;align-items:flex-start;font-size:14.5px;line-height:1.5}
.cside-train .cside-li{color:${SLATE700}}.cside-exec .cside-li{color:${SLATE200}}
.cside-mark{flex-shrink:0;font-size:14px;margin-top:1px}
.cside-train .cside-mark{color:${SLATE400}}.cside-exec .cside-mark{color:${GOLD}}
@media(max-width:800px){.contrast-split{grid-template-columns:1fr}}
.pricing{background:rgba(255,255,255,.985);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
.price-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;align-items:start}
.pcard{border:1px solid ${SLATE200};border-radius:18px;padding:30px 26px;background:${WHITE};position:relative;transition:all .35s cubic-bezier(.16,1,.3,1)}
.pcard:hover{transform:translateY(-6px);box-shadow:0 24px 50px -24px rgba(7,26,47,.18)}
.pcard.feat{background:${NAVY};border-color:#0F2747;box-shadow:0 24px 50px -20px rgba(11,29,51,.35)}
.pbadge{position:absolute;top:-12px;left:26px;background:${GOLD};color:${NAVY};font-family:${MONO};font-size:9.5px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:5px 13px;border-radius:20px}
.pname{font-family:${MONO};font-size:11px;letter-spacing:1.5px;text-transform:uppercase;font-weight:600;color:${SLATE600};margin-bottom:14px}
.pcard.feat .pname{color:${SAND}}
.pprice{display:flex;align-items:baseline;gap:5px;margin-bottom:4px}
.pprice-v{font-family:${SERIF};font-size:42px;color:${NAVY};line-height:1;letter-spacing:-.02em}
.pcard.feat .pprice-v{color:${WHITE}}
.pprice-sub{font-size:14px;color:${SLATE600}}.pcard.feat .pprice-sub{color:${SLATE400}}
.pdesc{font-size:12.5px;color:${SLATE600};margin-bottom:22px;min-height:18px}
.pcard.feat .pdesc{color:${SLATE400}}
.pfeat{display:flex;gap:9px;align-items:flex-start;margin-bottom:11px;font-size:13px;line-height:1.45;color:${SLATE700}}
.pcard.feat .pfeat{color:${SLATE200}}
.pfeat-c{color:${GOLDD};flex-shrink:0}.pcard.feat .pfeat-c{color:${GOLD}}
.pbtn{display:block;text-align:center;margin-top:24px;padding:12px;border-radius:9px;font-weight:600;font-size:13.5px;transition:all .2s}
.pbtn-navy{background:${NAVY};color:${WHITE}}.pbtn-navy:hover{background:#0F2747}
.pbtn-gold{background:${GOLD};color:${NAVY}}.pbtn-gold:hover{background:${GOLDL}}
@media(max-width:980px){.price-grid{grid-template-columns:1fr 1fr}}
@media(max-width:560px){.price-grid{grid-template-columns:1fr}}
.faq{background:rgba(247,248,250,.975);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
.faq-list{max-width:820px;margin:0 auto}
.faq-item{border-bottom:1px solid ${SLATE200}}
.faq-q{width:100%;text-align:left;background:none;border:none;padding:26px 0;display:flex;align-items:center;justify-content:space-between;cursor:pointer;font-family:${DISPLAY};font-size:18px;font-weight:600;color:${NAVY};gap:20px}
.faq-icon{flex-shrink:0;width:24px;height:24px;position:relative;transition:transform .3s}
.faq-icon::before,.faq-icon::after{content:'';position:absolute;background:${GOLDD};border-radius:2px;transition:all .3s}
.faq-icon::before{top:11px;left:3px;width:18px;height:2px}
.faq-icon::after{top:3px;left:11px;width:2px;height:18px}
.faq-item.open .faq-icon::after{transform:rotate(90deg);opacity:0}
.faq-a{max-height:0;overflow:hidden;transition:max-height .4s cubic-bezier(.16,1,.3,1)}
.faq-a-inner{padding:0 0 26px;font-size:15px;color:${SLATE700};line-height:1.7;max-width:680px}
.final{background:transparent;padding:130px 32px;position:relative;overflow:hidden}
.final-inner{position:relative;z-index:2;max-width:820px;margin:0 auto;text-align:center}
.final-h{font-family:${SERIF};font-size:clamp(40px,6vw,76px);font-weight:400;color:${WHITE};line-height:1.02;letter-spacing:-.025em;margin-bottom:28px}
.final-h em{font-style:italic;color:${GOLD}}
.final-sub{font-size:18px;color:${SLATE400};line-height:1.6;max-width:520px;margin:0 auto 40px}
.final-actions{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
.final-note{margin-top:26px;font-family:${MONO};font-size:11px;color:${SLATE600};letter-spacing:.5px}
.footer{background:rgba(7,26,47,.55);backdrop-filter:blur(10px);border-top:1px solid rgba(255,255,255,.08);padding:56px 32px 36px}
.footer-grid{max-width:1280px;margin:0 auto;display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px;margin-bottom:40px}
.footer-word{font-family:${SERIF};font-size:22px;color:${WHITE};margin-bottom:12px}
.footer-tag{font-size:13px;color:${SLATE400};line-height:1.6;max-width:260px}
.footer-col-h{font-family:${MONO};font-size:11px;color:${GOLD};letter-spacing:1.5px;text-transform:uppercase;font-weight:600;margin-bottom:16px}
.footer-link{display:block;font-size:13.5px;color:${SLATE400};margin-bottom:10px;transition:color .15s}
.footer-link:hover{color:${WHITE}}
.footer-bot{max-width:1280px;margin:0 auto;padding-top:24px;border-top:1px solid rgba(255,255,255,.08);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px}
.footer-copy{font-family:${MONO};font-size:11px;color:${SLATE400}}
@media(max-width:800px){.footer-grid{grid-template-columns:1fr 1fr}}
`

const FLOW:[string,string][]=[['Intake','◇'],['Review','☰'],['Approve','◉'],['Execute','⚙'],['Done','✓']]
const TOOLS:[string,string,string][]=[
  ['Value Stream Map','See the whole flow end to end','M3 3v18h18 M7 14l4-4 3 3 5-6'],
  ['Time Study','Stopwatch with precision','M12 6v6l4 2 M12 2a10 10 0 100 20 10 10 0 000-20'],
  ['Fishbone','Trace causes to their root','M3 12h18 M7 12l4-5 M7 12l4 5 M15 12l4-5 M15 12l4 5'],
  ['5 Why','Drill past the symptom','M12 2v6 M12 10v4 M12 16v2 M12 20v2'],
  ['Waste ID','Spot the 8 wastes fast','M3 6h18 M8 6V4h8v2 M6 6l1 14h10l1-14'],
  ['Kaizen Board','Track every improvement','M4 5h16 M4 12h16 M4 19h10'],
  ['SMED','Cut changeover time','M12 2a10 10 0 100 20 10 10 0 000-20 M12 8v4l3 2'],
  ['Yamazumi','Balance operator load','M5 20V9 M10 20V5 M15 20v-8 M20 20v-4'],
  ['Standard Work','Lock in the best method','M9 11l3 3L22 4 M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11'],
  ['PDCA','Run improvement cycles','M21 12a9 9 0 11-3-6.7 M21 4v5h-5'],
  ['Simulation','Test before you change','M5 3v18 M5 8h14 M19 3v18 M9 12h6'],
  ['Supe AI','Your Lean advisor','M12 2a4 4 0 014 4c0 2-2 3-2 5 M12 17v.01 M5 9a7 7 0 1014 0'],
]
const INDS=['Manufacturing','Healthcare','Logistics','Food & Beverage','Construction','Warehousing','Restaurants','Financial Services','Field Service','Pharma','Automotive','Electronics']
const DEMO_STEPS=[
  {name:'Receive',ct:12,wt:18,wip:5,va:12,bot:false},
  {name:'Prep',ct:20,wt:30,wip:7,va:20,bot:false},
  {name:'Assembly',ct:45,wt:120,wip:12,va:45,bot:true},
  {name:'Inspect',ct:15,wt:25,wip:4,va:15,bot:false},
  {name:'Pack',ct:10,wt:10,wip:3,va:10,bot:false},
]
const FAQ:[string,string][]=[
  ['Do I need to know Lean to use VeSiMy?','No. VeSiMy guides you step by step and explains every concept in plain language as you go. If you have been through a Lean course, you will feel at home immediately. If you have not, the app teaches you the method as you map your first real process.'],
  ['What can I do on the free tier?','You can map one process, run a time study, and generate a plain-language report with one improvement action, all without creating an account. It is genuinely useful on its own, not a crippled trial.'],
  ['Is my process data private?','Yes. Every record is protected by row-level security, so your maps and data are only ever visible to your account. Connections are encrypted, payments run through Stripe, and you can export or delete your data at any time.'],
  ['How is this different from a generic AI chatbot?','A chatbot gives you words. VeSiMy gives you a structured, calculated value stream map built on ISO 22468 methodology, with a toolkit that connects every analysis back to the map. Supe, the built-in AI advisor, works from your actual process data and never invents numbers.'],
  ['Can I export reports to share with leadership?','Yes. Pro generates a clean, A3-style PDF report with your branding, professional tables, and your value stream map, ready to send to an owner, a client, or a plant manager.'],
]

function Spark({pts,color}:{pts:string;color:string}){
  return <svg width="100%" viewBox="0 0 100 18" style={{height:18,marginTop:7}}><polyline points={pts} fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round"/></svg>
}

export default function HomePage(){
  const [scrolled,setScrolled]=useState(false)
  const [flowI,setFlowI]=useState(0)
  const [openFaq,setOpenFaq]=useState<number|null>(null)
  const [activeStep,setActiveStep]=useState<number|null>(null)
  const bgRef=useRef<HTMLDivElement>(null)

  useEffect(()=>{
    // ── cube drag to rotate ──
    const scene=document.getElementById('scene')
    const cube=document.getElementById('cube3d')
    let rx=-18, ry=24, dragging=false, px=0, py=0
    const applyCube=()=>{ if(cube) cube.style.transform=`rotateX(${rx}deg) rotateY(${ry}deg)` }
    const cdown=(x:number,y:number)=>{dragging=true;px=x;py=y;const h=scene?.querySelector('.scene-hint') as HTMLElement|null;if(h)h.style.opacity='0'}
    const cmove=(x:number,y:number)=>{if(!dragging)return;ry+=(x-px)*0.55;rx-=(y-py)*0.55;rx=Math.max(-85,Math.min(85,rx));px=x;py=y;applyCube()}
    const cup=()=>{dragging=false}
    const md=(e:MouseEvent)=>{e.preventDefault();cdown(e.clientX,e.clientY)}
    const mm=(e:MouseEvent)=>cmove(e.clientX,e.clientY)
    const ts=(e:TouchEvent)=>{const t=e.touches[0];cdown(t.clientX,t.clientY)}
    const tm=(e:TouchEvent)=>{const t=e.touches[0];cmove(t.clientX,t.clientY)}
    if(scene){scene.addEventListener('mousedown',md);scene.addEventListener('touchstart',ts,{passive:true});scene.addEventListener('touchmove',tm,{passive:false});scene.addEventListener('touchend',cup)}
    document.addEventListener('mousemove',mm);document.addEventListener('mouseup',cup)
    applyCube()

    const onScroll=()=>{
      setScrolled(window.scrollY>40)
    }
    window.addEventListener('scroll',onScroll,{passive:true})
    const t=setInterval(()=>setFlowI(i=>(i+1)%FLOW.length),1400)
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12})
    document.querySelectorAll('.hp .reveal').forEach(el=>io.observe(el))
    const pt=document.getElementById('hpProblem')
    if(pt){
      const pio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){
        pt.querySelectorAll<HTMLElement>('.w').forEach((w,i)=>{
          const lit=w.dataset.lit
          setTimeout(()=>{
            if(lit==='gold'){w.style.color=GOLD;w.style.textShadow='0 0 30px rgba(201,166,107,.4)'}
            else if(lit==='white'){w.style.color='#fff'}
            else w.style.color='rgba(255,255,255,.55)'
          },i*45)
        })
        pio.disconnect()
      }}),{threshold:.4})
      pio.observe(pt)
    }
    return ()=>{window.removeEventListener('scroll',onScroll);clearInterval(t);io.disconnect();document.removeEventListener('mousemove',mm);document.removeEventListener('mouseup',cup);if(scene){scene.removeEventListener('mousedown',md);scene.removeEventListener('touchstart',ts);scene.removeEventListener('touchmove',tm);scene.removeEventListener('touchend',cup)}}
  },[])

  const totalLead=DEMO_STEPS.reduce((a,s)=>a+s.ct+s.wt,0)
  const totalVA=DEMO_STEPS.reduce((a,s)=>a+s.va,0)
  const totalWait=DEMO_STEPS.reduce((a,s)=>a+s.wt,0)

  const heroA=[['See','em0'],['the','']]
  const probLine1='Lean is not a manufacturing methodology.'.split(' ')
  const probLine2:[string,string][]=[['It','white'],['is','white'],['the','white'],['discipline','white'],['of','white'],['seeing','gold'],['clearly.','gold']]
  const probLine3:[string,string][]=[['Every','white'],['business','white'],['has','white'],['a','white'],['process.','white'],['Every','white'],['process','white'],['has','white'],['waste.','gold']]
  const probLine4:[string,string][]=[['The','white'],['only','white'],['question','white'],['is','white'],['whether','white'],['you','white'],['can','white'],['see','gold'],['it.','gold']]

  return (
    <div className="hp">
      <style dangerouslySetInnerHTML={{__html:CSS}}/>
      <div className="fixed-bg"><div className="fixed-bg-img" ref={bgRef}/><div className="fixed-bg-veil"/></div>

      <nav className={`nav${scrolled?' scrolled':''}`}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:11}}>
          <img src={LOGO} width={34} height={34} alt="VeSiMy" style={{display:'block'}}/>
          <span className="nav-word">VeSiMy</span>
        </Link>
        <div className="nav-links">
          <a href="#problem" className="nav-link">The Problem</a>
          <a href="#demo" className="nav-link">Try It</a>
          <a href="#tools" className="nav-link">Toolkit</a>
          <a href="#method" className="nav-link">Methodology</a>
          <a href="#pricing" className="nav-link">Pricing</a>
        </div>
        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          <Link href="/auth/login" className="nav-signin">Sign in</Link>
          <Link href="/auth/signup" className="btn btn-navy" style={{padding:'8px 16px',fontSize:13}}>Start free</Link>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-inner">
          <div>
            <div className="eyebrow"><span className="eyebrow-line"/><span className="eyebrow-txt" style={{color:GOLD}}>The execution layer for Lean</span></div>
            <h1 className="hero-h1">
              <span className="word" style={{animationDelay:'.05s'}}>See</span>{' '}
              <span className="word" style={{animationDelay:'.13s'}}>the</span>{' '}
              <span className="word" style={{animationDelay:'.21s'}}><em>waste</em></span><br/>
              <span className="word" style={{animationDelay:'.29s'}}>you{'\u2019'}ve</span>{' '}
              <span className="word" style={{animationDelay:'.37s'}}>been</span>{' '}
              <span className="word" style={{animationDelay:'.45s'}}>walking</span>{' '}
              <span className="word" style={{animationDelay:'.53s'}}>past.</span>
            </h1>
            <p className="hero-sub">VeSiMy turns any process into a living value stream map. <strong>Map it, measure it, find the bottleneck, and prove the improvement</strong> without spreadsheets, consultants, or guesswork.</p>
            <div className="hero-actions">
              <Link href="/auth/signup" className="btn btn-gold">Map your first process <span style={{fontSize:13}}>→</span></Link>
              <a href="#demo" className="btn btn-ghostL">See it in motion</a>
            </div>
            <div className="hero-trust">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5"><path d="M12 2L4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4z"/><path d="M9 12l2 2 4-4"/></svg>
              <span className="hero-trust-txt">Structured on ISO 22468:2020 value stream methodology.<br/>No credit card to start. Free forever tier.</span>
            </div>
          </div>
          {/* 3D CUBE — drag to rotate */}
          <div className="scene" id="scene">
            <div className="cube3d" id="cube3d">
              <div className="face front">
                <div className="face-top"><span className="face-tag">CURRENT STATE</span><span className="face-live"><i/>LIVE</span></div>
                <div className="face-title">Assembly Line A</div>
                <div className="vsm-row">
                  <div className="vsm-node">Cut<small>45s</small></div><div className="vsm-arr"/>
                  <div className="vsm-node">Weld<small>60s</small></div><div className="vsm-arr"/>
                  <div className="vsm-node bot">Asm<small>75s</small><i>!</i></div><div className="vsm-arr"/>
                  <div className="vsm-node">Pack<small>20s</small></div>
                </div>
                <div className="face-kpis">
                  <div className="fk"><span>LEAD TIME</span><b>12.6<small>d</small></b></div>
                  <div className="fk"><span>PCE</span><b>27.8<small>%</small></b></div>
                  <div className="fk"><span>WIP</span><b>49</b></div>
                </div>
              </div>
              <div className="face back">
                <div className="face-top"><span className="face-tag">WASTE ANALYSIS</span></div>
                <div className="donut-wrap">
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="46" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="16"/>
                    <circle cx="60" cy="60" r="46" fill="none" stroke={GOLD} strokeWidth="16" strokeDasharray="101 188" transform="rotate(-90 60 60)"/>
                    <circle cx="60" cy="60" r="46" fill="none" stroke={STEEL} strokeWidth="16" strokeDasharray="58 231" strokeDashoffset="-101" transform="rotate(-90 60 60)"/>
                    <circle cx="60" cy="60" r="46" fill="none" stroke="#5AAE8A" strokeWidth="16" strokeDasharray="43 246" strokeDashoffset="-159" transform="rotate(-90 60 60)"/>
                    <text x="60" y="56" textAnchor="middle" fill="#fff" fontFamily="Instrument Serif" fontSize="22">35%</text>
                    <text x="60" y="72" textAnchor="middle" fill={SLATE400} fontFamily="JetBrains Mono" fontSize="8">WAITING</text>
                  </svg>
                </div>
                <div className="face-legend"><span><i style={{background:GOLD}}/>Waiting</span><span><i style={{background:STEEL}}/>Motion</span><span><i style={{background:'#5AAE8A'}}/>Defects</span></div>
              </div>
              <div className="face right">
                <div className="face-top"><span className="face-tag" style={{color:'#E59A9A'}}>BOTTLENECK</span></div>
                <div className="alert-big">75<small>s</small></div>
                <div className="alert-label">Assembly cycle time</div>
                <div className="alert-bar"><div style={{width:'100%'}}/></div>
                <div className="alert-note">2.1× the takt time. This stage sets the pace for the entire line.</div>
              </div>
              <div className="face left">
                <div className="face-top"><span className="face-tag" style={{color:GOLD}}>SUPE · AI ADVISOR</span></div>
                <div className="supe-msg">Based on the data, the likely constraint is <b>Assembly</b>. Consider a SMED study to cut changeover, then rebalance load to the Weld station.</div>
                <div className="supe-chips"><span>Run SMED</span><span>Rebalance</span></div>
              </div>
              <div className="face top">
                <img src={LOGO} width={56} height={56} alt=""/>
                <div className="top-word">VeSiMy</div>
              </div>
              <div className="face bottom">
                <div className="face-tag" style={{marginBottom:14}}>90-DAY TREND</div>
                <svg width="170" height="70" viewBox="0 0 170 70">
                  <polyline points="0,58 28,50 56,53 84,38 112,30 140,18 170,8" fill="none" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round"/>
                  <polyline points="0,58 28,50 56,53 84,38 112,30 140,18 170,8 170,70 0,70" fill="rgba(201,166,107,.12)"/>
                </svg>
                <div className="bottom-v">-34% lead time</div>
              </div>
            </div>
            <div className="scene-hint"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="1.6"><path d="M9 11V6a2 2 0 014 0v5"/><path d="M13 7a2 2 0 014 0v4"/><path d="M17 9a2 2 0 014 0v5a7 7 0 01-7 7h-2a7 7 0 01-6-4l-2-4a2 2 0 013-2l2 2"/></svg> Drag to rotate</div>
          </div>
        </div>
        <div className="scroll-cue"><span className="scroll-cue-txt">SCROLL</span><span className="scroll-cue-arrow"/></div>
      </header>

      <section className="section problem" id="problem">
        <div className="wrap" style={{position:'relative',zIndex:2}}>
          <div className="eyebrow reveal"><span className="eyebrow-line"/><span className="eyebrow-txt" style={{color:GOLDD}}>Why most improvement fails</span></div>
          <div className="problem-statement" id="hpProblem">
            <span style={{display:'block'}}>{probLine1.map((w,i)=><span key={i} className="w" data-lit="white">{w} </span>)}</span>
            <span style={{display:'block'}}>{probLine2.map((w,i)=><span key={i} className="w" data-lit={w[1]}>{w[0]} </span>)}</span>
            <span style={{display:'block',marginTop:'.4em'}}>{probLine3.map((w,i)=><span key={i} className="w" data-lit={w[1]}>{w[0]} </span>)}</span>
            <span style={{display:'block'}}>{probLine4.map((w,i)=><span key={i} className="w" data-lit={w[1]}>{w[0]} </span>)}</span>
          </div>
          <div className="problem-foot reveal"><span className="ln"/>VeSiMy makes it visible.</div>
        </div>
      </section>

      <section className="section demo floatpanel" id="demo">
        <div className="wrap">
          <div className="sec-head reveal">
            <div className="eyebrow"><span className="eyebrow-line"/><span className="eyebrow-txt" style={{color:GOLDD}}>Try it, no signup</span></div>
            <h2 className="sec-h2">This is a real process.<br/><em>Find the bottleneck.</em></h2>
            <p className="sec-lead">Hover or tap any step. Watch how a single slow stage drags the entire lead time. This is exactly what VeSiMy reveals the moment you map your own work.</p>
          </div>
          <div className="demo-stage reveal rd1">
            <div className="demo-hint">tap a step <svg width="30" height="20" viewBox="0 0 40 24" fill="none" stroke={GOLDD} strokeWidth="1.6" style={{verticalAlign:'middle'}}><path d="M2 12h32"/><path d="M26 5l9 7-9 7"/></svg></div>
            <div className="demo-canvas">
              {DEMO_STEPS.map((s,i)=>(
                <React.Fragment key={i}>
                  <div className={`dstep${s.bot?' bot':''}`} style={{opacity:activeStep===null||activeStep===i?1:.5}} onMouseEnter={()=>setActiveStep(i)} onClick={()=>setActiveStep(i)} onMouseLeave={()=>setActiveStep(null)}>
                    <div className="dstep-note">
                      <div className="dstep-pin"/>
                      <div className="dstep-name">{s.name}</div>
                      <div className="dstep-metric"><span>CT</span><b>{s.ct}m</b></div>
                      <div className="dstep-metric"><span>WIP</span><b>{s.wip}</b></div>
                      <div className="dstep-ct">{s.bot?'⚠ bottleneck':'flowing'}</div>
                      <div className="dstep-wait">wait {s.wt}m</div>
                    </div>
                  </div>
                  {i<DEMO_STEPS.length-1&&<div className="dstep-arrow">→</div>}
                </React.Fragment>
              ))}
            </div>
            <div className="demo-readout">
              <div className="dro"><div className="dro-v">{totalLead}<small style={{fontSize:20}}>m</small></div><div className="dro-l">Lead Time</div></div>
              <div className="dro"><div className="dro-v gold">{Math.round(totalVA/totalLead*100)}<small style={{fontSize:20}}>%</small></div><div className="dro-l">Value-Added %</div></div>
              <div className="dro"><div className="dro-v danger">Assembly</div><div className="dro-l">Bottleneck</div></div>
              <div className="dro"><div className="dro-v">{totalWait}<small style={{fontSize:20}}>m</small></div><div className="dro-l">Hidden Waste</div></div>
            </div>
            <div className="demo-cta">
              <div className="demo-cta-txt">That bottleneck cost this process <strong>{totalWait} minutes of pure waiting.</strong> Imagine seeing this for <em>your</em> operation.</div>
              <Link href="/auth/signup" className="btn btn-gold">Map my process free →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section floatpanel" style={{background:'rgba(255,255,255,.985)',backdropFilter:'blur(8px)'}}>
        <div className="wrap">
          <div className="sec-head reveal">
            <div className="eyebrow"><span className="eyebrow-line"/><span className="eyebrow-txt" style={{color:GOLDD}}>How it works</span></div>
            <h2 className="sec-h2">From process chaos<br/>to <em>measurable clarity.</em></h2>
          </div>
          <div className="pillars-grid">
            {[
              ['01','Map','Build a current-state map step by step. Capture cycle time, wait time, WIP, defects, and operators. The map assembles as you type, no diagramming skill required.','M3 3v18h18 M7 14l4-4 3 3 5-6'],
              ['02','Measure','Lead time, takt, process cycle efficiency, and bottleneck detection calculate automatically. The numbers update live as you refine the map.','M21 12a9 9 0 11-3-6.7 M21 4v5h-5'],
              ['03','Improve','Run the full Lean toolkit, then let Supe, your AI Lean advisor, surface the highest-leverage actions and draft the target state.','M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3'],
            ].map((p,i)=>(
              <div key={i} className={`pillar reveal rd${i+1}`}>
                <div className="pillar-n">{p[0]}</div>
                <div className="pillar-ico"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={p[3]}/></svg></div>
                <h3 className="pillar-h">{p[1]}</h3>
                <p className="pillar-b">{p[2]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section tools" id="tools">
        <div className="wrap">
          <div className="sec-head reveal">
            <div className="eyebrow"><span className="eyebrow-line"/><span className="eyebrow-txt" style={{color:GOLD}}>One platform, the full method</span></div>
            <h2 className="sec-h2">Every Lean tool you trained on,<br/><em>in one workspace.</em></h2>
            <p className="sec-lead">No more scattered spreadsheets and whiteboard photos. The complete continuous improvement toolkit, connected to your value stream map.</p>
          </div>
          <div className="tools-grid">
            {TOOLS.map((t,i)=>(
              <div key={i} className={`tool reveal rd${(i%4)+1}`}>
                <div className="tool-ico"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={t[2]}/></svg></div>
                <div className="tool-name">{t[0]}</div><div className="tool-desc">{t[1]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section method floatpanel" id="method">
        <div className="wrap">
          <div className="method-split">
            <div className="method-visual reveal">
              <div className="method-ring" style={{width:'100%',height:'100%'}}/>
              <div className="method-ring" style={{width:'74%',height:'74%'}}/>
              <div className="method-ring" style={{width:'48%',height:'48%'}}/>
              <div className="method-badge">
                <div className="method-iso">BUILT ON</div>
                <div className="method-iso-big">ISO<br/>22468</div>
                <div className="method-iso-sub">The international standard for value stream management, published 2020. Your maps follow real methodology, not a toy diagram tool.</div>
              </div>
            </div>
            <div className="reveal rd2">
              <div className="eyebrow"><span className="eyebrow-line"/><span className="eyebrow-txt" style={{color:GOLDD}}>Serious methodology</span></div>
              <h2 className="sec-h2" style={{fontSize:'clamp(32px,4vw,48px)'}}>Rigor that holds up<br/>in front of <em>leadership.</em></h2>
              <div className="method-list">
                {[
                  ['Standardized notation','Process boxes, data boxes, inventory triangles, and timeline ladders that any Lean practitioner instantly recognizes.'],
                  ['Honest calculations','Lead time, PCE, and takt computed from your real inputs. No invented numbers, ever. Estimates are always labeled as estimates.'],
                  ['Boardroom-ready exports','Generate a clean A3-style report with your logo, ready to send to an owner, a client, or a plant manager.'],
                ].map((m,i)=>(
                  <div key={i} className="method-item"><div className="method-check">✓</div><div><div className="method-item-h">{m[0]}</div><div className="method-item-b">{m[1]}</div></div></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="industries floatpanel">
        <div className="ind-label">Built for any operation with a process</div>
        <div className="marquee-row"><div className="marquee">{[...INDS,...INDS].map((n,i)=><span key={i} className="ind-item">{n}</span>)}</div></div>
      </section>

      <section className="section founder">
        <div className="wrap">
          <div className="eyebrow reveal"><span className="eyebrow-line"/><span className="eyebrow-txt">Why VeSiMy exists</span></div>
          <div className="founder-card reveal rd1">
            <div className="founder-photo">MS</div>
            <div>
              <p className="founder-quote">I spent twelve years on factory floors watching teams get trained in Lean, then hand back to spreadsheets and forget all of it within a month. <em>The training was never the problem. Execution was.</em> VeSiMy is the tool I always wished my teams had.</p>
              <div className="founder-name">Max Singh</div>
              <div className="founder-role">Founder &amp; CEO · Pleasant Hill, California</div>
              <div className="founder-creds">
                <span className="founder-cred">12 YEARS OPERATIONS</span>
                <span className="founder-cred">TESLA</span>
                <span className="founder-cred">PHILIPS</span>
                <span className="founder-cred">LEAN SIX SIGMA GREEN BELT</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section contrast floatpanel">
        <div className="wrap">
          <div className="sec-head reveal">
            <div className="eyebrow"><span className="eyebrow-line"/><span className="eyebrow-txt" style={{color:GOLDD}}>The gap nobody talks about</span></div>
            <h2 className="sec-h2">Training teaches the theory.<br/>VeSiMy is where you <em>do it.</em></h2>
          </div>
          <div className="contrast-split">
            <div className="cside cside-train reveal rd1">
              <div className="cside-tag">After a Lean course</div>
              <div className="cside-h">You know the words.</div>
              <div className="cside-list">
                {['A binder of concepts you will mostly forget','A whiteboard photo that never gets revisited','Spreadsheets nobody updates after week two','Good intentions, no system to sustain them'].map((t,i)=><div key={i} className="cside-li"><span className="cside-mark">—</span> {t}</div>)}
              </div>
            </div>
            <div className="cside cside-exec reveal rd2">
              <div className="cside-tag">With VeSiMy</div>
              <div className="cside-h">You run the method.</div>
              <div className="cside-list">
                {['A living map that updates as the process changes','Bottlenecks and waste surfaced automatically','Every improvement tracked from idea to result','An AI advisor that suggests the next right move'].map((t,i)=><div key={i} className="cside-li"><span className="cside-mark">✓</span> {t}</div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section pricing floatpanel" id="pricing">
        <div className="wrap">
          <div className="sec-head reveal" style={{textAlign:'center',marginLeft:'auto',marginRight:'auto'}}>
            <div className="eyebrow" style={{justifyContent:'center'}}><span className="eyebrow-line"/><span className="eyebrow-txt" style={{color:GOLDD}}>Pricing</span></div>
            <h2 className="sec-h2">Start free.<br/>Upgrade when <em>it earns it.</em></h2>
          </div>
          <div className="price-grid">
            <div className="pcard reveal rd1">
              <div className="pname">Free Start</div><div className="pprice"><span className="pprice-v">$0</span></div><div className="pdesc">No account needed</div>
              {['One process map','Stopwatch & time study','Plain-language report','One improvement action'].map((f,i)=><div key={i} className="pfeat"><span className="pfeat-c">✓</span> {f}</div>)}
              <Link href="/start" className="pbtn pbtn-navy">Start mapping</Link>
            </div>
            <div className="pcard reveal rd2">
              <div className="pname">Trial</div><div className="pprice"><span className="pprice-v">14</span><span className="pprice-sub">days</span></div><div className="pdesc">No credit card</div>
              {['All Lean tools','AI-guided workflow','Up to 3 projects','AI report preview'].map((f,i)=><div key={i} className="pfeat"><span className="pfeat-c">✓</span> {f}</div>)}
              <Link href="/auth/signup" className="pbtn pbtn-navy">Create account</Link>
            </div>
            <div className="pcard feat reveal rd3">
              <div className="pbadge">Most Popular</div>
              <div className="pname">Pro</div><div className="pprice"><span className="pprice-v">$29</span><span className="pprice-sub">/mo</span></div><div className="pdesc">Or $23/mo billed annually</div>
              {['Everything in Trial','Supe AI full analysis','Target-state VSM','PDF export','Simulation engine','Kaizen roadmap'].map((f,i)=><div key={i} className="pfeat"><span className="pfeat-c">✓</span> {f}</div>)}
              <Link href="/auth/signup" className="pbtn pbtn-gold">Start Pro</Link>
            </div>
            <div className="pcard reveal rd4">
              <div className="pname">Enterprise</div><div className="pprice"><span className="pprice-v">Custom</span></div><div className="pdesc">Volume &amp; teams</div>
              {['Team collaboration','Roles & permissions','Version comparison','SSO + SLA'].map((f,i)=><div key={i} className="pfeat"><span className="pfeat-c">✓</span> {f}</div>)}
              <Link href="/contact" className="pbtn pbtn-navy">Talk to us</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section faq floatpanel">
        <div className="wrap">
          <div className="sec-head reveal" style={{textAlign:'center',marginLeft:'auto',marginRight:'auto'}}>
            <div className="eyebrow" style={{justifyContent:'center'}}><span className="eyebrow-line"/><span className="eyebrow-txt" style={{color:GOLDD}}>Questions</span></div>
            <h2 className="sec-h2">Things worth <em>knowing.</em></h2>
          </div>
          <div className="faq-list reveal rd1">
            {FAQ.map(([q,a],i)=>(
              <div key={i} className={`faq-item${openFaq===i?' open':''}`}>
                <button className="faq-q" onClick={()=>setOpenFaq(openFaq===i?null:i)}>{q}<span className="faq-icon"/></button>
                <div className="faq-a" style={{maxHeight:openFaq===i?400:0}}><div className="faq-a-inner">{a}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="final">
        <div className="final-inner">
          <div className="eyebrow reveal" style={{justifyContent:'center'}}><span className="eyebrow-line"/><span className="eyebrow-txt" style={{color:GOLD}}>Get started</span></div>
          <h2 className="final-h reveal rd1">Map your first process<br/><em>in under five minutes.</em></h2>
          <p className="final-sub reveal rd2">No credit card. No consultant. Just you, your process, and a clearer view of where the waste is hiding.</p>
          <div className="final-actions reveal rd3">
            <Link href="/auth/signup" className="btn btn-gold">Start free →</Link>
            <a href="#demo" className="btn btn-ghostL">Try the demo first</a>
          </div>
          <div className="final-note reveal rd4">Free forever tier · No card required · Your data stays yours</div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-grid">
          <div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}><img src={LOGO} width={28} height={28} alt="" style={{display:'block'}}/><span className="footer-word">VeSiMy</span></div>
            <p className="footer-tag">The execution layer for Lean. Map it. Measure it. Improve it.</p>
          </div>
          <div><div className="footer-col-h">Product</div><Link href="/features" className="footer-link">Features</Link><Link href="/pricing" className="footer-link">Pricing</Link><a href="#tools" className="footer-link">Toolkit</a><a href="#demo" className="footer-link">Live Demo</a></div>
          <div><div className="footer-col-h">Company</div><Link href="/about" className="footer-link">About</Link><Link href="/blog" className="footer-link">Blog</Link><Link href="/contact" className="footer-link">Contact</Link></div>
          <div><div className="footer-col-h">Resources</div><Link href="/docs" className="footer-link">Documentation</Link><Link href="/iso-22468" className="footer-link">ISO 22468</Link><Link href="/lean-glossary" className="footer-link">Lean Glossary</Link></div>
        </div>
        <div className="footer-bot">
          <span className="footer-copy">© 2026 VeSiMy · Pleasant Hill, California · Structured using ISO 22468:2020 methodology</span>
          <div style={{display:'flex',gap:20}}><Link href="/privacy" className="footer-link" style={{margin:0}}>Privacy</Link><Link href="/terms" className="footer-link" style={{margin:0}}>Terms</Link><Link href="/security" className="footer-link" style={{margin:0}}>Security</Link></div>
        </div>
      </footer>
    </div>
  )
}
