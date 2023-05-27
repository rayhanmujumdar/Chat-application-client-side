import ChatItem from "./ChatItem";
import { useSelector } from "react-redux";
import { useGetConversationsQuery } from "../feature/conversation/conversationApi";
import Loading from "./ui/Loading";
import Error from "./ui/Error";
import InfiniteScroll from "react-infinite-scroll-component";

export default function ChatItems() {
  const { user } = useSelector((state) => state.auth) || {};
  const {
    data: conversations,
    isLoading,
    isError,
  } = useGetConversationsQuery(user?.email);
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
        next={() => console.log("fetching")}
        hasMore={true}
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
