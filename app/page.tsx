import Link from 'next/link'

const navItems = [
  { label: 'Product', href: '/start' },
  { label: 'Solutions', href: '/learn' },
  { label: 'Industries', href: '/industries' },
  { label: 'Resources', href: '/blog' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Enterprise', href: '/enterprise' },
]

const ciTools = [
  ['Time Study', 'Accurate time capture and analysis.'],
  ['5 Why', 'Get to the root cause, faster.'],
  ['Fishbone', 'Visualize cause and effect.'],
  ['Waste ID', 'Identify and categorize waste.'],
  ['Kaizen', 'Run improvement events that stick.'],
  ['Improvements', 'Log, prioritize, and track actions.'],
]

const industries = ['Manufacturing', 'Automotive', 'Healthcare', 'Logistics', 'Food & Beverage', 'Aerospace', 'More']

function HeaderLogo() {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="VeSiMy home">
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 shadow-[0_0_24px_rgba(59,124,255,.22)]">
        <span className="absolute h-5 w-5 rotate-45 rounded-[4px] bg-gradient-to-br from-[#3B7CFF] to-[#22D3EE]" />
        <span className="absolute h-3 w-3 -translate-x-1 -translate-y-1 rotate-45 rounded-[3px] bg-[#102A6D]" />
      </span>
      <span className="text-2xl font-black tracking-[-0.04em] text-white">VeSiMy</span>
    </Link>
  )
}

