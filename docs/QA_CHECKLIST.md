# VeSiMy — Manual QA Checklist
*Version: v4.0 | Use before every major release*

---

## 1. Authentication

- [ ] Sign up with new email → receives confirmation (if enabled) → lands on /onboarding or /dashboard
- [ ] Sign in with existing credentials → redirects to /dashboard
- [ ] Sign in with wrong password → shows clear error message
- [ ] Signed-in user visits /auth/login → redirects to /dashboard (no infinite loop)
- [ ] Sign out → redirects to homepage or /auth/login
- [ ] Protected route (/dashboard) without session → redirects to /auth/login with ?redirect param
- [ ] After login, ?redirect param sends user back to original destination
- [ ] Session persists across browser refreshes
- [ ] Session persists across tabs

---

## 2. Dashboard

- [ ] Projects list loads correctly
- [ ] Project health scores display with correct colours (green ≥70, amber ≥40, red <40)
- [ ] "New Project" button opens creation form
- [ ] Project creation with name + industry → project appears in list immediately
- [ ] Empty state: zero projects → shows onboarding guidance
- [ ] **Delete project**: trash icon visible on each card → confirm dialog → project removed → toast confirmation
- [ ] Delete project → page refresh → project is gone (not just UI state)
- [ ] Industry selector shows correct options
- [ ] Reference project seed loads correctly for user's industry
- [ ] Mobile: all buttons visible, no horizontal overflow, bottom nav not covering content

---

## 3. Project Workspace

- [ ] Opening a project loads all steps in correct order
- [ ] Step count, cycle times, and metrics display correctly
- [ ] Takt time calculation correct when demand/hours/shifts entered
- [ ] PCE (Process Cycle Efficiency) calculates and colour-codes correctly
- [ ] Bottleneck step highlighted correctly (highest cycle time vs takt)

### 3a. Step Management
- [ ] Add step → appears in list
- [ ] Edit step → all fields save correctly (name, cycle time, wait time, operators, dept, etc.)
- [ ] Delete step → removed from list and database
- [ ] Reorder steps via drag → order persists after refresh
- [ ] All numeric fields (cycle time, wait time, WIP, defect rate, uptime) save as numbers not strings

### 3b. CI Tools (test each)
For each tool, test: open → enter data → save → refresh → data still present

- [ ] Time Study (Stopwatch) — record observations, see avg/min/max
- [ ] Fishbone / Ishikawa — add causes in categories, save
- [ ] 5 Why — complete all 5 levels, see root cause summary
- [ ] Waste Identification — tag waste types, see summary
- [ ] Kaizen — create improvement actions
- [ ] Improvement Tool — enter current vs target metrics
- [ ] SMED — record setup activities, internal/external split

### 3c. VSM (Value Stream Map)
- [ ] Map renders all steps in correct order
- [ ] Step blocks show name, cycle time, wait time, WIP, operators
- [ ] Bottleneck step visually highlighted
- [ ] Process metrics panel shows lead time, total CT, takt, PCE
- [ ] Map looks readable at 1080p and above

### 3d. Branches / Sub-Processes
- [ ] Create branch → steps can be added
- [ ] Branch steps save correctly
- [ ] Branch steps do not pollute main flow metrics

### 3e. Simulation
- [ ] Loads with real project step data
- [ ] Scenario presets (demand spike, labor shortage, etc.) change metrics visibly
- [ ] Results explain what the numbers mean
- [ ] Premium gate: trial users see upgrade prompt

### 3f. Report
- [ ] Report generates from real step data + CI tool data
- [ ] Bottleneck identified correctly
- [ ] PCE and metrics match the builder tab
- [ ] Supe AI recommendations appear (for Pro users)
- [ ] PDF export produces clean, readable document
- [ ] PDF has no dark/unreadable backgrounds

### 3g. Supe AI Panel
- [ ] Opens correctly
- [ ] Analyzes actual steps (not generic advice)
- [ ] Identifies bottleneck, quality issues, SMED opportunities
- [ ] Shows which Lean principle applies
- [ ] Trial users see upgrade prompt
- [ ] Rate limit message appears after 20 requests/minute

