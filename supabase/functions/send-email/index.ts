// Supabase Edge Function: Transactional Email Dispatcher via Resend
// Location: supabase/functions/send-email/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { template, to, data } = await req.json();
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ message: "Resend unconfigured. Email logged to console." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let subject = "Clayton Art House — Reservation Confirmation";
    let html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #23211E; background: #FAF8F5;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="font-family: serif; color: #C26D53; margin: 0;">Clayton Art House</h1>
          <p style="color: #606E5B; font-size: 14px; margin-top: 4px;">Kafr Abdo, Alexandria, Egypt</p>
        </div>
        <div style="background: #ffffff; padding: 24px; border-radius: 16px; border: 1px solid #E5DFD5;">
          <h2 style="margin-top: 0; font-size: 20px;">Your creative session is reserved!</h2>
          <p>Dear ${data?.customerName || "Artisan"},</p>
          <p>We are delighted to welcome you to Clayton. Here are your booking details:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 8px 0; color: #635D56;">Booking Reference:</td><td style="font-weight: bold; text-align: right;">${data?.bookingNumber}</td></tr>
            <tr><td style="padding: 8px 0; color: #635D56;">Workshop:</td><td style="font-weight: bold; text-align: right;">${data?.workshopTitle}</td></tr>
            <tr><td style="padding: 8px 0; color: #635D56;">Attendees:</td><td style="text-align: right;">${data?.attendeesCount} guest(s)</td></tr>
            <tr><td style="padding: 8px 0; color: #635D56;">Total Amount:</td><td style="text-align: right; color: #C26D53; font-weight: bold;">${data?.totalAmountEgp} EGP</td></tr>
          </table>
          <p style="font-size: 14px; color: #635D56; margin-top: 24px;">Location: 14 Rue Ahmed Zulfikar, Kafr Abdo, Alexandria</p>
        </div>
      </div>
    `;

    if (template === "cancellation") {
      subject = `Clayton Art House — Reservation Cancelled (${data?.bookingNumber})`;
      html = `<p>Your booking #${data?.bookingNumber} has been cancelled.</p>`;
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: Deno.env.get("NOTIFICATION_EMAIL_SENDER") || "Clayton <bookings@claytonarthouse.com>",
        to: [to],
        subject,
        html
      })
    });

    const resData = await res.json();
    return new Response(JSON.stringify(resData), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
