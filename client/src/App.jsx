// eslint-disable-next-line no-unused-vars
import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Box, Container, Typography, TextField, Button } from "@mui/material";
import { Stack } from "@mui/system";

const App = () => {
  const socket = useMemo(() => io("http://localhost:3000"), []);

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [receivedMessage, setReceivedMessage] = useState([]);
  const [roomName, setRoomName] = useState("");

  console.log(receivedMessage);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server", socket.id);
      setSocketId(socket.id);
    });

    socket.on("receive-message", (data) => {
      setReceivedMessage((messages) => [...messages, data]);
    });
  }, []);

  return (
    <Container maxWidth="sm">
      <Box my={4} />
      <Typography variant="h6" component="div" gutterBottom>
        {socketId}
      </Typography>

      <form onSubmit={joinRoomHandler}>
        <Typography variant="h6" component="div" gutterBottom>
          Join Room
        </Typography>
        <TextField
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          id="outlined-basic"
          label="Room Name"
          variant="outlined"
        />
        <Button variant="contained" color="primary" type="submit">
          Join
        </Button>
      </form>

      <Box my={4} />

      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="outlined-basic"
          label="Message"
          variant="outlined"
        />
        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          id="outlined-basic"
          label="Room"
          variant="outlined"
        />
        <Button variant="contained" color="primary" type="submit">
          Send
        </Button>
      </form>

      <Stack spacing={2}>
        {receivedMessage.map((msg, index) => (
          <Typography key={index} variant="body1" component="div">
            {msg}
          </Typography>
        ))}
      </Stack>
    </Container>
  );
};

export default App;
