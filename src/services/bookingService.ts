import { Booking, BookingCreationInput, BookingCreationResult } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { localStore } from '../lib/localStore';

export const bookingService = {
  /**
   * Concurrency-safe atomic booking creation.
   * Invokes the PostgreSQL stored procedure with row-locking when connected,
   * or the local atomic engine when in offline/local mode.
   */
  async createBooking(input: BookingCreationInput): Promise<BookingCreationResult> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.rpc('create_booking_atomic', {
          p_session_id: input.sessionId,
          p_attendees_count: input.attendeesCount,
          p_customer_name: input.customerName,
          p_customer_email: input.customerEmail,
          p_customer_phone: input.customerPhone,
          p_special_requests: input.specialRequests || null,
          p_payment_provider: input.paymentProvider || 'mock',
          p_payment_method: input.paymentMethod || 'card'
        });

        if (error) {
          // If RPC raised capacity/validation exception
          return {
            success: false,
            error: error.message || 'Unable to complete reservation.'
          };
        }

        return {
          success: true,
          bookingId: data.booking_id,
          bookingNumber: data.booking_number,
          confirmationCode: data.confirmation_code,
          workshopTitle: data.workshop_title,
          startTime: data.start_time,
          endTime: data.end_time,
          attendeesCount: data.attendees_count,
          totalAmountEgp: Number(data.total_amount_egp),
          customerName: data.customer_name,
          customerEmail: data.customer_email,
          bookingStatus: data.booking_status,
          paymentStatus: data.payment_status
        };
      } catch (err: any) {
        console.warn('Supabase RPC error, falling back to local atomic engine:', err);
        return localStore.createBookingAtomic(input);
      }
    }

    // Local persistent atomic engine
    return localStore.createBookingAtomic(input);
  },

  async getBookings(): Promise<Booking[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          workshops(*),
          sessions(*),
          customers(*),
          payments(*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch bookings error, fallback:', error.message);
        return localStore.getBookings();
      }

      return (data || []).map(row => ({
        id: row.id,
        bookingNumber: row.booking_number,
        sessionId: row.session_id,
        workshopId: row.workshop_id,
        customerId: row.customer_id,
        attendeesCount: row.attendees_count,
        totalAmountEgp: Number(row.total_amount_egp),
        bookingStatus: row.booking_status,
        paymentStatus: row.payment_status,
        specialRequests: row.special_requests,
        confirmationCode: row.confirmation_code,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        workshop: row.workshops ? {
          id: row.workshops.id,
          title: row.workshops.title,
          slug: row.workshops.slug,
          category: row.workshops.category,
          shortDescription: row.workshops.short_description,
          description: row.workshops.description,
          priceEgp: Number(row.workshops.price_egp),
          durationMinutes: row.workshops.duration_minutes,
          capacityPerSession: row.workshops.capacity_per_session,
          difficulty: row.workshops.difficulty,
          whatIsIncluded: row.workshops.what_is_included || [],
          coverImage: row.workshops.cover_image,
          isPublished: row.workshops.is_published,
          isFeatured: row.workshops.is_featured,
          sortOrder: row.workshops.sort_order,
          createdAt: row.workshops.created_at
        } : undefined,
        session: row.sessions ? {
          id: row.sessions.id,
          workshopId: row.sessions.workshop_id,
          startTime: row.sessions.start_time,
          endTime: row.sessions.end_time,
          capacity: row.sessions.capacity,
          bookedSeats: row.sessions.booked_seats,
          status: row.sessions.status,
          instructorName: row.sessions.instructor_name,
          roomOrSpace: row.sessions.room_or_space,
          createdAt: row.sessions.created_at
        } : undefined,
        customer: row.customers ? {
          id: row.customers.id,
          fullName: row.customers.full_name,
          email: row.customers.email,
          phone: row.customers.phone,
          notes: row.customers.notes,
          totalBookings: row.customers.total_bookings,
          totalSpentEgp: Number(row.customers.total_spent_egp),
          createdAt: row.customers.created_at
        } : undefined
      }));
    }

    return localStore.getBookings();
  },

  async getBookingById(id: string): Promise<Booking | null> {
    const all = await this.getBookings();
    return all.find(b => b.id === id || b.bookingNumber === id || b.confirmationCode === id) || null;
  },

  async cancelBooking(bookingId: string, reason?: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.rpc('cancel_booking_atomic', {
          p_booking_id: bookingId,
          p_cancellation_reason: reason || null
        });
        if (!error && data?.success) {
          return true;
        }
      } catch (err) {
        console.warn('Supabase cancel RPC error, fallback:', err);
      }
    }

    return localStore.cancelBooking(bookingId, reason);
  },

  async updateBookingStatus(
    bookingId: string,
    bookingStatus: Booking['bookingStatus'],
    paymentStatus?: Booking['paymentStatus']
  ): Promise<Booking> {
    if (isSupabaseConfigured() && supabase) {
      const updates: Record<string, any> = { booking_status: bookingStatus, updated_at: new Date().toISOString() };
      if (paymentStatus) updates.payment_status = paymentStatus;

      await supabase.from('bookings').update(updates).eq('id', bookingId);
    }
    return localStore.updateBookingStatus(bookingId, bookingStatus, paymentStatus);
  }
};
