import React from "react";
import Navbar from "../component/Navbar";
import ChatList from "../component/ChatList";
import Layout from "../component/Layout";
import Blank from "../component/Blank";

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
