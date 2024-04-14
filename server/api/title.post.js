import OpenAI from "openai";
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const body = await readBody(event);
  const { messages } = body;
  const openai = new OpenAI({
    apiKey: config.openaiApiKey,
  });
  messages[0].content =
    "將以下問題總結為能當成標題的一句話，語言需與詢問內容相同，英文就用英文，中文就用中文";
  async function genTitle() {
    try {
      const completion = await openai.chat.completions.create({
        messages,
        model: "gpt-3.5-turbo",
      });
      return completion.choices[0].message;
    } catch (error) {
      return error;
    }
  }
  return genTitle();
});
