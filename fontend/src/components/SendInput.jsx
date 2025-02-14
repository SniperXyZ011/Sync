import React from "react";
import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";



const SendInput = () => {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const {messages} = useSelector(store => store.message);
  const selectedUser = useSelector((store) => store.user.selectedUser);

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    if (!selectedUser?._id) {
      alert("Please select a user to send a message.");
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:8080/api/v1/message/send/${selectedUser?._id}`,
        { message: message },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(res.data.message.message);
      dispatch(setMessages([...messages, res.data.message]));
      setMessage("");
    } catch (err) {
      console.log(err);
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <form onSubmit={sendMessageHandler}>
      <div className="p-2 w-full relative">
        <input
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          type="text"
          placeholder="send something..."
          className="border text-sm rounded-lg block w-full bg-gray-600 text-white p-2 placeholder-white outline-none"
        />
        <button
          className="absolute flex items-center inset-y-0 end-0 pr-4"
          type="submit"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5"
          >
            <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z" />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default SendInput;
