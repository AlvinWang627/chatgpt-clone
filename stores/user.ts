export const useUserStore = defineStore("useUserStore", {
  state: () => ({
    name: "",
    avatarUrl: "",
    email: "",
    id: "",
    limitTimes: 0,
  }),
  actions: {
    getData() {
      const storedAuth =
        localStorage.getItem("sb-sofxledwuwikccvjhpdg-auth-token") || "";
      const auth = JSON.parse(storedAuth);
      const { name, avatar_url, email } = auth.user.user_metadata;
      const { id } = auth.user;
      if (auth) {
        this.name = name ?? email!.split("@")[0];
        this.avatarUrl = avatar_url;
        this.email = email;
        this.id = id;
      }
    },
    async getLimitTimes() {
      try {
        const limitTimes = await $fetch("/api/limitTimes", {
          method: "get",
        });
        this.limitTimes = limitTimes as number;
      } catch (error) {
        console.log(error);
      }
    },
  },
});
