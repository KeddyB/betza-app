import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verifyRegistrationResponse } from "https://deno.land/x/simplewebauthn@v9.0.1/deno/server.ts";

serve(async (req) => {
  try {
    // Create a Supabase client with the service_role key
    const supabase = createClient(
      Deno.env.get("PROJECT_URL") ?? "",
      Deno.env.get("SERVICE_ROLE_KEY") ?? ""
    );

    // Get the user from the request header
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const body = await req.json();

    // This is your Relying Party ID. It must match the one in the options function.
    const rpID = "com.betza.app"; // IMPORTANT: Replace this with your app's ID
    const expectedOrigin = `https://${rpID}`; // The origin you expect the request from

    // Verify the registration response
    const { verified, registrationInfo } = await verifyRegistrationResponse({
      response: body,
      expectedChallenge: body.challenge, // The challenge from the client
      expectedOrigin,
      expectedRPID: rpID,
    });

    if (verified && registrationInfo) {
      const { credentialPublicKey, credentialID } = registrationInfo;

      // Save the new credential to the database
      await supabase.from("user_credentials").insert([
        {
          user_id: user.id,
          credential_id: credentialID,
          public_key: credentialPublicKey,
          transports: body.response.transports,
        },
      ]);
    }

    return new Response(JSON.stringify({ verified }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});