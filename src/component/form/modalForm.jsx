import React, { useEffect, useState } from "react";
import debounce from "../../utils/debounce";
import { useGetUsersQuery, usersApi } from "../../feature/users/usersApi";
import { useDispatch, useSelector } from "react-redux";
import Error from "../ui/error";
import isValidEmail from "../../utils/isValidEmail";
import {
  conversationApi,
  useAddConversationMutation,
  useEditConversationMutation,
} from "../../feature/conversation/conversationApi";

export default function ModalForm({ control }) {
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const { user } = useSelector((state) => state.auth);
  const [participants, setParticipants] = useState({});
  const [conversation, setConversation] = useState(undefined);
  // without dispatch to get user
  // const [userCheck, setUserCheck] = useState(false);
  // const { data, isLoading, isError } = useGetUsersQuery(to, {
  //   skip: !toggle,
  // });
  const [
    addConversation,
    { isSuccess: isAddConversationSuccess, error: conversationError },
  ] = useAddConversationMutation();
  const [editConversation, { isSuccess: isEditConversationSuccess }] =
    useEditConversationMutation();
  // listen conversation add/edit success
  useEffect(() => {
    if (isAddConversationSuccess || isEditConversationSuccess) {
      control(false);
    }
  }, [isAddConversationSuccess, isEditConversationSuccess]);
  useEffect(() => {
    if (to) {
      dispatch(
        conversationApi.endpoints.getConversation.initiate({
          myEmail: user.email,
          participantEmail: to,
        })
      )
        .unwrap()
        .then(({ data }) => {
          setConversation(data);
        })
        .catch((err) => {
          setError("There was an error");
        });
    }
  }, [to]);
  const doSearch = async (e) => {
    try {
      const email = e.target.value;
      if (isValidEmail(email)) {
        // dispatch use to get user
        const { user } =
          (await dispatch(
            usersApi.endpoints.getUsers.initiate(email)
          ).unwrap()) || {};
        if (user?.email) {
          setParticipants(user);
          setError("");
          setTo(user?.email);
        }
      } else if (email !== "") {
        setTo("");
        setError("Email is not valid");
      } else {
        setTo("");
        setError("");
      }
    } catch (err) {
      setTo("");
      setError(err?.data?.message);
    }
  };
  // check user in database
  const handleUser = debounce(doSearch, 500);
  //new conversation handler or not update conversation handler
  const handleConversation = (e) => {
    e.preventDefault();
    if (to && message) {
      if (conversation?.length > 0) {
        // edit conversation
        const conversationId = conversation[0]._id;
        editConversation({
          id: conversationId,
          data: {
            participants: `${user?.email}-${to}`,
            users: [user, participants],
            message,
            timestamp: Date.now(),
          },
        });
      } else if (conversation?.length === 0) {
        // edit conversation
        addConversation({
          sender: user?.email,
          data: {
            participants: `${user?.email}-${to}`,
            users: [user, participants],
            message,
            timestamp: Date.now(),
          },
        });
      }
    }
  };
  return (
    <form onSubmit={handleConversation} className="mt-8 space-y-6">
      <input type="hidden" name="remember" value="true" />
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="to" className="sr-only">
            To
          </label>
          <input
            onChange={handleUser}
            id="to"
            name="to"
            type="to"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
            placeholder="Send to"
          />
        </div>
        <div>
          <label htmlFor="message" className="sr-only">
            Message
          </label>
          <textarea
            onChange={(e) => setMessage(e.target.value)}
            id="message"
            name="message"
            type="message"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
            placeholder="Message"
          />
        </div>
      </div>

      <div>
        <button
          disabled={to === user.email || conversation === undefined}
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
        >
          Send Message
        </button>
      </div>

      {error && <Error message={error} />}
      {user.email === to && (
        <Error message={"You don't conversation with yourself"} />
      )}
    </form>
  );
}
