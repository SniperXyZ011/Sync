import React, {useEffect, useRef} from "react";
import { useSelector } from "react-redux";

const Message = ({message}) => {
  const scroll = useRef();
  const {authUser, selectedUser} = useSelector(state => state.user);
  useEffect(() => {
    scroll.current?.scrollIntoView({behavior: 'smooth'}); // this makes sure the scroll position is correct
  }, [message]);
  return (
      <div className={`chat ${authUser?._id == message.senderId ? 'chat-end' : 'chat-start'}`} ref={scroll}>
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img
              alt="Tailwind CSS chat bubble component"
              src={`${message?.senderId  === authUser?._id ? authUser?.profilePhoto : selectedUser?.profilePhoto}`}
            />
          </div>
        </div>
        <div className="chat-header">
          <time className="text-xs opacity-50 text-white">12:45</time>
        </div>
        <div className="chat-bubble">{message?.message}</div>
      </div>
  );
};

export default Message;
