<template>
  <Loading v-if="loading" />
  <div class="w-screen h-screen bg-slate-500 relative">
    <div>
      <div v-for="(item, index) in promptDesc" :key="index">
        <div v-if="item.role === 'user'">
          <div class="avatar">
            <img :src="avatar" alt="" class="w-[25px]" />
            <div class="name" v-if="item.role === 'user'">You</div>
          </div>
          <div class="name" v-if="item.role === 'assistant'">Bot</div>
          <div class="content">{{ item.content }}</div>
        </div>
        <div v-if="item.role === 'assistant'">
          <div class="avatar">
            <Icon name="material-symbols:robot-outline" :size="'25px'" />
            <div class="name">Bot</div>
          </div>
          <div class="content">{{ item.content }}</div>
        </div>
      </div>
    </div>
    <form
      action=""
      class="absolute bottom-4 flex right-1/2 translate-x-1/2"
      @submit="test"
    >
      <Textarea
        v-model.trim="promptInput"
        type="text"
        rows="10"
        placeholder="inptut the prompt"
        :class="'w-[300px] min-h-14 mr-3 resize-none max-h-[300px]'"
      />
      <button
        type="submit"
        @click.prevent="submitHandler"
        class="bg-slate-600 h-[30px] cursor-pointer"
      >
        submit
      </button>
    </form>
  </div>
</template>

<script setup>
// import Loading from "~/assets/Loading.vue";
//get chat room list
//get chat description
definePageMeta({
  layout: "default",
});
const loading = ref(false);
const userData = useSupabaseUser();
const avatar = userData.value["identities"][0]["identity_data"]["avatar_url"];
const promptInput = ref("");
const promptDesc = ref([
  {
    role: "system",
    content: "You are a helpful assistant.",
  },
  {
    role: "user",
    content: "台灣總統是誰",
  },
  {
    role: "assistant",
    content: "截至現在，台灣的總統是蔡英文。",
  },
]);

const submitHandler = async () => {
  loading.value = true;
  console.log("submit");
  promptDesc.value.push({ role: "user", content: promptInput.value });
  try {
    const res = await $fetch("/api/conversation", {
      method: "post",
      body: { messages: promptInput.value },
    });
    promptInput.value = "";
    promptDesc.value.push(res);
    console.log(res);
    loading.value = false;
  } catch (error) {
    promptDesc.value.pop();
  }
};
</script>

<style lang="scss" scoped></style>
