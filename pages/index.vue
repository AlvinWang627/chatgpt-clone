<template>
  <div class="w-100">
    login success

    {{ data }}
  </div>
</template>

<script setup>
definePageMeta({
  layout: "home",
});
const data = useSupabaseUser();
</script>

<style lang="scss" scoped></style>
