# VeSiMy Session 19 — Footer + dark-section visibility fixes

Triggered by a footer screenshot: links nearly invisible against the dark
background image showing through.

## Root cause
Several homepage dark/transparent sections let the busy fixed background image
bleed through behind text, with thin/low-opacity backings and light-gray text,
destroying contrast.

## Fixes (homepage)
- Footer: backing opacity .55 -> .92 (so the bg image stops washing out text);
  links #A9B5C2 -> #D5DCE5; tagline and copyright brightened.
- Tool cards: backing rgba(255,255,255,.04) -> rgba(7,26,47,.55) so each card is
  a defined dark surface; descriptions #A9B5C2 -> #C6D0DB.
- Hero subtitle + final-CTA subtitle: #A9B5C2 -> #CDD6E0 with a subtle text
  shadow for legibility over the busy image.
- Pricing panel subtext (on the LIGHT frosted panel) #73879C -> slate-700, since
  the lighter gray was borderline on white.

## Checked, found acceptable (not changed)
- In-app sidebar (dark navy): nav items #7AAECF / active gold #D9C8A9 read fine.
- Dashboard / app light theme: dark text on white (muted #64748B) passes.

## Status
TypeScript: 0 errors.

## Note
"All over the app" was addressed for the confirmed homepage dark sections. If
specific in-app screens still show low-contrast text, a screenshot of each will
let me fix those precisely rather than guessing (a blanket color change risks
making light-panel text worse).

## Deploy
git checkout develop
# extract zip over working tree
git add -A
git commit -m "fix: footer + dark-section text contrast (visibility)"
git push origin develop