### 3h. PDCA / Kaizen Plan / Kanban
- [ ] PDCA saves Plan, Do, Check, Act sections
- [ ] Kaizen Plan shows improvement actions
- [ ] Kanban board loads columns and cards

---

## 4. Settings Page

- [ ] Plan tier displays correctly (Trial / Pro / Lifetime / Enterprise)
- [ ] Project count vs limit accurate
- [ ] Upgrade button links to /pricing
- [ ] Manage Subscription button shows for paying users
- [ ] Profile info (name, email, industry) displays correctly
- [ ] Industry update saves and reflects in dashboard

---

## 5. Pricing and Subscription

- [ ] /pricing page loads cleanly
- [ ] Pro plan checkout → Stripe modal → successful payment → redirects to /dashboard?upgraded=true
- [ ] After payment: plan_tier = 'pro' in Supabase within 60 seconds
- [ ] After payment: premium features (Supe AI, PDF export, simulation) unlocked
- [ ] Trial expired user → sees clear upgrade prompt on locked features
- [ ] SPRING25 promo code (if active) works at checkout

---

## 6. Data Persistence (Critical)

Perform these tests after saving data in CI tools:

- [ ] Add stopwatch observations → save → hard refresh (Ctrl+Shift+R) → observations still present
- [ ] Add fishbone causes → save → refresh → causes still present
- [ ] Add 5 Why answers → save → refresh → answers still present
- [ ] Enter waste IDs → save → refresh → wastes still present
- [ ] Saving Tool A then Tool B does not erase Tool A data
- [ ] Project settings (name, description, industry) persist after refresh
- [ ] Step fields (cycle time, wait time, etc.) persist after refresh

---

## 7. Mobile Testing (iPhone Safari — real device preferred)

- [ ] Homepage loads and scrolls smoothly
- [ ] Sign up / sign in works
- [ ] Dashboard: project cards readable, delete icon accessible
- [ ] Project: tab bar visible, doesn't overlap content
- [ ] Step modal: all fields accessible, keyboard doesn't cover inputs
- [ ] CI tool modals: close button visible, scrollable
- [ ] Save buttons: not hidden behind bottom navigation
- [ ] VSM map: pinch-zoom works or horizontal scroll works

---

## 8. Security Spot Checks

- [ ] Visit /api/supe/analyze without auth → gets 401
- [ ] Visit /api/projects without auth → gets 401
- [ ] Try to access another user's project URL directly → gets 404 or 403
- [ ] Stripe webhook: test with invalid signature → gets 400
- [ ] Seed routes: test without auth → gets 401

---

## 9. Performance

- [ ] Dashboard loads under 2 seconds on good connection
- [ ] Project page loads under 3 seconds
- [ ] Adding a step responds under 500ms
- [ ] Saving tool data shows immediate UI feedback (toast or spinner)
- [ ] No visible layout shift (CLS) on dashboard load

---

## 10. Error States

- [ ] Network offline: adding step shows error toast (not silent failure)
- [ ] Supabase unavailable: report generates rule-based response (not crash)
- [ ] Empty project (no steps): VSM map shows helpful empty state
- [ ] All step data missing: Supe shows "Add step data to get analysis"
- [ ] PDF export with no data: graceful fallback message

---

## Sign-off Checklist

Before marking a release as production-ready:

- [ ] All critical items above pass
- [ ] Zero TypeScript errors in build (`npm run build` clean)
- [ ] No broken images or 404s in production
- [ ] Stripe webhooks confirmed active in Stripe dashboard
- [ ] Supabase RLS verified on all tables
- [ ] TASKS_FOR_OWNER.md SQL changes applied to production DB
- [ ] Environment variables all set in Vercel production
- [ ] Manual test on real iPhone Safari
- [ ] Greg Foertsch's feedback items resolved (delete bug ✓, simulation params — in progress)
