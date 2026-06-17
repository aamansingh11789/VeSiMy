# VeSiMy User Tutorial
*A complete step-by-step guide. Read this once, refer back as needed.*

This tutorial walks you through every screen, every tool, and every concept in VeSiMy. If a customer asks "how does this work?" the answer is in here.

---

## Part 1: What VeSiMy Is For

VeSiMy is a Value Stream Mapping and Continuous Improvement platform. In plain English:

You have a process. It could be making a product, serving a customer, processing an order, treating a patient, or anything else with multiple steps. VeSiMy helps you:

1. **Map** that process so everyone can see how work actually flows
2. **Measure** how long each step takes and where time is wasted
3. **Analyze** where the bottlenecks and root causes of problems are
4. **Improve** with structured tools used by Toyota, GE, and every major Lean program
5. **Report** your work professionally to your team or management

VeSiMy was built for operations managers, quality leads, plant supervisors, consultants, and small business owners. You do not need a Lean Six Sigma certification to use it. The terminology adapts to your industry automatically.

---

## Part 2: The First Five Minutes (Quick Start)

For a new user, here is the fastest path from zero to your first useful insight.

### Step 1: Sign Up
Go to vesimy.com and click "Start Free Trial." Enter your email and password. Check your inbox for a confirmation link. Click it. You are now signed in.

### Step 2: Onboarding (4 short questions)
You will be asked:
- **What industry are you in?** Pick the closest match. This changes the terminology used throughout the app. A clinic sees "patient flow" where a factory sees "production line."
- **What is your role?** This adjusts the dashboard and what features are surfaced first.
- **Pick a template or start blank.** For your first project, picking a template is much faster than starting blank. VeSiMy gives you industry-specific starting points.
- **Confirm.**

### Step 3: Your First Process Map
After onboarding you land in the project workspace. You will see:
- A list of steps on the left
- A live VSM map updating as you add information
- Metrics across the top (Lead Time, PCE, Takt Time, WIP)

For each step, fill in:
- **Name** (what the step is called)
- **Cycle Time** (how long it takes to do this step once, in seconds)
- **Wait Time** (how long work sits between this step and the next, in seconds)
- **Operators** (how many people work on this step)
- **WIP** (how many units are typically waiting at this step)

Three to five steps is plenty for your first map.

### Step 4: Find Your Bottleneck
Look at the VSM map at the top. The step with the longest red bar is your bottleneck. Cycle time exceeds takt time. That is the step costing you the most.

### Step 5: Ask Supe AI
Click the Supe AI tab. Ask: "What should I focus on improving first?" Supe reads your actual data and gives you a specific recommendation based on the bottleneck, the wait time, and the PCE.

That is the five-minute path. Anyone who completes those 5 steps has experienced the core value of VeSiMy.

---

## Part 3: Understanding the Lean Concepts

These are the terms VeSiMy uses everywhere. Memorize these and you can answer 80% of user questions.

### Cycle Time (CT)
How long it takes to complete one step, one time. If a worker assembles one widget in 45 seconds, CT = 45s. Measured in seconds.

### Wait Time (WT)
How long work sits idle between steps. If a widget waits 5 minutes between assembly and inspection, WT = 300s. Almost always greater than cycle time, almost always invisible to managers.

### Lead Time (LT)
Total time from start of process to end. **LT = sum of all CT + sum of all WT.** This is what customers actually feel. If a customer's order takes 2 weeks but only 4 hours of actual work, lead time is 2 weeks. The other 13 days and 20 hours is waste.

### Takt Time (TT)
The pace the process must run at to meet customer demand. **TT = Available Working Time ÷ Customer Demand.** If you have 8 hours = 28,800 seconds and customers want 240 units, takt = 120s. Every step must complete in 120s or less or you fall behind.

### Bottleneck
The step with cycle time greater than takt time. This is what limits your output. Improving any other step does nothing for total throughput until you fix the bottleneck. This is the most important concept in the entire app.

