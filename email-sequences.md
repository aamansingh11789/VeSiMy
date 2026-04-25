# VeSiMy Tier 0 Email Sequences
## Section 23 — Post-Report Nurture Flow

All emails send from: **founder@vesimy.com**
Sender name: **Max Singh, VeSiMy**
Reply-to: founder@vesimy.com

Variables available in all emails:
- `{{first_name}}` — entered in Tier 0 flow Step 1
- `{{process_name}}` — process the user mapped
- `{{industry}}` — industry selected
- `{{pain_step}}` — the step flagged as the biggest pain point
- `{{report_url}}` — unique link to view the report online (generated on session create)

---

## Email 0 — Report Delivery (Day 0, send immediately)

**Subject:** Your lean report is here, {{first_name}}

---

Hi {{first_name}},

Here is the lean analysis for your **{{process_name}}** process.

[View Your Report]({{report_url}})

A few things worth knowing about what you just got:

This is not a generic summary. The analysis is generated specifically for your steps, your timings, and the pain you flagged in the {{industry}} context. It uses the same lean frameworks I have applied across 12+ years on manufacturing and operations floors, including time at Tesla.

What the report gives you:

- Where your process time is actually going (value-added vs. non-value-added breakdown)
- The specific waste type that is most likely driving your bottleneck
- A first concrete action you can take this week

That last part is the one most tools skip. They identify waste. They do not tell you what to do about it next.

---

**Want to go further?**

The free report shows you the top layer. A full VSM map shows you the whole picture: information flow, inventory, push vs. pull, takt time, lead time. That is where the real leverage is.

You can build that map free for 14 days. No card required.

[Start Free Trial](https://vesimy.com/signup)

Or if you want to talk through what the report found, reply to this email.

Max
Founder, VeSiMy
LSS Green Belt | 12+ years manufacturing operations | ex-Tesla

---

## Email 1 — Follow-up (Day 2, send if no account created)

**Subject:** One question about {{process_name}}, {{first_name}}

---

Hi {{first_name}},

You mapped your {{process_name}} process two days ago.

One question: did the report show you something you already knew, or did it surface something you had not named yet?

I ask because that is the split I see most often. Either the report confirms what you suspected (and you just needed something concrete to show your team), or it catches a waste type you were not looking at.

Both are useful. They just require different next steps.

---

**If it confirmed what you knew:**
The bottleneck is probably not a mystery. The harder problem is building a shared picture that your team can act on without five separate conversations. That is what the VSM canvas does.

**If it caught something new:**
That is worth digging into. The Tier 0 report shows the top waste type. A full map shows you how many other steps are feeding it.

Either way, the free trial gives you 14 days to build the full picture. No card needed.

[Start Free Trial](https://vesimy.com/signup)

Max

---

## Email 2 — Methodology angle (Day 4, send if no account created)

**Subject:** What PDCA looks like on a real process

---

Hi {{first_name}},

Most teams know the PDCA cycle. Fewer teams actually complete one.

The drop-off usually happens at Check. You make a change, things seem better, and then the team moves on before anyone has actually measured whether the change held.

VeSiMy builds the Check step into the map. When you mark a step as improved and log the updated time, the before/after comparison is automatic. Your PDCA cycle closes. The improvement is on record.

For a process like {{process_name}}, that means:

- You have a baseline (from your Tier 0 report)
- You have a target state to map in the trial
- You have a structured way to show the delta to whoever needs to see it

That is a complete improvement cycle. Not just a tool. A documented result.

[Build Your First VSM Map](https://vesimy.com/signup)

14 days free. No card required.

Max

P.S. If {{process_name}} involves any handoffs between departments, the collaboration feature in the trial lets you map those live with the other people in the loop. That is usually where the real waste is hiding.

---

## Email 3 — Final nudge (Day 7, send if no account created)

**Subject:** Closing the loop on {{process_name}}

---

Hi {{first_name}},

Quick note.

You mapped {{process_name}} a week ago. The report identified at least one place where your process is losing time. I am guessing you have thought about it since then, even if you have not acted on it yet.

That gap between knowing and acting is exactly what VeSiMy is built to close.

The free trial is still open. You can start building the full current-state map today and have something worth showing your team by end of week.

[Start Free Trial](https://vesimy.com/signup)

If the timing is not right, no problem. Your Tier 0 report is yours and the link stays live. Come back when you are ready.

And if you have questions about what the report found, reply here. I read every reply.

Max Singh
Founder, VeSiMy

---

## Sequence Logic

```
Day 0:  Email 0 — Report Delivery        (always sends, triggers immediately on API response)
Day 2:  Email 1 — Follow-up              (send IF tier0_sessions.account_created = false)
Day 4:  Email 2 — Methodology angle      (send IF tier0_sessions.account_created = false)
Day 7:  Email 3 — Final nudge            (send IF tier0_sessions.account_created = false)
```

If a user creates an account at any point, stop the sequence.

### Sender API — Schedule config

Use Sender's automation/trigger API to schedule Emails 1–3 at time of Email 0 delivery:

```json
{
  "trigger": "subscriber_added",
  "group": "tier0_nurture",
  "sequence": [
    { "email_id": "tier0_day0",  "delay_hours": 0   },
    { "email_id": "tier0_day2",  "delay_hours": 48  },
    { "email_id": "tier0_day4",  "delay_hours": 96  },
    { "email_id": "tier0_day7",  "delay_hours": 168 }
  ],
  "exit_condition": {
    "event": "account_created",
    "source": "vesimy_webhook"
  }
}
```

Stop condition: when user completes Supabase signup, call Sender API to remove subscriber from the `tier0_nurture` group.

### Supabase webhook to stop sequence

In `app/api/auth/callback/route.ts` (or post-signup hook), add:

```typescript
// Remove from Tier 0 nurture sequence when user creates account
await fetch('https://api.sender.net/v2/subscribers/groups', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${process.env.SENDER_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: user.email,
    groups: ['tier0_nurture'],
  }),
});

// Mark account_created in tier0_sessions
await supabase
  .from('tier0_sessions')
  .update({
    account_created: true,
    account_created_at: new Date().toISOString(),
  })
  .eq('email', user.email.toLowerCase().trim());
```

---

## Tone guidelines (applies to all 4 emails)

- Write like a practitioner, not a marketer
- Short paragraphs, plain sentences
- No exclamation points
- No em dashes
- No orange accents in email templates
- All CTAs link to vesimy.com with UTM params:
  - Email 0: `?utm_source=tier0&utm_medium=email&utm_campaign=report_delivery`
  - Email 1: `?utm_source=tier0&utm_medium=email&utm_campaign=day2_followup`
  - Email 2: `?utm_source=tier0&utm_medium=email&utm_campaign=day4_methodology`
  - Email 3: `?utm_source=tier0&utm_medium=email&utm_campaign=day7_nudge`
