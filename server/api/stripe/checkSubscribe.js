import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";
/**
 * 讓前端檢查 user是否為subscriber及到達送出限制
 */
export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const userId = user.id;
  const client = await serverSupabaseClient(event);
  try {
    //確認user_subscribe中是否有目前的user
    const { data: userExit } = await client
      .from("user_subscribe")
      .select("*")
      .eq("user_id", userId);
    if (!userExit) {
      return false;
    }
    //確定user在user_subscribe中，確認是否到期
    const { data: userSubScribeDate } = await client
      .from("user_subscribe")
      .select("expire_date");
    if (
      userSubScribeDate.length !== 0 &&
      new Date(userSubScribeDate[0].expire_date) > new Date()
    ) {
      //有訂閱return true
      return true;
    } else {
      //沒訂閱 return false
      return false;
    }
  } catch (error) {
    console.log(error);
  }
});
