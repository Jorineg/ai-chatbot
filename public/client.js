// Wait for the HTML document to be fully loaded before running script
document.addEventListener('DOMContentLoaded', () => {

    const socket = io(); // Connect to Socket.IO server

    // Get references to DOM elements
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const chatContainer = document.getElementById('chat-container');

    // --- Socket.IO Event Listeners ---
    socket.on('connect', () => {
        console.log("Connected to server with ID:", socket.id);
        // Optional: displayMessage("Connected to the Rhyming Bot!", "system");
    });

    socket.on('response', (aiResponse) => {
        console.log("Received response:", aiResponse);
        displayMessage(aiResponse, 'ai'); // Display AI message
    });

    socket.on('disconnect', () => {
        console.log("Disconnected from server");
        // Optional: displayMessage("Disconnected from the bot.", "system");
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
        if (messageText !== '') {
            console.log("Sending:", messageText);
            socket.emit('message', messageText); // Send the message
            displayMessage(messageText, 'user'); // Display user's message
            messageInput.value = ''; // Clear the input field
            messageInput.focus(); // Keep focus on input field
        }
    }

    function displayMessage(text, senderType) {
        const messageDiv = document.createElement('div'); // Create a new div element
        messageDiv.textContent = text; // Set the text content safely

        // Add CSS class based on who sent the message
        if (senderType === 'user') {
            messageDiv.classList.add('user-message');
        } else if (senderType === 'ai') {
            messageDiv.classList.add('ai-message');
        } else { // For system messages or errors
            messageDiv.classList.add('system-message');
        }

        chatContainer.appendChild(messageDiv); // Add the new div to the chat container

        // Scroll chat to the bottom to show the latest message
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

}); // End of DOMContentLoaded listener