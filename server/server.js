const http = require("http");

const PORT = 8000;
const server = http.createServer();

const io = require("socket.io")(server, {
    transports: ["websocket", "polling"]
});

const users = {};

io.on("connection", client => {
    console.log("USER CONNECTED");

    client.on("username", username => {
        const user = {
            name: username,
            id: client.id
        };
        users[client.id] = user;
        io.emit("connected", user);
        io.emit("users", Object.values(users));
    });

    client.on("send", message => {
        io.emit("message", {
            text: message,
            date: new Date().toISOString(),
            user: users[client.id]
        });
    });

    client.on("disconnect", () => {
        console.log("USER DICONNECTED");

        const username = users[client.id];
        delete users[client.id];
        io.emit("disconnected", client.id);
    });

})

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})