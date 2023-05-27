import Message from "./Message";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";
import { messageApi } from "../../feature/messages/messageApi";

export default function Messages({ messages = [], totalCount = 0 }) {
  const user = useSelector((state) => state.auth.user) || {};
  const { email } = user || {};
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const dispatch = useDispatch();
  const fetchMore = () => {
    setPage((prevPage) => prevPage + 1);
  };
  useEffect(() => {
    if (totalCount > 0) {
      const more =
        Math.ceil(totalCount / Number(import.meta.env.VITE_MESSAGE_PER_PAGE)) >
        page;
      setHasMore(more);
    }
  }, [totalCount, page]);
  useEffect(() => {
    if (page > 1) {
      dispatch(
        messageApi.endpoints.getMoreMessages.initiate({
          id: messages[0]?.conversationId,
          page,
        })
      );
    }
  }, [page, dispatch, messages]);
  return (
    <div className="relative w-full p-6 h-[calc(100vh_-_129px)] flex flex-col-reverse">
      <ul id="scrollableDiv" className="space-y-2">
        <InfiniteScroll
          dataLength={messages?.length}
          next={fetchMore}
          hasMore={hasMore}
          inverse={true}
          loader={<h4>Loading...</h4>}
          height={window.innerHeight - 129}
          style={{ display: "flex", flexDirection: "column-reverse" }}
          scrollableTarget="scrollableDiv"
        >
          {messages.map((message) => {
            const { message: lastMessage, _id, sender } = message || {};
            const justify = sender?.email !== email ? "start" : "end";
            return (
              <Message
                key={_id}
                justify={justify}
                message={lastMessage}
              ></Message>
            );
          })}
        </InfiniteScroll>
      </ul>
    </div>
  );
}
