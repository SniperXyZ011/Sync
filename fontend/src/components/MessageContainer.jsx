import React, { useEffect, useState } from "react";
import SendInput from "./SendInput";
import Messages from "./Messages";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import { socketManager } from "../utils/socketManager";

const MessageContainer = () => {
  const { selectedUser, authUser, onlineUsers } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [isTyping, setIsTyping] = useState(false);
  // console.log("Here is the data : "+ selectedUser.profilePhoto )
  const isOnline = onlineUsers?.includes(selectedUser?._id);

  useEffect(() => {
    const socket = socketManager.getSocket();
    if (!socket) return;

    socket.on('userTyping', (data) => {
      if (data.senderId === selectedUser?._id) {
        setIsTyping(data.isTyping);
      }
    });

    return () => {
      socket.off('userTyping');
    };
  }, [selectedUser]);

  useEffect(() => {
    return () => dispatch(setSelectedUser(null));
  }, []);

  return (
    <>
      {selectedUser != null ? (
        <div className="md:min-w-[550px] flex flex-col">
          <div className="flex items-center gap-2 rounded-md px-4 py-2 mb-2 bg-zinc-700 text-white">
            <div className={`avatar ${isOnline ? 'online' : ''}`}>
              <div className="w-10 rounded-full">
                <img src={selectedUser?.profilePhoto} />
              </div>
            </div>
            <div className="">
              <div className="gap-2">
                <p>{selectedUser?.fullName}</p>
                {isTyping && (
                  <p className="text-xs text-gray-300 animate-pulse">typing...</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <Messages />
          </div>
          <SendInput />
        </div>
      ) : (
        <div className="md:min-w-[550px] flex flex-col justify-center text-center">
          <h1 className="text-4xl text-gray-100 font-bold">Hi,{authUser?.fullName}</h1>
          <h1 className="text-3xl text-gray-100">
            Let's start the conversation
          </h1>
        </div>
      )}
    </>
  );
};

export default MessageContainer;
