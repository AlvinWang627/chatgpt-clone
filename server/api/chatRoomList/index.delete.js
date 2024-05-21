import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
export default defineEventHandler(async (event) => {
  try {
    const { chat_id } = await readBody(event);
    const client = await serverSupabaseClient(event);
    const user = await serverSupabaseUser(event);
    if (user) {
      const { error } = await client
        .from("ai_chat")
        .delete()
        .eq("chat_id", chat_id);
      if (error) {
        console.error("Error fetching chat id:", error);
        return { error: "Failed to retrieve chat id" };
      }
      return "success";
    }
  } catch (err) {
    console.error("Error processing chat request:", err);
    return { error: err.message || "An error occurred" };
  }
});
