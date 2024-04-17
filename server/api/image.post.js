import OpenAI from "openai";
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const body = await readBody(event);
  const { messages, quantity } = body;
  const openai = new OpenAI({
    apiKey: config.openaiApiKey,
  });
  async function genImage() {
    try {
      const response = await openai.images.generate({
        model: "dall-e-2",
        prompt: messages,
        size: "256x256",
        n: quantity,
      });
      return response;
    } catch (error) {
      return error;
    }
  }
  return genImage();
});
