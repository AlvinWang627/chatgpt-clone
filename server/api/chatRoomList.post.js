import { serverSupabaseClient } from "#supabase/server";
export default defineEventHandler(async (event) => {
  try {
    const { chat_name, messages } = await readBody(event);
    if (!chat_name || !messages) {
      return new Error("Missing required fields");
    }
    const client = await serverSupabaseClient(event);
    //新增chat room
    //chat room id
    //chat name 取前8個字
    //user_uid user.id

    const { data, error: insertError } = await client
      .from("ai_chat")
      .insert({
        chat_name,
        content: messages,
      })
      .select();
    if (insertError) {
      console.error("Error inserting chat data:", insertError);
      throw new Error("Failed to insert chat data");
    }
    return { data };
  } catch (err) {
    console.error("Error processing chat request:", err);
    return { error: err.message || "An error occurred" };
  }
});
