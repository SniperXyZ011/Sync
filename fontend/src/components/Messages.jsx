import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import useGetMessages from "../hooks/useGetMessages";
import { useSelector, useDispatch } from "react-redux";
import useGetRealTimeMessage from "../hooks/useGetRealTimeMessage";
import { socketManager } from "../utils/socketManager";
import { setMessages } from "../redux/messageSlice";

const Messages = () => {
    useGetMessages();
    useGetRealTimeMessage();
    const { messages } = useSelector(store => store.message);
    const { selectedUser, authUser } = useSelector(store => store.user);
    const dispatch = useDispatch();
    const messagesEndRef = useRef(null);
    const containerRef = useRef(null);
    const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
    const prevMessagesLengthRef = useRef(messages?.length || 0);

    const scrollToBottom = () => {
        if (shouldScrollToBottom) {
            messagesEndRef.current?.scrollIntoView({ block: 'nearest' });
        }
    };

    // Handle scroll events
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            // If user has scrolled up more than 100px from bottom, disable auto-scroll
            const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 100;
            setShouldScrollToBottom(isNearBottom);
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll to bottom on new messages or user change
    useEffect(() => {
        const currentLength = messages?.length || 0;
        const prevLength = prevMessagesLengthRef.current;

        // Scroll if:
        // 1. New message was added (length increased)
        // 2. User was changed (reset prevLength)
        // 3. Initial load (prevLength was 0)
        if (currentLength > prevLength || !prevLength) {
            scrollToBottom();
        }

        prevMessagesLengthRef.current = currentLength;
    }, [messages, selectedUser]);

    // Mark messages as read when they're viewed
    useEffect(() => {
        if (!messages || !selectedUser || !authUser) return;

        const unreadMessages = messages.filter(
            msg => msg.senderId === selectedUser._id && !msg.read
        );

        if (unreadMessages.length > 0) {
            const socket = socketManager.getSocket();
            if (socket) {
                socket.emit('messageRead', {
                    senderId: selectedUser._id,
                    receiverId: authUser._id
                });
            }
        }
    }, [messages, selectedUser, authUser]);

    // Listen for read receipts
    useEffect(() => {
        const socket = socketManager.getSocket();
        if (!socket) return;

        socket.on('messagesRead', (data) => {
            if (messages && selectedUser?._id === data.receiverId) {
                const updatedMessages = messages.map(msg => 
                    msg.senderId === authUser?._id ? { ...msg, read: true } : msg
                );
                dispatch(setMessages(updatedMessages));
            }
        });

        return () => {
            socket.off('messagesRead');
        };
    }, [messages, selectedUser, authUser, dispatch]);

    if (!messages || messages.length === 0) {
        return <div className="m-4 text-gray-100">No messages</div>;
    }

    return (
        <div 
            ref={containerRef}
            className="px-4 flex-1 overflow-y-auto"
        >
            {messages?.map((message) => (
                <Message key={message._id} message={message} />
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
}

export default Messages;
