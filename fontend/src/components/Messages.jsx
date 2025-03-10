import React from "react";
import Message from "./Message";
import useGetMessages from "../hooks/useGetMessages";
import { useSelector } from "react-redux";
import useGetRealTimeMessage from "../hooks/useGetRealTimeMessage";

const Messages  = () => {
    useGetMessages();
    useGetRealTimeMessage();
    const {messages} = useSelector(store => store.message);

    if (!messages || messages.length === 0) {
        return <div className="m-4 text-gray-100">No messages</div>;

    }

    return <div className="px-4 flex-1 overflow-auto scrollbar-width-none">
    {
        messages?.map((message) => {
            return <Message key={message._id} message={message} />
        })
    }
    </div>
}

export default Messages;
