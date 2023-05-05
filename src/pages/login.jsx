import React from "react";
import LoginForm from "../component/form/loginForm";
import logo from "../assets/lws-logo-light.svg";

function Login() {
  return (
    <div className="grid place-items-center h-screen bg-[#F9FAFB">
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src={logo}
              alt="Learn with sumit"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <LoginForm></LoginForm>
        </div>
      </div>
    </div>
  );
}

export default Login;
