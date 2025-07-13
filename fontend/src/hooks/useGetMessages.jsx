import React from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setMessages } from '../redux/messageSlice';

const useGetMessages = () => {
    const { selectedUser } = useSelector(store => store.user);
    const dispatch = useDispatch();
    console.log("This was called");

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                console.log(selectedUser?._id);
                axios.defaults.withCredentials = true;
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/message/${selectedUser?._id}`);
                console.log(response.data);                
                if (response.data.length === 0) {
                    dispatch(setMessages([])); // Clear messages if none are found
                    return;
                }

                
                if (response.status === 200 && response.data) {
                    dispatch(setMessages(response.data));
                } else {
                    console.error("Unexpected response status:", response.status);
                }
            } catch (err) {
                console.error("Error fetching messages:", err);
            }
        };

        if (selectedUser?._id) {
            fetchMessages();
        }
    }, [selectedUser]);
};

export default useGetMessages;