### WIP (Work in Progress)
Units of work between steps that are not yet finished. High WIP means poor flow and tied-up cash. Most managers have no idea how much WIP they have.

### PCE (Process Cycle Efficiency)
**PCE = (Value-Added Time ÷ Lead Time) × 100%.** Most processes are in the 5 to 15% range. Above 25% is excellent. This is your "how much of the time we have is actually being used to add value" number.

### VA / NVA / NNVA
- **VA (Value-Added):** The customer pays for it. Cutting wood for a chair is VA.
- **NVA (Non-Value-Added):** Pure waste. Walking 4 meters to get tools is NVA. Customer would not pay for it.
- **NNVA (Necessary but Non-Value-Added):** Required by law, safety, or quality but not value-creating. Inspection, paperwork, regulatory checks.

The goal: eliminate NVA. Minimize NNVA. Maximize VA.

---

## Part 4: Every Tool, Explained

VeSiMy has 17 CI tools. Here is what each does, when to use it, and what good output looks like.

### Stopwatch / Time Study
**What it does:** Records cycle times across multiple observations. Calculates mean, standard deviation, coefficient of variation, and process capability.
**When to use:** Whenever you need real cycle time data. Estimates are not enough.
**Good output:** 10+ observations, CV under 15% means the process is stable, Cp above 1.33 means it is capable.

### Fishbone (Ishikawa) Diagram
**What it does:** Structures root cause brainstorming into categories. Manufacturing uses 6M (Machine, Method, Material, Manpower, Measurement, Mother Nature). Service uses 4P. Healthcare uses 4S.
**When to use:** When you have a problem but multiple possible causes.
**Good output:** Multiple specific causes in each category, then you vote and rank them, then route the top one into 5 Why.

### 5 Why
**What it does:** Asks "why" five times to drill from symptom to root cause. VeSiMy validates each answer (no one-word responses) and prompts you when you are still at the symptom level.
**When to use:** Once you have identified a specific cause in the fishbone, you 5-Why it to find the deep reason.
**Good output:** The fifth answer should make you say "oh, that is the real problem." Common deep causes: missing process, missing standard, missing training, misaligned metrics.

### Waste ID
**What it does:** Tags the 8 forms of waste against process steps. The 8 wastes: Transport, Inventory, Motion, Waiting, Over-Production, Over-Processing, Defects, Unused Talent.
**When to use:** Walking the process and tagging what you see.
**Good output:** Each step has 1 to 3 waste tags with specific descriptions and a priority order for what to fix first.

### Kaizen (Improvement Actions)
**What it does:** Tracks specific improvement actions with owner, priority, status, due date.
**When to use:** After you have identified what to improve. This is where ideas become actions.
**Good output:** Every action has a clear owner and a real due date. Status moves from "Open" to "In Progress" to "Complete" to "Verified."

### Improvement Goals
**What it does:** Tracks a metric over time. Set baseline, target, and current actual. Watch progress.
**When to use:** Once you have started executing kaizen actions, use this to confirm the metric is actually moving.
**Good output:** Baseline → Target → Actual all in one place. Tied to a specific kaizen.

### SMED (Single Minute Exchange of Die)
**What it does:** Breaks changeover/setup activities into "internal" (machine stopped) and "external" (machine running). Goal is to convert internal to external.
**When to use:** Any time you have setup, changeover, or reset between batches or product variants.
**Good output:** A list of activities, classification, and a clear plan to convert internal to external. Original SMED at Toyota took a 4-hour die changeover to 9 minutes.

### Yamazumi Chart
**What it does:** Operator balance chart. Shows how work is distributed across your team relative to takt time.
**When to use:** When one operator looks overloaded and another is waiting.
**Good output:** Visual stack showing each operator's bars. Identify the overloaded ones, rebalance tasks to others.

