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
  origin: "http://localhost",  // Replace with the allowed frontend origin
  credentials: true  // Allow credentials (cookies, authorization headers, etc.)
}));
// app.options('*', cors());
app.use(express.json());
app.use(cookieParser());


app.use('/auth', authRoutes);
app.use('/', authMiddleware, statisticsRoutes);
app.use('/', authMiddleware, heatmapRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));