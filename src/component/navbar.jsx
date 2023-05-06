import React from "react";
import logo from "../assets/lws-logo-dark.svg";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLoggedOut } from "../feature/auth/authSlice";

export default function Navbar() {
  const dispatch = useDispatch()
  const handleLoggedOut = () => {
    dispatch(userLoggedOut())
  };
  return (
    <nav className="border-general sticky top-0 z-40 border-b bg-violet-700 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between h-16 items-center">
          <img className="h-10" src={logo} />
          <ul>
            <li onClick={handleLoggedOut} className="text-white">
              <Link to="/">Logout</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