### Standard Work Sheet
**What it does:** Documents exactly how a step should be performed. Step sequence, time per task, quality checks, safety notes.
**When to use:** After you have improved a process, lock in the gains with a written standard.
**Good output:** Posted at the workstation. Used to train new operators. Updated whenever the process changes.

### PDCA (Plan, Do, Check, Act)
**What it does:** Structures an improvement cycle. Plan what you will do, Do it, Check the result, Act to standardize or re-plan.
**When to use:** Wrapper around any improvement effort.
**Good output:** Each box filled in with specific actions, not generic statements.

### Kanban Board
**What it does:** Visualizes work in progress across columns (Identified, In Progress, Verifying, Complete).
**When to use:** Managing multiple improvement initiatives at once.
**Good output:** Limited WIP. Items move left to right. Nothing stuck in "In Progress" for months.

### DMAIC
**What it does:** Six Sigma's structured improvement methodology. Define, Measure, Analyze, Improve, Control.
**When to use:** Larger structured projects with measurable outcomes.

### 8D Problem Solving
**What it does:** Automotive-standard problem solving. Used heavily in supplier quality.
**When to use:** Customer complaint or defect that needs formal investigation.

### OODA (Observe, Orient, Decide, Act)
**What it does:** Military decision-making loop adapted for fast-moving operational decisions.
**When to use:** Real-time operational situations where you need to act quickly.

### VSM Coaching
**What it does:** AI-guided gap analysis comparing current state to a target state.
**When to use:** Once you have both current and target state, use this to define the implementation roadmap.

### Kaizen Roadmap
**What it does:** Phases of improvement on a timeline. Helps sequence dozens of kaizens.
**When to use:** Multi-month or multi-year continuous improvement programs.

### Supe AI Advisor
**What it does:** Reads your actual project data and gives specific Lean-grounded recommendations. Not generic advice. Looks at your bottleneck, your wait times, your defect rates, and tells you what to fix in what order.
**When to use:** When you have at least 3 steps with cycle times entered.
**Good output:** Specific, references your actual data, suggests a concrete next action, and explains why.

---

## Part 5: Your Reference Project

You have a reference project pre-loaded on your account called "Reference, Automotive Seat Assembly." Open it anytime to see:

- 6 main process steps with realistic cycle times
- 2 parallel branches (Electrical Harness, Foam Prep)
- Time studies on multiple steps
- Fishbone diagram on the bottleneck
- Complete 5 Why analysis with root cause
- Waste tags on multiple steps
- 5 Kaizen events with various statuses
- Improvement goals with baseline and target
- SMED analysis on changeover
- Yamazumi balance chart
- Standard work sheet
- PDCA cycle
- Kanban board

This is the project to demo when someone asks "what does VeSiMy look like?"

If you ever lose it or want a fresh copy, run this in Supabase SQL Editor:
```sql
DELETE FROM public.projects 
WHERE user_id = (SELECT id FROM public.profiles WHERE email = 'your-email@example.com')
AND name = '⭐ Reference, Automotive Seat Assembly';
```
Then click the dashboard's reference button or call `POST /api/projects/seed-reference` to recreate it.

---

## Part 6: Common Questions and How to Answer Them

### "How is this different from a whiteboard?"
A whiteboard is a snapshot at one moment. VeSiMy is a living map that updates whenever the team adds data. The calculations (lead time, PCE, takt, bottleneck) happen automatically. The AI reads your data and points to where to focus. The whiteboard ends when the workshop ends. VeSiMy keeps working.

### "How is this different from Visio or Lucidchart?"
Visio is a drawing tool. You draw boxes and lines, but the boxes do not know what they are or what data they contain. VeSiMy understands that this step is a process step with cycle time, that triangle is WIP, that arrow is information flow. It calculates real metrics. It runs simulations. It links to CI tools. It is a process engineering tool, not a drawing program.

### "How is this different from MS Project?"
MS Project tracks tasks on a timeline. VeSiMy tracks processes and waste. Different problems. MS Project answers "when will this project finish?" VeSiMy answers "where in this process are we losing time?"

