import { useState, useRef } from "react";
import React from "react";
import io from "socket.io-client";
import immer from "immer";
import Chat from "./components/Chat";
import UsernameForm from "./components/UsernameForm";

import IllustrationChat from './il_chat.svg';
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const socket = io.connect("http://localhost:8000", {
  transports: ["websocket", "polling"]
});

const initialMessagesState = {
  // channel names
  public: [],
  discussion: [],
  chitchat: [],
  code: [],
}

const App = () => {
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);
  const [currentChat, setCurrentChat] = useState({
    isChannel: true,
    chatName: "public",
    receiverId: ""
  });
  const [connectedRooms, setConnectedRooms] = useState(["public"]); // set public as default channel
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState(initialMessagesState);
  const [message, setMessage] = useState("");
  const socketRef = useRef();

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  }

  const sendMessage = () => {
    const payload = {
      content: message,
      receiver: currentChat.isChannel ? currentChat.chatName : currentChat.receiverId,
      sender: username,
      chatName: currentChat.chatName,
      isChannel: currentChat.isChannel,
      date: new Date().toISOString(),
    };
    socketRef.current.emit("sendMessage", payload);
    const newMessages = immer(messages, draft => {
      draft[currentChat.chatName].push({
        sender: username,
        content: message,
        date: new Date().toISOString(),
      });
    });
    setMessages(newMessages);
  }

  const roomJoinCallback = (incomingMessages, room) => {
    const newMessages = immer(messages, draft => {
      draft[room] = incomingMessages;
    });
    setMessages(newMessages);
  }

  const joinRoom = (room) => {
    const newConnectedRooms = immer(connectedRooms, draft => {
      draft.push(room);
    });

    socketRef.current.emit("joinRoom", room, (messages) => roomJoinCallback(messages, room));
    setConnectedRooms(newConnectedRooms);
  }

  const toggleChat = (currentChat) => {
    if (!messages[currentChat.chatName]) {
      const newMessages = immer(messages, draft => {
        draft[currentChat.chatName] = [];
      });
      setMessages(newMessages);
    }
    setCurrentChat(currentChat);
  }

  const handleChange = (e) => {
    setUsername(e.target.value);
  }

  const connect = () => {
    setConnected(true);
    socketRef.current = io.connect("/");
    socketRef.current.emit("joinServer", username);
    socketRef.current.emit("joinRoom", "public", (messages) => roomJoinCallback(messages, "public"));
    socketRef.current.on("newUser", users => {
      setUsers(users);
    })
    socketRef.current.on("newMessage", ({ content, sender, chatName }) => {
      setMessages(messages => {
        const newMessages = immer(messages, draft => {
          if (draft[chatName]) {
            draft[chatName].push({ content, sender });
          } else {
            draft[chatName] = [{ content, sender }];
          }
        });
        return newMessages;
      });
    });
  }

  let body;
  if (connected) {
    body = (
      <Chat
        message={message}
        handleMessageChange={handleMessageChange}
        sendMessage={sendMessage}
        yourId={socketRef.current ? socketRef.current.id : ""}
        users={users}
        joinRoom={joinRoom}
        connectedRooms={connectedRooms}
        currentChat={currentChat}
        toggleChat={toggleChat}
        messages={messages[currentChat.chatName]}
      />
    )
  } else {
    body = (
      <UsernameForm username={username} onChange={handleChange} connect={connect} />
    )
  }

  return (
    <div className="App">
      {body}
    </div>
  );


}



export default App;
