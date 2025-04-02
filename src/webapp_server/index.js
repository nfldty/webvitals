const express = require('express');
const authRoutes = require('./routes/auth');
const statisticsRoutes = require('./routes/statistics');
const heatmapRoutes = require('./routes/heatmap');
const authMiddleware = require('./middleware/authMiddleware');
const cookieParser = require('cookie-parser');

const PORT = process.env.WEBAPP_SERVER_PORT || 3001;
const app = express();
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost',
  credentials: true,
}));

app.options('*', (req, res) => {
  res.sendStatus(204); // Respond with 204 No Content for OPTIONS requests
});
// app.options('*', cors());
app.use(express.json());
app.use(cookieParser());


app.use('/auth', authRoutes);
app.use('/', authMiddleware, statisticsRoutes);
app.use('/', authMiddleware, heatmapRoutes);
app.use('/get-user', authMiddleware, (req, res) => {
  // If the request reaches here, the user is authenticated
  res.json({
    message: 'User is authenticated',
    user: req.user, // Send back the user details from the decoded JWT
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));