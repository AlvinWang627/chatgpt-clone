<template>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Customize ChatGPT</AlertDialogTitle>
      <AlertDialogDescription>
        <div class="font-bold">Custom Instructions</div>
        <p class="m-0 pt-2 pb-3">
          What would you like ChatGPT to know about you to provide better
          responses?
        </p>
        <Textarea
          class="max-h-[177px] resize-none min-h-[177px] mb-1"
          v-model.trim="promptData.yourself_prompt"
          maxlength="500"
          :disabled="!promptData.enable"
        ></Textarea>
        <div class="mb-3 px-1">{{ yourself_prompt_text }} /500</div>
        <p class="m-0 pt-2 pb-3">How would you like ChatGPT to respond?</p>
        <Textarea
          class="max-h-[177px] resize-none min-h-[177px] mb-1"
          v-model.trim="promptData.response_prompt"
          maxlength="500"
          :disabled="!promptData.enable"
        ></Textarea>
        <div class="mb-3 px-1">{{ response_prompt_text }} /500</div>
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter class="flex justify-between">
      <div class="flex items-center">
        Enable to new chats
        <Switch class="ml-3" v-model:checked="promptData.enable" />
      </div>
      <div class="flex gap-3">
        <AlertDialogCancel @click="getData">Cancel</AlertDialogCancel>
        <AlertDialogAction @click="handleSubmit">Save</AlertDialogAction>
      </div>
    </AlertDialogFooter>
  </AlertDialogContent>
</template>

<script setup lang="ts">
type PromptData = {
  yourself_prompt: string;
  response_prompt: string;
  enable: boolean;
};
const promptData = ref<PromptData>({
  yourself_prompt: "",
  response_prompt: "",
  enable: true,
});
const yourself_prompt_text = computed<number>(() => {
  return promptData.value.yourself_prompt.length || 0;
});
const response_prompt_text = computed<number>(() => {
  return promptData.value.response_prompt.length || 0;
});
const getData = async () => {
  try {
    const res: PromptData = await $fetch("/api/instruction", {
      method: "get",
    });
    if (res) {
      promptData.value.yourself_prompt = res.yourself_prompt;
      promptData.value.response_prompt = res.response_prompt;
      promptData.value.enable = res.enable;
    }
  } catch (error) {
    console.log(error);
  }
};
getData();
const handleSubmit = async () => {
  try {
    const { yourself_prompt, response_prompt, enable } = promptData.value;
    await $fetch("/api/instruction", {
      method: "post",
      body: {
        yourself_prompt,
        response_prompt,
        enable,
      },
    });
    getData();
  } catch (error) {
    console.log(error);
  }
};
</script>

<style scoped></style>
