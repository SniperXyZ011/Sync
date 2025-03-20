import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "../redux/messageSlice";
import { socketManager } from "../utils/socketManager";

const useGetRealTimeMessage = () => {
    const {messages} = useSelector(store=>store.message);
    const dispatch = useDispatch();
    
    useEffect(()=>{
        const socket = socketManager.getSocket();
        if (!socket) return;

        const handleNewMessage = (newMessage) => {
            dispatch(setMessages([...(messages || []), newMessage]));
        };

        socket.on("newMessage", handleNewMessage);
        
        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    },[dispatch, messages]);
};

export default useGetRealTimeMessage;