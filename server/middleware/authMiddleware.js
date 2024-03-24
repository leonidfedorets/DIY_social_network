const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'No token provided, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecret');
    req.userId = decoded.userId;  // Attach userId to the request object
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
