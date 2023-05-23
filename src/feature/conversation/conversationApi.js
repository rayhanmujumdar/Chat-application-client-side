import { apiSlice } from "../api/apiSlice";
import { messageApi } from "../messages/messageApi";
import socket from "../../utils/socket";

export const conversationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: (email) =>
        `/conversations?participants=${email}&sort=timestamp&order=desc&page=1&limit=${
          import.meta.env.VITE_CONVERSATION_PER_PAGE
        }`,
      onCacheEntryAdded: async (
        args,
        { cacheDataLoaded, updateCachedData, cacheEntryRemoved }
      ) => {
        try {
          await cacheDataLoaded;
          socket.on("conversation", (data) => {
            updateCachedData((draft) => {
              const draftConversation = draft.data.find(
                (conversation) => conversation._id === data.data._id
              );
              // console.log(JSON.parse(JSON.stringify(draftConversation)));
              if (draftConversation?._id) {
                draftConversation.message = data.data.message;
                draftConversation.timestamp = data.data.timestamp;
              }
            });
          });
        } catch (err) {}
        await cacheEntryRemoved;
        socket.close();
      },
    }),
    getConversation: builder.query({
      query: ({ myEmail, participantEmail }) =>
        `/conversations?participants=${myEmail}-${participantEmail}&participants=${participantEmail}-${myEmail}`,
    }),
    addConversation: builder.mutation({
      query: ({ data }) => ({
        url: "/conversations",
        method: "POST",
        body: data,
      }),
      _onQueryStarted: async (
        { sender, data },
        { queryFulfilled, dispatch }
      ) => {
        try {
          const {
            data: { data: conversation },
          } = await queryFulfilled;
          // Pessimistic cache update start
          dispatch(
            apiSlice.util.updateQueryData(
              "getConversations",
              sender,
              (draft) => {
                draft.data.push(conversation);
              }
            )
          );
          // Pessimistic cache update end
          if (conversation?._id) {
            const senderUser = conversation.users.find(
              (user) => user.email === sender
            );
            const receiverUser = conversation.users.find(
              (user) => user.email !== sender
            );
            const { data: messageResult } = await dispatch(
              messageApi.endpoints.addMessage.initiate({
                conversationId: conversation._id,
                sender: senderUser,
                receiver: receiverUser,
                message: data.message,
                timestamp: data.timestamp,
              })
            ).unwrap();
            // pessimistic cache update start
            dispatch(
              apiSlice.util.updateQueryData(
                "getMessages",
                messageResult.conversationId,
                (draft) => {
                  draft.data.push(messageResult);
                }
              )
            );
            // pessimistic cache update end
          }
        } catch (err) {
          optimisticAddConversation.undo();
          console.log(err);
        }
      },
      get onQueryStarted() {
        return this._onQueryStarted;
      },
      set onQueryStarted(value) {
        this._onQueryStarted = value;
      },
    }),
    editConversation: builder.mutation({
      query: ({ id, data }) => ({
        url: `/conversations/${id}`,
        method: "PATCH",
        body: data,
      }),
      onQueryStarted: async (
        { id, sender, data },
        { queryFulfilled, dispatch }
      ) => {
        // optimistic cache update start
        const optimisticUpdateConversation = dispatch(
          apiSlice.util.updateQueryData("getConversations", sender, (draft) => {
            const draftConversation = draft?.data?.find(
              (conversation) => conversation._id === id
            );
            draftConversation.message = data.message;
            draftConversation.timestamp = data.timestamp;
          })
        );
        // optimistic cache update end
        try {
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
            // silent entry to message section
            dispatch(
              messageApi.endpoints.addMessage.initiate({
                conversationId: conversation._id,
                sender: senderUser,
                receiver: receiverUser,
                message: data.message,
                timestamp: data.timestamp,
              })
            );
            // pessimistic cache update start
            // dispatch(
            //   apiSlice.util.updateQueryData(
            //     "getMessages",
            //     messageResult.conversationId,
            //     (draft) => {
            //       draft.data.push(messageResult);
                  // console.log(JSON.parse(JSON.stringify(draft)))
            //     }
            //   )
            // );
            // pessimistic cache update end
          }
        } catch (err) {
          optimisticUpdateConversation.undo();
          console.log(err);
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
