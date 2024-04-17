<template>
  <div
    class="flex items-center justify-center flex-col w-full relative sub-page"
    v-if="promptDesc.length === 1"
  >
    <div class="flex items-center justify-center flex-col chat-area">
      <Icon name="charm:robot" :size="'48px'" class="mb-2" />
      <h1>How can I help you today?</h1>
    </div>

    <form
      @keydown.shift.enter=""
      @keyup.enter.exact="submitHandler"
      class="relative mx-auto mb-8 w-full max-w-[766px]"
    >
      <Textarea
        ref="textarea"
        v-model.trim="promptInput"
        type="text"
        placeholder="inptut the prompt"
        :class="'resize-none max-h-[450px] max-w-[766px] p-3 pl-4 pr-12'"
      ></Textarea>
      <Button
        type="submit"
        @click.prevent="submitHandler"
        variant="secondary"
        class="absolute w-[30px] h-[30px] bottom-6 right-4 p-0"
        :disabled="promptInput.length === 0"
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
            v-html="$md.render(item.content)"
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
            v-html="$md.render(item.content)"
          ></div>
        </div>
      </div>
    </div>
    <div v-if="loading" class="px-4 py-2 flex gap-3 max-w-[672px] mx-auto">
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
    <div
      v-else
      class="px-4 py-2 flex gap-3 max-w-[672px] mx-auto justify-center"
    >
      <div>something went wrong, please try again</div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "default",
  name: "index",
});
useHead({
  title: "New chat",
});
const loading = ref(true);
import { useUserStore } from "@/stores/user";
import { useChatRoomList } from "@/stores/chatRoomList";
const { $md } = useNuxtApp();
const chatRoomList = useChatRoomList();

const userStore = useUserStore();
const { avatarUrl } = storeToRefs(userStore);

const promptInput = ref("");
const title = ref("");
const promptDesc = ref([
  { role: "system", content: "You are a helpful assistant." },
]);
const router = useRouter();
const submitHandler = async () => {
  if (promptInput.value.length === 0) return;
  promptDesc.value.push({ role: "user", content: promptInput.value });
  await handleTitleFetch();
  try {
    //insert chatroom get chat_id
    const { chat_id, chat_name, created_at, id } = await $fetch(
      "/api/chatRoomList",
      {
        method: "post",
        body: { messages: promptDesc.value, chat_name: title.value },
      }
    );
    //chat to ai
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
  } finally {
    loading.value = false;
  }
};
async function handleTitleFetch() {
  try {
    const _title = await $fetch("/api/title", {
      method: "post",
      body: { messages: promptDesc.value },
    });
    title.value = _title.content;
  } catch (error) {
    console.log(error);
  }
}
</script>

<style lang="scss" scoped>
.sub-page {
  height: calc(100dvh - 56px);
}
.chat-area {
  height: calc(100dvh - 112px);
}
</style>
