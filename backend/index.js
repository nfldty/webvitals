const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { Pool } = require('pg');

const PORT = process.env.PORT || 3000;
const app = express();

const server = http.createServer(app);
const io = new Server(server);

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
// pooling is likely sufficient for handling 60 requests per second per client for now; may need to optimize/scale later

app.get('/test', (req, res) => {
  res.json({ status: 'OK' });
});

// event_name's, and the entities they modify:
/*
mouse_move
  MouseMovement
page_visit
  Session
  PageVisit
session_end
  Session
  TimeSpent

the event_name is passed as the event name using socket.io.
start a session with:
this.socket = io(url, {auth:{
  "session_id": sessionStorage['webvitals-session-id'],
  "user_id": this.userId
}});

for all other events, follow this event body scheme:
mouse_move:
{
  "x": 120,
  "y": 300,
}

page_visit:
{
  "page_url": "https://www.example.com/page1",
}

session_end:
{}
*/

io.use((socket, next) => {
  const { session_id, user_id } = socket.handshake.auth;
  if (session_id && user_id) {
    return next();
  }
  const err = new Error("Invalid authentication");
  err.data = { content: "Invalid authentication" };
  next(err);
});

io.on('connection', (socket) => {
  // socket.handshake.auth contains the session_id and user_id
  // create new session if it doesn't exist, linked with user_id

  socket.on('mouse_move', async (data) => {
    // record mouse_move for session_id
    const { session_id } = socket.handshake.auth;
    await pool.query('SELECT NOW()');
  });

  socket.on('page_visit', async (data) => {
    // get current page in session
    // make new row in PageVisit with page_id, session_id, and timestamp
    // set new current page in session with current timestamp
    const { session_id } = socket.handshake.auth;
    await pool.query('SELECT NOW()');
  });

  socket.on('session_end', async (data) => {
    // record time_spent for session_id
    const { session_id } = socket.handshake.auth;
    await pool.query('SELECT NOW()');
  });
});

server.listen(PORT, () => {
  console.log(`Events server running on: http://localhost:${PORT}`);
});
