-- Clayton Art House Seed Data
-- Location: Kafr Abdo, Alexandria, Egypt

-- 1. Site Settings
INSERT INTO public.site_settings (
  id, venue_name, tagline, address_line_1, city, country, phone, email, instagram, opening_hours, booking_lead_hours, cancellation_policy
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Clayton Art House',
  'A Creative Sanctuary in Kafr Abdo',
  '14 Rue Ahmed Zulfikar, Kafr Abdo',
  'Alexandria',
  'Egypt',
  '+20 102 345 6789',
  'hello@claytonarthouse.com',
  '@clayton.arthouse',
  'Tuesday – Sunday: 10:00 AM – 10:00 PM (Closed Mondays)',
  4,
  'Cancellations made 24 hours prior to the session start receive a 100% venue credit or reschedule. No-shows are non-refundable.'
) ON CONFLICT (id) DO NOTHING;

-- 2. Admins
INSERT INTO public.admins (id, email, role)
VALUES 
  ('22222222-2222-2222-2222-222222222222', 'admin@claytonarthouse.com', 'admin')
ON CONFLICT (email) DO NOTHING;

-- 3. Workshops
INSERT INTO public.workshops (
  id, title, slug, category, short_description, description, price_egp, duration_minutes,
  capacity_per_session, difficulty, what_is_included, requirements, cover_image, is_published, is_featured, sort_order
) VALUES 
(
  '33333333-3333-3333-3333-333333333301',
  'Hand-Building & Wheel Pottery',
  'hand-building-wheel-pottery',
  'Ceramics & Pottery',
  'Discover the therapeutic art of ceramics. Shape organic vessels using pinch, slab, and electric wheel techniques.',
  'Set within our sunlit courtyard conservatory in Kafr Abdo, this immersive pottery workshop introduces you to the tactile world of clay. You will learn the foundational hand-building methods—pinching, coiling, and soft slab formation—followed by guided practice on our electric potter''s wheels. Each participant sculpts two to three unique pieces, which will be professionally bisque-fired, glazed in our studio glazes (terracotta matte, Mediterranean sea-salt white, or olive ash), and fired in our kiln ready for collection within 10 days.',
  750.00,
  150,
  10,
  'All Levels (Beginner Friendly)',
  ARRAY['1.5kg stoneware & terracotta clay', 'All wheel & sculpting tools', 'Glazing & two kiln firings', 'Apron provided', 'Specialty Alexandria roast coffee or herbal infusion'],
  'Please trim fingernails short. Wear clothes you do not mind getting a bit dusty with clay.',
  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=1200&auto=format&fit=crop',
  true,
  true,
  1
),
(
  '33333333-3333-3333-3333-333333333302',
  'Botanical Cyanotype & Sun Printing',
  'botanical-cyanotype-sun-printing',
  'Botanical & Flora',
  'Harness sunlight and garden botanicals to produce mesmerizing Prussian blue photographic prints on handmade cotton paper.',
  'Cyanotype is a 19th-century historical photographic printing process that yields rich, Prussian blue monochromes. In this serene atelier session, we will gather fresh botanicals, ferns, and pressed olive leaves from the Clayton villa gardens. You will coat heavy archival cotton rag paper with light-sensitive mineral emulsions, arrange your botanical compositions, and expose them to Alexandria’s midday sunlight before rinsing them in cool water to reveal breathtaking permanent cyan prints to frame at home.',
  620.00,
  120,
  12,
  'All Levels',
  ARRAY['Archival 300gsm cold-pressed cotton paper', 'Fresh villa garden cuttings & pressed specimens', 'All chemistry & UV exposure stations', 'Matte framing folders for 3 finished prints', 'Artisan lemonade and garden tea'],
  'No prior art experience required.',
  'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop',
  true,
  true,
  2
),
(
  '33333333-3333-3333-3333-333333333303',
  'Mediterranean Oil & Palette Knife',
  'mediterranean-oil-palette-knife',
  'Painting & Drawing',
  'Learn expressive impasto techniques, light blending, and architectural depth inspired by historic Alexandria.',
  'Immerse yourself in rich oil pigments and dynamic palette knife painting under the guidance of our resident Alexandria fine artists. Rather than delicate brushes, we explore the sculptural energy of the knife—layering luscious textures, capturing Kafr Abdo’s warm afternoon shadows, neoclassical balcony motifs, and the Mediterranean horizon. You will take home an expressive 40x50cm stretched linen artwork with deep textured character.',
  850.00,
  180,
  8,
  'Intermediate & Enthusiasts',
  ARRAY['Premium artist-grade oil paints (Winsor & Newton)', '40x50cm Belgian stretched linen canvas', 'Set of 4 stainless steel painting knives', 'Palette & brush-care solvents', 'Espresso & artisanal patisserie'],
  'Protective aprons provided. We recommend comfortable footwear.',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop',
  true,
  true,
  3
),
(
  '33333333-3333-3333-3333-333333333304',
  'Stained Glass Sun Catchers',
  'stained-glass-sun-catchers',
  'Glass & Mosaic',
  'Cut vibrant spectrum glass, foil with copper ribbon, and solder your own luminous window suncatcher.',
  'The vintage villas of Kafr Abdo boast some of the finest stained-glass transoms in Alexandria. In this masterclass, you will practice scoring and breaking colorful art glass sheets, smoothing edges on diamond glass grinders, applying adhesive copper foil, and flux soldering the joints into an exquisite geometric or botanical suncatcher ready to hang in your sunniest window.',
  950.00,
  180,
  8,
  'Beginner to Intermediate (Ages 16+)',
  ARRAY['Art glass assortment (amber, cobalt, olive, iridescent)', 'Diamond grinding and glass-cutter access', 'Copper foil, soldering station & lead-free solder', 'Brass hanging loops & chain', 'Herbal refreshment bar'],
  'Closed-toe shoes are strictly required for safety. Safety goggles are provided and mandatory during glass work.',
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1200&auto=format&fit=crop',
  true,
  false,
  4
),
(
  '33333333-3333-3333-3333-333333333305',
  'Artisanal Candle Craft & Botanical Blending',
  'artisanal-candle-craft-botanical-blending',
  'Culinary & Sensory',
  'Blend natural soy and beeswax with pure botanical fragrances and hand-pour into ceramic vessels.',
  'A soothing sensory experience centered around fragrance composition and warm wax craftsmanship. Learn top, heart, and base perfume notes inspired by Egyptian flora—Alexandrian night jasmine, bitter orange blossom, fig leaf, and warm amber. You will blend your custom scent profile and hand-pour two wooden-wick candles into handcrafted Clayton terracotta tumblers.',
  580.00,
  90,
  14,
  'All Levels',
  ARRAY['Two Clayton handmade terracotta vessels', '100% natural organic soy & beeswax', 'Premium pure essential & fragrance oils', 'Natural crackling wooden wicks', 'Botanical garnishes (lavender, dried rose petals)', 'Iced hibiscus & mint tea'],
  'None. All materials and safety gear provided.',
  'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1200&auto=format&fit=crop',
  true,
  true,
  5
),
(
  '33333333-3333-3333-3333-333333333306',
  'Hellenistic & Roman Mosaic Craft',
  'hellenistic-roman-mosaic-craft',
  'Glass & Mosaic',
  'Craft an intricate decorative trivet or wall panel using authentic marble, ceramic tesserae, and traditional grout.',
  'Honoring Alexandria’s deep Greco-Roman legacy, this workshop teaches traditional tesserae cutting using mosaic nippers. Arrange classical geometric borders, wave crests, or pomegranate motifs on solid wood substrate, adhering pieces with water-resistant mastic before mastering color-pigmented grouting.',
  720.00,
  150,
  10,
  'All Levels',
  ARRAY['Assorted Mediterranean tumbled marble & glazed tesserae', 'Compound mosaic nippers and safety eyewear', '30cm solid wooden display base', 'Specialty grout and sponge finisher', 'Warm spiced chai and dates'],
  'No prior experience required.',
  'https://images.unsplash.com/photo-1582562124811-c09040d0a901?q=80&w=1200&auto=format&fit=crop',
  true,
  false,
  6
)
ON CONFLICT (id) DO NOTHING;

