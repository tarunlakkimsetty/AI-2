const bcrypt = require('bcryptjs');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const generateToken = require('../utils/generateToken');

const AuthService = {
  async register({ name, email, password }) {
    const existing = User.findByEmail(email);
    if (existing) {
      throw new ApiError(409, 'An account with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = User.create({ name, email, hashedPassword });
    const token = generateToken(user.id);

    return { user, token };
  },

  async login({ email, password }) {
    const userRow = User.findByEmail(email);
    if (!userRow) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, userRow.password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    const token = generateToken(userRow.id);
    const user = User.findById(userRow.id);

    return { user, token };
  },

  async changePassword(userId, { currentPassword, newPassword }) {
    const userRow = User.findByIdWithPassword(userId);
    const isMatch = await bcrypt.compare(currentPassword, userRow.password);
    if (!isMatch) {
      throw new ApiError(401, 'Current password is incorrect.');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    User.updatePassword(userId, hashedPassword);
  }
};

module.exports = AuthService;
