import { useState, useEffect } from "react";
import React from "react";
import io from "socket.io-client";
import { Container, Row, Col, ListGroup, InputGroup, FormControl, Button, Badge } from "react-bootstrap";
import moment from "moment";

import IllustrationChat from './il_chat.svg';
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const socket = io.connect("http://localhost:8000", {
  transports: ["websocket", "polling"]
});

// username input
const username = prompt("Enter your username here:");

const App = ({ }) => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // admitted username to the server
    socket.on("connect", () => {
      socket.emit("username", username);
    });

    // set active user
    socket.on("users", users => {
      setUsers(users);
    });

    // add new message to messages array
    socket.on("message", message => {
      setMessages([...messages, message]);
    });

    // add new user to users array
    socket.on("connected", user => {
      setUsers([...users, user]);
    });

    // disconnect user 
    socket.on("disconnected", id => {
      setUsers(users => {
        return users.filter(user => user.id !== id);
      });
    });

  }, [users, messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("send", message);
    setMessage("");
  };

  return (
    <div className="App">
      <Container fluid>
        <Row className="d-flex flex-row justify-content-center my-5">
          <Col md="auto"><img src={IllustrationChat} style={{ width: '85%' }} /></Col>
          <Col md="auto" className="my-5">
            <h3>Annyeong,</h3>
            <h2>{username}!</h2>
          </Col>
        </Row>
        <Row id="chatroom" className="m-0 p-4">
          <Col>
            <h5>Active Users</h5>
            <ListGroup id="users" className="my-4">
              {users.map(({ name, id }) => (
                <ListGroup.Item key={id}>{name}</ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col>
            <h5>Messages</h5>
            <div id="messages" className="my-4 d-flex flex-column justify-content-start align-items-start">
              {messages.map(({ user, date, text }, index) => (
                <Row key={index} className="mb-2">
                  <Col md="auto" className="fw-light">
                    {moment(date).format("hh:mm:ss a")}
                  </Col>
                  <Col md="auto">
                    <Badge bg="dark" text="light" className="px-3 py-2">
                      {user.name}
                    </Badge>
                  </Col>
                  <Col md="auto">{text}</Col>
                </Row>
              ))}
            </div>
            <form onSubmit={handleSubmit} id="form">
              <InputGroup className="mb-3">
                <FormControl
                  type="text"
                  id="text"
                  onChange={e => setMessage(e.currentTarget.value)}
                  value={message}
                  placeholder="Enter your message..."
                  aria-label="message"
                  aria-describedby="basic-addon2"
                />
                <Button as="input" variant="dark" id="submit" type="submit" value="Send" />
              </InputGroup>
            </form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
