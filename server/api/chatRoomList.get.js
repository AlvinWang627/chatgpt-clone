import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event);
    const user = await serverSupabaseUser(event);
    if (user && user.id) {
      const { data, error } = await client
        .from("ai_chat")
        .select("*")
        .eq("user_uid", user.id)
        .order("created_at", { ascending: false }); // Ensure case-insensitivity if needed
      if (error) {
        console.error("Error fetching chat data:", error);
        return { error: "Failed to retrieve chat data" }; // Informative error response
      }

      return data;
    }
  } catch (err) {
    console.error("Error processing chat request:", err);
    return { error: err.message || "An error occurred" };
  }
});
