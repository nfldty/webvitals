const express = require('express');
const authRoutes = require('./routes/auth');
const statisticsRoutes = require('./routes/statistics');
const authMiddleware = require('./middleware/authMiddleware');
const PORT = process.env.WEBAPP_SERVER_PORT || 3001;
const app = express();
const cors = require('cors');
app.use(cors());
app.options('*', cors());
app.use(express.json());


app.use('/auth', authRoutes);
app.use('/', statisticsRoutes);
app.get('/test', (req, res) => {
    res.json({ status: 'OK' });
  });

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));