-- 4. Sessions (Realistic upcoming dates in 2026/2027)
INSERT INTO public.sessions (
  id, workshop_id, start_time, end_time, capacity, booked_seats, status, instructor_name, room_or_space, notes
) VALUES
-- Hand-Building Pottery Sessions
(
  '44444444-4444-4444-4444-444444444401',
  '33333333-3333-3333-3333-333333333301',
  now() + interval '2 days 14 hours',
  now() + interval '2 days 16 hours 30 minutes',
  10,
  6,
  'scheduled',
  'Nour El-Din (Master Ceramist)',
  'Clayton Courtyard Studio',
  'Wheel focus + trimming'
),
(
  '44444444-4444-4444-4444-444444444402',
  '33333333-3333-3333-3333-333333333301',
  now() + interval '4 days 17 hours',
  now() + interval '4 days 19 hours 30 minutes',
  10,
  10,
  'full',
  'Nour El-Din (Master Ceramist)',
  'Clayton Courtyard Studio',
  'Evening candlelit pottery session'
),
(
  '44444444-4444-4444-4444-444444444403',
  '33333333-3333-3333-3333-333333333301',
  now() + interval '6 days 11 hours',
  now() + interval '6 days 13 hours 30 minutes',
  10,
  2,
  'scheduled',
  'Salma Raouf',
  'Clayton Courtyard Studio',
  'Weekend morning studio'
),
-- Botanical Cyanotype Sessions
(
  '44444444-4444-4444-4444-444444444404',
  '33333333-3333-3333-3333-333333333302',
  now() + interval '3 days 11 hours',
  now() + interval '3 days 13 hours',
  12,
  4,
  'scheduled',
  'Farida Mansour',
  'Sun Terrace & Villa Garden',
  'Midday sunlight exposure'
),
(
  '44444444-4444-4444-4444-444444444405',
  '33333333-3333-3333-3333-333333333302',
  now() + interval '7 days 12 hours',
  now() + interval '7 days 14 hours',
  12,
  0,
  'scheduled',
  'Farida Mansour',
  'Sun Terrace & Villa Garden',
  'Open for weekend registration'
),
-- Oil Painting Sessions
(
  '44444444-4444-4444-4444-444444444406',
  '33333333-3333-3333-3333-333333333303',
  now() + interval '3 days 16 hours',
  now() + interval '3 days 19 hours',
  8,
  5,
  'scheduled',
  'Karim Halim (Faculty of Fine Arts)',
  'The Atelier Gallery Room',
  'Kafr Abdo architecture & light'
),
(
  '44444444-4444-4444-4444-444444444407',
  '33333333-3333-3333-3333-333333333303',
  now() + interval '8 days 16 hours',
  now() + interval '8 days 19 hours',
  8,
  1,
  'scheduled',
  'Karim Halim (Faculty of Fine Arts)',
  'The Atelier Gallery Room',
  'Golden hour study'
),
-- Stained Glass Sessions
(
  '44444444-4444-4444-4444-444444444408',
  '33333333-3333-3333-3333-333333333304',
  now() + interval '5 days 15 hours',
  now() + interval '5 days 18 hours',
  8,
  3,
  'scheduled',
  'Tarek Wassef',
  'Glass & Metal Workshop',
  'Safety briefing at 15:00 sharp'
),
-- Candle Craft Sessions
(
  '44444444-4444-4444-4444-444444444409',
  '33333333-3333-3333-3333-333333333305',
  now() + interval '2 days 18 hours',
  now() + interval '2 days 19 hours 30 minutes',
  14,
  8,
  'scheduled',
  'Yasmine Amin',
  'The Conservatory Room',
  'Sensory aroma blending'
),
-- Mosaic Sessions
(
  '44444444-4444-4444-4444-444444444410',
  '33333333-3333-3333-3333-333333333306',
  now() + interval '6 days 15 hours',
  now() + interval '6 days 17 hours 30 minutes',
  10,
  3,
  'scheduled',
  'Dr. Magdy Boutros',
  'Mosaic Studio & Terrace',
  'Alexandrian Roman motifs'
)
ON CONFLICT (id) DO NOTHING;

