const express = require('express');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/authMiddleware');
const statisticsRoute = require('./routes/statistics')
const PORT = process.env.WEBAPP_SERVER_PORT || 3001;
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/', statisticsRoute)
app.get('/test', (req, res) => {
    res.json({ status: 'OK' });
  });

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
