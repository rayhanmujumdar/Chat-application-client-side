import { apiSlice } from "../api/apiSlice";
import { messageApi } from "../messages/messageApi";

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
      query: ({ sender, data }) => ({
        url: "/conversations",
        method: "POST",
        body: data,
      }),
      onQueryStarted: async (
        { sender, data },
        { queryFulfilled, dispatch }
      ) => {
        const {
          data: { data: conversation },
        } = await queryFulfilled;
        if (conversation?._id) {
          const senderUser = conversation.users.find(
            (user) => user.email === sender
          );
          const receiverUser = conversation.users.find(
            (user) => user.email !== sender
          );
          dispatch(
            messageApi.endpoints.addMessage.initiate({
              conversationId: conversation._id,
              sender: senderUser,
              receiver: receiverUser,
              message: data.message,
              timestamp: data.timestamp,
            })
          );
        }
      },
    }),
    editConversation: builder.mutation({
      query: ({ id, data,sender }) => ({
        url: `/conversations/${id}`,
        method: "PATCH",
        body: data,
      }),
      onQueryStarted: async (
        { sender, data },
        { queryFulfilled, dispatch }
      ) => {
        const {
          data: { data: conversation },
        } = await queryFulfilled;
        if (conversation?._id) {
          const senderUser = conversation.users.find(
            (user) => user.email === sender
          );
          const receiverUser = conversation.users.find(
            (user) => user.email !== sender
          );
          dispatch(
            messageApi.endpoints.addMessage.initiate({
              conversationId: conversation._id,
              sender: senderUser,
              receiver: receiverUser,
              message: data.message,
              timestamp: data.timestamp,
            })
          );
        }
      },
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetConversationQuery,
  useAddConversationMutation,
  useEditConversationMutation,
} = conversationApi;
