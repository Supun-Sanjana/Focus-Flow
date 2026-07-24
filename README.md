# Focus Flow

A minimal, keyboard-first personal task manager built with TanStack Start, React, and Supabase. Designed for a single user — no bloat, no clutter, just focused work.

![Focus Flow](https://img.shields.io/badge/stack-TanStack%20Start-7C3AED?style=flat-square) ![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react) ![Supabase](https://img.shields.io/badge/Supabase-auth%20%2B%20db-3ECF8E?style=flat-square&logo=supabase) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)

---

## Features

- **Today View** — tasks due today and in-progress work, grouped by project
- **Inbox** — unsorted tasks without a due date, ready to triage
- **Weekly Planner** — drag tasks into day columns across a Mon–Sun grid
- **Projects** — color-coded projects with per-project task lists
- **Habit Tracker** — daily habits with streak counters
- **Task Detail Panel** — slide-over with subtasks, priority, tags, recurrence, and reminders
- **Quick Add** — press `N` anywhere to open a command-palette style task creator
- **Browser Notifications** — reminder engine that fires lead-time, due-today, and overdue alerts
- **Auth** — Supabase email/password auth with per-user data isolation via RLS
- **Responsive** — desktop sidebar + mobile bottom nav

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) (SSR, file-based routing) |
| UI | React 19 + Tailwind CSS v4 + shadcn/ui |
| State | Zustand (UI state) + TanStack Query (server state) |
| Database | Supabase (PostgreSQL + Auth + RLS) |
| Drag & Drop | dnd-kit |
| Forms | React Hook Form + Zod |
| Notifications | Browser Notification API + Sonner toasts |
| Build | Vite 8 + Rolldown |

---

## Project Structure

```
src/
├── components/
│   ├── NitificationBell.tsx   # Notification bell + dropdown
│   ├── PageHeader.tsx         # Reusable page title + count
│   ├── QuickAdd.tsx           # N-key quick task modal
│   ├── Sidebar.tsx            # Desktop sidebar + mobile nav
│   ├── TaskDetail.tsx         # Slide-over task editor
│   ├── TaskList.tsx           # Task row list with checkbox
│   └── ui/                    # shadcn/ui primitives
├── integrations/
│   └── supabase/
│       ├── client.ts          # Supabase client (env-aware)
│       └── types.ts           # Auto-generated DB types
├── lib/
│   ├── api.ts                 # All Supabase CRUD functions
│   ├── notifications.ts       # Reminder engine + browser push
│   ├── queries.ts             # TanStack Query query objects
│   ├── store.ts               # Zustand UI store
│   └── utils.ts               # cn() helper
├── routes/
│   ├── __root.tsx             # HTML shell + QueryClientProvider
│   ├── auth.tsx               # Sign in / sign up page
│   └── _authenticated/
│       ├── route.tsx          # Auth guard + app layout
│       ├── index.tsx          # Today view
│       ├── inbox.tsx          # Inbox
│       ├── weekly.tsx         # Weekly planner
│       ├── habits.tsx         # Habit tracker
│       ├── projects.index.tsx # Projects list
│       └── projects.$id.tsx   # Single project view
├── main.tsx                   # Client entry (StartClient)
├── router.tsx                 # Router + QueryClient setup
├── start.ts                   # Server entry (TanStack Start)
└── server.ts                  # Nitro server wrapper
supabase/
└── migrations/
    ├── 20260723064458_...sql  # Tables + seed projects
    ├── 20260724063347_...sql  # user_id columns + RLS policies
    └── 20260724070047_...sql  # remind_lead_minutes column
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project (free tier is fine)

### 1. Clone and install

```bash
git clone https://github.com/your-username/focus-flow.git
cd focus-flow
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in your values from **Supabase Dashboard → Project Settings → API**:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-public-key
```

### 3. Run database migrations

Using the Supabase CLI:

```bash
npm install -g supabase
supabase login
supabase link --project-ref your-project-ref
supabase db push
```

Or paste each file in `supabase/migrations/` into the **SQL Editor** in the Supabase dashboard, in chronological order.

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), sign up, and you're in.

---

## Database Schema

```
projects        — id, name, color, icon, user_id, created_at
tasks           — id, project_id, title, description, status, priority,
                  due_date, tags[], is_recurring, recur_pattern,
                  remind_lead_minutes, order_index, user_id, created_at, updated_at
subtasks        — id, task_id, title, is_done, order_index
habits          — id, title, user_id, created_at
habit_logs      — id, habit_id, logged_date
```

All tables use Row Level Security — each user only sees their own data.

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `N` | Open quick-add modal |
| `Esc` | Close any open panel or modal |

---

## Available Scripts

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run preview    # Preview production build locally
npm run lint       # ESLint
npm run format     # Prettier
```

---

## Deployment

The project uses TanStack Start with Nitro. It can be deployed to any platform Nitro supports.

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Cloudflare Pages** — set `nitro: { preset: "cloudflare" }` in `vite.config.ts`.

Set your `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` as environment variables in your hosting platform.

---

## Roadmap

- [ ] Pomodoro timer
- [ ] Google Calendar sync
- [ ] PWA / offline support
- [ ] Kanban board toggle
- [ ] Weekly review prompt
- [ ] Commute mode (morning brief view)

---

## License

MIT
