# ImmuniCare

ImmuniCare is a bilingual (Bangla / English) web app that helps parents in Bangladesh track their children's vaccinations. It builds a personal schedule from each child's date of birth, flags doses that are due or overdue, emails reminders, and keeps a record that can be downloaded as a PDF.

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
- **Email reminders:** parents get an email even when they are not on the site (see [Email reminders](#email-reminders)). Works at no cost, with a profile toggle, a test email button and one-click unsubscribe.
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

## Email reminders

Parents are reminded by email, so they do not need to open the site. The whole feature runs on free services.

### What is sent

| Reminder | When | How often |
|---|---|---|
| Upcoming | A dose is due in 1 to 3 days | Once per dose |
| Due today | A dose is due today | Once per dose |
| Overdue | One or more doses are past their due date | Once a week per child |

- Each parent gets **one email per run**, covering all their children.
- Every email is **bilingual** (Bangla first, then English) and has an **unsubscribe link**.
- Only **government EPI** doses are emailed by default. Private (optional) vaccines are excluded. This can be changed with the `INCLUDE_PRIVATE` flag in `lib/reminders/run.ts`.
- Parents can turn reminders on or off in **Dashboard > Profile**, and can send themselves **one test email per day**.
- Accounts without a real email address are skipped.

### How it works

1. **Vercel Cron** calls `GET /api/cron/vaccine-reminders` once a day. The route only accepts requests that carry the `CRON_SECRET` bearer token.
2. `lib/reminders/run.ts` loads every opted-in parent with children and works out each dose status with the same logic the dashboard uses.
3. Before sending, each reminder is **claimed** in the `ReminderLog` table (unique per child, kind and key). A duplicate cron delivery therefore cannot send the same reminder twice. If sending fails, the claim is released so the next run retries.
4. Mail goes out through **Nodemailer over SMTP**. Any SMTP provider works, for example Gmail or Brevo.
5. Each run stops at **60 emails** or about **8 seconds**. Remaining parents are handled on the next run, and the 3-day window means no reminder is lost.

### Free-tier limits

| Service | Limit |
|---|---|
| Vercel Hobby cron | Once per day, UTC only, and it can fire anywhere within the scheduled hour. Production deployments only. |
| Gmail SMTP | About 500 emails per day with an App Password. |
| Brevo SMTP (alternative) | 300 emails per day. |

The schedule `0 2 * * *` (UTC) means the email arrives between **8:00 and 8:59 AM Bangladesh time**.

### Environment variables

Names only. Never commit real values.

| Variable | Purpose |
|---|---|
| `SMTP_HOST`, `SMTP_PORT` | SMTP server (for Gmail: `smtp.gmail.com`, `465`). |
| `SMTP_USER`, `SMTP_PASS` | SMTP login. For Gmail, `SMTP_PASS` is an App Password (needs 2-Step Verification). |
| `MAIL_FROM` | Sender shown to parents, for example `ImmuniCare <you@gmail.com>`. |
| `APP_URL` | Public site URL, used in email links and unsubscribe links. |
| `CRON_SECRET` | Secret that protects the cron route. Also signs unsubscribe links unless `UNSUBSCRIBE_SECRET` is set. |
| `UNSUBSCRIBE_SECRET` | Optional separate secret for unsubscribe links. |

### Data

| Model / field | Purpose |
|---|---|
| `User.emailReminders` | Opt-in flag. Defaults to `true`. |
| `ReminderLog` | Remembers what has already been emailed, so nothing is sent twice. |

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

### Email and scheduling

| Technology | Why it is used |
|---|---|
| Nodemailer | Sends reminder emails over SMTP. Provider independent. |
| Gmail SMTP (free) | Free sending with an App Password. Brevo or any other SMTP provider also works. |
| Vercel Cron | Free daily trigger for the reminder job. |
| Node `crypto` | Signs unsubscribe links (HMAC) and checks the cron secret in constant time. |

### Authentication

| Technology | Why it is used |
|---|---|
| Firebase Authentication (client SDK) | Email/password and Google sign-in in the browser. |
| Firebase Admin SDK (pinned to v13) | Verifies ID tokens and creates secure, HTTP-only session cookies on the server. v14 pulls in a `jose` version that fails to load on Vercel (`ERR_REQUIRE_ESM`), so v13 is used. |

### Hosting and tooling

| Technology | Why it is used |
|---|---|
| Vercel | Hosting, deployments and cron. |
| ESLint 9 + eslint-config-next | Linting. |
| Google Gemini API (optional) | Free-tier AI for the assistant. The assistant works without it. |

## How it works

- **Dose schedule:** `lib/vaccination/doses.ts` defines every dose and its offset from the date of birth (weeks, months or years).
- **Status calculation:** `lib/vaccination/status.ts` turns a date of birth plus the given-dose records into `completed`, `due`, `upcoming` or `missed`. Dates use Bangladesh time (UTC+6).
- **Dashboard data:** `lib/dashboard/data.ts` builds one JSON payload (children, stats, notifications, feedback). The dashboard and the notification bell both read it from the API.
- **Email reminders:** `lib/reminders/run.ts` reuses the same status logic, so emails always match what the dashboard shows.
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
- **Cron:** the schedule lives in `vercel.json` and runs on production deployments only.
- **Email:** SMTP variables and `CRON_SECRET` are set in Vercel environment variables.
- **Node:** 22.x.

## Known limitations

- Influenza is tracked for the first two doses only. Yearly boosters are not tracked.
- Email reminders go out once a day, around 8 AM Bangladesh time, and the exact minute is not guaranteed on the Vercel Hobby plan. A parent who registers gets in-app notifications at once, and the first email at the next daily run.
- Email reminders cover government EPI doses only by default. There are no SMS reminders.
- Gmail's free daily limit (about 500 emails) caps the number of parents who can be reminded per day. Emails may land in spam at first.
- Time of birth is not stored. Only the date, weekday and age are shown.
- Redis is configured but not used by any feature yet.
- Private vaccine schedules are general guidance and may differ from your doctor's advice.

## Disclaimer

Vaccine information is for general awareness only. Dates and doses should be confirmed with your nearest EPI centre, vaccinator or paediatrician.
