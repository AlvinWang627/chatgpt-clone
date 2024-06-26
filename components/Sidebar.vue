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
      <ScrollArea :class="[{ 'pro-version': proVersion }, 'pb-3 scroll-area']">
        <TransitionGroup name="list" tag="ul" class="mt-[80px]">
          <li v-for="item in chatRoomData" :key="item.id" class="relative">
            <NuxtLink
              class="block p-2 w-[213px] hover:bg-button-foreground rounded-lg text-start"
              :to="`/c/${item.chat_id}`"
            >
              <span
                class="block w-[167px] overflow-hidden text-nowrap text-ellipsis"
              >
                {{ item.chat_name }}
              </span>
            </NuxtLink>
            <AlertDialog>
              <AlertDialogTrigger as-child>
                <div
                  class="absolute right-7 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  <Icon
                    icon="fluent:delete-16-filled"
                    width="20px"
                    height="20px"
                  />
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete chat?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will delete {{ item.chat_name }}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction @click="handleDelete(item.chat_id)"
                    >Delete</AlertDialogAction
                  >
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </li>
        </TransitionGroup>
      </ScrollArea>
      <PaywallDialog :pro-version="proVersion" />
      <div class="flex flex-col">
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button
                variant="ghost"
                class="w-[213px] flex items-center justify-start h-12 p-2 bg-background hover:bg-button-foreground"
              >
                <Avatar class="mr-[0.5rem] w-8 h-8">
                  <AvatarImage :src="avatarUrl" alt="@radix-vue" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  {{ name }}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent :align="'start'" class="w-[213px]">
              <DropdownMenuLabel class="h-10 leading-7">{{
                email
              }}</DropdownMenuLabel>
              <DropdownMenuSeparator />
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
              <DropdownMenuItem class="p-0">
                <AlertDialogTrigger
                  class="w-[203px] px-2 py-[6px] flex items-center active:bg-accent focus:g-accent h-10"
                >
                  <Icon
                    icon="mdi:file-table-outline"
                    width="20px"
                    height="20px"
                    class="mr-2"
                  />
                  Customize ChatGPT
                </AlertDialogTrigger>
              </DropdownMenuItem>
              <DropdownMenuItem
                class="cursor-pointer h-10"
                @click="handleLogout"
              >
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
          <InstructionDialog />
        </AlertDialog>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { useChatRoomList } from "@/stores/chatRoomList";
import { Icon } from "@iconify/vue";
const colorMode = useColorMode();

const chatRoomList = useChatRoomList();
const { chatRoomData } = storeToRefs(chatRoomList);
const userStore = useUserStore();
const { name, avatarUrl, email } = storeToRefs(userStore);
chatRoomList.getData();
onMounted(() => {
  userStore.getData();
  userStore.getLimitTimes();
  checkSubscribe();
});

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

const handleDelete = async (chat_id: string) => {
  try {
    const res = await $fetch("/api/chatRoomList", {
      method: "delete",
      body: {
        chat_id,
      },
    });
    if (res === "success") {
      chatRoomList.getData();
      router.push("/");
    } else {
      console.log(res);
      alert("An error occurred");
    }
  } catch (error) {
    console.log(error);
  }
};
const proVersion = ref(true);
const checkSubscribe = async () => {
  const isSubscribe = await $fetch("/api/stripe/checkSubscribe");
  if (isSubscribe === true) {
    proVersion.value = true;
  } else {
    proVersion.value = false;
  }
};
</script>

<style lang="scss" scoped>
.router-link-active {
  @apply bg-button;
}
.scroll-area {
  height: calc(100vh - 12px - 88px - 48px);
}
.scroll-area.pro-version {
  height: calc(100vh - 12px - 48px);
}
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
