<template>
  <div
    class="flex items-center justify-center flex-col w-full relative sub-page"
  >
    <div class="flex items-center justify-center flex-col chat-area">
      <div
        v-if="isLoading"
        class="px-4 py-2 flex gap-3 max-w-[672px] mx-auto chat-area items-center"
      >
        <div class="flex flex-col">
          <Icon
            name="eos-icons:bubble-loading"
            width="100px"
            height="100px"
            class="mt-3"
          />
        </div>
      </div>
      <div
        v-else-if="!isLoading && imageData === ''"
        class="flex items-center justify-center flex-col"
      >
        <Icon name="charm:robot" :size="'48px'" class="mb-2" />
        <h1>What image do you want to produce?</h1>
      </div>
      <div>
        <div v-if="isError">unexpected error, please try again</div>
        <img v-if="!isLoading" :src="imageData" alt="" />
      </div>
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
        :disabled="isLoading"
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

<script setup>
definePageMeta({
  layout: "default",
  name: "image",
});
useHead({
  title: "Create Image",
});
const isLoading = ref(false);
const isError = ref(false);
const promptInput = ref("");
const imageData = ref("");
const submitHandler = async () => {
  isLoading.value = true;
  isError.value = false;
  try {
    const res = await $fetch("/api/image", {
      method: "post",
      body: { messages: promptInput.value, quantity: 1 },
    });
    promptInput.value = "";
    imageData.value = res.data[0].url;
  } catch (error) {
    isError.value = true;
    console.log(error);
  } finally {
    isLoading.value = false;
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
