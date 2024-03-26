<template>
  <Loading v-if="loading" />
  <div class="flex items-center justify-center flex-col w-full relative">
    <div class="flex items-center justify-center flex-col h-[80%]">
      <img src="assets/logo.jpg" alt="logo" class="w-[48px] rounded-3xl mb-3" />
      <h1>How can I help you today?</h1>
    </div>
    <!-- absolute bottom-4 flex right-1/2 translate-x-1/2 -->
    <div class="w-full pb-6 flex items-center justify-center">
      <form action="" @submit="test" class="relative">
        <Textarea
          v-model.trim="promptInput"
          type="text"
          rows="10"
          placeholder="inptut the prompt"
          :class="'min-h-14 resize-none max-h-[300px] w-[696px] p-3 pl-4 pr-12'"
        ></Textarea>
        <Button
          type="submit"
          @click.prevent="submitHandler"
          variant="secondary"
          class="absolute w-[30px] h-[30px] top-1/2 -translate-y-1/2 right-4"
        >
          S
        </Button>
      </form>
    </div>
  </div>
</template>

<script setup>
//get chat room list

definePageMeta({
  layout: "default",
});
const loading = ref(false);
const userData = useSupabaseUser();
const avatar = userData.value["identities"][0]["identity_data"]["avatar_url"];
const promptInput = ref("");
const title = ref("");
const userId = useSupabaseUser().value.id;
const promptDesc = ref([
  { role: "system", content: "You are a helpful assistant." },
]);
// TODO
// 送出表單，新增一個chatroom
// v gen uuid
// v push router /c/uuid
//  add new chat room to chat room list and get chat room list
const router = useRouter();
const submitHandler = async () => {
  if (promptInput.value.length === 0) return;
  promptDesc.value.push({ role: "user", content: promptInput.value });
  try {
    title.value = promptInput.value.slice(0, 8);
    //新增chatroom
    const { data } = await $fetch("/api/chatRoomList", {
      method: "post",
      body: { messages: promptDesc.value, chat_name: title.value },
    });
    const { chat_id } = data[0];
    const res = await $fetch("/api/conversation", {
      method: "post",
      body: {
        messages: promptDesc.value,
        chat_id,
      },
    });
    router.push(`/c/${chat_id}`);
    promptInput.value = "";
  } catch (error) {
    console.log(error);
  }
};
</script>

<style lang="scss" scoped></style>
