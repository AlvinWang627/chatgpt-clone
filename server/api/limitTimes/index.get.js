import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const user = await serverSupabaseUser(event);
  const userId = user.id;
  try {
    const { data, error } = await client
      .from("user_limit")
      .select("*")
      .eq("user_id", userId);
    if (data.length) {
      return data[0].limit_times;
    } else {
      return 0;
    }
  } catch (error) {
    console.log(error);
  }
});
