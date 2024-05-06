import OpenAI from "openai";
import { defineEventHandler } from "h3";
import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
/**
 * backend
 * 建立
 * 1.送出表單prompt，獲取uuid
 * 2.將uuid放到網址上 nuxt-ai/chat/uuid
 * 3.將uuid建立chatroom，insert from chat_list
 * 4.送出的表單prompt，insert from chat_ai
 */

/**
 * 非建立，第二次以上傳送prompt
 * 1.用UUID獲取歷史messages = prompt history 從 get select(uuid)
 * 2.messages.push(new prompt)
 * 3.更新database update to new messages
 */

/**
 * todo
 * add new chatroom
 * chatroom name
 * switch system prompt
 */

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const user = await serverSupabaseUser(event);
  const userId = user.id;
  const body = await readBody(event);
  const { chat_id, messages } = body;
  const config = useRuntimeConfig(event);
  const openai = new OpenAI({
    apiKey: config.openaiApiKey,
  });
  const isSubscribtion = await checkIsSubscriber(event, userId);
  const isLimited = await checkMessageIsLimitd(event, userId);
  if (!isSubscribtion && isLimited) {
    //沒訂閱 到達限制次數
    return false;
  }

  await addLimitTimes(event, userId);

  //get message by chat_id
  const { data } = await client
    .from("ai_chat")
    .select("*")
    .eq("chat_id", chat_id);

  async function promptToGPT() {
    const completion = await openai.chat.completions.create({
      messages,
      model: "gpt-3.5-turbo",
    });
    //push gpt response
    messages.push(completion.choices[0].message);
    if (data.length !== 0) {
      // update database
      await client
        .from("ai_chat")
        .update({
          content: messages,
        })
        .eq("chat_id", chat_id);
    } else {
      //insert database
      await client.from("ai_chat").insert({
        chat_id,
        content: messages,
      });
    }
    return completion.choices[0].message;
  }
  return promptToGPT();
});
