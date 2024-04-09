const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middlewares to verify JWT token and extract ID

exports.authenticateUser = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({
          message: 'Authorization token is missing',
      });
  }
  const tokenValue = token.split(" ")[1];

  try {
      const decoded = jwt.verify(tokenValue,process.env.JWT_SECRET);
      req.user = decoded;
      next();
  }
  catch (error) {
      return res.status(401).json({
          success: false,
          message: 'Invalid token',
      });
  }
};

exports.authenticateOrganizer = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
          message: 'Authorization token is missing',
      });
  }
  const tokenValue = token.split(" ")[1];
  try {
      const decoded = jwt.verify(tokenValue,process.env.JWT_SECRET);
      req.organizer = decoded;
      next();
  }
  catch (error) {
      return res.status(401).json({
          success: false,
          message: 'Invalid token',
      });
  }
};