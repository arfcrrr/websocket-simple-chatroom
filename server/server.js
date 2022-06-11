const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);

const socket = require("socket.io");
const io = socket(server);

const PORT = 8000;

let users = [];

const messages = {
    // channel names
    public: [],
    discussion: [],
    chitchat: [],
    code: [],
}

io.on("connection", socket => {
    console.log("USER CONNECTED");

    socket.on("joinServer", (username) => {
        const user = {
            username,
            id: socket.id,
        };
        users.push(user);
        io.emit("newUser", users);
    });

    socket.on("joinRoom", (roomName, callback) => {
        socket.join(roomName);
        callback(messages[roomName]);
    });

    socket.on("sendMessage", ({ content, receiver, sender, chatName, isChannel }) => {
        if(isChannel) {
            const payload = {
                content,
                chatName,
                sender
            };
            socket.to(receiver).emit("newMessage", payload);
        } else {
            const payload = {
                content,
                chatName: sender,
                sender
            };
            socket.to(to).emit("newMessage", payload);
        }
        if(messages[chatName]) {
            messages[chatName].push({
                sender,
                content
            });
        }
    });

    socket.on("disconnect", () => {
        users = users.filter(user => user.id !== socket.id);
        io.emit("new user", users);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});