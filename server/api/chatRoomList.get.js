import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event);
    const user = await serverSupabaseUser(event);
    if (user && user.id) {
      const { data, error } = await client
        .from("ai_chat")
        .select("chat_id, chat_name, id, created_at")
        .eq("user_uid", user.id)
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching chat data:", error);
        return { error: "Failed to retrieve chat data" };
      }
      return data;
    }
  } catch (err) {
    console.error("Error processing chat request:", err);
    return { error: err.message || "An error occurred" };
  }
});
