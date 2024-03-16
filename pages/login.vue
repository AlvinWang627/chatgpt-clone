<!-- App.vue -->
<template>
  <div class="w-[400px]">
    <Auth
      :supabaseClient="supabaseClient"
      :appearance="{
        theme: ThemeSupa,
      }"
      :providers="['google', 'github']"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "home",
});
// Import predefined theme
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Auth } from "@nuxtbase/auth-ui-vue";

const supabaseClient = useSupabaseClient();
</script>
