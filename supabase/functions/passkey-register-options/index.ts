import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { generateRegistrationOptions } from "https://deno.land/x/simplewebauthn@v9.0.1/deno/server.ts";

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

    // This is your Relying Party ID. It must be a domain you control.
    // For local development, you can use your app's bundle/package ID.
    const rpID = "com.betza.app"; // IMPORTANT: Replace this with your app's ID
    const rpName = "Betza App";

    const options = await generateRegistrationOptions({
      rpID,
      rpName,
      userID: user.id,
      userName: user.email,
    });

    return new Response(JSON.stringify(options), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});