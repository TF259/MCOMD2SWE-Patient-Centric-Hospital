# CarePoint HMS

> **Module:** MCOMD2SWE — Software Engineering  
> A patient-centric Hospital Management System built with SvelteKit and TypeScript.

---

## 🚀 Project Overview

CarePoint HMS is a self-service patient portal that gives patients secure access to their medical records and lets them book appointments with doctors in real time. Authentication is based on NHS numbers rather than email addresses, and the UI follows GOV.UK design principles.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [SvelteKit](https://kit.svelte.dev/) + TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Auth / Hashing | [bcryptjs](https://github.com/dcodeIO/bcrypt.js) |
| Database | [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) (in-memory mock data for dev) |
| Unit Tests | [Vitest](https://vitest.dev/) |
| E2E Tests | [Playwright](https://playwright.dev/) |
| Deployment | cPanel (Node adapter) |

---

## ✨ Features

- **Secure Patient Portal** — NHS-number + password login with bcrypt hashing.
- **Medical Records** — Private, per-patient access to clinical notes.
- **Appointment Booking** — Real-time doctor availability calendar with slot selection.
- **Doctor Portal** — View and manage assigned patient appointments.
- **Admin Panel** — Administrative oversight of system data.
- **Audit Log** — Tamper-evident record of system events.
- **Privacy Page** — Compliant patient data transparency statement.

---

## 📁 Project Structure

```
src/
├── lib/
│   ├── server/
│   │   ├── auth.ts          # NHS-number authentication logic
│   │   ├── database.ts      # SQLite database connection
│   │   ├── db-helpers.ts    # Query helpers
│   │   ├── db-seed.ts       # Database seeding
│   │   ├── mockData.ts      # In-memory mock patients, doctors & appointments
│   │   ├── validation.ts    # Input validation helpers
│   │   ├── auth.test.ts     # Unit tests UT01–UT10
│   │   └── validation.test.ts
│   ├── components/          # Shared Svelte components
│   └── types.ts             # Shared TypeScript types
└── routes/
    ├── +page.svelte         # Login page (/)
    ├── dashboard/           # Patient dashboard (/dashboard)
    ├── booking/             # Appointment booking (/booking)
    ├── doctor/              # Doctor portal (/doctor)
    ├── admin/               # Admin panel (/admin)
    ├── audit-log/           # Audit log (/audit-log)
    ├── profile/             # Patient profile (/profile)
    └── privacy/             # Privacy policy (/privacy)
docs/
├── Diagrams/                # UML, IA, LDM diagrams + wireframes
├── Sprint 1.docx            # Sprint 1 planning & design artefacts
└── Sprint 2.docx            # Sprint 2 build & testing artefacts
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm v9 or later

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/TF259/MCOMD2SWE-Patient-Centric-Hospital.git
cd MCOMD2SWE-Patient-Centric-Hospital

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview   # preview the production build locally
```

---

## 🔑 Demo Credentials

The development build uses in-memory mock data. Use either account below to log in:

| Patient | NHS Number | Password |
|---|---|---|
| Arthur Retiree | `1234567890` | `arthur123` |
| Sarah Professional | `0987654321` | `sarah123` |

---

## 🧪 Testing

```bash
# Run all unit tests (single pass)
npm run test:unit -- --run

# Run unit tests in watch mode
npm run test:unit

# Run end-to-end tests (requires a running dev server)
npm run test:e2e
```

Unit tests cover authentication and input validation (UT01–UT10) and live in `src/lib/server/auth.test.ts` and `src/lib/server/validation.test.ts`.

---

## 🔍 Code Quality

```bash
# Type-check Svelte files
npm run check

# Lint (Prettier + ESLint)
npm run lint

# Auto-format
npm run format
```

---

## 📈 Agile Methodology

This project follows the **Scrum** framework across two sprints:

| Sprint | Focus |
|---|---|
| Sprint 1 | Requirement engineering, User Stories, UML architecture & wireframes |
| Sprint 2 | Full portal development, appointment booking, and rigorous unit testing |

Sprint artefacts, UML diagrams, and design documents are stored in the `docs/` directory.

---

## 📄 Licence

Distributed under the terms of the [LICENSE](LICENSE) file included in this repository.
