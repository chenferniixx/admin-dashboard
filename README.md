# Admin Dashboard

Next.js 14+ Admin Dashboard with authentication, Users & Products CRUD, and dynamic charts. Built with TypeScript, Tailwind CSS, shadcn/ui, TanStack React Query, Zustand, and NextAuth.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI:** shadcn/ui, Lucide icons, ECharts
- **Data:** TanStack React Query, REST API (App Router API routes)
- **Auth:** NextAuth (Credentials)
- **State:** Zustand (sidebar, toast)

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment**

   Copy `.env.example` to `.env.local` and set:

   - `NEXTAUTH_URL` — e.g. `http://localhost:3000`
   - `NEXTAUTH_SECRET` — random string (e.g. `openssl rand -base64 32`)

3. **Run dev server**

   ```bash
   npm run dev
   ```

4. **Login (demo)**

   - Admin: `admin@example.com` / `admin123`
   - Editor: `editor@example.com` / `editor123`
   - Viewer: `viewer@example.com` / `viewer123`

## Project Structure (high level)

- `app/` — Routes, pages, API routes
- `components/` — Reusable UI (charts, forms, layout, table, ui)
- `lib/` — API client, auth, db, nav config
- `store/` — Zustand stores
- `types/` — Shared TypeScript types

See [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) for detailed architecture and separation of concerns.

## Scripts

- `npm run dev` — Development server
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — Run ESLint
