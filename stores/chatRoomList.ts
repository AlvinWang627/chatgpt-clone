export const useChatRoomList = defineStore("useChatRoomList", {
  state: (): DataType => ({
    chatRoomData: [
      {
        chat_id: "",
        chat_name: "",
        created_at: new Date(),
        id: 0,
      },
    ],
    sidebarLoading: false,
  }),
  actions: {
    async getData() {
      try {
        this.chatRoomData = await $fetch("/api/chatRoomList", {
          method: "get",
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
});
interface DataType {
  chatRoomData: {
    chat_id: string;
    chat_name: string;
    created_at: Date;
    id: number;
  }[];
  sidebarLoading: boolean;
}
