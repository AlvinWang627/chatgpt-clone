export const useUserStore = defineStore("useUserStore", {
  state: () => ({
    name: "",
    avatarUrl: "",
    email: "",
  }),
  actions: {
    getData() {
      const storedAuth =
        localStorage.getItem("sb-sofxledwuwikccvjhpdg-auth-token") || "";
      const auth = JSON.parse(storedAuth);
      const { name, avatar_url, email } = auth.user.user_metadata;
      if (auth) {
        this.name = name ?? email!.split("@")[0];
        this.avatarUrl = avatar_url;
        this.email = email;
      }
    },
  },
});
