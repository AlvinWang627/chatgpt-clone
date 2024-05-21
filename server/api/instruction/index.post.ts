import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
export default defineEventHandler(async (event) => {
  try {
    const { yourself_prompt, response_prompt, enable } = await readBody(event);
    const client = await serverSupabaseClient<Database>(event);
    const user = await serverSupabaseUser(event);
    const userId = user!.id;
    const { data: get, error: getError } = await client
      .from("instruction")
      .select("*")
      .eq("user_id", userId);
    if (getError) {
      console.error("Error get", getError);
      throw new Error("Failed to get instruction data");
    }
    if (get.length !== 0) {
      //update
      const { data: update, error: updateError } = await client
        .from("instruction")
        .update({ yourself_prompt, response_prompt, enable })
        .eq("user_id", userId)
        .select("*");

      if (updateError) {
        console.error("Error update", updateError);
        throw new Error("Failed to update instruction data");
      }
      return update[0];
    } else {
      const { data: insert, error: insertError } = await client
        .from("instruction")
        .insert({
          yourself_prompt,
          response_prompt,
          enable,
          user_id: userId,
        })
        .select();
      if (insertError) {
        console.error("Error insert", insertError);
        throw new Error("Failed to insert instruction data");
      }
      return insert[0];
    }
  } catch (err) {
    console.error("Error processing instruction request:", err);
    return { error: err || "An error occurred" };
  }
});
