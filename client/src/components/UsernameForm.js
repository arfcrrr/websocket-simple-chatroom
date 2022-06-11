import React from "react";

import { Container, Form, Button } from "react-bootstrap";

const UsernameForm = (props) => {
    return (
        <Container>
            <Form>
                <Form.Label htmlFor="inputText">Username</Form.Label>
                <Form.Control
                    type="text"
                    id="inputText"
                    aria-describedby="textHelpBlock"
                />
                <Form.Text id="textHelpBlock" muted>
                    Your username will be seen by others once submitted.
                </Form.Text>
                <Button variant="dark" onClick={props.connect}>Join</Button>
            </Form>
        </Container>
    )
}

export default UsernameForm;