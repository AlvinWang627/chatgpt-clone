<template>
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <button
        class="mb-1 p-2 flex flex-col items-center justify-between w-[213px] rounded-lg bg-background hover:bg-button-foreground cursor-pointer active:scale-[0.98]"
        v-if="!proVersion"
      >
        <div>{{ limitTimes >= 5 ? 5 : limitTimes }} / 5 free messages</div>
        <Progress
          :model-value="(limitTimes >= 5 ? 5 : limitTimes) * 20"
          class="my-2"
        />
        <div>Upgrade to Pro</div>
      </button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Upgrade to chatGPT pro</AlertDialogTitle>
        <AlertDialogDescription>
          Upgrade to the professional version and you can ask unlimited times
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>not now</AlertDialogCancel>
        <AlertDialogAction @click="handleStripe">Upgrade</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup>
const userStore = useUserStore();
const { limitTimes } = storeToRefs(userStore);
const props = defineProps(["proVersion"]);

onMounted(() => {
  userStore.getLimitTimes();
});

async function handleStripe() {
  const sessionURL = await $fetch("/api/stripe", {
    method: "post",
  });
  window.location = sessionURL;
}
onMounted(() => {});
const stripe = await useClientStripe();
// console.log("client", stripe);
</script>

<style lang="scss" scoped></style>
