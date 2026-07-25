const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// Protects routes: verifies the Bearer JWT and attaches req.user
const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw new ApiError(401, 'Not authorized, no token provided.');
  }

  const token = header.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, jwtSecret);
  } catch (err) {
    throw new ApiError(401, 'Not authorized, token is invalid or expired.');
  }

  const user = User.findById(decoded.id);
  if (!user) {
    throw new ApiError(401, 'Not authorized, user no longer exists.');
  }

  req.user = user;
  next();
});

module.exports = { protect };
