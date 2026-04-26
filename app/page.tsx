import Link from 'next/link'
import type { ReactNode } from 'react'

const navItems = [
  { label: 'Guided', href: '/auth/signup?ref=guided' },
  { label: 'Tools', href: '/blog' },
  { label: 'Industries', href: '/industries' },
  { label: 'Enterprise', href: '/enterprise' },
  { label: 'Pricing', href: '/pricing' },
]

const ciTools = [
  ['Time Study', 'Capture cycle time with stopwatch-based measurement and build a cleaner current state.'],
  ['5 Why', 'Move past symptoms and guide the team toward a system-level root cause.'],
  ['Fishbone', 'Structure possible causes before the team jumps into solutions.'],
  ['Waste ID', 'Classify waste patterns so improvement work starts in the right place.'],
  ['Kaizen', 'Turn ideas into focused improvement actions with status and ownership.'],
  ['Improvements', 'Track actions, owners, due dates, and the work needed to sustain gains.'],
]

const industries = [
  'Manufacturing', 'Food & Beverage', 'Healthcare', 'Logistics', 'Retail', 'Pharma',
  'Automotive', 'Hospitality', 'Warehousing', 'Services', 'Aerospace', 'Energy',
]

const metrics = [
  ['Cycle Time', '210s', 'Measured per step'],
  ['Wait Time', '3.2d', 'Visible before action'],
  ['WIP', '49', 'Shown on the flow'],
  ['PCE', '27.8%', 'VA time / total time'],
]

function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label="VeSiMy home">
      <div className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-gradient-to-br from-[#3B7CFF] to-[#162040] shadow-[0_6px_0_rgba(3,6,15,.75),0_18px_42px_rgba(59,124,255,.25)] transition-transform group-hover:-translate-y-0.5">
        <span className="font-black tracking-tight text-white">V</span>
        <span className="absolute inset-x-2 top-1 h-px bg-white/35" />
      </div>
      <div className="leading-none">
        <div className="text-lg font-black tracking-[-0.04em] text-white">Ve<span className="text-[#90BAFF]">SiM</span>y</div>
        <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.28em] text-slate-500">Value streams</div>
      </div>
    </Link>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="font-mono text-xs font-semibold uppercase tracking-[0.28em] text-[#90BAFF]">{children}</p>
}

function PrimaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center justify-center rounded-xl border border-[#90BAFF]/30 bg-[#3B7CFF] px-6 py-3 text-sm font-bold text-white shadow-[0_3px_0_rgba(19,48,130,.9),0_7px_0_rgba(10,25,70,.65),0_18px_44px_rgba(59,124,255,.32)] transition hover:-translate-y-0.5 hover:bg-[#2760E0] active:translate-y-0">
      {children}
    </Link>
  )
}

function SecondaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-bold text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_3px_0_rgba(3,6,15,.85),0_18px_34px_rgba(0,0,0,.35)] transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.07] active:translate-y-0">
      {children}
    </Link>
  )
}

function DeepCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl border border-white/10 bg-[#0A1228]/90 shadow-[inset_0_1px_0_rgba(255,255,255,.08),inset_0_-1px_0_rgba(0,0,0,.5),3px_3px_0_rgba(4,8,20,.9),6px_6px_0_rgba(3,6,15,.65),9px_9px_0_rgba(2,4,10,.4),0_20px_60px_rgba(0,0,0,.55)] backdrop-blur ${className}`}>{children}</div>
  )
}

