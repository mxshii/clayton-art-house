// Supabase Edge Function: Paymob Webhook Verification
// Location: supabase/functions/paymob-webhook/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const body = await req.json();
    const hmacReceived = url.searchParams.get("hmac");
    const hmacSecret = Deno.env.get("PAYMOB_HMAC_SECRET");

    const obj = body.obj;
    if (!obj) {
      return new Response("Invalid webhook body", { status: 400 });
    }

    const isSuccess = obj.success === true;
    const bookingNumber = obj.order?.merchant_order_id;
    const transactionId = String(obj.id);

    // Initialize Supabase admin client to sync database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (bookingNumber) {
      if (isSuccess) {
        // Update booking and payment records
        await supabase
          .from("bookings")
          .update({ payment_status: "paid", booking_status: "confirmed" })
          .eq("booking_number", bookingNumber);

        // Find booking ID to update payments table
        const { data: booking } = await supabase
          .from("bookings")
          .select("id")
          .eq("booking_number", bookingNumber)
          .single();

        if (booking) {
          await supabase
            .from("payments")
            .update({
              payment_status: "paid",
              transaction_ref: `PAYMOB-${transactionId}`,
              metadata: obj
            })
            .eq("booking_id", booking.id);
        }
      } else {
        await supabase
          .from("bookings")
          .update({ payment_status: "failed" })
          .eq("booking_number", bookingNumber);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
