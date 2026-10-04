# Clayton Art House — Website & Atelier Booking Management System

A production-ready website, booking engine, and administrative management portal for **Clayton Art House**, an artistic atelier and creative venue located in **Kafr Abdo, Alexandria, Egypt**.

---

## 1. Overview & Brand Identity

Located in a restored heritage villa surrounded by jacaranda and ficus trees in historic Kafr Abdo, Clayton Art House hosts hands-on masterclasses in pottery hand-building and wheel throwing, botanical cyanotypes, fine oil and palette knife painting, stained glass craft, and sensory candle blending.

The digital platform is designed with an editorial, warm Mediterranean aesthetic—combining warm clay/terracotta (`#C26D53`), olive sage (`#606E5B`), warm linen (`#FBF9F5`), and rich charcoal slate (`#23211E`).

---

## 2. Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v3 with custom Clayton palette & typography tokens
- **Routing**: React Router v7 (`react-router-dom`)
- **Database & Auth**: Supabase (PostgreSQL 15+, Row Level Security, Supabase Auth, Storage)
- **Edge Computing**: Supabase Edge Functions (Deno runtime) for Paymob gateway intentions and Resend email dispatches
- **Icons**: Lucide React + custom SVG icons
- **Concurrency & Safety**: PostgreSQL row-level locks (`SELECT ... FOR UPDATE`) in `create_booking_atomic` stored procedure to strictly prevent overbooking and race conditions.

---

## 3. Database Architecture & Migrations

All SQL schema migrations and seed scripts are located in `supabase/`:

1. `supabase/migrations/20261004000000_clayton_schema.sql`
   - **Tables**: `profiles`, `admins`, `workshops`, `workshop_images`, `sessions`, `customers`, `bookings`, `payments`, `private_event_inquiries`, `gallery_images`, `site_settings`.
   - **UUID Primary Keys**: `gen_random_uuid()` across all entities.
   - **Row Level Security (RLS)**: Public read on published workshops, active sessions, gallery, and venue settings; public insert for bookings and inquiries; strict authenticated admin access for all modification and management operations.
2. `supabase/migrations/20261004000001_atomic_booking.sql`
   - Stored procedure `create_booking_atomic(p_session_id, p_attendees_count, ...)`:
     - Locks the session row with `FOR UPDATE`.
     - Validates real-time availability: `capacity - booked_seats >= attendees_count`.
     - Automatically updates session `booked_seats` and flags session as `full` when capacity is reached.
     - Upserts customer records and initializes payment tracking.
   - Stored procedure `cancel_booking_atomic(p_booking_id, ...)`:
     - Atomically releases reserved seats back to session capacity and updates status from `full` to `scheduled`.
3. `supabase/seed.sql`
   - Rich, curated Alexandria Kafr Abdo workshop catalog, upcoming sessions, customer profiles, sample bookings, and atelier portfolio photos.

---

## 4. Setup & Local Development

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm 9+

### Installation
```bash
git clone <repo_url>
cd clayton
npm install
```

### Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | Your Supabase Project URL | `https://xyz.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase Public Anonymous API Key | `eyJhbGciOi...` |
| `VITE_ADMIN_DEFAULT_EMAIL` | Default staff login email | `admin@claytonarthouse.com` |
| `VITE_PAYMENT_MODE` | Payment processing mode | `test` (sandbox) or `production` (Paymob) |
| `PAYMOB_API_KEY` | Paymob Egyptian Gateway Secret Key | *(Edge Function secret)* |
| `PAYMOB_INTEGRATION_ID` | Paymob Card Integration ID | *(Edge Function secret)* |
| `PAYMOB_HMAC_SECRET` | Paymob HMAC Webhook Secret | *(Edge Function secret)* |
| `RESEND_API_KEY` | Resend Transactional Email API Key | *(Edge Function secret)* |

> **Note on Zero-Config Offline/Demo Mode:**
> If `VITE_SUPABASE_URL` is omitted, the application automatically initializes a high-fidelity local persistent database pre-seeded with the Kafr Abdo dataset. All booking actions, seat decrements, admin workshop edits, and cancellations function smoothly and persist in browser storage.

### Running the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 5. Admin Portal Access

- **URL**: `http://localhost:5173/admin`
- **Default Email**: `admin@claytonarthouse.com`
- **Default Password**: `password123`

### Features Included:
- **Dashboard Overview**: KPI cards for Today's Bookings, Expected Attendees, Total Revenue in EGP, Scheduled Sessions, Pending Bookings, and Occupancy Rate %.
- **Bookings Management**: Real-time table with search, status filters, payment filters, customer contact view, atomic confirmation, seat-releasing cancellation, completion, and no-show tracking.
- **Workshop Management**: Full CRUD operations, pricing in EGP, duration, capacity, what's included tags, and publish/unpublish toggles.
- **Session Management**: Schedule calendar dates and time windows, set capacities, monitor live remaining seats, and manage instructors.
- **Customer CRM**: Aggregate guest records, total bookings count, cumulative atelier spend, and past booking history.
- **Private Event Inquiries**: Manage bespoke villa buyouts, birthdays, bridal showers, and corporate offsites with status workflows (`new`, `contacted`, `quoted`, `confirmed`, `archived`) and follow-up notes.
- **Gallery Management**: Add and delete portfolio images by category.
- **Venue Settings**: Update Kafr Abdo address, phone, email, visiting hours, and cancellation terms.

---

## 6. Payment Architecture (Paymob Egypt Integration)

The application includes an Egyptian payment gateway abstraction:
1. **Frontend Initiation**: `paymentService.initiatePayment(...)` requests transaction authorization.
2. **Server-Side Edge Function (`supabase/functions/paymob-checkout`)**: Authenticates with Paymob using `PAYMOB_API_KEY`, creates an order with merchant booking reference, and returns the secure checkout iframe URL.
3. **Webhook Synchronization (`supabase/functions/paymob-webhook`)**: Validates HMAC signature from Paymob and synchronizes the booking and payment records in PostgreSQL.
4. **Test Sandbox Mode**: When `VITE_PAYMENT_MODE=test`, interactive test authorization simulates real gateway latency and generates unique transaction codes.

---

## 7. Email Architecture (Resend Integration)

Transactional emails are prepared via `emailService` and `supabase/functions/send-email`:
- **Guest Confirmation**: Dispatches an email with booking reference, confirmation pass code, workshop details, start time, attendees count, and Kafr Abdo directions.
- **Cancellation Notice**: Informs guests if their reservation was cancelled.
- **Admin Alerts**: Notifies staff when a new private event inquiry is submitted.

---

## 8. Deployment Guide

### Deploying Frontend to Vercel / Netlify
1. Connect repository.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set environment variables from `.env.example`.

### Deploying Supabase Migrations & Edge Functions
```bash
# Push database schema and stored procedures
supabase db push

# Deploy edge functions
supabase functions deploy paymob-checkout
supabase functions deploy paymob-webhook
supabase functions deploy send-email
```

---

## 9. QA & Production Verification

- [x] Concurrency and overbooking protection verified via database locks.
- [x] Zero raw technical error messages exposed to guests.
- [x] Real-time remaining seats display across workshops and sessions.
- [x] Guest booking flow requires no mandatory account registration.
- [x] Fully responsive across mobile, tablet, and desktop viewports.
- [x] Production build passes cleanly with zero errors (`tsc -b && vite build`).
