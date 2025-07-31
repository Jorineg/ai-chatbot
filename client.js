const serverURL = "http://localhost:3000";
let userId = null;

// Wait for the HTML document to be fully loaded before running script
document.addEventListener('DOMContentLoaded', () => {

    const socket = io(serverURL); // Connect to Socket.IO server

    // Get references to DOM elements
    const usernameInput = document.getElementById('usernameInput');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const chatContainer = document.getElementById('chat-container');

    socket.on('userId', (id) => {
        userId = id;
    });

    socket.on('allMessages', (messages) => {
        console.log("Received messages:", messages);
        chatContainer.innerHTML = ''; // Clear existing messages
        messages.forEach(message => displayMessage(message));
    });

    // Listen for new messages from server
    socket.on('newMessage', (message) => {
        console.log("Received new message:", message);
        displayMessage(message);
    });

    // --- DOM Event Listeners ---
    sendButton.addEventListener('click', sendMessage);

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent default form submission/newline
            sendMessage();
        }
    });

    // --- Functions ---
    function sendMessage() {
        const messageText = messageInput.value.trim(); // Trim whitespace
        const username = usernameInput.value.trim() || 'anonymous';

        if (messageText !== '') {
            console.log("Sending:", messageText);
            const messageObj = {
                message: messageText,
                username: username
            };
            socket.emit('sendMessage', messageObj); // Send the message object
            messageInput.value = ''; // Clear the input field
            messageInput.focus(); // Keep focus on input field
        }
    }

    function displayMessage(messageData) {
        const messageDiv = document.createElement('div'); // Create a new div element
        const messageContent = document.createElement('div');
        const messageUsername = document.createElement('div');
        const messageTimestamp = document.createElement('div');

        // Extract data from message object
        const message = messageData.message || messageData;
        const username = messageData.username || 'anonymous';
        const timestamp = messageData.timestamp || new Date().toLocaleTimeString();
        const messageUserId = messageData.userId;

        messageContent.textContent = message;
        messageUsername.textContent = username;
        messageTimestamp.textContent = timestamp;

        messageDiv.appendChild(messageUsername);
        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(messageTimestamp);

        messageDiv.classList.add('message');
        messageContent.classList.add('message-content');
        messageUsername.classList.add('message-username');
        messageTimestamp.classList.add('message-timestamp');

        // Add CSS class based on who sent the message
        if (userId === messageUserId) {
            messageDiv.classList.add('user-message');
        } else {
            messageDiv.classList.add('other-message');
        }

        chatContainer.appendChild(messageDiv); // Add the new div to the chat container

        // Scroll chat to the bottom to show the latest message
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

}); // End of DOMContentLoaded listener