-- Clayton Art House Database Schema
-- Location: Kafr Abdo, Alexandria, Egypt
-- PostgreSQL with Row Level Security (RLS) & UUIDs

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles (linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Admins Whitelist Table
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Workshops
CREATE TABLE IF NOT EXISTS public.workshops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'Ceramics & Pottery',
    'Painting & Drawing',
    'Botanical & Flora',
    'Glass & Mosaic',
    'Textile & Fiber',
    'Culinary & Sensory',
    'Private & Seasonal'
  )),
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  price_egp NUMERIC(10,2) NOT NULL CHECK (price_egp >= 0),
  duration_minutes INTEGER NOT NULL DEFAULT 120,
  capacity_per_session INTEGER NOT NULL DEFAULT 12,
  difficulty TEXT DEFAULT 'All Levels',
  what_is_included TEXT[] DEFAULT '{}',
  requirements TEXT,
  cover_image TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Workshop Images
CREATE TABLE IF NOT EXISTS public.workshop_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workshop_id UUID NOT NULL REFERENCES public.workshops(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Sessions
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workshop_id UUID NOT NULL REFERENCES public.workshops(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  booked_seats INTEGER NOT NULL DEFAULT 0 CHECK (booked_seats >= 0),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'full', 'cancelled', 'completed')),
  instructor_name TEXT,
  room_or_space TEXT DEFAULT 'Main Studio',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Customers
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  notes TEXT,
  total_bookings INTEGER NOT NULL DEFAULT 0,
  total_spent_egp NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);

-- 7. Bookings
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_number TEXT UNIQUE NOT NULL,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE RESTRICT,
  workshop_id UUID NOT NULL REFERENCES public.workshops(id) ON DELETE RESTRICT,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  attendees_count INTEGER NOT NULL CHECK (attendees_count > 0),
  total_amount_egp NUMERIC(10,2) NOT NULL CHECK (total_amount_egp >= 0),
  booking_status TEXT NOT NULL DEFAULT 'confirmed' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'refunded', 'failed')),
  special_requests TEXT,
  confirmation_code TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bookings_session ON public.bookings(session_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_number ON public.bookings(booking_number);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(booking_status);

-- 8. Payments
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  amount_egp NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EGP',
  provider TEXT NOT NULL DEFAULT 'mock' CHECK (provider IN ('paymob', 'fawry', 'instapay', 'cash', 'mock')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'refunded', 'failed')),
  transaction_ref TEXT,
  payment_method TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Private Event Inquiries
CREATE TABLE IF NOT EXISTS public.private_event_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL CHECK (event_type IN (
    'Private Workshop',
    'Birthday Celebration',
    'Corporate Retreat',
    'Bridal Gathering',
    'Photo / Film Shoot',
    'Custom Experience'
  )),
  preferred_date DATE NOT NULL,
  guest_count INTEGER NOT NULL CHECK (guest_count > 0),
  budget_range TEXT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'confirmed', 'archived')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Gallery Images
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Pottery', 'Painting', 'Garden & Villa', 'Sensory & Tea', 'Private Events')),
  image_url TEXT NOT NULL,
  aspect_ratio TEXT DEFAULT 'square',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. Site Settings
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_name TEXT NOT NULL DEFAULT 'Clayton Art House',
  tagline TEXT NOT NULL DEFAULT 'A Creative Sanctuary in Kafr Abdo',
  address_line_1 TEXT NOT NULL DEFAULT '14 Rue Ahmed Zulfikar, Kafr Abdo',
  city TEXT NOT NULL DEFAULT 'Alexandria',
  country TEXT NOT NULL DEFAULT 'Egypt',
  phone TEXT NOT NULL DEFAULT '+20 102 345 6789',
  email TEXT NOT NULL DEFAULT 'hello@claytonarthouse.com',
  instagram TEXT NOT NULL DEFAULT '@clayton.arthouse',
  facebook TEXT DEFAULT 'facebook.com/claytonarthouse',
  opening_hours TEXT NOT NULL DEFAULT 'Tuesday – Sunday: 10:00 AM – 10:00 PM',
  booking_lead_hours INTEGER NOT NULL DEFAULT 4,
  cancellation_policy TEXT NOT NULL DEFAULT 'Cancellations made 24 hours prior to the session start receive a 100% venue credit or reschedule. No-shows are non-refundable.',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_event_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Helper function: is current user an admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins
    WHERE email = auth.jwt() ->> 'email'
  ) OR EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public can read published workshops
CREATE POLICY "Public can view published workshops"
ON public.workshops FOR SELECT
USING (is_published = true OR public.is_admin());

-- Public can read workshop images
CREATE POLICY "Public can view workshop images"
ON public.workshop_images FOR SELECT
USING (true);

-- Public can view upcoming scheduled sessions
CREATE POLICY "Public can view scheduled sessions"
ON public.sessions FOR SELECT
USING (status IN ('scheduled', 'full') OR public.is_admin());

-- Public can view gallery images
CREATE POLICY "Public can view gallery images"
ON public.gallery_images FOR SELECT
USING (true);

-- Public can view site settings
CREATE POLICY "Public can view site settings"
ON public.site_settings FOR SELECT
USING (true);

-- Public can insert private event inquiries
CREATE POLICY "Public can submit event inquiries"
ON public.private_event_inquiries FOR INSERT
WITH CHECK (true);

-- Admins have full access to inquiries
CREATE POLICY "Admins full access to inquiries"
ON public.private_event_inquiries FOR ALL
USING (public.is_admin());

-- Customers / Bookings access:
-- Only admins can view all bookings; customers view through secure RPC or confirmation code
CREATE POLICY "Admins full access to bookings"
ON public.bookings FOR ALL
USING (public.is_admin());

CREATE POLICY "Admins full access to customers"
ON public.customers FOR ALL
USING (public.is_admin());

CREATE POLICY "Admins full access to payments"
ON public.payments FOR ALL
USING (public.is_admin());

CREATE POLICY "Admins full access to workshops"
ON public.workshops FOR ALL
USING (public.is_admin());

CREATE POLICY "Admins full access to sessions"
ON public.sessions FOR ALL
USING (public.is_admin());

CREATE POLICY "Admins full access to settings"
ON public.site_settings FOR ALL
USING (public.is_admin());

CREATE POLICY "Admins full access to gallery"
ON public.gallery_images FOR ALL
USING (public.is_admin());
