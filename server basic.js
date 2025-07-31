const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// allow cross origin requests
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// messages array
let messages = [];

// --- Socket.IO ---
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // send all messages to the client
    socket.emit("userId", socket.id);
    socket.emit("allMessages", messages);

    // Listen for drawing requests
    // message object: { message: string, username: string, userId: string }
    // handle malformed messages gracefully
    socket.on('sendMessage', async (message) => {
        console.log("Received message:", message);
        if (!message.message) {
            message.message = "... empty message";
        }

        if (!message.username) {
            message.username = "anonymous";
        }
        message.timestamp = new Date().toLocaleTimeString();
        message.userId = socket.id;

        messages.push(message);
        // send message to all clients
        io.emit("newMessage", message);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// --- Start Server ---
server.listen(3000, () => {
    console.log(`Server running at http://localhost:3000/`);
});