import Link from 'next/link'
import { VesimyLogo } from '@/components/ui/Logo'

const navItems = [
  { label: 'Product', href: '/start' },
  { label: 'Guided', href: '/auth/signup?ref=guided' },
  { label: 'Industries', href: '/industries' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Enterprise', href: '/enterprise' },
]

const tools = [
  ['Time Study', 'Measure cycle time from the floor.'],
  ['5 Why', 'Find root causes without stopping at symptoms.'],
  ['Fishbone', 'Organize possible causes with the team.'],
  ['Waste ID', 'Classify waste directly from process steps.'],
  ['Kaizen', 'Turn opportunities into focused actions.'],
  ['Improvements', 'Track owners, status, and follow-through.'],
]

const industries = ['Manufacturing', 'Food & Beverage', 'Healthcare', 'Logistics', 'Retail', 'Services', 'Warehousing', 'Automotive']

function ProductPreview() {
  const steps = ['Receive', 'Prep', 'Assembly', 'Inspect', 'Pack']
  return (
    <div className="relative mx-auto w-full max-w-[640px] [perspective:1200px]">
      <div className="absolute -right-4 -top-6 hidden rounded-2xl border border-blue-100 bg-white/90 p-4 shadow-2xl md:block">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400">Supe AI</p>
        <p className="mt-2 max-w-[180px] text-xs leading-6 text-slate-600">Highlights the step with the biggest wait / WIP signal from your real map.</p>
      </div>
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,.12),0_5px_0_rgba(15,23,42,.04)] md:[transform:rotateX(7deg)_rotateY(-10deg)]">
        <div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-blue-500">Product UI preview</p>
            <h3 className="mt-1 text-xl font-black tracking-tight text-slate-950">Current State Map</h3>
          </div>
          <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-blue-600">Sticky canvas</span>
        </div>
        <div className="overflow-x-auto pb-3">
          <div className="flex min-w-[560px] items-start gap-4">
            {steps.map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <div className={`relative h-28 w-28 rounded-md border border-black/5 p-3 shadow-xl ${i === 0 ? 'bg-blue-100' : i === 1 ? 'bg-yellow-100' : i === 2 ? 'bg-rose-100' : i === 3 ? 'bg-green-100' : 'bg-violet-100'}`}>
                  <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-blue-600 shadow-md" />
                  <p className="font-serif text-lg font-black text-slate-800">{i + 1}. {step}</p>
                  <div className="mt-3 grid grid-cols-2 gap-1 font-mono text-[9px] text-slate-600">
                    <span>CT —</span><span>WT —</span><span>WIP —</span><span>VA/NVA</span>
                  </div>
                </div>
                {i < steps.length - 1 && <div className="h-px w-7 bg-slate-300" />}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {['Lead Time', 'Cycle Time', 'WIP', 'PCE'].map(label => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">{label}</p>
              <p className="mt-2 text-2xl font-black text-slate-950">—</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_70%_20%,rgba(59,124,255,.12),transparent_30%),linear-gradient(180deg,#fff,#f8fbff)] px-5 pb-20 pt-5 sm:px-8 lg:px-10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-3xl border border-slate-200 bg-white/80 px-4 py-3 shadow-[0_12px_40px_rgba(15,23,42,.07)] backdrop-blur-xl">
          <Link href="/" aria-label="VeSiMy home" className="flex items-center"><VesimyLogo size={42} showText /></Link>
          <div className="hidden items-center gap-7 lg:flex">
            {navItems.map(item => <Link key={item.href} href={item.href} className="text-sm font-bold text-slate-600 transition hover:text-blue-600">{item.label}</Link>)}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm sm:inline-flex">Sign in</Link>
            <Link href="/start" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-black text-white shadow-[0_4px_0_rgba(30,64,175,.8),0_18px_34px_rgba(37,99,235,.22)]">Start Free</Link>
          </div>
        </nav>
        <div className="mx-auto grid max-w-7xl items-center gap-14 pb-10 pt-16 lg:grid-cols-[.92fr_1.08fr] lg:pt-24">
          <div>
            <div className="inline-flex rounded-full border border-amber-200 bg-white px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-amber-700 shadow-sm">AI-powered value stream management</div>
            <h1 className="mt-8 max-w-3xl text-5xl font-black leading-[1.02] tracking-[-0.06em] text-slate-950 sm:text-6xl lg:text-7xl">
              Turn improvement into measurable <span className="text-blue-600">business impact.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">VeSiMy helps teams map processes, analyze bottlenecks, and achieve monthly, quarterly, and yearly targets across industries with built-in CI tools and Supe AI guidance.</p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link href="/start" className="inline-flex justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-black text-white shadow-[0_4px_0_rgba(30,64,175,.8),0_18px_38px_rgba(37,99,235,.22)] transition hover:-translate-y-0.5">Try it free. No account needed.</Link>
              <Link href="/auth/signup?ref=guided" className="inline-flex justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-700 shadow-[0_4px_0_rgba(15,23,42,.08)] transition hover:-translate-y-0.5">Explore Guided</Link>
            </div>
            <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 text-xs font-semibold text-slate-500 sm:grid-cols-4">
              <span>No account start</span><span>Built-in CI tools</span><span>Professional reports</span><span>Works across processes</span>
            </div>
          </div>
          <ProductPreview />
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-950 px-5 py-12 text-center text-white sm:px-8 lg:px-10">
        <p className="text-2xl font-black tracking-[-0.03em]">Every process has a constraint. VeSiMy helps make it visible.</p>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-blue-600">How VeSiMy works</p>
          <h2 className="mt-4 max-w-4xl text-4xl font-black tracking-[-0.045em] sm:text-5xl">Two paths: guided for beginners, pro canvas for practitioners.</h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_18px_48px_rgba(15,23,42,.08)]">
              <h3 className="text-2xl font-black">VeSiMy Guided</h3>
              <p className="mt-3 leading-7 text-slate-600">A step-by-step process that teaches the method while the user maps real work: knowledge check, target setting, current state, boundaries, map steps, bottleneck, improvement plan, and report.</p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-[0_18px_48px_rgba(15,23,42,.18)]">
              <h3 className="text-2xl font-black">Pro Sticky Canvas</h3>
              <p className="mt-3 leading-7 text-slate-300">A drag-and-drop sticky-note VSM workspace with inline CT, WT, WIP, activity lists, CI tool launchers, and current-state / future-state flow.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-blue-600">Built-in continuous improvement tools</p>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {tools.map(([title, body]) => <div key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,.06)]"><h3 className="text-xl font-black">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{body}</p></div>)}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-blue-600">Built for every process</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.045em]">Lean for everyone, not just manufacturing experts.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">Use VeSiMy wherever work repeats and improvement needs to be proven.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {industries.map(i => <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 text-center text-sm font-bold text-slate-700 shadow-sm">{i}</div>)}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center">
          <VesimyLogo size={36} showText />
          <p className="text-sm text-slate-500">© 2026 VeSiMy. Value streams. Real results.</p>
        </div>
      </footer>
    </main>
  )
}
