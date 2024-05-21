import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import type { Database } from "../database.types.js";
export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient<Database>(event);
    const user = await serverSupabaseUser(event);
    const userId = user!.id;
    const { data: get, error: getError } = await client
      .from("instruction")
      .select("*")
      .eq("user_id", userId);
    if (getError) {
      throw new Error(getError.message);
    }
    return {
      enable: get[0].enable,
      yourself_prompt: get[0].yourself_prompt,
      response_prompt: get[0].response_prompt,
    };
  } catch (err) {
    return err;
  }
});
