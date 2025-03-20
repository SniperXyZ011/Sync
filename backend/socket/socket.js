import {Server} from "socket.io";
import http from "http";
import express from "express";
import { Message } from "../models/messageModel.js";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin:['http://localhost:5173'],
        methods:['GET', 'POST'],
    },
});

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

const userSocketMap = {}; // {userId->socketId}

io.on('connection', (socket)=>{
    const userId = socket.handshake.query.userId
    if(userId !== undefined){
        userSocketMap[userId] = socket.id;
    } 

    io.emit('getOnlineUsers',Object.keys(userSocketMap));

    // Handle typing events
    socket.on('typing', (data) => {
        const receiverSocketId = getReceiverSocketId(data.receiverId);
        if(receiverSocketId) {
            io.to(receiverSocketId).emit('userTyping', {
                senderId: data.senderId,
                isTyping: true
            });
        }
    });

    socket.on('stopTyping', (data) => {
        const receiverSocketId = getReceiverSocketId(data.receiverId);
        if(receiverSocketId) {
            io.to(receiverSocketId).emit('userTyping', {
                senderId: data.senderId,
                isTyping: false
            });
        }
    });

    // Handle message edit
    socket.on('messageEdit', async (data) => {
        try {
            const { messageId, newMessage, receiverId } = data;
            const message = await Message.findById(messageId);
            
            if (message) {
                // Save current message to history
                message.editHistory.push({
                    message: message.message,
                    editedAt: new Date()
                });
                
                // Update message
                message.message = newMessage;
                message.isEdited = true;
                await message.save();

                // Notify receiver about edit
                const receiverSocketId = getReceiverSocketId(receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('messageUpdated', {
                        messageId,
                        newMessage,
                        isEdited: true
                    });
                }
            }
        } catch (error) {
            console.error('Error editing message:', error);
        }
    });

    // Handle message delete
    socket.on('messageDelete', async (data) => {
        try {
            const { messageId, receiverId } = data;
            await Message.findByIdAndUpdate(messageId, {
                isDeleted: true
            });

            // Notify receiver about deletion
            const receiverSocketId = getReceiverSocketId(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('messageDeleted', {
                    messageId
                });
            }
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    });

    // Handle message read status
    socket.on('messageRead', async (data) => {
        try {
            // Update message read status in database
            await Message.updateMany(
                { 
                    senderId: data.senderId,
                    receiverId: data.receiverId,
                    read: false
                },
                { read: true }
            );

            // Notify sender that messages were read
            const senderSocketId = getReceiverSocketId(data.senderId);
            if(senderSocketId) {
                io.to(senderSocketId).emit('messagesRead', {
                    senderId: data.senderId,
                    receiverId: data.receiverId
                });
            }
        } catch (error) {
            console.error('Error updating message read status:', error);
        }
    });

    socket.on('disconnect', ()=>{
        delete userSocketMap[userId];
        io.emit('getOnlineUsers',Object.keys(userSocketMap));
    })
});

export {app, io, server};
