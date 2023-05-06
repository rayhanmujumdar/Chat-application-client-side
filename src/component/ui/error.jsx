import React from "react";

export default function Error({ message }) {
  return (
    <div className="text-sm text-white bg-red-400 py-3 px-2 rounded-md">
      <p>{message} </p>
    </div>
  );
}
