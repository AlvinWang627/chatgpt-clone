<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { useVModel } from "@vueuse/core";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  defaultValue?: string | number;
  modelValue?: string | number;
}>();

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void;
}>();

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue,
});
const textarea = ref<HTMLTextAreaElement | null>(null);
let textareaHeight = ref<string | number | undefined>("52px");
const handleHeight = () => {
  const textLength = textarea.value?.textLength;
  if (textLength === 0) {
    textareaHeight.value = "auto";
  } else if (typeof textarea.value?.scrollHeight !== "undefined") {
    textareaHeight.value = `${textarea.value?.scrollHeight + 2}px`;
  }
};
onMounted(() => {
  textarea.value?.focus();
});
</script>

<template>
  <textarea
    ref="textarea"
    @input="handleHeight"
    v-model="modelValue"
    :style="{ height: textareaHeight }"
    :class="
      cn(
        'textarea flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-auto prose dark:prose-invert text-base',
        props.class
      )
    "
  />
</template>
<style lang="scss" scoped>
.textarea {
  &::-webkit-scrollbar {
    @apply w-[7.5px];
  }
  &::-webkit-scrollbar-track {
    @apply bg-transparent;
  }
  &::-webkit-scrollbar-thumb {
    @apply bg-background-third rounded-sm;
  }
}
</style>
