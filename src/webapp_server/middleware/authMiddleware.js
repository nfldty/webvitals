// authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const token = req.cookies?.authToken; // Get token from the "authToken" cookie
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request object
    
    // Check if the user is trying to access their own statistics
    const { userId } = req.query;
    if (userId && userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden', message: 'You can only access your own statistics.' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

module.exports = authMiddleware;
