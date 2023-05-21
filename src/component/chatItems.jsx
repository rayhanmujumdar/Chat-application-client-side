import React from "react";
import ChatItem from "../component/chatItem";
import { useSelector } from "react-redux";
import { useGetConversationsQuery } from "../feature/conversation/conversationApi";
import Loading from "./ui/loading";
import Error from "./ui/error";

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
    content = conversations.data.map((conversation) => (
      <ChatItem key={conversation._id} conversation={conversation}></ChatItem>
    ));
  }
  return <ul>{content}</ul>;
}
