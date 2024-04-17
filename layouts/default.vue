<template>
  <div class="flex bg-background-secondary w-screen h-screen">
    <Sidebar class="basis-[240px] pl-3 shrink-0 grow-0 bg-background pb-4" />
    <div class="w-full">
      <div class="h-14 flex items-center justify-start p-2">
        <DropdownMenu>
          <DropdownMenuTrigger class="text-lg font-medium px-3 py-2">{{
            filterModel
          }}</DropdownMenuTrigger>
          <DropdownMenuContent>
            <NuxtLink to="/">
              <DropdownMenuItem @click="model = 'Text'">
                Text
              </DropdownMenuItem>
            </NuxtLink>
            <NuxtLink to="/Image">
              <DropdownMenuItem @click="model = 'Image'">
                Image
              </DropdownMenuItem>
            </NuxtLink>
            <NuxtLink to="/">
              <DropdownMenuItem @click="model = 'Audio'">
                Audio
              </DropdownMenuItem>
            </NuxtLink>
            <NuxtLink to="/">
              <DropdownMenuItem @click="model = 'Video'">
                Video
              </DropdownMenuItem>
            </NuxtLink>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
const model = ref("Text");
const route = useRoute();

const filterModel = computed(() => {
  const regex = /^\/c\/.*$/;
  if (route.path === "/" || regex.test(route.path)) {
    return (model.value = "Text");
  } else if (route.path === "/Image") {
    return (model.value = "Image");
  } else {
    return model.value;
  }
});
</script>

<style lang="scss" scoped></style>