function MiniProcessMap() {
  const steps = [
    { name: 'Intake', ct: '42s', wait: '8m', tone: 'blue' },
    { name: 'Review', ct: '76s', wait: '34m', tone: 'red' },
    { name: 'Prepare', ct: '55s', wait: '12m', tone: 'blue' },
    { name: 'Check', ct: '38s', wait: '10m', tone: 'amber' },
    { name: 'Release', ct: '26s', wait: '5m', tone: 'blue' },
  ]

  return (
    <div className="relative mx-auto w-full max-w-[620px] [perspective:1200px]">
      <div className="absolute -left-6 top-10 hidden rounded-2xl border border-[#3B7CFF]/20 bg-[#060C1A]/90 p-4 shadow-2xl backdrop-blur md:block">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Target progress</p>
        <div className="mt-3 flex items-center gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-full border-4 border-[#3B7CFF] text-sm font-black text-white">72%</div>
          <div>
            <p className="text-sm font-bold text-white">On track</p>
            <p className="text-xs text-slate-400">3 actions open</p>
          </div>
        </div>
      </div>
      <div className="absolute -right-4 bottom-8 hidden rounded-2xl border border-cyan-300/20 bg-[#060C1A]/95 p-4 shadow-2xl backdrop-blur md:block">
        <p className="text-sm font-bold text-cyan-200">Supe AI</p>
        <p className="mt-2 max-w-[190px] text-xs leading-6 text-slate-300">Review has the highest wait time. Start there before optimizing lower-impact steps.</p>
      </div>
      <DeepCard className="relative overflow-hidden p-5 md:[transform:rotateX(8deg)_rotateY(-10deg)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#90BAFF]/70 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(59,124,255,.18),transparent_35%),radial-gradient(circle_at_88%_18%,rgba(34,211,238,.12),transparent_28%)]" />
        <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">Real product preview style</p>
            <h3 className="mt-1 text-xl font-black tracking-tight text-white">Current State Map</h3>
          </div>
          <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-200">Live data</div>
        </div>
        <div className="relative mt-7 overflow-x-auto pb-3">
          <div className="flex min-w-[560px] items-center gap-3">
            {steps.map((step, index) => (
              <div key={step.name} className="flex items-center gap-3">
                <div className={`min-w-[92px] rounded-2xl border p-3 shadow-xl ${step.tone === 'red' ? 'border-red-300/35 bg-red-500/10' : step.tone === 'amber' ? 'border-amber-300/35 bg-amber-500/10' : 'border-[#3B7CFF]/30 bg-[#3B7CFF]/10'}`}>
                  <p className="text-sm font-black text-white">{step.name}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-[10px] text-slate-300">
                    <span>CT {step.ct}</span>
                    <span>WT {step.wait}</span>
                  </div>
                </div>
                {index < steps.length - 1 && <div className="flex items-center gap-2"><span className="h-px w-8 bg-[#3B7CFF]/50" /><span className="font-mono text-[10px] text-slate-500">WIP {index + 3}</span></div>}
              </div>
            ))}
          </div>
        </div>
        <div className="relative mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {metrics.map(([label, value, note]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-black/20 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,.06)]">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">{label}</p>
              <p className="mt-1 text-2xl font-black tracking-tight text-white">{value}</p>
              <p className="mt-1 text-xs text-slate-400">{note}</p>
            </div>
          ))}
        </div>
      </DeepCard>
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#02040D] px-5 py-7 text-white sm:px-8 lg:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,124,255,.22),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(34,211,238,.10),transparent_28%),linear-gradient(180deg,#02040D_0%,#060C1A_100%)]" />
      <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(circle,rgba(59,124,255,.55)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_30%,black,transparent_78%)]" />
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 shadow-[0_10px_44px_rgba(0,0,0,.35)] backdrop-blur-xl">
        <Logo />
        <div className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => <Link key={item.href} href={item.href} className="text-sm font-semibold text-slate-300 transition hover:text-white">{item.label}</Link>)}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="hidden text-sm font-semibold text-slate-300 hover:text-white sm:inline">Sign in</Link>
          <Link href="/start" className="rounded-xl bg-white px-4 py-2 text-sm font-black text-[#060C1A] shadow-[0_3px_0_rgba(148,163,184,.8)] transition hover:-translate-y-0.5">Start free</Link>
        </div>
      </nav>
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 pb-20 pt-20 lg:grid-cols-[1fr_0.95fr] lg:pt-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#3B7CFF]/25 bg-[#3B7CFF]/10 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[#90BAFF] shadow-[inset_0_1px_0_rgba(255,255,255,.08)]">
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,.9)]" /> Target-driven CI platform
          </div>
          <h1 className="mt-8 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.065em] text-white drop-shadow-2xl sm:text-6xl lg:text-7xl">
            Hit improvement targets. <span className="block bg-gradient-to-r from-[#90BAFF] via-[#22D3EE] to-[#A78BFA] bg-clip-text text-transparent">Not just process maps.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
            VeSiMy helps teams map the current state, identify bottlenecks and waste, create a target state, and turn improvement work into clear actions, owners, reports, and measurable progress.
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <PrimaryButton href="/start">Try it free - no account</PrimaryButton>
            <SecondaryButton href="/auth/signup?ref=guided">Explore Guided</SecondaryButton>
          </div>
          <div className="mt-8 grid max-w-2xl grid-cols-1 gap-3 text-sm text-slate-400 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">Tier 0 process map in minutes</div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">Built-in CI tools and reports</div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">Made for any repeatable process</div>
          </div>
        </div>
        <MiniProcessMap />
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    ['01', 'Current State', 'Map how the work actually moves today. Start with steps, then add time, WIP, and observations.'],
    ['02', 'Analyze', 'Use CI tools and Supe AI to surface waste, bottlenecks, root causes, and data quality gaps.'],
    ['03', 'Target State', 'Define what better looks like with measurable monthly, quarterly, or yearly targets.'],
    ['04', 'Act & Track', 'Create actions, owners, due dates, reports, and the next improvement cycle.'],
  ]
  return (
    <section className="bg-white px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionLabel>How VeSiMy works</SectionLabel>
        <div className="mt-5 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <h2 className="text-4xl font-black leading-tight tracking-[-0.045em] text-slate-950 sm:text-5xl">From current state to action plan without needing a Lean textbook.</h2>
          <p className="text-lg leading-8 text-slate-600">The product is designed to teach enough methodology to do real work while still giving experienced CI practitioners the structure they expect.</p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map(([num, title, body]) => (
            <div key={num} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-[0_4px_0_rgba(15,23,42,.08),0_24px_55px_rgba(15,23,42,.08)] transition hover:-translate-y-1">
              <p className="font-mono text-sm font-black text-[#3B7CFF]">{num}</p>
              <h3 className="mt-5 text-xl font-black tracking-tight text-slate-950">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ToolsSection() {
  return (
    <section className="relative overflow-hidden bg-[#060C1A] px-5 py-24 text-white sm:px-8 lg:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(167,139,250,.16),transparent_32%),radial-gradient(circle_at_85%_35%,rgba(59,124,255,.14),transparent_34%)]" />
      <div className="relative mx-auto max-w-7xl">
        <SectionLabel>Built-in continuous improvement tools</SectionLabel>
        <div className="mt-5 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <h2 className="max-w-3xl text-4xl font-black leading-tight tracking-[-0.045em] text-white sm:text-5xl">Real methodology, connected to the map.</h2>
          <SecondaryButton href="/blog">View learning center</SecondaryButton>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {ciTools.map(([title, body]) => (
            <DeepCard key={title} className="p-6 transition hover:-translate-y-1">
              <div className="grid h-12 w-12 place-items-center rounded-2xl border border-[#3B7CFF]/25 bg-[#3B7CFF]/10 font-mono text-sm font-black text-[#90BAFF]">{title.slice(0, 2).toUpperCase()}</div>
              <h3 className="mt-6 text-xl font-black tracking-tight text-white">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{body}</p>
            </DeepCard>
          ))}
        </div>
      </div>
    </section>
  )
}

function SupeAndReports() {
  return (
    <section className="bg-slate-50 px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_5px_0_rgba(15,23,42,.08),0_30px_70px_rgba(15,23,42,.10)]">
          <SectionLabel>Supe AI</SectionLabel>
          <h2 className="mt-5 text-4xl font-black leading-tight tracking-[-0.045em] text-slate-950">AI guidance that stays grounded in the process.</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">Supe AI is positioned as an advisor: it helps interpret process data, surface likely bottlenecks, suggest relevant CI tools, and explain why the next action matters. Your team stays in control.</p>
          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white shadow-2xl">
            <p className="text-sm font-bold text-cyan-200">Supe AI insight</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">The Review step has the highest wait time and appears to constrain flow. Start with a focused 5 Why or Fishbone before changing staffing or layout.</p>
          </div>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_5px_0_rgba(15,23,42,.08),0_30px_70px_rgba(15,23,42,.10)]">
          <SectionLabel>Business-ready reports</SectionLabel>
          <h2 className="mt-5 text-4xl font-black leading-tight tracking-[-0.045em] text-slate-950">Leave the session with a plan, not just a map.</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">Reports should summarize the current state, bottlenecks, CI findings, improvement actions, owners, and the target-state story in a clean, printable format.</p>
          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5">
            {['Executive summary', 'Current vs target metrics', 'Bottleneck analysis', 'Recommended next actions'].map((item) => (
              <div key={item} className="flex items-center justify-between border-b border-slate-200 py-3 last:border-0">
                <span className="font-semibold text-slate-800">{item}</span>
                <span className="rounded-full bg-[#3B7CFF]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#2760E0]">Included</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Industries() {
  return (
    <section className="bg-white px-5 py-20 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-[0_8px_0_rgba(15,23,42,.12),0_32px_80px_rgba(15,23,42,.18)] md:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
          <div>
            <SectionLabel>Across industries</SectionLabel>
            <h2 className="mt-5 text-4xl font-black leading-tight tracking-[-0.045em] text-white">Wherever there is a repeatable process, there is something to improve.</h2>
            <p className="mt-5 text-slate-400">Manufacturing examples should not dominate the product. VeSiMy should speak to operations, service, healthcare, logistics, food, and any team trying to make work visible.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {industries.map((industry) => <div key={industry} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm font-bold text-slate-200">{industry}</div>)}
          </div>
        </div>
      </div>
    </section>
  )
}

function PricingCta() {
  return (
    <section className="relative overflow-hidden bg-[#02040D] px-5 py-24 text-white sm:px-8 lg:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,124,255,.22),transparent_38%)]" />
      <div className="relative mx-auto max-w-5xl text-center">
        <SectionLabel>Start simple</SectionLabel>
        <h2 className="mt-5 text-4xl font-black leading-tight tracking-[-0.045em] text-white sm:text-6xl">Map one process free. Upgrade when VeSiMy earns it.</h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">Start with Tier 0: no account, no setup, just one process and a clear first recommendation. Then move into Guided or Pro when you want the full methodology.</p>
        <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
          <PrimaryButton href="/start">Start mapping now</PrimaryButton>
          <SecondaryButton href="/pricing">Compare plans</SecondaryButton>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <section className="relative bg-[#060C1A] px-5 py-16 text-center text-white sm:px-8 lg:px-10">
        <p className="mx-auto max-w-3xl text-2xl font-semibold italic tracking-[-0.02em] text-slate-200">Every process has a constraint. VeSiMy helps make it visible.</p>
      </section>
      <HowItWorks />
      <ToolsSection />
      <Industries />
      <SupeAndReports />
      <section className="bg-white px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-7 h-px w-24 bg-gradient-to-r from-transparent via-[#3B7CFF] to-transparent" />
          <p className="text-2xl italic leading-10 tracking-[-0.025em] text-slate-900">Lean is not a manufacturing methodology. It is the discipline of seeing clearly. Every business has a process. Every process has waste. The only question is whether you can see it. VeSiMy makes it visible.</p>
          <p className="mt-6 text-sm font-bold text-slate-700">Max Singh, Founder VeSiMy</p>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-slate-500">LSS Green Belt · 12+ years manufacturing operations · ex-Tesla</p>
          <div className="mx-auto mt-7 h-px w-24 bg-gradient-to-r from-transparent via-[#3B7CFF] to-transparent" />
        </div>
      </section>
      <PricingCta />
    </main>
  )
}
