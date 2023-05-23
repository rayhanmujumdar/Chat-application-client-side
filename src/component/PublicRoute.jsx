import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
export default function PublicRoute({ children }) {
  const isAuth = useAuth();
  return !isAuth ? children : <Navigate to="/inbox" />;
}