function HeroProductPreview() {
  const steps = [
    ['1. Material', 'Staging', 'CT: 2.5 min', 'WT: 10.0 min', 'WIP: 12', 'border-emerald-400/40'],
    ['2. Sub', 'Assembly', 'CT: 4.0 min', 'WT: 18.0 min', 'WIP: 20', 'border-cyan-400/40'],
    ['3. Assembly', '', 'CT: 6.5 min', 'WT: 25.0 min', 'WIP: 28', 'border-red-400/70 bg-red-500/10'],
    ['4. Test', '', 'CT: 3.0 min', 'WT: 8.0 min', 'WIP: 10', 'border-blue-400/40'],
    ['5. Pack &', 'Ship', 'CT: 2.0 min', 'WT: 6.0 min', 'WIP: 8', 'border-emerald-400/40'],
  ]

  return (
    <div className="relative mx-auto w-full max-w-[760px] [perspective:1200px]">
      <div className="absolute -bottom-10 left-12 z-20 hidden w-72 rounded-2xl border border-blue-400/20 bg-[#071225]/90 p-5 shadow-[0_28px_80px_rgba(0,0,0,.55)] backdrop-blur-xl md:block">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-blue-300">Supe AI insight</p>
        <p className="mt-3 text-sm font-bold text-white">Step 3 — Assembly is the constraint.</p>
        <p className="mt-2 text-xs leading-5 text-slate-300">High wait time and WIP are causing flow delays.</p>
        <span className="mt-4 inline-flex text-xs font-bold text-blue-300">View insight →</span>
      </div>

      <div className="absolute -bottom-10 right-8 z-20 hidden w-64 rounded-2xl border border-blue-400/20 bg-[#071225]/90 p-5 shadow-[0_28px_80px_rgba(0,0,0,.55)] backdrop-blur-xl md:block">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-blue-300">Target Progress</p>
        <div className="mt-3 flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full border-[7px] border-blue-500/80 text-sm font-black text-white">62%</div>
          <p className="text-xs leading-5 text-slate-300">On track to meet your lead-time reduction target.</p>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-white/10 bg-[#071225]/95 p-5 shadow-[0_35px_120px_rgba(0,0,0,.58),0_0_0_1px_rgba(59,124,255,.16)] backdrop-blur-xl lg:[transform:rotateX(3deg)_rotateY(-9deg)]">
        <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-blue-300">Current State Map</p>
            <h3 className="mt-1 text-lg font-black text-white">Assembly Line</h3>
          </div>
          <div className="flex gap-2">
            <span className="rounded-lg border border-white/10 px-3 py-1 text-xs font-bold text-slate-300">Share</span>
            <span className="rounded-lg border border-white/10 px-3 py-1 text-xs font-bold text-slate-300">Actions</span>
          </div>
        </div>

        <div className="flex min-w-[620px] items-start gap-3 overflow-x-auto pb-3">
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-center text-xs font-bold text-slate-300">Supplier</div>
          {steps.map((step, index) => (
            <div key={`${step[0]}-${index}`} className="flex items-center gap-3">
              <div className={`w-[106px] rounded-xl border bg-[#0B1830] p-3 shadow-xl ${step[5]}`}>
                <p className="text-sm font-black text-white">{step[0]}</p>
                {step[1] && <p className="text-sm font-black text-white">{step[1]}</p>}
                <div className="mt-3 space-y-1 font-mono text-[9px] text-slate-300">
                  <p>{step[2]}</p>
                  <p className={index === 2 ? 'text-red-300' : ''}>{step[3]}</p>
                  <p className={index === 2 ? 'text-red-300' : ''}>{step[4]}</p>
                </div>
              </div>
              {index < steps.length - 1 && <div className="h-px w-7 bg-slate-500" />}
            </div>
          ))}
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-center text-xs font-bold text-slate-300">Customer</div>
        </div>

        <div className="mt-4 grid grid-cols-5 gap-3">
          {[
            ['Takt Time', '5.60 min'], ['Total Cycle Time', '18.0 min'], ['Total Wait Time', '67.0 min'], ['Total WIP', '78'], ['PCE', '21.1%'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-slate-500">{label}</p>
              <p className="mt-2 text-lg font-black text-white">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function GuidedPreview() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_22px_55px_rgba(15,23,42,.10)]">
      <p className="mb-4 text-xs font-black text-slate-500">Guided Workflow</p>
      <div className="grid grid-cols-4 gap-3">
        {['Map', 'Analyze', 'Improve', 'Control'].map((s, i) => (
          <div key={s} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-blue-50 text-xs font-black text-blue-600">{i + 1}</span>
            <p className="mt-3 text-sm font-black text-slate-950">{s}</p>
            <p className="mt-1 text-[11px] leading-4 text-slate-500">{i === 0 ? 'Capture your current state' : i === 1 ? 'Find constraints and waste' : i === 2 ? 'Build and prioritize solutions' : 'Track KPIs and sustain gains'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function CanvasPreview() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#071225] p-4 shadow-[0_22px_65px_rgba(0,0,0,.35)]">
      <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-3">
        <span className="h-3 w-3 rounded-full bg-red-400" /><span className="h-3 w-3 rounded-full bg-yellow-400" /><span className="h-3 w-3 rounded-full bg-green-400" />
        <span className="ml-auto rounded-lg bg-blue-600 px-3 py-1 text-xs font-bold text-white">Share</span>
      </div>
      <div className="grid h-32 grid-cols-6 gap-2 rounded-xl bg-white/95 p-4">
        {['Receive', 'Prep', 'Assembly', 'Inspect', 'Pack', 'Ship'].map((s, i) => (
          <div key={s} className={`${['bg-blue-100','bg-yellow-100','bg-rose-100','bg-green-100','bg-violet-100','bg-sky-100'][i]} rounded-md p-2 text-[10px] font-black text-slate-800 shadow-md`}>{s}</div>
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="relative overflow-hidden bg-[#020817] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(59,124,255,.22),transparent_24%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,.12),transparent_26%)]" />
        <div className="absolute inset-x-0 bottom-0 h-72 bg-[radial-gradient(circle,rgba(59,124,255,.35)_1px,transparent_1px)] [background-size:24px_24px] opacity-40 [mask-image:linear-gradient(to_top,black,transparent)]" />
        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <HeaderLogo />
          <div className="hidden items-center gap-8 lg:flex">
            {navItems.map(item => <Link key={item.href} href={item.href} className="text-sm font-bold text-slate-300 transition hover:text-white">{item.label}</Link>)}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="hidden rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-bold text-white sm:inline-flex">Sign In</Link>
            <Link href="/start" className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-black text-white shadow-[0_12px_34px_rgba(37,99,235,.36)]">Start Free</Link>
          </div>
        </nav>

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-6 pb-24 pt-14 lg:grid-cols-[.86fr_1.14fr] lg:px-8 lg:pt-20">
          <div>
            <div className="inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300">Value Stream Mapping & Continuous Improvement Platform</div>
            <h1 className="mt-8 max-w-3xl text-5xl font-black leading-[1.02] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Hit Improvement Targets. <span className="block bg-gradient-to-r from-[#3B7CFF] to-[#A78BFA] bg-clip-text text-transparent">Not Just Process Maps.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">Map your current state. Analyze bottlenecks. Use built-in CI tools and Supe AI to prioritize the right improvements. Then track measurable results that move your KPIs.</p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link href="/start" className="inline-flex justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-black text-white shadow-[0_4px_0_rgba(30,64,175,.8),0_18px_38px_rgba(37,99,235,.24)] transition hover:-translate-y-0.5">Try it free. No account needed. →</Link>
              <Link href="/auth/signup?ref=guided" className="inline-flex justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5">Explore Guided</Link>
            </div>
            <div className="mt-8 grid max-w-2xl grid-cols-1 gap-4 text-xs font-semibold text-slate-300 sm:grid-cols-3">
              <span><strong className="text-white">Focus on constraints</strong><br />Find what is holding you back</span>
              <span><strong className="text-white">Prove the impact</strong><br />Track real KPI improvement</span>
              <span><strong className="text-white">Built for teams</strong><br />Operators to executives</span>
            </div>
          </div>
          <HeroProductPreview />
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-slate-800 bg-slate-950 px-6 py-9 text-center text-white">
        <div className="absolute inset-0 opacity-35 bg-[linear-gradient(90deg,rgba(15,23,42,.95),rgba(15,23,42,.75)),radial-gradient(circle_at_70%_50%,rgba(59,124,255,.22),transparent_30%)]" />
        <p className="relative text-2xl font-black tracking-[-0.03em]">Every process has a constraint. VeSiMy finds it.</p>
        <div className="relative mx-auto mt-4 h-1 w-16 rounded-full bg-blue-500" />
      </section>

      <section className="bg-white px-6 py-14 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[.42fr_.58fr]">
          <div>
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-2xl text-blue-600">✦</div>
            <h2 className="mt-5 text-2xl font-black">Guided</h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-slate-600">Step-by-step guidance to map, analyze, improve, and control — perfect for teams getting started with continuous improvement.</p>
            <Link href="/auth/signup?ref=guided" className="mt-5 inline-flex text-sm font-black text-blue-600">Explore Guided →</Link>
          </div>
          <GuidedPreview />
        </div>
      </section>

      <section className="bg-[#020817] px-6 py-14 text-white lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[.42fr_.58fr]">
          <div>
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-500/15 text-2xl text-blue-300">▧</div>
            <h2 className="mt-5 text-2xl font-black">Pro Canvas</h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-slate-300">Advanced sticky-note canvas for expert users who want full flexibility to model complex value streams and scenarios.</p>
            <Link href="/auth/signup?ref=pro-canvas" className="mt-5 inline-flex text-sm font-black text-blue-300">Explore Pro Canvas →</Link>
          </div>
          <CanvasPreview />
        </div>
      </section>

      <section className="bg-white px-6 py-14 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-2xl font-black">Built-in CI Tools</h2>
          <p className="mt-2 text-sm text-slate-600">Powerful tools. One seamless experience.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {ciTools.map(([title, body]) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-[0_12px_30px_rgba(15,23,42,.06)]">
                <h3 className="text-base font-black">{title}</h3>
                <p className="mt-3 text-xs leading-5 text-slate-600">{body}</p>
                <span className="mt-4 inline-flex text-xs font-black text-blue-600">Open Tool →</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#020817] px-6 py-14 text-white lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.42fr_.58fr]">
          <div>
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-500/15 text-2xl text-blue-300">✦</div>
            <h2 className="mt-5 text-2xl font-black">Supe AI <span className="rounded-full bg-blue-500/15 px-2 py-1 text-xs text-blue-200">Beta</span></h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-slate-300">Your AI improvement advisor. Get grounded insights, recommendations, and plain-language explanations based on your current map data.</p>
            <ul className="mt-5 space-y-2 text-sm text-slate-300">
              <li>✓ Detect constraints and bottlenecks</li>
              <li>✓ Prioritize high-impact opportunities</li>
              <li>✓ Explain insights in plain language</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-[#071225] p-6 shadow-[0_25px_90px_rgba(0,0,0,.45)]">
            <p className="rounded-full bg-white/5 px-4 py-2 text-center text-xs text-slate-300">What is the biggest opportunity to improve this process?</p>
            <div className="mt-6 rounded-2xl border border-blue-400/20 bg-blue-500/5 p-5">
              <p className="text-sm font-black text-white">The biggest opportunity is at Step 3 — Assembly.</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">It has the longest cycle time and highest wait signal, creating downstream delays and excess WIP.</p>
              <button className="mt-5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-black text-white">View Detailed Recommendation</button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-14 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[.42fr_.58fr]">
          <div>
            <h2 className="text-2xl font-black">Reports</h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-slate-600">Clear visual reports that communicate impact and track progress over time.</p>
            <Link href="/auth/signup?ref=reports" className="mt-5 inline-flex text-sm font-black text-blue-600">Explore Reports →</Link>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,.10)]">
            <div className="mb-4 flex items-center justify-between"><h3 className="font-black">Improvement Summary Report</h3><span className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-bold text-blue-600">Export</span></div>
            <div className="grid gap-4 md:grid-cols-[.35fr_.4fr_.25fr]">
              <div className="space-y-2 text-sm"><p className="font-bold text-slate-500">KPI Summary</p>{['Lead Time', 'Cycle Time', 'Wait Time', 'WIP', 'PCE'].map(x => <p key={x} className="flex justify-between"><span>{x}</span><span className="font-bold text-emerald-600">Improved</span></p>)}</div>
              <div className="rounded-xl bg-slate-50 p-4"><div className="grid h-40 grid-cols-5 items-end gap-3">{[72,54,66,45,80].map((h,i)=><div key={i} className="rounded-t-lg bg-blue-500" style={{height:`${h}%`}} />)}</div></div>
              <div className="space-y-3 text-sm"><p className="font-bold text-slate-500">Highlights</p><p>✓ Lead time reduced</p><p>✓ WIP reduced</p><p>✓ Targets on track</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#020817] px-6 py-10 text-white lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div><h2 className="text-2xl font-black">Industries</h2><p className="mt-2 text-sm text-slate-300">Built for operators, consultants, and CI teams across industries.</p></div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
            {industries.map(i => <div key={i} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-xs font-bold text-slate-200">{i}</div>)}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-14 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[.25fr_.75fr]">
          <div><h2 className="text-2xl font-black">Simple, transparent pricing</h2><p className="mt-2 text-sm text-slate-600">Start free. Upgrade when you are ready.</p></div>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              ['Free Start', '$0', 'Forever', 'Get Started'], ['Free Trial', '$0', '14 days', 'Start Free Trial'], ['Pro', '$29', 'per user / month', 'Start Pro'], ['Enterprise', 'Custom', 'For organizations', 'Contact Sales'],
            ].map(([name, price, sub, cta]) => <div key={name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,.06)]"><h3 className="font-black">{name}</h3><p className="mt-4 text-3xl font-black">{price}</p><p className="text-sm text-slate-500">{sub}</p><button className={`mt-5 w-full rounded-xl px-4 py-2 text-sm font-black ${name==='Pro'?'bg-blue-600 text-white':'border border-slate-200 text-slate-700'}`}>{cta}</button></div>)}
          </div>
        </div>
      </section>

      <footer className="bg-[#020817] px-6 py-10 text-white lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center">
          <HeaderLogo />
          <p className="text-sm text-slate-400">© 2026 VeSiMy. Value streams. Real results.</p>
        </div>
      </footer>
    </main>
  )
}
