import { useServerStripe } from "#stripe/server";
import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const runtimeConfig = useRuntimeConfig();
  const stripe = await useServerStripe(event);
  const headers = event.node.req.headers;
  const body = await readRawBody(event);
  let hookEvent;

  const endpointSecret = runtimeConfig.stripeWebhookKey;
  if (endpointSecret) {
    const signature = headers["stripe-signature"];
    try {
      hookEvent = stripe.webhooks.constructEvent(
        body,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return response.sendStatus(400);
    }
  }
  let subscription;
  // Handle the event
  if (hookEvent.type === "checkout.session.completed") {
    subscription = hookEvent.data.object;
    const subscriptionData = await stripe.subscriptions.retrieve(
      hookEvent.data.object.subscription
    );
    console.log(subscriptionData);
    try {
      const { data, error } = await client
        .from("user_subscribe")
        .insert({
          user_id: subscription.metadata.userId,
          expire_date: new Date(subscriptionData.current_period_end * 1000),
          customer_id: subscriptionData.customer,
          subscription_id: subscriptionData.id,
          price_id: subscriptionData.plan.id,
        })
        .select();
      console.log("data", data);
      console.log("error", error);
    } catch (error) {
      console.log(error);
    }
  }
  return 200;
});
