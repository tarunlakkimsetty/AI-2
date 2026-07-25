const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../config/env');

module.exports = function generateToken(userId) {
  return jwt.sign({ id: userId }, jwtSecret, { expiresIn: jwtExpiresIn });
};
