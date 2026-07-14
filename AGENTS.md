# Agent Instructions

Real Match is a two-sided, human-led matchmaking service. This repository is
truth-first: a beautiful lie is a failed product.

## Hard lines — never cross these

- Never guarantee or imply a match, relationship, marriage, sex, or any
  romantic outcome.
- Never sell access to members. No one may pay to make another member view,
  reply to, or meet them. No escalating pay-per-action funnels. No
  outcome-based or "success" fees.
- Never present any member, or one gender, as inventory, a catalogue, or a
  reward to be unlocked.
- Never invent people: no fictional founders, staff, testimonials, member
  counts, satisfaction rates, or credentials. Demonstration profiles must be
  visibly labelled fictional.
- Never claim a capability (verification, encryption, review turnaround,
  active members) that is not implemented and operationally true.

## Truth mechanism

- `lib/config/site.ts` is the single source of truth for status, fees, and
  capability flags. UI must derive claims from it — never from copy alone.
- `NEXT_PUBLIC_SERVICE_STATUS` (`preview`/`pilot`/`live`) gates behaviour.
  It may only advance when the matching gates in `PRODUCTION_READINESS.md`
  are met.
- Long-form copy lives in `content/` so it can be audited in one place.

## Engineering rules

- Zero new runtime dependencies without a working build environment to
  regenerate `package-lock.json` and verify the build. CI uses `npm ci`.
- CI must never write to the repository (no auto-committed lockfiles).
- Server-side only for anything sensitive; the Supabase service-role key is
  server-only and never `NEXT_PUBLIC_`.
- Keep components in `components/{layout,marketing,forms,profiles,safety,admin}`;
  copy in `content/`; config in `lib/config`.
- Accessibility is a requirement, not polish: labels, error announcements,
  focus management, keyboard support, reduced-motion.
- Run `npm run lint`, `npm run typecheck`, and `npm run build` when available;
  otherwise state plainly that they were not run.
- Do not commit secrets. `.env.example` stays placeholder-only.

## Copy standard

Calm, warm, precise, human. Short paragraphs. No robotic luxury jargon, no
status/wealth signalling, no nationality fetishization, no legal panic, no
absolute privacy/safety promises. Approved framing: private matchmaking,
curated introductions, human review, mutual approval, controlled profile
visibility.