-- 5. Customers
INSERT INTO public.customers (
  id, full_name, email, phone, notes, total_bookings, total_spent_egp
) VALUES
(
  '55555555-5555-5555-5555-555555555501',
  'Mariam Shenouda',
  'mariam.shenouda@gmail.com',
  '+20 100 123 4567',
  'Prefers corner wheel in pottery studio',
  2,
  1500.00
),
(
  '55555555-5555-5555-5555-555555555502',
  'Omar El-Sayed',
  'omar.elsayed@alexu.edu.eg',
  '+20 111 987 6543',
  'Architecture enthusiast, attended oil painting twice',
  1,
  850.00
),
(
  '55555555-5555-5555-5555-555555555503',
  'Layla Kabbani',
  'layla.kabbani@outlook.com',
  '+20 122 456 7890',
  'Booked for bridal sister gathering',
  1,
  1240.00
)
ON CONFLICT (id) DO NOTHING;

-- 6. Bookings
INSERT INTO public.bookings (
  id, booking_number, session_id, workshop_id, customer_id, attendees_count,
  total_amount_egp, booking_status, payment_status, special_requests, confirmation_code
) VALUES
(
  '66666666-6666-6666-6666-666666666601',
  'CLY-261001-A92F',
  '44444444-4444-4444-4444-444444444401',
  '33333333-3333-3333-3333-333333333301',
  '55555555-5555-5555-5555-555555555501',
  2,
  1500.00,
  'confirmed',
  'paid',
  'Celebrating an anniversary',
  'A92F47BC'
),
(
  '66666666-6666-6666-6666-666666666602',
  'CLY-261002-C381',
  '44444444-4444-4444-4444-444444444406',
  '33333333-3333-3333-3333-333333333303',
  '55555555-5555-5555-5555-555555555502',
  1,
  850.00,
  'confirmed',
  'paid',
  'Left-handed palette knife grip requested',
  'C38189D2'
),
(
  '66666666-6666-6666-6666-666666666603',
  'CLY-261003-E550',
  '44444444-4444-4444-4444-444444444404',
  '33333333-3333-3333-3333-333333333302',
  '55555555-5555-5555-5555-555555555503',
  2,
  1240.00,
  'confirmed',
  'pending',
  'Allergic to synthetic fragrance (fine with natural plants)',
  'E550A411'
)
ON CONFLICT (id) DO NOTHING;

