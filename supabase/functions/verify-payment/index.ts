import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const { reference } = await req.json();

    if (!reference) {
      throw new Error("Payment reference is required.");
    }

    const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!paystackSecretKey) {
      throw new Error("Paystack secret key is not set.");
    }

    // 1. Verify the transaction with Paystack
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
      },
    });

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok || paystackData.data.status !== 'success') {
      throw new Error(paystackData.data.gateway_response || "Payment verification failed.");
    }

    // 2. Payment is successful, now create the order in your database
    const { user_id, cart_items } = paystackData.data.metadata;
    const total_amount = paystackData.data.amount / 100; // Paystack amount is in kobo

    // Create a Supabase client with the service_role key to perform admin tasks
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 3. Create a new order in the 'orders' table
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id,
        total,
        status: 'paid',
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 4. Add the cart items to the 'order_items' table
    const orderItems = cart_items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // 5. Clear the user's cart
    await supabaseAdmin.from("user_carts").delete().eq("user_id", user_id);

    // Return the new order ID to the app
    return new Response(JSON.stringify({ order_id: order.id }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});