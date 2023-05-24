import { apiSlice } from "../api/apiSlice";
import Pusher from "pusher-js";
// import socket from "../../utils/socket";
export const messageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // endpoints here
    getMessages: builder.query({
      query: (id) =>
        `/messages?conversationId=${id}&sort=timestamp&order=asc&page=1`,
      onCacheEntryAdded: async (
        args,
        { cacheDataLoaded, updateCachedData, cacheEntryRemoved }
      ) => {
        try {
          await cacheDataLoaded;
          const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
            cluster: import.meta.env.VITE_PUSHER_CLUSTER,
          });
          const channel = pusher.subscribe(
            import.meta.env.VITE_PUSHER_CHANNEL_NAME
          );
          channel.bind("message", function (data) {
            updateCachedData((draft) => {
              if (data.data.conversationId === args) {
                draft.data.push(data.data);
              }
            });
          });
          // TODO: socket.io use in this below:
          // socket.on("message", (data) => {
          //   console.log(data)
          //   updateCachedData((draft) => {
          //     if (data.data.conversationId === args) {

          //       draft.data.push(data.data);
          //     }
          //     // console.log(JSON.parse(JSON.stringify(draft)))
          //   });
          // });
        } catch (err) {
          console.log(err);
        }
        await cacheEntryRemoved;
        // socket.close();
      },
    }),
    //TODO: &limit=${import.meta.env.VITE_MESSAGE_PER_PAGE}
    addMessage: builder.mutation({
      query: (data) => ({
        url: "/messages",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetMessagesQuery, useAddMessageMutation } = messageApi;
