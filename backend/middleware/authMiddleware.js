const jwt = require('jsonwebtoken');

const authMiddleware = (requiredRole) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided. Access denied.' });
    }

    const token = authHeader.split(' ')[1];

    if (!token || token === 'undefined' || token === 'null') {
      return res.status(401).json({ message: 'Token is empty or invalid.' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({ message: 'Access forbidden. Wrong role.' });
      }

      next();
    } catch (error) {
      console.log('JWT Error:', error.message); // This will show exact error in terminal
      return res.status(401).json({ message: 'Invalid or expired token.', error: error.message });
    }
  };
};

module.exports = authMiddleware;