const express = require('express');
const app = express();
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const { on } = require('events');

dotenv.config();

const PORT = process.env.PORT;
const ENV = process.env.ENV ?? 'WEB';

app.get('/', (req, res) => {
  res.send('Socket.io server is running');
});

const server = app.listen(
  PORT,
  console.log(`Socket.io server started on port ${PORT}`)
);

const io = new Server(server, {
  cors: {
    origin:
      ENV === 'LOCAL'
        ? 'http://localhost:3000'
        : 'https://plazita-chat.vercel.app',
  },
});

io.on('connection', (socket) => {
  console.log('Connected to socket.io');

  socket.on('setup', (userData) => {
    socket.join(userData._id);
    console.log(`${userData._id} connected`);
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log(`User joined room ${room}`);
  });

  socket.on('new message', (newMessage) => {
    var chat = newMessage.chat;

    if (!chat.users) return console.log('chat.users not defined');

    chat.users.forEach((user) => {
      if (user._id != newMessage.sender._id) {
        socket.in(user._id).emit('message received', newMessage);
      }
    });
  });
});
