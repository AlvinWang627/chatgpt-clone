import { serverSupabaseClient } from "#supabase/server";
/**
 * return  >= 5 true    <5 false
 */
const maxTimes = 5;
/**
 * 檢查是否達到送出限制
 * @param {*} event
 * @param {*} userId
 * @returns true代表達到送出上限
 */
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
/**
 * 送出次數加一次
 * @param {*} event
 * @param {string} userId
 * @returns none
 */
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

/**
 * 拿到送出限制的次數
 * @param {*} event
 * @param {string} userId
 * @returns 送出次數的number
 */
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
/**
 * 檢查是否為subscriber
 * @param {*} event h3 event
 * @param {*} userId user id
 * @returns 是subscriber且沒到期 return true
 */
export const checkIsSubscriber = async (event, userId) => {
  const client = await serverSupabaseClient(event);
  try {
    //確認user_subscribe中是否有目前的user
    const { data: userExit } = await client
      .from("user_subscribe")
      .select("*")
      .eq("user_id", userId);
    if (!userExit.length) {
      return false;
    }
    //確定user在user_subscribe中，確認是否到期
    const { data: userSubScribeDate } = await client
      .from("user_subscribe")
      .select("expire_date");
    if (new Date(userSubScribeDate[0].expire_date) > new Date()) {
      //沒到期
      return true;
    } else {
      //到期
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};