### "Do I need to know Lean Six Sigma to use this?"
No. VeSiMy has built-in education in every tool. Each field has a tooltip explaining what to put there. The terminology adapts to your industry. The AI suggests what to do next. You will learn Lean by using VeSiMy, not the other way around.

### "Can my team collaborate?"
Currently VeSiMy is single-user. Each person has their own projects. Team collaboration (shared projects, comments, change history) is on the roadmap for the enterprise tier.

### "How does the AI work?"
The Supe AI reads your real project data: your process steps, cycle times, wait times, identified wastes, and tool findings. It uses Anthropic's Claude API with a custom prompt structured around Lean methodology. It does not generate fake numbers or invent improvements. If you have not entered the data, Supe will say so and ask you to add it.

### "What industries does it work for?"
Manufacturing, healthcare, logistics, food and beverage, financial services, construction, retail, hospitality, and any other industry with a repeatable process. The terminology adapts automatically to the industry you select during signup.

### "How is data secured?"
Every database query is protected by row-level security policies. You can only read and write your own data. Other users cannot see your projects. Authentication is handled by Supabase using industry-standard methods.

### "Can I export my data?"
Yes. Pro plan includes PDF report export and an experimental Excel export. Your raw data is also accessible via Supabase if you need to back it up.

### "What if I leave VeSiMy?"
Your data remains yours. PDF exports for any project you have are available before you cancel. We do not lock you in.

---

## Part 7: Troubleshooting

### "I cannot see my projects"
You may have been affected by a bug fixed in May 2026. Log out, log back in. If still not visible, contact max@vesimy.com directly.

### "The CI tool data disappeared after refresh"
This was a bug in early versions. Run the latest update of VeSiMy. If it still happens, check that you are logged into the correct account (not a duplicate).

### "The AI is giving generic advice"
Supe needs at least 3 steps with cycle time data to give specific recommendations. Add more data, then try again.

### "I cannot save my project"
Check that you are still logged in (session may have expired). Refresh the page. If the problem persists, your subscription may have lapsed.

### "The mobile view looks broken"
VeSiMy supports phones at 320px width and up. If something looks wrong, send a screenshot to max@vesimy.com.

---

## Part 8: Founder Quick-Reference (For Demos)

When you are demoing VeSiMy live to a prospect, this is the script. Five minutes.

**Minute 1: The Problem**
"Every business has processes. Most processes have waste. Most managers know this, but they cannot see it clearly. Whiteboards do not scale. Consultants are expensive. Software is either too simple to be useful, or too complex to learn. That is the gap VeSiMy fills."

**Minute 2: Open the Reference Project**
Show the VSM map. Point at the bottleneck. Say "This is the step costing them the most. The system identified it automatically from the cycle time data."

**Minute 3: Show a CI Tool**
Open the 5 Why. Walk through the chain. Say "Most people stop at 'we have always done it this way.' VeSiMy validates each answer and pushes you to go deeper. The root cause they found was that the PFMEA review process did not include material flow audits when takt time changed."

**Minute 4: Show Supe AI**
Click the Supe tab. Show the recommendation. Say "Supe reads the actual project data. It looks at the cycle times, the waste, the fishbone, and the 5 Why. It gives one specific next action and explains why. Not a generic AI chatbot."

**Minute 5: The Outcome**
"From this point, they have a complete improvement plan: identified bottleneck, root cause, specific actions, owner, due date, and a target. All of this used to take a week with a consultant. With VeSiMy it takes an afternoon."

**Then ask:** "What is the worst process in your business right now?"

That question always works. Every operations person has an answer ready.

---

## End

That is the complete tutorial. Bookmark this document. Refer back when prospects ask questions. Update it as VeSiMy evolves.

If you find any part of this is wrong or outdated, ping me and I will fix it.

Max Singh, Founder
VeSiMy
max@vesimy.com
