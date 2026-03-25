# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Urbantrends Task-flow** — full-stack task management app with a Django REST API backend and a React/Vite frontend.

## Backend (Django)

**Location:** `backend/`
**Django project:** `tasks_manager/` (settings, urls, wsgi, celery)
**Apps:** `accounts` (auth), `tasks_management` (task CRUD + Celery tasks)
**Virtualenv:** `backend/virtual/`

### Commands

```bash
# Activate virtualenv
source backend/virtual/bin/activate

# Run dev server
cd backend && python manage.py runserver

# Migrations
python manage.py makemigrations
python manage.py migrate

# Run all tests for an app
python manage.py test accounts
python manage.py test tasks_management

# Run a single test method
python manage.py test accounts.tests.MyTestClass.test_method

# Celery worker
celery -A tasks_manager worker --loglevel=info

# Celery beat scheduler (due date reminders)
celery -A tasks_manager beat --loglevel=info
```

### Environment

`tasks.env` is the checked-in template — copy it to `.env` in the backend directory. Required vars:
- `DATABASE_URL` — PostgreSQL connection string
- `DJANGO_SECRET_KEY`
- `DJANGO_ALLOWED_HOSTS`
- `DJANGO_EMAIL_HOST`, `DJANGO_EMAIL_HOST_USER`, `DJANGO_HOST_PASSWORD` — SMTP (port 465 SSL)
- `CELERY_BROKER_URL` — Redis URL
- `TIME_ZONE`
- `DEBUG`

`DJANGO_HOST_PASSWORD` is required at startup — settings.py raises `ValueError` if unset.

### Architecture

- **Auth:** JWT via `djangorestframework-simplejwt`. Access: 120 min, refresh: 1 day. Login at `POST /auth/login/`, refresh at `POST /auth/token/refresh/`.
- **`accounts` app:** FBVs for register (`POST /auth/create/`), login (`POST /auth/login/`), list users (`GET /auth/get-users/`). Uses Django's built-in `User` model.
- **`tasks_management` app:** `TasksViewSet` (ModelViewSet) scoped to `request.user`. Routes at `/task-flow/tasks/`. `DueDateRemindersView` at `/task-flow/due-date-reminders/` triggers the Celery task manually. Task fields: title, description, priority (low/medium/high), due_date, is_completed, due_reminder_sent.
- **Celery:** `send_due_date_reminders` shared task in `tasks_management/tasks.py` — queries tasks due within 24h (not completed, reminder not yet sent) and emails owners. Retries up to 3× on failure. `tasks_management/tasks/` is an empty directory (unused).
- **Email:** `accounts/utils/emails.py` — `send_email()` helper used everywhere. Triggered on user registration, task creation, and due-date reminder.
- **Rate throttling:** anon 10/min, authenticated 100/min (configured in `DEFAULT_THROTTLE_RATES`).
- **CORS:** allowed origins include `localhost:5173`, `urbantrends.dev`, `te.urbantrends.dev`, `tasks.urbantrends.dev`.

### Deployment

Docker Compose (`docker-compose.yml`) runs `db` (Postgres 16) and `backend` (Gunicorn on port 8001) only. Celery worker and beat must be started separately. Redis is an external dependency not in the compose file.

---

## Frontend (React)

**Location:** `frontend/task-manager-app/`
**Stack:** React 19, Vite, Tailwind CSS v4, React Router v7, React Hook Form + Zod, Radix UI (shadcn-style), Axios, Sonner (toasts), Framer Motion

### Commands

```bash
cd frontend/task-manager-app

npm install
npm run dev        # dev server at http://localhost:5173
npm run build
npm run lint
npm run preview
```

### Architecture

- **Provider hierarchy** (`main.jsx`): `BrowserRouter > ThemeProvider > AuthProvider > TaskProvider > App`. `App` only contains `Routes` and `Toaster`.
- **Path alias:** `@/` maps to `src/` (configured in `vite.config.js`).
- **API client** (`src/lib/apis.js`): Axios instance with base URL `https://te.urbantrends.dev/`. Interceptors auto-attach `Bearer` token and handle token refresh on **403** responses (not 401 — this is intentional). On failed refresh, clears `localStorage` and shows a toast.
- **AuthContext** (`src/components/auth-context.jsx`): Persists `user`, `accessToken`, `refreshToken` to `localStorage`. Syncs across tabs via the `storage` event.
- **TaskContext** (`src/components/task-context.jsx`): Fetches and caches tasks from `GET task-flow/tasks/`. `addTask`/`updateTask`/`deleteTask` perform optimistic local updates without re-fetching.
- **Routing:** Public: `/`, `/sign`, `/login`. Protected (wrapped in `PrivateRoute`): `/dashboard`, `/timer`.
- **Form validation:** `react-hook-form` + Zod schemas in `src/lib/task-schema.jsx`.
- **UI components:** shadcn-style components in `src/components/ui/`.
- **Pages:** `Dashboard` (task list + management), `CoffeeFocusTimer` (Pomodoro timer), `Home` (landing), `Login`, `Sign`.
