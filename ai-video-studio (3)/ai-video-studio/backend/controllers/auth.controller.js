const AuthService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const { user, token } = await AuthService.register({ name, email, password });
  res.status(201).json({ success: true, data: { user, token } });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await AuthService.login({ email, password });
  res.status(200).json({ success: true, data: { user, token } });
});

const me = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: { user: req.user } });
});

module.exports = { register, login, me };
