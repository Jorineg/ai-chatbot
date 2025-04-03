require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const { GoogleGenAI } = require("@google/genai");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const SYSTEM_INSTRUCTION = "always answer in rhymes";

if (!GEMINI_API_KEY) {
    console.error("ERROR: GEMINI_API_KEY not set in .env file!");
    process.exit(1);
}

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const chat = genAI.chats.create({
    model: "gemini-2.0-flash",
    config: {
        systemInstruction: SYSTEM_INSTRUCTION,
    }
})

// Serve static files
app.use(express.static('public'));

// --- Socket.IO ---
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Listen for drawing requests
    socket.on('message', async (message) => {
        console.log("Received message:", message);
        let response = await chat.sendMessage({ message: message });
        response = response.text; // Extract text from response
        console.log("AI Response:", response);
        socket.emit("response", response); // Send AI response back to client
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// --- Start Server ---
server.listen(3000, () => {
    console.log(`Server running at http://localhost:3000/`);
});