import { apiSlice } from "../api/apiSlice";
import socket from "../../utils/socket";
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
          socket.on("message", (data) => {
            updateCachedData((draft) => {
              if (data.data.conversationId === args) {
                
                draft.data.push(data.data);
              }
              // console.log(JSON.parse(JSON.stringify(draft)))
            });
          });
        } catch (err) {}
        await cacheEntryRemoved;
        socket.close();
      },
    }),
    // &limit=${import.meta.env.VITE_MESSAGE_PER_PAGE}
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
