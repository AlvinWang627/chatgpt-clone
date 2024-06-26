<template>
  <div class="flex flex-col w-full sub-page">
    <ScrollArea class="chat-area">
      <div class="pb-9">
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
          v-if="erroring"
          class="px-4 py-2 flex gap-3 max-w-[672px] mx-auto justify-center"
        >
          <div>something went wrong, please try again</div>
        </div>
      </div>
    </ScrollArea>
    <form
      @submit="submitHandler"
      class="relative mx-auto mb-8 w-full max-w-[766px]"
    >
      <Textarea
        v-model.trim="promptInput"
        @keyup.enter.prevent="submitHandler"
        @keyup.shift.enter=""
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
</template>

<script setup lang="ts">
const { $md } = useNuxtApp();
import { useUserStore } from "@/stores/user";
definePageMeta({
  layout: "default",
});
useHead({
  title: "Chat room",
});

const userStore = useUserStore();
const { avatarUrl } = storeToRefs(userStore);
const route = useRoute();
const chat_id = route.params.id || null;
const loading = ref<boolean>(false);
const erroring = ref<boolean>(false);
const promptInput = ref("");
const promptDesc = ref<PromptDesc[]>([]);
const fromNewChat = ref<boolean>(true);
interface PromptDesc {
  role: string;
  content: string;
}
//todo type
const getPromptHistory = async (isFirstPrompt = false) => {
  if (isFirstPrompt) {
    promptDesc.value = JSON.parse(localStorage.getItem("firstPrompt") || "");
  } else {
    try {
      const res = await $fetch(`/api/conversation/${chat_id}`, {
        method: "get",
      });
      const { data } = res;
      promptDesc.value = data;
    } catch (error) {
      erroring.value = true;
      console.log(error);
    }
  }
};
onMounted(() => {
  const isFirstPrompt = localStorage.getItem("isFirstPrompt");
  fromNewChat.value = isFirstPrompt ? JSON.parse(isFirstPrompt) : false;
  getPromptHistory(fromNewChat.value);
  localStorage.removeItem("isFirstPrompt");
});
const submitHandler = async () => {
  if (promptInput.value.length === 0) return;
  loading.value = true;
  promptDesc.value.push({ role: "user", content: promptInput.value });
  promptInput.value = "";
  try {
    const res = await $fetch("/api/conversation", {
      method: "post",
      body: { messages: promptDesc.value, chat_id },
    });
    promptDesc.value.push(res);
  } catch (error) {
    erroring.value = true;
    promptDesc.value.pop();
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.sub-page {
  height: calc(100dvh - 56px);
}
.chat-area {
  height: calc(100dvh - 112px - 56px);
}
</style>
