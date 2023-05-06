import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/register";
import Chat from "./pages/chat";
import NotFound from "./component/notFound";
import Conversation from "./pages/conversation"

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login></Login>}></Route>
        <Route path="/register" element={<Register></Register>}></Route>
        <Route path="/inbox" element={<Conversation></Conversation>}></Route>
        <Route path="/inbox/:id" element={<Chat></Chat>}></Route>
        <Route path="*" element={<NotFound></NotFound>}></Route>
      </Routes>
    </div>
  );
}

export default App;
