const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const pool = require('./database');
const userAgentParser = require('parse-user-agent');

const PORT = process.env.PORT || 3000;
const app = express();

const server = http.createServer(app);
const io = new Server(server,
  {cors:{
    "origin": "*",
    "methods": ["GET", "POST"]
  }}
);

app.get('/test', (req, res) => {
  res.json({ status: 'OK' });
});

// event_name's, and the tables they modify:
/*
mouse_move
  mouse_movement
page_visit
  sessions
  page_visits
time_tracker
  time_spent
session_end
  sessions

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

time_tracker:
{
  "time_spent": 30000, // 30 seconds
}

session_end:
{}
*/

io.use(async (socket, next) => {
  // socket.handshake.auth contains the session_id and user_id
  // create new session if it doesn't exist, linked with user_id
  const { session_id, user_id } = socket.handshake.auth;
  console.log("session_id: ", session_id);
  if (session_id && user_id) {
    // check that user_id exists
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [user_id]);
    if (user.rows.length === 0) {
      const err = new Error("Invalid authentication");
      err.data = { content: "Invalid authentication" };
      return next(err);
    }

    pool.query('INSERT INTO sessions (id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [session_id, user_id]); // upsert session
    return next();
  }
  const err = new Error("Invalid authentication");
  err.data = { content: "Invalid authentication" };
  return next(err);
});


io.on('connection', (socket) => {
  const { session_id } = socket.handshake.auth;
  console.log(`New connection from session: ${session_id}`);

  socket.on('mouse_move', async ({ x, y }) => {
    console.log(`Mouse moved to: ${x}, ${y}`);
    const { user_id, session_id } = socket.handshake.auth;
    await pool.query(
      'INSERT INTO mouse_movement (user_id, session_id, x_coord, y_coord) VALUES ($1, $2, $3, $4)',
      [user_id, session_id, x, y]
    );
  });

  socket.on('mouse_click', async ({ x, y, isRage, isDead, isQuickBack }) => {
    console.log(`Mouse clicked at: ${x}, ${y}`);
    const { user_id, session_id } = socket.handshake.auth;
    await pool.query(
      'INSERT INTO mouse_click (user_id, session_id, x_coord, y_coord, is_rage, is_dead, is_quick_back) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [user_id, session_id, x, y, isRage, isDead, isQuickBack]
    );
  });
  
  socket.on('page_visit', async ({ page_url }) => {
    const { user_id, session_id } = socket.handshake.auth;
    await pool.query(
      `UPDATE page_visits
      SET left_at = NOW()
      WHERE session_id = $1
      AND left_at IS NULL`,
      [session_id]
    ); // set left_at for previous page visit, new page visit will have NULL left_at
  
    await pool.query(
      'INSERT INTO page_visits (user_id, session_id, page_url) VALUES ($1, $2, $3)',
      [user_id, session_id, page_url]
    );
  });
  
  socket.on('time_tracker', async ({ time_spent }) => {
    const { user_id, session_id } = socket.handshake.auth;
    await pool.query(
      `UPDATE time_spent
      SET elapsed_time = elapsed_time + $3, last_modified = NOW()
      WHERE user_id = $1
      AND session_id = $2`,
      [user_id, session_id, time_spent]
    ); // update iff row exists
  
    await pool.query(
      `INSERT INTO time_spent (user_id, session_id, elapsed_time)
      SELECT $1, $2, $3
      WHERE NOT EXISTS (
        SELECT 1 FROM time_spent WHERE user_id = $1 AND session_id = $2
      )`,
      [user_id, session_id, time_spent]
    ); // in case no row exists create one
  });
  
  socket.on('user_journey', async ({ page_url, time_spent }) => {
    const { user_id, session_id } = socket.handshake.auth;
    await pool.query(
      'INSERT INTO user_journey (user_id, session_id, page_url, time_spent) VALUES ($1, $2, $3, $4)',
      [user_id, session_id, page_url, time_spent]
    );
  });

  socket.on('extra_data_tracking', async ({ userAgent, referrer }) => {
    const { user_id, session_id } = socket.handshake.auth;
    let parsed = userAgentParser.parseUserAgent(userAgent);
    await pool.query(
      'INSERT INTO extra_data (user_id, session_id, browser_name, operating_system, is_mobile, referrer) VALUES ($1, $2, $3, $4)',
      [user_id, session_id, parsed.browser_name, parsed.operating_system_name, parsed.is_mobile, referrer]
    );
  });

  socket.on('session_end', async () => {
    const { session_id } = socket.handshake.auth;
    await pool.query(
      'UPDATE sessions SET end_time = NOW() WHERE id = $1',
      [session_id]
    );
  });

  socket.on('userReg', async () => {
    const { session_id } = socket.handshake.auth;
    await pool.query(
      'INSERT INTO users ',
      [session_id]
    );
  });

  socket.on('disconnect', () => {
    console.log(`Session ${session_id} disconnected`);
  });

});

server.listen(PORT, () => {
  console.log(`Events server running on: http://localhost:${PORT}`);
});
