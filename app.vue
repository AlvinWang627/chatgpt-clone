<template>
  <div>
    <NuxtWelcome />
    <Button>123</Button>
  </div>
</template>

<script setup lang="ts">
const { data } = await useFetch("/hello");
console.log(data);

console.log("123");
</script>
