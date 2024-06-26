import { apiSlice } from "../api/apiSlice";
import { messageApi } from "../messages/messageApi";
// import socket from "../../utils/socket";
import Pusher from "pusher-js";

export const conversationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: (email) =>
        `/conversations?participants=${email}&sort=timestamp&order=desc&page=1&limit=${
          import.meta.env.VITE_CONVERSATION_PER_PAGE
        }`,
      transformResponse: (response, meta) => {
        const totalCount = Number(meta.response.headers.get("X-Total-Count"));
        return {
          data: response,
          totalCount,
        };
      },
      onCacheEntryAdded: async (
        _args,
        { cacheDataLoaded, updateCachedData, cacheEntryRemoved }
      ) => {
        try {
          await cacheDataLoaded;
          const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
            cluster: import.meta.env.VITE_PUSHER_CLUSTER,
          });
          var channel = pusher.subscribe(
            import.meta.env.VITE_PUSHER_CHANNEL_NAME
          );
          channel.bind("conversation", function (data) {
            console.log(data);
            updateCachedData((draft) => {
              const draftConversation =
                draft.data.data.find(
                  (conversation) => conversation._id === data.data._id
                ) || {};
              if (draftConversation?._id) {
                draftConversation.message = data.data.message;
                draftConversation.timestamp = data.data.timestamp;
              } else {
                draft.data.push(data.data);
              }
            });
          });
          // TODO: socket.io use in this below:
          // socket.on("conversation", (data) => {
          //   updateCachedData((draft) => {
          //     const draftConversation = draft.data.find(
          //       (conversation) => conversation._id === data.data._id
          //     );
          //     // console.log(JSON.parse(JSON.stringify(draftConversation)));
          //     if (draftConversation?._id) {
          //       draftConversation.message = data.data.message;
          //       draftConversation.timestamp = data.data.timestamp;
          //     }
          //   });
          // });
        } catch (err) {
          console.log(err);
        }
        await cacheEntryRemoved;
        // socket.close();
      },
    }),
    getMoreConversations: builder.query({
      query: ({ email, page }) =>
        `/conversations?participants=${email}&sort=timestamp&order=desc&page=${page}&limit=${
          import.meta.env.VITE_CONVERSATION_PER_PAGE
        }`,
      onQueryStarted: async ({ email }, { queryFulfilled, dispatch }) => {
        try {
          const { data: conversations } = await queryFulfilled;
          dispatch(
            apiSlice.util.updateQueryData(
              "getConversations",
              email,
              (draft) => {
                console.log(JSON.parse(JSON.stringify(draft)));
                return {
                  data: {
                    data: [...draft.data.data, ...conversations.data],
                  },
                  totalCount: Number(draft.totalCount),
                };
              }
            )
          );
        } catch (err) {
          console.log(err);
        }
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
                draft.data.data.push(conversation);
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
                  const draftMessage = draft.data.data;
                  draftMessage.unshift(messageResult);
                }
              )
            );
            // pessimistic cache update end
          }
        } catch (err) {
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
        // optimistic conversation cache update start
        const optimisticUpdateConversation = dispatch(
          apiSlice.util.updateQueryData("getConversations", sender, (draft) => {
            const draftConversation =
              draft?.data?.data?.find(
                (conversation) => conversation._id === id
              ) || {};
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
            // TODO: i can use in this code if my cache data update in pessimistically
            // pessimistic cache update start
            // dispatch(
            //   apiSlice.util.updateQueryData(
            //     "getMessages",
            //     messageResult.conversationId,
            //     (draft) => {
            //       console.log(JSON.parse(JSON.stringify(draft)));
            //       draft.data.push(messageResult);
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
