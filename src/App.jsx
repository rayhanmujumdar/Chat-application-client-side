import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import NotFound from "./component/NotFound";
import Conversation from "./pages/Conversation";
import useAuthChecked from "./hooks/useAuthChecked";
import PrivateRoute from "./component/PrivateRoute";
import PublicRoute from "./component/PublicRoute";

function App() {
  const authCheck = useAuthChecked();
  return !authCheck ? (
    "Authentication Checking....."
  ) : (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      ></Route>
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      ></Route>
      <Route
        path="/inbox"
        element={
          <PrivateRoute>
            <Conversation />
          </PrivateRoute>
        }
      ></Route>
      <Route
        path="/inbox/:id"
        element={
          <PrivateRoute>
            <Chat></Chat>
          </PrivateRoute>
        }
      ></Route>
      <Route path="*" element={<NotFound></NotFound>}></Route>
    </Routes>
  );
}

export default App;
