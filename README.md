# WorkTracker ⏱️

**WorkTracker** is a full-stack time-tracking and workforce analytics platform built for teams who need clear, honest visibility into how work actually happens — without invasive or heavy-handed monitoring.

It combines simple daily time tracking for employees with rich, security-conscious activity analytics for administrators — all wrapped in a clean, fully bilingual (English/Arabic, RTL-aware) interface with dark and light themes.

---

## ✨ Features

### 🔐 Authentication & Access Control
- Secure email/password login with JWT-based session tokens
- Role-based access control — distinct **Admin** and **User** experiences
- Automatic session expiry handling with clear, translated feedback
- Global HTTP error interceptor for consistent error handling

### ⏱️ Time Tracking
- Real-time work session timer (start/stop tracking)
- Daily, weekly, and monthly productivity reports per user
- Configurable target working hours and working days per user

### 🛡️ Admin Activity & Security Monitoring
For every login, admins get a full picture of account activity:
- Login and logout timestamps
- IP address of the request
- Precise geolocation — captured via browser GPS (with explicit user permission) and reverse-geocoded into a real street address, city, and country
- Device type (mobile vs. desktop) and browser/OS detection
- Interactive map view (Leaflet + OpenStreetMap) showing exactly where each login occurred
- Searchable, paginated activity log table

> Location is only ever shown when a user has explicitly granted permission. If access is denied, the system transparently shows "location not shared" rather than falling back to an inaccurate guess.

### 👥 User Management
- Create, edit, and activate/deactivate user accounts
- Confirmation safeguards on destructive actions

### 🎨 Interface & Experience
- Dark/light theme toggle, built with reactive Angular Signals
- Complete English/Arabic localization with automatic RTL/LTR layout switching
- Responsive sidebar navigation
- Reusable component library (data tables, badges, paginators, loading states)

---

## 🛠️ Tech Stack

**Frontend**
- [Angular 20](https://angular.dev) — standalone components, Signals-based reactivity
- [PrimeNG](https://primeng.org) — UI component library
- [`@ngx-translate`](https://ngx-translate.org) — internationalization
- [Leaflet](https://leafletjs.com) + OpenStreetMap — interactive location mapping

**Backend**
- Node.js + Express
- [Drizzle ORM](https://orm.drizzle.team)
- PostgreSQL (via [Supabase](https://supabase.com))
- JWT authentication
- OpenStreetMap Nominatim — reverse geocoding

**Infrastructure**
- pnpm monorepo
- Backend deployed on [Railway](https://railway.app)
- Frontend deployed on [Vercel](https://vercel.com)

