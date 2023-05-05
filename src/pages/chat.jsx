import React from "react";
import Navbar from "../component/navbar";
import ChatList from "../component/chatList";
import Inbox from "../component/chatbody/inbox";
import Layout from "../component/layout";

function Chat() {
  return (
    <div>
      <Navbar></Navbar>
      <Layout>
        <ChatList></ChatList>
        <Inbox></Inbox>
      </Layout>
    </div>
  );
}

export default Chat;
