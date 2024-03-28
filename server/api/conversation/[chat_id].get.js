import { serverSupabaseClient } from "#supabase/server";
export default defineEventHandler(async (event) => {
  const chat_id = getRouterParam(event, "chat_id");
  const client = await serverSupabaseClient(event);
  const { data } = await client
    .from("ai_chat")
    .select("*")
    .eq("chat_id", chat_id)
    .select();
  return { data: data[0]?.content };
});
