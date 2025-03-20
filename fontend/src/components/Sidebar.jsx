import React, { useState } from "react";
import OtherUsers from "./OtherUsers.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setAuthUser, setOtherUsers } from "../redux/userSlice.js";
import { setMessages } from "../redux/messageSlice.jsx";

const Sidebar = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { otherUsers } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const handleLogOut = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/user/logout"
      );
      console.log(response.data.message);
      toast.success(response.data.message);
      navigate("/login");
      dispatch(setAuthUser(null));
      dispatch(setMessages(null));
      dispatch(setOtherUsers(null));
      dispatch(setSelectedUser(null));
    } catch (e) {
      console.error(e);
    }
  };

  const searchHandler = (e) => {
    e.preventDefault();
    const convoUser = otherUsers?.find((user) =>
      user.fullName.toLowerCase().includes(search.toLowerCase())
    );

    if (convoUser) {
      dispatch(setOtherUsers([convoUser]));
    } else {
      toast.error("User not found!");
    }
  };

  return (
    <div className="border-r border-slate-500 p-4 flex flex-col">
      <form onSubmit={searchHandler} className="flex items-center gap-2">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          className="input input-bordered rounded-md bg-white"
          type="text"
          placeholder="search..."
        />
        <button
          type="submit"
          className="btn border-white bg-gray-500 text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </form>
      <div className="divider px-3"></div>
      <OtherUsers />
      <div className="mt-2">
        <button
          onClick={handleLogOut}
          className="btn btn-sm bg-gray-600 text-white"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
