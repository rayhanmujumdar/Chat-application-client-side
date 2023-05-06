import React from "react";
import Navbar from "../component/navbar";
import ChatList from "../component/chatList";
import Layout from "../component/layout";
import Blank from "../component/blank";

function Conversation() {
  return (
    <div>
      <Navbar></Navbar>
      <Layout>
        <ChatList></ChatList>
        <div className="w-full lg:col-span-2 lg:block">
          <div className="w-full grid conversation-row-grid">
            <Blank />
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default Conversation;
