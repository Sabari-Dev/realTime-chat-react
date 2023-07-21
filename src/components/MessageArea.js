import React from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { HiOutlineUpload } from "react-icons/hi";
import { AiOutlineSend } from "react-icons/ai";
import Button from "react-bootstrap/Button";

const MessageArea = ({ handleSubmit, text, setText, setImg }) => {
  return (
    <Form className="message-box" onSubmit={handleSubmit}>
      <InputGroup>
        <Form.Control
          placeholder="Enter Message"
          aria-label="mesage"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button variant="outline-secondary">
          <Form.Label htmlFor="img">
            <HiOutlineUpload />
          </Form.Label>

          <input
            onChange={(e) => setImg(e.target.files[0])}
            type="file"
            id="img"
            accept="image/*"
            style={{ display: "none" }}
          />
        </Button>

        <Button variant="outline-secondary" type="submit">
          <AiOutlineSend />
        </Button>
      </InputGroup>
    </Form>
  );
};

export default MessageArea;
