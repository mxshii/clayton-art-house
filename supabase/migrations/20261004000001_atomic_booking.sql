-- Clayton Art House Concurrency-Safe Booking Stored Procedures
-- Prevents race conditions and overbooking via row-level locks (FOR UPDATE)

CREATE OR REPLACE FUNCTION public.create_booking_atomic(
  p_session_id UUID,
  p_attendees_count INTEGER,
  p_customer_name TEXT,
  p_customer_email TEXT,
  p_customer_phone TEXT,
  p_special_requests TEXT DEFAULT NULL,
  p_payment_provider TEXT DEFAULT 'mock',
  p_payment_method TEXT DEFAULT 'card'
)
RETURNS JSONB AS $$
DECLARE
  v_session RECORD;
  v_workshop RECORD;
  v_customer_id UUID;
  v_booking_id UUID;
  v_payment_id UUID;
  v_booking_number TEXT;
  v_confirmation_code TEXT;
  v_remaining_seats INTEGER;
  v_total_amount NUMERIC(10,2);
  v_result JSONB;
BEGIN
  -- Input validation
  IF p_attendees_count <= 0 THEN
    RAISE EXCEPTION 'Attendees count must be greater than zero';
  END IF;

  IF p_customer_name IS NULL OR length(trim(p_customer_name)) < 2 THEN
    RAISE EXCEPTION 'A valid customer name is required';
  END IF;

  IF p_customer_email IS NULL OR position('@' in p_customer_email) = 0 THEN
    RAISE EXCEPTION 'A valid customer email address is required';
  END IF;

  IF p_customer_phone IS NULL OR length(trim(p_customer_phone)) < 8 THEN
    RAISE EXCEPTION 'A valid phone number is required';
  END IF;

  -- 1. CRITICAL: Acquire exclusive row lock on the session to eliminate race conditions
  SELECT * INTO v_session
  FROM public.sessions
  WHERE id = p_session_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Session not found (id: %)', p_session_id;
  END IF;

  IF v_session.status = 'cancelled' THEN
    RAISE EXCEPTION 'This session has been cancelled';
  END IF;

  IF v_session.status = 'completed' THEN
    RAISE EXCEPTION 'This session has already ended';
  END IF;

  -- 2. Verify real-time seat availability
  v_remaining_seats := v_session.capacity - v_session.booked_seats;
  IF p_attendees_count > v_remaining_seats THEN
    RAISE EXCEPTION 'Only % seat(s) remaining for this session; requested % seat(s)',
      v_remaining_seats, p_attendees_count;
  END IF;

  -- 3. Lock and retrieve workshop price strictly from database
  SELECT * INTO v_workshop
  FROM public.workshops
  WHERE id = v_session.workshop_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Workshop not found';
  END IF;

  v_total_amount := v_workshop.price_egp * p_attendees_count;

  -- 4. Find or create Customer record
  SELECT id INTO v_customer_id
  FROM public.customers
  WHERE lower(email) = lower(trim(p_customer_email))
  LIMIT 1;

  IF v_customer_id IS NULL THEN
    INSERT INTO public.customers (
      full_name, email, phone, total_bookings, total_spent_egp
    ) VALUES (
      trim(p_customer_name),
      lower(trim(p_customer_email)),
      trim(p_customer_phone),
      1,
      v_total_amount
    )
    RETURNING id INTO v_customer_id;
  ELSE
    UPDATE public.customers
    SET
      full_name = trim(p_customer_name),
      phone = trim(p_customer_phone),
      total_bookings = total_bookings + 1,
      total_spent_egp = total_spent_egp + v_total_amount,
      updated_at = now()
    WHERE id = v_customer_id;
  END IF;

  -- 5. Generate human-readable booking reference and confirmation hash
  v_booking_number := 'CLY-' || to_char(now(), 'YYMMDD') || '-' || upper(substring(md5(random()::text) from 1 for 4));
  v_confirmation_code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8));

  -- 6. Insert Booking
  INSERT INTO public.bookings (
    booking_number,
    session_id,
    workshop_id,
    customer_id,
    attendees_count,
    total_amount_egp,
    booking_status,
    payment_status,
    special_requests,
    confirmation_code
  ) VALUES (
    v_booking_number,
    p_session_id,
    v_session.workshop_id,
    v_customer_id,
    p_attendees_count,
    v_total_amount,
    'confirmed',
    'pending',
    trim(p_special_requests),
    v_confirmation_code
  )
  RETURNING id INTO v_booking_id;

  -- 7. Update Session booked_seats and set status to 'full' if capacity reached
  UPDATE public.sessions
  SET
    booked_seats = booked_seats + p_attendees_count,
    status = CASE
      WHEN booked_seats + p_attendees_count >= capacity THEN 'full'
      ELSE status
    END,
    updated_at = now()
  WHERE id = p_session_id;

  -- 8. Create Payment record
  INSERT INTO public.payments (
    booking_id,
    amount_egp,
    currency,
    provider,
    payment_status,
    payment_method,
    transaction_ref
  ) VALUES (
    v_booking_id,
    v_total_amount,
    'EGP',
    p_payment_provider,
    'pending',
    p_payment_method,
    'TXN-' || upper(substring(md5(random()::text) from 1 for 8))
  )
  RETURNING id INTO v_payment_id;

  -- 9. Build JSON response
  v_result := jsonb_build_object(
    'booking_id', v_booking_id,
    'booking_number', v_booking_number,
    'confirmation_code', v_confirmation_code,
    'workshop_title', v_workshop.title,
    'start_time', v_session.start_time,
    'end_time', v_session.end_time,
    'attendees_count', p_attendees_count,
    'total_amount_egp', v_total_amount,
    'customer_name', trim(p_customer_name),
    'customer_email', lower(trim(p_customer_email)),
    'booking_status', 'confirmed',
    'payment_status', 'pending'
  );

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cancellation function that restores capacity atomically
CREATE OR REPLACE FUNCTION public.cancel_booking_atomic(
  p_booking_id UUID,
  p_cancellation_reason TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_booking RECORD;
  v_session RECORD;
BEGIN
  -- Lock booking row
  SELECT * INTO v_booking
  FROM public.bookings
  WHERE id = p_booking_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Booking not found';
  END IF;

  IF v_booking.booking_status = 'cancelled' THEN
    RETURN jsonb_build_object('success', false, 'message', 'Booking is already cancelled');
  END IF;

  -- Lock session row
  SELECT * INTO v_session
  FROM public.sessions
  WHERE id = v_booking.session_id
  FOR UPDATE;

  -- Decrement booked_seats and restore 'scheduled' status if previously full
  UPDATE public.sessions
  SET
    booked_seats = GREATEST(0, booked_seats - v_booking.attendees_count),
    status = CASE
      WHEN status = 'full' THEN 'scheduled'
      ELSE status
    END,
    updated_at = now()
  WHERE id = v_booking.session_id;

  -- Update booking
  UPDATE public.bookings
  SET
    booking_status = 'cancelled',
    special_requests = CASE
      WHEN p_cancellation_reason IS NOT NULL THEN coalesce(special_requests, '') || ' [Cancelled: ' || p_cancellation_reason || ']'
      ELSE special_requests
    END,
    updated_at = now()
  WHERE id = p_booking_id;

  RETURN jsonb_build_object(
    'success', true,
    'booking_id', p_booking_id,
    'booking_number', v_booking.booking_number,
    'status', 'cancelled'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
