<!-- App.vue -->
<template>
  <div class="flex flex-col" v-show="componentLoaded">
    <img src="/assets/logo.jpg" alt="logo" class="w-8 mx-auto mb-8" />
    <div class="w-[320px] flex flex-col"></div>
    <h1 class="text-center font-bold">歡迎回來</h1>
    <Auth
      :supabaseClient="supabaseClient"
      :appearance="{
        theme: ThemeSupa,
      }"
      :providers="[]"
      v-model="authView"
      :redirectTo="redirectTo"
    />
    <div class="flex items-center justify-center gap-3 py-6">
      <div class="w-full h-[1px] bg-foreground"></div>
      <div class="shrink-0 text-sm">或者</div>
      <div class="w-full h-[1px] bg-foreground"></div>
    </div>
    <Button
      variant="outline"
      @click.prevent="githubHandler"
      class="h-[52px] flex justify-start text-base mb-2"
    >
      <Icon icon="mdi:github" width="20px" height="20px" class="mr-2" />
      使用 Github 繼續</Button
    >
    <Button
      variant="outline"
      @click.prevent="googleHandler"
      class="h-[52px] flex justify-start text-base"
    >
      <Icon icon="logos:google-icon" width="20px" height="20px" class="mr-2" />
      使用 Google 繼續</Button
    >
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
definePageMeta({
  layout: "home",
});
const componentLoaded = ref(false);
onMounted(() => {
  componentLoaded.value = true;
});
// Import predefined theme
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Auth } from "@nuxtbase/auth-ui-vue";
import { createClient } from "@supabase/supabase-js";
const config = useRuntimeConfig();
const supabase = createClient(
  config.public.supabase.url,
  config.public.supabase.key
);
const supabaseClient = useSupabaseClient();
const authView = ref("sign_in");
const redirectTo = computed(() => {
  return authView.value === "forgotten_password" ? "/forgot" : "/confirm";
});

// const supabase = useSupabaseClient();
const router = useRouter();
const user = useSupabaseUser();
const githubHandler = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: "https://alvinwang627.dev/confirm",
      },
    });
    if (error) {
      throw new Error("fail");
    }
  } catch (error) {
    console.log(error);
  }
};
const googleHandler = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://alvinwang627.dev/confirm",
      },
    });
    if (error) {
      throw new Error("fail");
    }
  } catch (error) {
    console.log(error);
  }
};
watchEffect(() => {
  if (user.value) {
    navigateTo("/");
  }
});
</script>
