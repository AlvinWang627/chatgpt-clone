<template>
      <div
      class="flex items-center justify-center flex-col w-full relative"
      v-if="!firstPrompt.length"
    >
      <div class="flex items-center justify-center flex-col chat-area">
        <Icon name="charm:robot" :size="'48px'" class="mb-2" />
        <h1>How can I help you today?</h1>
      </div>
<form @submit="submitHandler" class="relative mx-auto mb-8">
      <Textarea
        v-model.trim="promptInput"
        @keyup.enter.prevent="submitHandler"
        @keyup.shift.enter=""
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
    <div v-else class="pb-9 w-full pt-6">
      <div v-for="(item, index) in promptDesc" :key="index">
        <div
          v-if="item.role === 'user'"
          class="px-4 py-2 flex gap-3 max-w-[672px] mx-auto"
        >
          <Avatar class="avatar shrink-0 w-[25px] h-[25px]">
            <AvatarImage :src="avatarUrl" alt="@radix-vue" />
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
      <div v-if="true" class="px-4 py-2 flex gap-3 max-w-[672px] mx-auto">
        <div class="avatar shrink-0">
          <Icon name="charm:robot" :size="'25px'" />
        </div>
        <div class="flex flex-col">
          <div class="name">Bot</div>
          <Icon
            name="eos-icons:bubble-loading"
            width="20px"
            height="20px"
            class="mt-3"
          />
        </div>
      </div>
      </div>
</template>

<script setup>
import markdownit from "markdown-it";
import { useUserStore } from "@/stores/user";
import { useChatRoomList } from "@/stores/chatRoomList";
const chatRoomList = useChatRoomList();
definePageMeta({
  layout: "default",
  name: "index",
});
useHead({
  title: "New chat",
});

const userStore = useUserStore();
const { avatarUrl } = storeToRefs(userStore);

const firstPrompt = ref("");
const md = markdownit({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      //TODO
      //code block code的名字
      // console.log("apple", lang);
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }

    return "";
  },
});
const promptInput = ref("");
const title = ref("");
const promptDesc = ref([
  { role: "system", content: "You are a helpful assistant." },
]);
const router = useRouter();
const submitHandler = async () => {
  if (promptInput.value.length === 0) return;
  firstPrompt.value = promptInput.value;
  promptDesc.value.push({ role: "user", content: promptInput.value });
  try {
    title.value = promptInput.value.slice(0, 8);
    //新增chatroom
    const { chat_id, chat_name, created_at, id } = await $fetch(
      "/api/chatRoomList",
      {
        method: "post",
        body: { messages: promptDesc.value, chat_name: title.value },
      }
    );
    const res = await $fetch("/api/conversation", {
      method: "post",
      body: {
        messages: promptDesc.value,
        chat_id,
      },
    });
    chatRoomList.chatRoomData.unshift({
      chat_id,
      chat_name,
      created_at,
      id,
    });
    promptDesc.value.push(res);

    localStorage.setItem("firstPrompt", JSON.stringify(promptDesc.value));
    localStorage.setItem("isFirstPrompt", JSON.stringify(true));
    router.push(`/c/${chat_id}`);
    promptInput.value = "";
  } catch (error) {
    console.log(error);
  }
};
</script>

<style lang="scss" scoped>
.chat-area {
  height: calc(100dvh - 92px);
}
</style>