-- 7. Payments
INSERT INTO public.payments (
  id, booking_id, amount_egp, currency, provider, payment_status, payment_method, transaction_ref
) VALUES
(
  '77777777-7777-7777-7777-777777777701',
  '66666666-6666-6666-6666-666666666601',
  1500.00,
  'EGP',
  'paymob',
  'paid',
  'Visa/Mastercard',
  'PAYMOB-TXN-884912'
),
(
  '77777777-7777-7777-7777-777777777702',
  '66666666-6666-6666-6666-666666666602',
  850.00,
  'EGP',
  'instapay',
  'paid',
  'InstaPay Direct',
  'INSTA-REF-302914'
),
(
  '77777777-7777-7777-7777-777777777703',
  '66666666-6666-6666-6666-666666666603',
  1240.00,
  'EGP',
  'cash',
  'pending',
  'Pay at Venue Reception',
  'CASH-PEND-491021'
)
ON CONFLICT (id) DO NOTHING;

-- 8. Gallery Images
INSERT INTO public.gallery_images (
  id, title, category, image_url, is_featured, sort_order
) VALUES
(
  '88888888-8888-8888-8888-888888888801',
  'Morning Light on the Wheel',
  'Pottery',
  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=1200&auto=format&fit=crop',
  true,
  1
),
(
  '88888888-8888-8888-8888-888888888802',
  'Clayton Villa Garden Patio',
  'Garden & Villa',
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1200&auto=format&fit=crop',
  true,
  2
),
(
  '88888888-8888-8888-8888-888888888803',
  'Cyanotype Sunlight Wash',
  'Sensory & Tea',
  'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop',
  true,
  3
),
(
  '88888888-8888-8888-8888-888888888804',
  'Palette Knife Studio Session',
  'Painting',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop',
  true,
  4
),
(
  '88888888-8888-8888-8888-888888888805',
  'Private Birthday Studio Gathering',
  'Private Events',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop',
  false,
  5
),
(
  '88888888-8888-8888-8888-888888888806',
  'Botanical Candle Curing',
  'Sensory & Tea',
  'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1200&auto=format&fit=crop',
  false,
  6
),
(
  '88888888-8888-8888-8888-888888888807',
  'Art Glass Cutting Station',
  'Pottery',
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1200&auto=format&fit=crop',
  false,
  7
),
(
  '88888888-8888-8888-8888-888888888808',
  'Historic Kafr Abdo Villa Facade',
  'Garden & Villa',
  'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?q=80&w=1200&auto=format&fit=crop',
  true,
  8
)
ON CONFLICT (id) DO NOTHING;

-- 9. Private Event Inquiries
INSERT INTO public.private_event_inquiries (
  id, event_type, preferred_date, guest_count, budget_range, name, phone, email, notes, status
) VALUES
(
  '99999999-9999-9999-9999-999999999901',
  'Corporate Retreat',
  CURRENT_DATE + 14,
  18,
  '15,000 - 20,000 EGP',
  'Dina Mostafa (Creative Agency Alexandria)',
  '+20 109 876 5432',
  'dina@creativealex.eg',
  'Looking for a team pottery & coffee morning session in the courtyard garden.',
  'quoted'
),
(
  '99999999-9999-9999-9999-999999999902',
  'Birthday Celebration',
  CURRENT_DATE + 21,
  12,
  '8,000 - 12,000 EGP',
  'Zeina Kassab',
  '+20 120 765 4321',
  'zeina.kassab@gmail.com',
  'Surprise 30th birthday candle crafting workshop with cake and beverage setup.',
  'new'
)
ON CONFLICT (id) DO NOTHING;
