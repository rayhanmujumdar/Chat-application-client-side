import { useEffect, useState } from "react";
import { useRegisterMutation } from "../../feature/auth/authApi";
import { Link, useNavigate } from "react-router-dom";
import Error from "../ui/Error";

export default function RegisterFrom() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const [register, { data, isLoading, error: responseError }] =
    useRegisterMutation();
  useEffect(() => {
    if (data?.accessToken && data?.user) {
      navigate("/inbox");
    }
    if (responseError?.data) {
      setError(responseError.data.message);
    }
  }, [data, responseError]);
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (confirmPassword !== password) {
      setError("Password does not match");
    } else {
      register({
        name,
        email,
        password,
      });
    }
  };
  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <input type="hidden" name="remember" value="true" />
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="name" className="sr-only">
            Full Name
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            id="name"
            name="Name"
            type="Name"
            autoComplete="Name"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
            placeholder="Name"
          />
        </div>

        <div>
          <label htmlFor="email-address" className="sr-only">
            Email address
          </label>
          <input
            id="email-address"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            name="email"
            type="email"
            autoComplete="email"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
            placeholder="Email address"
          />
        </div>

        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
            placeholder="Password"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="sr-only">
            Confirm Password
          </label>
          <input
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="current-confirmPassword"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
            placeholder="confirmPassword"
          />
        </div>
      </div>
      <div
        style={{ marginTop: "10px" }}
        className="flex items-center justify-end mt-2"
      >
        <div className="text-sm">
          <Link
            to="/"
            className="font-medium text-violet-600 hover:text-violet-500"
          >
            I have already an account!
          </Link>
        </div>
      </div>
      <div style={{ marginTop: "10px" }} className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="agree"
            name="agree"
            type="checkbox"
            onChange={(e) => setAgree(e.target.checked)}
            checked={agree}
            required
            className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
          />
          <label
            htmlFor="accept-terms"
            className="ml-2 block text-sm text-gray-900"
          >
            Agreed with the terms and condition
          </label>
        </div>
      </div>

      <div>
        <button
          disabled={isLoading}
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
        >
          <span className="absolute left-0 inset-y-0 flex items-center pl-3"></span>
          Sign up
        </button>
      </div>
      {error && <Error message={error}></Error>}
    </form>
  );
}
