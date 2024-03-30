<template>
  <div class="flex flex-col text-center relative text-sm">
    <button
      @click="$router.push('/')"
      to="/"
      class="mb-5 p-2 flex items-center justify-between absolute top-4 z-10 w-[213px] rounded-lg bg-background hover:bg-button-foreground cursor-pointer active:scale-[0.98]"
    >
      <div class="flex items-center">
        <Icon icon="charm:robot" width="28px" height="28px" class="mr-2" />
        New chat
      </div>
      <Icon icon="jam:write" width="18px" height="18px" />
    </button>
    <div class="flex flex-col content-between">
      <ScrollArea class="pb-3 scroll-area">
        <ul class="mt-[80px]">
          <li v-for="item in chatRoomList" :key="item.id">
            <NuxtLink
              class="block p-2 w-[213px] hover:bg-button-foreground rounded-lg text-start"
              :to="`/c/${item.chat_id}`"
              >{{ item.chat_name }}</NuxtLink
            >
          </li>
        </ul>
      </ScrollArea>
      <div class="flex flex-col">
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" class="w-[213px]">
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
            <DropdownMenuItem
              @click="colorMode.preference = 'light'"
              class="cursor-pointer"
            >
              Light
            </DropdownMenuItem>
            <DropdownMenuItem
              @click="colorMode.preference = 'dark'"
              class="cursor-pointer"
            >
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem
              @click="colorMode.preference = 'system'"
              class="cursor-pointer"
            >
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button
              variant="ghost"
              class="w-[213px] flex items-center justify-start h-12 p-2"
            >
              <Avatar class="mr-[0.5rem] w-8 h-8">
                <AvatarImage :src="avatarUrl" alt="@radix-vue" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                {{ userName }}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent :align="'start'" class="w-[213px]">
            <DropdownMenuItem class="cursor-pointer h-10" @click="handleLogout">
              <Icon
                icon="ic:round-logout"
                width="20px"
                height="20px"
                class="mr-2"
              />
              Log out</DropdownMenuItem
            >
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
interface DataType {
  chat_id: string;
  chat_name: string;
  content: string[];
  created_at: Date;
  id: number;
  user_uid: string;
}

const colorMode = useColorMode();
const chatRoomList = ref<DataType[]>();
const getChatRoomList = async () => {
  try {
    const res: DataType[] = await $fetch<DataType[]>("/api/chatRoomList", {
      method: "get",
    });
    chatRoomList.value = res;
  } catch (error) {
    console.log(error);
  }
};
getChatRoomList();
const user = useSupabaseUser();
const userName =
user!.value!["identities"]![0]!["identity_data"]!["name"] ??
user!.value!["identities"]![0]!["identity_data"]!["user_name"];
const avatarUrl =
user!.value!["identities"]![1]!["identity_data"]!["avatar_url"];
const supabase = useSupabaseClient();
const router = useRouter();
const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push("/login");
    }
    console.log(error);
  } catch (error) {
    console.log(error);
  }
};
</script>

<style lang="scss" scoped>
.router-link-active {
  @apply bg-button;
}
.scroll-area {
  height: calc(100vh - 12px - 40px - 48px);
}
</style>
