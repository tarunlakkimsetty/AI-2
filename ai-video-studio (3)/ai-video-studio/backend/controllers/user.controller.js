const User = require('../models/User');
const AuthService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');

const getProfile = asyncHandler(async (req, res) => {
  const projectsCount = User.projectCount(req.user.id);
  res.status(200).json({ success: true, data: { user: req.user, projectsCount } });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, theme, language, tone, temperature } = req.body;
  const user = User.updateProfile(req.user.id, { name, theme, language, tone, temperature });
  res.status(200).json({ success: true, data: { user } });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await AuthService.changePassword(req.user.id, { currentPassword, newPassword });
  res.status(200).json({ success: true, message: 'Password updated successfully.' });
});

const deleteAccount = asyncHandler(async (req, res) => {
  User.delete(req.user.id); // cascades to projects via FK
  res.status(200).json({ success: true, message: 'Account deleted successfully.' });
});

module.exports = { getProfile, updateProfile, changePassword, deleteAccount };
