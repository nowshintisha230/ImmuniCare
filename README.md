# ImmuniCare

ImmuniCare is a bilingual (Bangla / English) web app that helps parents in Bangladesh track their children's vaccinations. It builds a personal schedule from each child's date of birth, flags doses that are due or overdue, and keeps a record that can be downloaded as a PDF.

The schedule follows the Bangladesh government **EPI** programme (7 vaccines) and also covers 6 additional private vaccines.

> ImmuniCare gives general information, not medical advice. It is not an official vaccination certificate. Always follow the guidance of your vaccinator or doctor.

## Live Link: https://immuni-care.vercel.app/

## Features

- **Authentication:** email/password and Google sign-in (Firebase), with a secure server-side session cookie.
- **Bangla / English:** one-tap language switch across the whole site, including content and dates.
- **Home page:** hero, vaccine categories, schedule at a glance, why ImmuniCare, how it works, parent feedback, about.
- **Vaccine details:** a public page for each of the 13 vaccines (what it protects against, when, how it is given, side effects, when to see a doctor). No login needed.
- **Parent dashboard:**
  - Per-child overview: total vaccines, total doses, completed, due, upcoming, and progress.
  - Vaccine schedule per child with search and filters (status, government/private, vaccine).
  - Mark a dose as given (with date) or undo it.
  - Add, view and delete children.
  - Profile with each child's date of birth (weekday) and exact age.
  - My feedback.
- **Smart notifications:** computed from the date of birth, including children with no records. Overdue doses, doses due today and doses due within 3 days are flagged. Shown in a bell menu and on the dashboard.
- **Initial vaccine records:** at registration and when adding a child, the parent can enter vaccines already given (vaccine, dose, date).
- **Vaccination record PDF:** download any child's record at any time.
- **Parent feedback:** published on the landing page instantly.
- **Free vaccine assistant:** answers common vaccine questions from a built-in knowledge base, with emergency detection. It can optionally use Google Gemini's free tier.
- **Responsive design:** mobile bottom navigation on the dashboard, sidebar on desktop.

## Vaccines covered

| Type | Vaccines |
|---|---|
| Government EPI (7) | BCG, Pentavalent, OPV, IPV / fIPV, PCV, MR, TCV |
| Private / additional (6) | Rotavirus, Hepatitis A, Varicella, Influenza, MMR, HPV |

The dashboard tracks 13 vaccines and 27 doses per child (15 government and 12 private).
Private vaccine ages follow general WHO / IAP / CDC guidance, so they are marked optional and parents are told to ask a paediatrician. Rotavirus doses have an age window; once it passes, the dose is shown as "Window passed" and is not counted as due.

## Tech stack

### Core

| Technology | Version | Why it is used |
|---|---|---|
| Next.js (App Router, Turbopack) | 16.4 | Full-stack framework: pages, API routes and server rendering in one project. Cache Components and Partial Prefetching are enabled. |
| React | 19.3 | UI library. |
| TypeScript | 5 | Type safety across the frontend, API and shared logic. |
| Node.js | 22.x | Runtime (set in `engines`). |

### UI

| Technology | Why it is used |
|---|---|
| Tailwind CSS 4 | Utility-first styling, responsive layout and theme tokens. |
| shadcn/ui | Accessible, copy-in components (button, card, input, label, badge, tabs, sheet, skeleton, sonner, and others). |
| @base-ui/react | Headless primitives that the shadcn components are built on. |
| class-variance-authority, clsx, tailwind-merge | Component variants and conflict-free class merging (the `cn()` helper). |
| lucide-react | Icon set. |
| sonner | Toast notifications. |
| tw-animate-css | Animation utilities used by shadcn components. |
| next-themes | Theme support (dark/light) for the shadcn setup. |
| Google Fonts (Geist, Noto Sans Bengali) | Latin and Bangla typography via `next/font`. |

### Data and backend

| Technology | Why it is used |
|---|---|
| PostgreSQL | Primary relational database. |
| Prisma 6 | Type-safe ORM, schema and migrations. |
| Neon | Serverless Postgres for production. |
| Docker (Compose) | Local Postgres and Redis for development. |
| Redis (ioredis) | Client and connection helper are set up for future caching and rate limiting. Not used by any feature yet. |
| Zod | One validation schema shared by the browser forms and the API routes. |

### Authentication

| Technology | Why it is used |
|---|---|
| Firebase Authentication (client SDK) | Email/password and Google sign-in in the browser. |
| Firebase Admin SDK (pinned to v13) | Verifies ID tokens and creates secure, HTTP-only session cookies on the server. v14 pulls in a `jose` version that fails to load on Vercel (`ERR_REQUIRE_ESM`), so v13 is used. |

### Hosting and tooling

| Technology | Why it is used |
|---|---|
| Vercel | Hosting and deployments. |
| ESLint 9 + eslint-config-next | Linting. |
| Google Gemini API (optional) | Free-tier AI for the assistant. The assistant works without it. |

## How it works

- **Dose schedule:** `lib/vaccination/doses.ts` defines every dose and its offset from the date of birth (weeks, months or years).
- **Status calculation:** `lib/vaccination/status.ts` turns a date of birth plus the given-dose records into `completed`, `due`, `upcoming` or `missed`. Dates use Bangladesh time (UTC+6).
- **Dashboard data:** `lib/dashboard/data.ts` builds one JSON payload (children, stats, notifications, feedback). The dashboard and the notification bell both read it from the API.
- **Session flow:** the browser signs in with Firebase, sends the ID token to `/api/auth/session`, and the server stores a session cookie. Server code reads the cookie with `getCurrentUser()`.
- **Shared validation:** `lib/validations/*` and `lib/vaccination/records.ts` are used by both the forms and the API routes, so the same rules apply on both sides.
- **i18n:** a lightweight custom system. UI strings live in `lib/i18n/dictionary.ts`. Page content is stored as `{ en, bn }` objects in `lib/content/*` and read with `l()` from the language provider.
- **Vaccine record PDF:** a print-optimised report page uses the browser's "Save as PDF". This keeps Bangla text correct, which client-side PDF libraries often break.
- **Assistant:** an emergency keyword check runs first and always returns a fixed safe answer. After that it uses Gemini if a key is set, otherwise the built-in keyword answers.
- **Cache Components:** the dashboard and report pages load their data from the API in client components, which avoids prerender conflicts with cookies and time-based values.

## Deployment

- **Hosting:** Vercel. The build runs database migrations and then the Next.js build.
- **Database:** Neon Postgres, connected through the Vercel integration.
- **Auth:** the production domain is added to Firebase **Authorized domains**.
- **Node:** 22.x.

## Known limitations

- Influenza is tracked for the first two doses only. Yearly boosters are not tracked.
- Reminders are in-app only. There are no email or SMS reminders yet.
- Time of birth is not stored. Only the date, weekday and age are shown.
- Redis is configured but not used by any feature yet.
- Private vaccine schedules are general guidance and may differ from your doctor's advice.

## Disclaimer

Vaccine information is for general awareness only. Dates and doses should be confirmed with your nearest EPI centre, vaccinator or paediatrician.
