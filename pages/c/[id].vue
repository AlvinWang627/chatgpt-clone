<template>
  <Loading v-if="loading" />
  <div class="flex flex-col w-full h-full">
    <ScrollArea class="chat-area pt-6">
      <div class="pb-9">
        <div v-for="(item, index) in promptDesc" :key="index">
          <div
            v-if="item.role === 'user'"
            class="px-4 py-2 flex gap-3 max-w-[672px] mx-auto"
          >
            <!-- <div class="avatar shrink-0">
              <img :src="avatar" alt="" class="w-[25px]" />
            </div> -->
            <Avatar class="avatar shrink-0 w-[25px] h-[25px]">
              <AvatarImage :src="avatar" alt="@radix-vue" />
              <AvatarFallback>avatar</AvatarFallback>
            </Avatar>
            <div class="flex flex-col">
              <div class="name">You</div>
              <div
                class="content prose dark:prose-invert"
                v-html="md.render(item.content)"
              ></div>
            </div>
          </div>
          <div
            v-if="item.role === 'assistant'"
            class="px-4 py-2 flex gap-3 max-w-[672px] mx-auto"
          >
            <div class="avatar shrink-0">
              <Icon name="charm:robot" :size="'25px'" />
            </div>
            <div class="flex flex-col">
              <div class="name">Bot</div>
              <div
                class="content prose dark:prose-invert"
                v-html="md.render(item.content)"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
    <form @submit="submitHandler" class="relative mx-auto mb-3">
      <Textarea
        v-model.trim="promptInput"
        type="text"
        rows="10"
        placeholder="inptut the prompt"
        :class="'h-[52px] resize-none max-h-[300px] w-[696px] p-3 pl-4 pr-12'"
      ></Textarea>
      <Button
        type="submit"
        @click.prevent="submitHandler"
        variant="secondary"
        class="absolute w-[30px] h-[30px] top-1/2 -translate-y-1/2 right-4 p-0"
      >
        <Icon name="uil:arrow-up" :size="'25px'" />
      </Button>
    </form>
  </div>
</template>

<script setup>
import markdownit from "markdown-it";
import hljs from "highlight.js";
const md = markdownit({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      //TODO
      console.log("apple", lang);
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }

    return ""; // use external default escaping
  },
});
// const md = markdownit()
const result = md.render("# markdown-it rulezz!");
definePageMeta({
  layout: "default",
});
const route = useRoute();
const chat_id = route.params.id;
const loading = ref(false);
const userData = useSupabaseUser();
const avatar = userData.value["identities"][0]["identity_data"]["avatar_url"];
const promptInput = ref("");
const promptDesc = ref([]);
const getPromptHistory = async () => {
  try {
    const { data } = await $fetch(`/api/conversation/${chat_id}`, {
      method: "get",
    });
    promptDesc.value = data;
  } catch (error) {
    console.log(error);
  }
};
getPromptHistory();
const submitHandler = async () => {
  if (promptInput.value.length === 0) return;
  loading.value = true;
  promptDesc.value.push({ role: "user", content: promptInput.value });
  try {
    const res = await $fetch("/api/conversation", {
      method: "post",
      body: { messages: promptDesc.value, chat_id },
    });
    promptInput.value = "";
    promptDesc.value.push(res);
    loading.value = false;
  } catch (error) {
    promptDesc.value.pop();
  }
};
</script>

<style lang="scss" scoped>
.chat-area {
  height: calc(100dvh - 92px);
}
</style>
