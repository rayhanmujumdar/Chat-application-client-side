import React from "react";
import Message from "./message";
import { useSelector } from "react-redux";

export default function Messages({ messages = [] }) {
  const user = useSelector((state) => state.auth.user) || {};
  const { email } = user || {};
  return (
    <div className="relative w-full p-6 overflow-y-auto flex flex-col-reverse">
      <ul className="space-y-2">
        {messages.map((message) => {
          const { message: lastMessage, _id, sender } = message || {};
          const justify = sender?.email !== email ? "start" : "end";
          return <Message key={_id} justify={justify} message={lastMessage}></Message>;
        })}
      </ul>
    </div>
  );
}
