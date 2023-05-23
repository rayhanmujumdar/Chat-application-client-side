import React from "react";
import gravatar from "gravatar";
import { useSelector } from "react-redux";

export default function ChatHead({ message }) {
  const user = useSelector((state) => state.auth.user) || {};
  const { sender, receiver } = message;
  const { name, email } = sender?.email === user.email ? receiver : sender || {};
  return (
    <div className="relative flex items-center p-3 border-b border-gray-300">
      <img
        className="object-cover w-10 h-10 rounded-full"
        src={gravatar.url(email, { size: "80" })}
        alt={name}
      />
      <span className="block ml-2 font-bold text-gray-600">{name}</span>
      <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3"></span>
    </div>
  );
}
