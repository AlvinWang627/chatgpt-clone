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
  console.log("user", user);
  const body = await readBody(event);
  const chat_id = "1b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d";
  const config = useRuntimeConfig(event);
  const openai = new OpenAI({
    apiKey: config.openaiApiKey,
  });
  //get message
  const { data } = await client
    .from("ai-chat")
    .select("*")
    .eq("chat_id", chat_id);

  //確認初始messages，第一次or 2次以上
  let messages = [];
  if (data.length !== 0) {
    messages = data[0].content;
  } else {
    messages = [{ role: "system", content: "You are a helpful assistant." }];
  }
  //user input prompt
  messages.push({ role: "user", content: `${body.messages}` });
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
        .from("ai-chat")
        .update({
          content: messages,
        })
        .eq("chat_id", chat_id);
    } else {
      //insert database
      await client.from("ai-chat").insert({
        chat_id,
        content: messages,
      });
    }
    return completion.choices[0].message;
  }
  return promptToGPT();
});
