import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const { amount, email, metadata } = await req.json();

    if (!amount || !email) {
      throw new Error("Amount and email are required.");
    }

    const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!paystackSecretKey) {
      throw new Error("Paystack secret key is not set.");
    }
    
    // Define the callback URL here
    const callback_url = "betza://payment-callback";

    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount * 100, // Paystack expects amount in kobo
        email,
        // Explicitly set the callback URL for the transaction
        callback_url: callback_url,
        metadata: {
          ...metadata,
          // Include a custom redirect URL in metadata as a fallback
          custom_redirect_url: callback_url,
        }
      }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok) {
      // Provide more detailed error logging
      console.error("Paystack API Error:", paystackData);
      throw new Error(paystackData.message || "Failed to initialize payment.");
    }

    return new Response(JSON.stringify(paystackData.data), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    // Also log the error on the server
    console.error("Edge Function Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});