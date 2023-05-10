import { apiSlice } from "../api/apiSlice";

export const conversationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversation: builder.query({
      query: (email) =>
        `/conversation?participants=${email}&sort=timestamp&order=desc&page=1&limit=${
          import.meta.env.VITE_CONVERSATION_PER_PAGE
        }`,
    }),
    // addConversation: 
  }),
});

export const { useGetConversationQuery } = conversationApi;
