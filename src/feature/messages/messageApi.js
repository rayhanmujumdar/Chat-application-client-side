import { apiSlice } from "../api/apiSlice";
import Pusher from "pusher-js";
// import socket from "../../utils/socket";
export const messageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // endpoints here
    getMessages: builder.query({
      query: (id) =>
        `/messages?conversationId=${id}&sort=timestamp&order=desc&limit=${
          import.meta.env.VITE_MESSAGE_PER_PAGE
        }&page=1`,
      transformResponse: (response, meta) => {
        const totalCount = meta.response.headers.get("X-Total-Count");
        return { data: response, totalCount };
      },
      onCacheEntryAdded: async (
        args,
        { cacheDataLoaded, updateCachedData, cacheEntryRemoved }
      ) => {
        try {
          const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
            cluster: import.meta.env.VITE_PUSHER_CLUSTER,
          });
          const channel = pusher.subscribe(
            import.meta.env.VITE_PUSHER_CHANNEL_NAME
          );
          await cacheDataLoaded;
          channel.bind("message", function (data) {
            updateCachedData((draft) => {
              if (data.data.conversationId === args) {
                draft.data.data.unshift(data.data);
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
          // console.log(JSON.parse(JSON.stringify(draft)))
          //   });
          // });
        } catch (err) {
          console.log(err);
        }
        await cacheEntryRemoved;
        // socket.close();
      },
    }),
    getMoreMessages: builder.query({
      query: ({ id, page }) =>
        `/messages?conversationId=${id}&sort=timestamp&order=desc&limit=${
          import.meta.env.VITE_MESSAGE_PER_PAGE
        }&page=${page}`,
      onQueryStarted: async ({ id }, { queryFulfilled, dispatch }) => {
        try {
          const { data: messages } = await queryFulfilled;
          if (messages?.data?.length > 0) {
            dispatch(
              apiSlice.util.updateQueryData("getMessages", id, (draft) => {
                return {
                  data: {
                    data: [...draft.data.data, ...messages.data],
                  },
                  totalCount: Number(draft.totalCount),
                };
              })
            );
          }
        } catch (err) {
          console.log(err);
        }
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
