import React from "react";
import Messages from "./messages";
import MessageInputFrom from "../form/messageInputFrom";
import { useParams } from "react-router-dom";
import { useGetMessagesQuery } from "../../feature/messages/messageApi";
import Loading from "../ui/loading";
import Error from "../ui/error";
import ChatHead from "./chatHead";

export default function Inbox() {
  const { id } = useParams();
  const { data: messages, isLoading, isError } = useGetMessagesQuery(id);

  //decide what to render
  let content = null;
  if (isLoading) {
    content = <Loading></Loading>;
  } else if (!isLoading && isError) {
    content = <Error message="There was an error"> </Error>;
  } else if (!isLoading && !isError && messages?.data?.length === 0) {
    content = <Error message="Messages not found"></Error>;
  } else if (!isLoading && !isError && messages?.data?.length > 0) {
    content = (
      <>
        <ChatHead message={messages.data[0]} />
        <Messages messages={messages.data} />
        <MessageInputFrom info={messages.data[0]}/>
      </>
    );
  }
  return (
    <div className="w-full lg:col-span-2 lg:block">
      <div className="w-full grid conversation-row-grid">{content}</div>
    </div>
  );
}
