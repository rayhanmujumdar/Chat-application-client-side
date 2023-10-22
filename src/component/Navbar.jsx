// import logo from "../assets/dingu logo.png";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLoggedOut } from "../feature/auth/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const handleLoggedOut = () => {
    localStorage.clear();
    dispatch(userLoggedOut());
  };
  return (
    <nav className="border-general sticky top-0 z-40 border-b bg-violet-700 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between h-16 items-center">
          {/* <img className="h-10" src={logo} /> */}
          <p className="mx-3 px-3 py-2 justify-center items-center bg-violet-600 text-white text-2xl font-semibold font-sans rounded-lg">
            <span>Dingu</span> <span> Chat Application</span>
          </p>
          <ul>
            <li onClick={handleLoggedOut} className="text-white bg-violet-600 p-3 rounded-md">
              <Link to="/">Logout</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
