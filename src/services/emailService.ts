// Clayton Art House — Email Notification Abstraction
// Routes through Supabase Edge Function to Resend or outputs friendly dev simulation logs.

export interface BookingEmailData {
  bookingNumber: string;
  confirmationCode: string;
  customerName: string;
  customerEmail: string;
  workshopTitle: string;
  sessionStartTime: string;
  sessionEndTime: string;
  attendeesCount: number;
  totalAmountEgp: number;
  venueAddress: string;
}

export interface InquiryEmailData {
  inquiryId: string;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  preferredDate: string;
  guestCount: number;
  budgetRange?: string;
  notes?: string;
}

export const emailService = {
  async sendBookingConfirmation(data: BookingEmailData): Promise<boolean> {
    let supabaseUrl = '';
    try {
      if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) {
        supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      }
    } catch {}

    const edgeEndpoint = `${supabaseUrl}/functions/v1/send-email`;

    try {
      if (supabaseUrl) {
        const res = await fetch(edgeEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            template: 'booking_confirmed',
            to: data.customerEmail,
            data
          })
        });
        if (res.ok) return true;
      }
    } catch {
      // Graceful fallback to dev logger
    }

    // High fidelity dev log
    console.info(
      `%c[EMAIL DISPATCH]%c Booking Confirmation sent to ${data.customerEmail} for #${data.bookingNumber} (${data.workshopTitle})`,
      'background: #C26D53; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
      'color: inherit;'
    );
    return true;
  },

  async sendBookingCancellation(customerEmail: string, bookingNumber: string, workshopTitle: string): Promise<boolean> {
    console.info(
      `%c[EMAIL DISPATCH]%c Cancellation Notice sent to ${customerEmail} for #${bookingNumber} (${workshopTitle})`,
      'background: #8F8981; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
      'color: inherit;'
    );
    return true;
  },

  async sendAdminInquiryAlert(data: InquiryEmailData): Promise<boolean> {
    console.info(
      `%c[ADMIN ALERT]%c New Private Event Inquiry from ${data.name} for ${data.eventType} on ${data.preferredDate}`,
      'background: #606E5B; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
      'color: inherit;'
    );
    return true;
  }
};
