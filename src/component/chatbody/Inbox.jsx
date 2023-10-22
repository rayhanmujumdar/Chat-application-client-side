import React from "react";
import Messages from "./Messages";
import MessageInputFrom from "../form/MessageInputFrom";
import { useParams } from "react-router-dom";
import { useGetMessagesQuery } from "../../feature/messages/messageApi";
import Loading from "../ui/Loading";
import Error from "../ui/Error";
import ChatHead from "./ChatHead";

export default function Inbox() {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetMessagesQuery(id) || {};
  const { data: messages, totalCount } = data || {};

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
        <Messages messages={messages.data} totalCount={totalCount}/>
        <MessageInputFrom info={messages.data[0]} />
      </>
    );
  }
  return (
    <div className="w-full lg:col-span-2 lg:block">
      <div className="w-full grid conversation-row-grid">{content}</div>
    </div>
  );
}
