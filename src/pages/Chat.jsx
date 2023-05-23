import Navbar from "../component/Navbar";
import ChatList from "../component/ChatList";
import Inbox from "../component/chatbody/Inbox";
import Layout from "../component/Layout";

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
