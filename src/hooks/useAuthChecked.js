import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { userLoggedIn } from "../feature/auth/authSlice";

export default function useAuthChecked() {
  const [authCheck, setAuthCheck] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const localAuth = localStorage.getItem("auth");
    const auth = JSON.parse(localAuth);
    if (auth?.accessToken && auth?.user) {
      dispatch(
        userLoggedIn({
          accessToken: auth?.accessToken,
          user: auth?.user,
        })
      );
    }
    setAuthCheck(true);
  }, []);
  return authCheck;
}
