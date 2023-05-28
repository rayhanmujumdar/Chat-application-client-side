import ChatItem from "./ChatItem";
import { useDispatch, useSelector } from "react-redux";
import {
  conversationApi,
  useGetConversationsQuery,
} from "../feature/conversation/conversationApi";
import Loading from "./ui/Loading";
import Error from "./ui/Error";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";

export default function ChatItems() {
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { user } = useSelector((state) => state.auth) || {};
  const { data, isLoading, isError } = useGetConversationsQuery(user?.email);
  const { data: conversations, totalCount } = data || {};
  const dispatch = useDispatch();
  useEffect(() => {
    if (page > 1) {
      dispatch(
        conversationApi.endpoints.getMoreConversations.initiate({
          email: user?.email,
          page,
        })
      );
    }
  }, [page, dispatch, user?.email]);
  useEffect(() => {
    if (totalCount > 0) {
      const isFetchData =
        Math.ceil(
          totalCount / Number(import.meta.env.VITE_CONVERSATION_PER_PAGE)
        ) > page;
      setHasMore(isFetchData);
    }
  }, [totalCount, page]);
  const fetchMoreConversation = () => {
    setPage((prev) => prev + 1);
  };
  // decide what to renders
  let content = null;
  if (isLoading && !isError) {
    content = <Loading></Loading>;
  } else if (!isLoading && isError) {
    content = <Error message="There was an error occur"></Error>;
  } else if (!isLoading && !isError && conversations?.data?.length === 0) {
    content = <Error message="No conversation"></Error>;
  } else if (!isLoading && !isError && conversations?.data?.length > 0) {
    content = (
      <InfiniteScroll
        dataLength={conversations?.length || 0}
        next={fetchMoreConversation}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        height={window.innerHeight - 129}
      >
        {conversations.data.map((conversation) => (
          <ChatItem
            key={conversation._id}
            conversation={conversation}
          ></ChatItem>
        ))}
      </InfiniteScroll>
    );
  }
  return <ul>{content}</ul>;
}
