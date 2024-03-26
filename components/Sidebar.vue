<template>
  <div class="flex flex-col text-center relative text-sm">
    <button
      @click="$router.push('/')"
      to="/"
      class="mb-5 p-2 flex items-center justify-between absolute top-4 z-10 w-[213px] rounded-lg bg-background hover:bg-button-foreground cursor-pointer active:scale-[0.98]"
    >
      <div class="flex items-center">
        <Icon
          icon="material-symbols:robot-outline"
          width="28px"
          height="28px"
          class="mr-2"
        />
        New chat
      </div>
      <Icon icon="jam:write" width="18px" height="18px" />
    </button>
    <ScrollArea class="h-[calc(100vh - 208.8px)]">
      <ul class="mt-[80px]">
        <li v-for="item in chatRoomList" :key="item.id">
          <NuxtLink
            class="block p-2 w-[200px] hover:bg-button-foreground rounded-lg text-start"
            :to="`/c/${item.chat_id}`"
            >{{ item.chat_name }}</NuxtLink
          >
        </li>
      </ul>
    </ScrollArea>
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="outline">
          <Icon
            icon="radix-icons:moon"
            class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
          />
          <Icon
            icon="radix-icons:sun"
            class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
          />
          <span class="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem @click="colorMode.preference = 'light'">
          Light
        </DropdownMenuItem>
        <DropdownMenuItem @click="colorMode.preference = 'dark'">
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem @click="colorMode.preference = 'system'">
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <div class="flex items-center justify-start p-2 w-full h-12">
      <Avatar class="mr-[0.5rem] w-8 h-8">
        <AvatarImage :src="avatarUrl" alt="@radix-vue" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div>{{ userName }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const colorMode = useColorMode();
interface dataType {
  chat_id: string;
  chat_name: string;
  content: string[];
  created_at: string;
  id: number;
  user_uid: string;
}
const chatRoomList = ref<dataType[]>();
const getChatRoomList = async () => {
  const res: dataType[] = await $fetch("/api/chatRoomList", {
    method: "get",
  });
  chatRoomList.value = res;
};
getChatRoomList();
const user = useSupabaseUser();
const userName = user!.value!["identities"]![0]!["identity_data"]!["name"];
const avatarUrl =
  user!.value!["identities"]![0]!["identity_data"]!["avatar_url"];
</script>
<style lang="scss" scoped>
.router-link-active {
  @apply bg-button;
}
</style>
