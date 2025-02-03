const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3000; // still need to add .env file

const app = express();

const server = http.createServer(app);
const io = new Server(server);

app.get('/test', (req, res) => {
  res.json({ status: 'OK' });
});

io.on('connection', (socket) => {
  console.log('New connection: ', socket.id);

  // events:
  socket.on('session_start', (data) => {
    console.log('session_start:', data);
  });

  socket.on('mouse_move', (data) => {
    console.log('mouse_move:', data);
  });

  socket.on('mouse_click', (data) => {
    console.log('mouse_click:', data);
  });

  socket.on('session_end', (data) => {
    console.log('session_end:', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Events server running on: http://localhost:${PORT}`);
});