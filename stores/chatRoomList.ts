export const useChatRoomList = defineStore("useChatRoomList", {
  state: (): DataType => ({
    chatRoomData: [
      {
        chat_id: "",
        chat_name: "",
        content: [],
        created_at: new Date(),
        id: 0,
        user_uid: "",
      },
    ],
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
    content: string[];
    created_at: Date;
    id: number;
    user_uid: string;
  }[];
}
