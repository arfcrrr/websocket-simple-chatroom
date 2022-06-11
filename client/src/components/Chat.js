import React from "react";
import { Container, Button, Row, Col, Form, FormControl, InputGroup, Badge } from "react-bootstrap";
import moment from "moment";
import IllustrationChat from '../il_chat.svg';

import styled from "styled-components";

const rooms = [
    // channel names
    "public",
    "discussion",
    "chitchat",
    "code",
];

const Sidebar = styled.div`
    height: 100%;
    width: 35%;
    padding: 24px;
    border-right: 1px solid black;
    background-color: #C6C6C6;
`;

const ChatPanel = styled.div`
    height: 100;
    width: 85%;
    display: flex;
    flex-direction: column;
`;

const BodyContainer = styled.div`
    width: 100%;
    height: 75%;
    overflow: scroll;
    border-bottom: 1px solid black;
`;

const ChannelInfo = styled.div`
    height: 10%;
    width: 100%;
    border-bottom: 1px solid black;
`;

const Messages = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const Chat = (props) => {
    const renderRooms = (room) => {
        const currentChat = {
            chatName: room,
            isChannel: true,
            receiverId: "",
        }

        return (
            <Row onClick={() => props.toggleChat(currentChat)} key={room}>
                {room}
            </Row>
        )
    }

    const renderUser = (user) => {
        if (user.id === props.yourId) {
            return (
                <Row key={user.id}>
                    You: {user.username}
                </Row>
            );
        }
        const currentChat = {
            chatName: user.username,
            isChannel: false,
            receiverId: user.id,
        }
        return (
            <Row onClick={() => {
                props.toggleChat(currentChat);
            }} key={user.id}>
                {user.username}
            </Row>
        )
    }
    const renderMessages = (message, index) => {
        return (
            <div id="messages" className="my-4 d-flex flex-column justify-content-start align-items-start">
                <Row key={index} className="mb-2">
                    <Col md="auto" className="fw-light">
                        {moment(message.date).format("hh:mm:ss a")}
                    </Col>
                    <Col md="auto">
                        <Badge bg="dark" text="light" className="px-3 py-2">
                            {message.sender}
                        </Badge>
                    </Col>
                    <Col md="auto">{message.content}</Col>
                </Row>
            </div>
        )
    }

    let body;
    if (!props.currentChat.isChannel || props.connectedRooms.includes(props.currentChat.chatName)) {
        body = (
            <Messages>
                {props.messages.map(renderMessages)}
            </Messages>
        );
    } else {
        body = (
            <Button variant="dark" onClick={() => props.joinRoom(props.currentChat.chatName)}>Join {props.currentChat.chatName}</Button>
        )
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        props.sendMessage();
    }

    return (
        <Container>
            <Row>
                <Col>
                    <Sidebar id="sidebar">
                        <h3>Rooms</h3>
                        {rooms.map(renderRooms)}
                        <h3>Users</h3>
                        {props.users.map(renderUser)}
                    </Sidebar>
                </Col>
                <Col md="auto"><img src={IllustrationChat} /></Col>
                <Col md="auto" className="my-5">
                    <h3>Annyeong!</h3>
                </Col>
            </Row>
            <ChatPanel>
                <ChannelInfo>
                    {props.currentChat.chatName}
                </ChannelInfo>
                <BodyContainer>
                    {body}
                </BodyContainer>
                <Form onSubmit={handleSubmit} id="form">
                    <InputGroup className="mb-3">
                        <FormControl
                            type="text"
                            id="text"
                            value={props.message}
                            onChange={props.handleMessageChange}
                            placeholder="Share your thoughts here..."
                            aria-label="message"
                            aria-describedby="basic-addon2"
                        />
                        <Button as="input" variant="dark" id="submit" type="submit" value="Send" />
                    </InputGroup>
                </Form>
            </ChatPanel>
        </Container>
    );
};

export default Chat;