import { apiSlice } from "../api/apiSlice";

export const conversationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: (email) =>
        `/conversations?participants=${email}&sort=timestamp&order=desc&page=1&limit=${
          import.meta.env.VITE_CONVERSATION_PER_PAGE
        }`,
    }),
    getConversation: builder.query({
      query: ({ myEmail, participantEmail }) =>
        `/conversations?participants=${myEmail}-${participantEmail}&participants=${participantEmail}-${myEmail}`,
    }),
    addConversation: builder.mutation({
      query: (data) => ({
        url: "/conversations",
        method: "POST",
        body: data,
      }),
    }),
    editConversation: builder.mutation({
      query: ({ id, data }) => ({
        url: `/conversations/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetConversationQuery,
  useAddConversationMutation,
  useEditConversationMutation,
} = conversationApi;
