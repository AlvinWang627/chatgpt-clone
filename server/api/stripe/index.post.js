import { defineEventHandler } from "h3";
import { serverSupabaseUser } from "#supabase/server";
import { useServerStripe } from "#stripe/server";
const baseURL = process.env.BASE_URL;
export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const stripe = await useServerStripe(event);
  const prices = await stripe.prices.list({
    type: "recurring",
    product: "prod_Q2PMr4xu2m9Z5P",
  });
  const session = await stripe.checkout.sessions.create({
    billing_address_collection: "auto",
    line_items: [
      {
        price: prices.data[0].id,
        quantity: 1,
      },
    ],
    payment_method_types: ["card"],
    customer_email: user.email,
    mode: "subscription",
    success_url: `${baseURL}/success`,
    cancel_url: `${baseURL}/`,
    metadata: {
      userId: user.id,
    },
  });

  return session.url;
});
