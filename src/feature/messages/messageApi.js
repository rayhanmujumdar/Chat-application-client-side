import { apiSlice } from "../api/apiSlice";

export const messageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // endpoints here
    getMessage: builder.query({
      query: (id) =>
        `/messages?conversationId=${id}&sort=timestamp&order=asc&page=1&limit=${
          import.meta.env.VITE_MESSAGE_PER_PAGE
        }`,
    }),
    addMessage: builder.mutation({
      query: (data) => ({
        url: "/messages",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetMessageQuery, useAddMessageMutation } = messageApi;
