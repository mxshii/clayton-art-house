// Supabase Edge Function: Paymob Checkout Intention
// Location: supabase/functions/paymob-checkout/index.ts

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
    const { amount_cents, booking_id, booking_number, billing_data } = await req.json();

    const apiKey = Deno.env.get("PAYMOB_API_KEY");
    const integrationId = Deno.env.get("PAYMOB_INTEGRATION_ID");

    if (!apiKey || !integrationId) {
      return new Response(
        JSON.stringify({
          error: "Paymob credentials unconfigured on server. Use test mode.",
          fallback_mode: "mock"
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 1: Authentication Token
    const authRes = await fetch("https://accept.paymob.com/api/auth/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: apiKey }),
    });
    const authData = await authRes.json();
    const token = authData.token;

    // Step 2: Order Registration
    const orderRes = await fetch("https://accept.paymob.com/api/ecommerce/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: token,
        delivery_needed: "false",
        amount_cents,
        currency: "EGP",
        merchant_order_id: booking_number,
        items: []
      }),
    });
    const orderData = await orderRes.json();

    // Step 3: Payment Key Request
    const keyRes = await fetch("https://accept.paymob.com/api/acceptance/payment_keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: token,
        amount_cents,
        expiration: 3600,
        order_id: orderData.id,
        billing_data,
        currency: "EGP",
        integration_id: parseInt(integrationId)
      }),
    });
    const keyData = await keyRes.json();

    return new Response(
      JSON.stringify({
        payment_token: keyData.token,
        order_id: orderData.id,
        iframe_url: `https://accept.paymob.com/api/acceptance/iframes/current?payment_token=${keyData.token}`
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
