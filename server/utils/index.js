import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
/**
 * return  >= 5 true    <5 false
 */
const maxTimes = 5;
export const checkMessageIsLimitd = async (event, userId) => {
  const client = await serverSupabaseClient(event);
  try {
    const { data: limitData, error: user_limit_error } = await client
      .from("user_limit")
      .select("*")
      .eq("user_id", userId);
    if (user_limit_error) {
      return { error: "fail" };
    }
    if (limitData.length !== 0) {
      if (limitData[0].limit_times >= maxTimes) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (err) {
    console.error(err);
  }
};

export const addLimitTimes = async (event, userId) => {
  const client = await serverSupabaseClient(event);
  try {
    const { data: limitData, error: user_limit_error } = await client
      .from("user_limit")
      .select("*")
      .eq("user_id", userId);
    if (limitData.length) {
      //userId存在 times+=1 update
      const { data: update, error: updateError } = await client
        .from("user_limit")
        .update({
          user_id: userId,
          limit_times: limitData[0].limit_times + 1,
        })
        .eq("user_id", userId)
        .select("*");
      if (updateError) {
        console.error("Error update", updateError);
        throw new Error("update failed");
      }
      return update;
    } else {
      //userId不存在，新增userId，times+1 insert
      const { data: insert, error: insertError } = await client
        .from("user_limit")
        .insert([{ user_id: userId, limit_times: 1 }])
        .select();
      if (insertError) {
        console.error("Error update", insertError);
        throw new Error("update failed");
      }
      return insert;
    }
  } catch (error) {
    console.log(error);
  }
};
export const getLimitTimes = async (event, userId) => {
  const client = await serverSupabaseClient(event);
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
  } catch (error) {}
};

export const checkIsSubscriber = () => {

  // strip
};
/**
 * if (checkIsSubscriber) {
 *  訂閱者
 *  addLimitTimes()
 * } else if(checkMessageIsLimitd) {
 *  非訂閱者 達到送出最大上限
 *  return  false,submit times 到達最大上限,請訂閱
 * } else {
 *  非訂閱者 未達送出最大上限
 *  addLimitTimes()
 *  return true
 * }
 */
